import { Button, Select, SelectBox } from "@/components/Form";
import {
  IconArrowRight,
  IconCKB,
  IconGlobGrid,
  IconKDA,
  IconLTC,
  IconMoreHoriz,
  IconSocialDiscord,
  IconSocialOpenSea,
  IconSocialTwitter,
  IconTriangleDown,
  IconTriangleUp,
} from "@/components/Icon";
import { MainLayout } from "@/components/Layout";
import { Card } from "@/components/ui";
import { IconCheck, IconError, IconSpinner } from "@/components/ui/Snippets";
import {
  aceMinerContracts,
  alchemySettings,
  chainURL,
  contrAceMinersBoost,
  contrAceMinersPhase1,
  contrAceMinersPhase2,
} from "@/constant/consonants";
import {
  AddClaim,
  VerifyCKBWallet,
  VerifyKDAWallet,
  VerifyLTCWallet,
} from "@/containers/AddClaim";
import Link from "next/link";

import ClaimableTokens from "@/containers/ClaimableTokens";
import { useDragScrollHook } from "@/hooks/useDragScrollHook";
import { useAddress } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Alchemy, Network } from "alchemy-sdk";
import { BigNumber } from "ethers";

import { useEffect, useRef, useState } from "react";
import CONTRACTA from "../constant/ABI_ACEMINERS1.json";

import NFTCollectionTabs from "@/components/NFTTabs";

const HomePage = ({ ip }) => {
  let address = useAddress();

  const [kdaStatus, setkdaStatus] = useState(""); //error,verified,verifing,verify
  const [ltcStatus, setltcStatus] = useState(""); //error,verified,verifing,verify
  const [ckbStatus, setckbStatus] = useState(""); //error,verified,verifing,verify
  const [userAmNft, setuserAmNft] = useState([]);
  const [userAmBoostNft, setuserAmBoostNft] = useState([]);
  const [nftsNotClaimed, setnftsNotClaimed] = useState([]);
  const [nftsNotClaimedBoost, setnftsNotClaimedBoost] = useState([]);
  const [claimData, setclaimData] = useState([{}]);
  const [claimDataBoost, setclaimDataBoost] = useState([{}]);
  const [dropData, setdropData] = useState([{}]);
  const [ltcWallet, setltcWallet] = useState();
  const [kdaWallet, setkdaWallet] = useState();
  const [ckbWallet, setckbWallet] = useState();
  const [isNftsLoading, setisNftsLoading] = useState(false);
  const [isSendingRequest, setisSendingRequest] = useState();
  const [isClaimSent, setIsClaimSent] = useState(false);
  const [claimResponse, setClaimResponse] = useState();
  const [isClaimModal, setisClaimModal] = useState(false);
  const [txData, settxData] = useState([]);

  const [loading, setloading] = useState(false);
  const [payouts, setpayouts] = useState([]);
  const [calculating, setcalculating] = useState(false);
  const alchemy = new Alchemy(alchemySettings);

  const getVerifications = () => {
    if (ltcWallet) {
      setkdaStatus("verified");
    }
    if (kdaWallet) {
      setltcStatus("verified");
    }
  };

  const getNFTsFromAlchemy = async (adr) => {
    setisNftsLoading(true);
    let amP1NFTs = [];
    let amP2NFTs = [];
    let amBoostNFTs = [];
    let allHoldingNfts = [];
    try {
      // Get the async iterable for the owner's NFTs.
      const nftsIterable = alchemy.nft.getNftsForOwnerIterator(adr, {
        contractAddresses: [
          contrAceMinersPhase1,
          contrAceMinersPhase2,
          contrAceMinersBoost,
        ],
      });

      // Iterate over the NFTs and add them to the nfts array.
      for await (const nft of nftsIterable) {
        if (
          nft.contract.address.toLowerCase() ==
          contrAceMinersPhase1.toLowerCase()
        ) {
          amP1NFTs.push(nft);
        }

        if (
          nft.contract.address.toLowerCase() ==
          contrAceMinersPhase2.toLowerCase()
        ) {
          amP2NFTs.push(nft);
        }

        if (
          nft.contract.address.toLowerCase() ==
          contrAceMinersBoost.toLowerCase()
        ) {
          amBoostNFTs.push(nft);
        }
      }

      // Log the NFTs.
    } catch (e) {
      console.log("Alchemy nft", e);
    }

    allHoldingNfts = amP1NFTs.concat(amP2NFTs);

    setuserAmNft(allHoldingNfts);
    setuserAmBoostNft(amBoostNFTs);
    setisNftsLoading(false);

    return allHoldingNfts;
  };

  const handleClaim = async () => {
    setisSendingRequest(true);
    if (nftsNotClaimed.length > 0) {
      try {
        await fetch("/api/claimReward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nftsNotClaimed),
        }).then(async (data) => {
          console.log(data);

          setClaimResponse(data);
        });
      } catch (error) {
        console.error(error);
      }
    }

    setTimeout(() => {
      setisSendingRequest(false);

      setIsClaimSent(true);
      window.location.reload();
    }, 5000);
  };

  function removeDuplicates(objArr1, objArr2, propName) {
    // Get an array of property values from the objects in objArr1
    const propValues = objArr1.map((obj) => obj[propName]);

    // Filter objArr2 to remove any objects with property values that are also in propValues
    const filteredArr = objArr2.filter(
      (obj) => !propValues.includes(obj[propName])
    );

    return filteredArr;
  }

  function getUniquePropertyValues(jsonArray) {
    const uniqueValues = new Set();
    const resultArray = [];

    jsonArray.forEach(function (jsonObject) {
      uniqueValues.add(jsonObject.claimRequestId);
    });

    uniqueValues.forEach(function (uniqueValue) {
      const filteredObject = {};
      let nfts = [];
      let totalCkb = 0,
        totalKda = 0,
        totalLtc = 0;

      jsonArray.forEach(function (jsonObject) {
        if (jsonObject.claimRequestId === uniqueValue) {
          filteredObject = {
            claimRequestId: jsonObject.claimRequestId,
            dropId: jsonObject.dropId,
            count: 1,
            status: jsonObject.requestStatus,
            hodlerAddress: jsonObject.holderEthAddress,
            nfts: nfts.push(jsonObject.nftId),
            totalCkb: Number((totalCkb += Number(jsonObject.eachCKB))),
            totalKda: Number((totalKda += Number(jsonObject.eachKDA))),
            totalLtc: Number((totalLtc += Number(jsonObject.eachLTC))),
          };
        }
      });

      resultArray.push(filteredObject);
    });

    return resultArray;
  }

  // Fetches NFTs from Alchemy when the user's address is available
  useEffect(() => {
    if (address) {
      getNFTsFromAlchemy(address);
    }
  }, [address]);

  // Initializes user data when address is available:
  // 1. Fetches wallet addresses (LTC, KDA, CKB)
  // 2. Fetches claim data for regular NFTs
  // 3. Fetches claim data for boost NFTs
  // 4. Fetches drop data
  // 5. Verifies wallet connections
  useEffect(() => {
    if (address) {
      const getWallets = async () => {
        try {
          const response = await fetch("/api/user/" + address);
          const data = await response.json();

          if (data.ltcWallet) {
            setltcWallet(data.ltcWallet);
          }
          if (data.kdaWallet) {
            setkdaWallet(data.kdaWallet);
          }
          if (data.ckbWallet) {
            setckbWallet(data.ckbWallet);
          }
        } catch (error) {
          console.error(error);
        }
      };

      const getClaimData = async () => {
        try {
          const response = await fetch("/api/claim-data");
          const data = await response.json();

          setclaimData(data);
        } catch (error) {
          console.error(error);
        }
      };

      const getClaimDataBoost = async () => {
        try {
          const response = await fetch("/api/claim-data-boost");
          const data = await response.json();

          setclaimDataBoost(data);
        } catch (error) {
          console.error(error);
        }
      };

      const getDropData = async () => {
        try {
          const response = await fetch("/api/drop");
          const data = await response.json();

          setdropData(data);
        } catch (error) {
          console.error(error);
        }
      };

      getWallets();
      getDropData();
      getClaimData();
      getClaimDataBoost();
      getVerifications();
    }
  }, [address]);

  const calculateRewards2 = (userNfts, claimData, dropId) =>
    userNfts.reduce((acc, nft) => {
      const isAlreadyClaimed = claimData?.some(
        (claim) =>
          claim.contractAddress?.toLowerCase() ===
            nft.contract.address.toLowerCase() &&
          claim.nftId === parseInt(nft.tokenId) &&
          claim.isClaimed &&
          claim.dropId === dropId
      );

      return isAlreadyClaimed
        ? acc
        : [
            ...acc,
            {
              nftId: nft.tokenId,
              nftContractAddress: nft.contract.address,
              dropId,
            },
          ];
    }, []);

  // Calculates unclaimed rewards for both regular and boost NFTs
  // Runs when:
  // - User's NFTs change
  // - Claim data updates
  // - A new claim is sent
  // Creates arrays of unclaimed NFTs for each drop
  useEffect(() => {
    setcalculating(true);
    const calculateRewards = (_dropId) => {
      let nftsNotClaimedArray = [];

      try {
        userAmNft.forEach((nft) => {
          const found = claimData?.some(
            (obj) =>
              obj.contractAddress.toLowerCase() ==
                nft.contract.address.toLowerCase() &&
              obj.nftId === parseInt(nft.tokenId) &&
              obj.isClaimed &&
              obj.dropId === _dropId
          );

          if (found) {
          } else {
            nftsNotClaimedArray.push({
              nftId: nft.tokenId,
              nftContractAddress: nft.contract.address,
              dropId: _dropId,
            });
          }
        });

        try {
        } catch (error) {}

        return nftsNotClaimedArray;
      } catch (error) {
        console.error(error);
      }
    };

    let nftsNotClaimedAllDrops = [];
    let nftsNotClaimedAllDropsBoost = [];

    if (dropData.length > 0) {
      dropData?.forEach((_drop) => {
        nftsNotClaimedAllDrops.push({
          drop_id: _drop,
          nfts: calculateRewards(_drop.dropId),
          holderAddress: address,
        });

        if (_drop.dropId > 7) {
          nftsNotClaimedAllDropsBoost.push({
            drop_id: _drop,
            nfts: calculateRewards2(userAmBoostNft, claimData, _drop),
            holderAddress: address,
          });
        }
      });
    }

    setcalculating(false);

    console.log("NFTS Not Claimed Boost: ", nftsNotClaimedAllDropsBoost);
    console.log("NFTS Not Claimed: ", nftsNotClaimedAllDrops);

    setnftsNotClaimed(nftsNotClaimedAllDrops);
    setnftsNotClaimedBoost(nftsNotClaimedAllDropsBoost);
    setIsClaimSent(false);
  }, [userAmNft, claimData, isClaimSent]);

  // Fetches and processes payout/transaction data for the user
  // Updates when:
  // - Claim data changes
  // - Boost claim data changes
  // - User address changes
  // Retrieves transaction hashes and organizes claim requests
  useEffect(() => {
    const getPayouts = async () => {
      setloading(true);
      if (claimData) {
        try {
          const filteredArray = claimData.filter(
            (item) => item.holderEthAddress === address
          );

          const getTxhashes = await fetch(`/api/tx-data?address=${address}`, {
            method: "GET",
          });

          const getTxhashesData = await getTxhashes.json();

          settxData(getTxhashesData);

          const claimRequests = getUniquePropertyValues(filteredArray);

          setpayouts(claimRequests);

          setloading(false);
        } catch (e) {
          console.log(e);
          setloading(false);
        }
      }
      setloading(false);
    };
    getPayouts();
  }, [claimData, claimDataBoost, address]);

  return (
    <MainLayout>
      {address ? (
        <>
          <div className="flex flex-wrap xl:justify-between sm:justify-center  mb-5 md:mb-10 gap-4">
            <h1 className="text-center title-2 ">Your NFTs</h1>

            {!ltcWallet || !ckbWallet || !kdaWallet ? (
              <>
                <Button className="px-6 bg-yellow-500 " active={false}>
                  Add all Wallets
                </Button>
              </>
            ) : (
              <>
                {calculating ? (
                  "calculating"
                ) : (
                  <>
                    {(address &&
                      nftsNotClaimed?.length > 0 &&
                      nftsNotClaimed[0]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length > 0 &&
                      nftsNotClaimed[1]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length &&
                      nftsNotClaimed[2]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length &&
                      nftsNotClaimed[3]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length &&
                      nftsNotClaimed[4]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length &&
                      nftsNotClaimed[5]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length &&
                      nftsNotClaimed[6]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length &&
                      nftsNotClaimed[7]?.nfts?.length > 0) ||
                    (address &&
                      nftsNotClaimed?.length &&
                      nftsNotClaimed[8]?.nfts?.length > 0) ? (
                      <>
                        <ClaimableTokens
                          nftsNotClaimed={nftsNotClaimed}
                          address={address}
                          nftsNotClaimedBoost={nftsNotClaimedBoost}
                        />

                        <div className="flex gap-2 align-middle">
                          <Button className="px-6 " onClick={handleClaim}>
                            {isSendingRequest ? (
                              <>Sending...</>
                            ) : (
                              "Send Claim Request"
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {" "}
                        <div className="flex gap-2 align-middle">
                          <Button className="px-6 bg-primary " active={false}>
                            Claimed
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="false"
            hidden={!isSendingRequest || isClaimModal}
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <div
                          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3
                          className="text-base font-semibold leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Sending Claim Request
                        </h3>

                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Kindly wait for this popup to close .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setisClaimModal(true)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NFTCollectionTabs
            isNftsLoading={isNftsLoading}
            userAmNft={userAmNft}
            userAmBoostNft={userAmBoostNft}
          />

          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
            <div>
              <div className="flex-wrap flex justify-between items-center mb-4 sm:mb-6 gap-x-2">
                <h2 className="title-2">Verifications</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-1 gap-6 flex-wrap">
                <Card
                  className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
                  key={"index"}
                >
                  <VerifyLTCWallet ltcWallet={ltcWallet} unfts={userAmNft} />
                </Card>

                <Card
                  className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
                  key={"index1"}
                >
                  <VerifyKDAWallet kdaWallet={kdaWallet} unfts={userAmNft} />
                </Card>

                <Card
                  className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
                  key={"index2"}
                >
                  <VerifyCKBWallet ckbWallet={ckbWallet} unfts={userAmNft} />
                </Card>
              </div>
            </div>
            <div className="2xl:col-span-2">
              <div>
                <h2 className="title-2 mb-6">Claim reward history</h2>
                <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
                  <span className="col-span-2">Request ID</span>
                  <span className="col-span-2">Address</span>
                  <span className="col-span-2">Status</span>
                  <span className="col-span-3">Reward amount</span>
                  <span className="col-span-3">Transaction Hash</span>
                </Card>

                {loading ? (
                  <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
                    <span className="col-span-4"></span>
                    <span className="col-span-4">Loading...</span>
                    <span className="col-span-4"></span>
                  </Card>
                ) : (
                  <></>
                )}

                {payouts.map((item, index) => (
                  <Card
                    className="max-md:space-y-4 p-3 md:px-8 md:py-6 md:grid md:grid-cols-12 rounded-2xl mb-6 last:mb-0 text-14 font-title font-500"
                    key={index}
                  >
                    <span className="col-span-2 flex justify-between  align-middle items-center">
                      <span className="text-gray-200 text-12 md:hidden">
                        Request ID
                      </span>
                      <span className="text-gray-300">
                        {" "}
                        {item?.claimRequestId?.slice(0, 6) +
                          "..." +
                          item?.claimRequestId?.slice(
                            item?.claimRequestId.length - 4,
                            item.claimRequestId.length
                          )}
                      </span>
                    </span>
                    <span className="col-span-2 flex justify-start align-middle items-center">
                      <span className="text-gray-200 text-12 md:hidden">
                        Whens
                      </span>
                      <span className="text-gray-300">
                        {" "}
                        {item?.hodlerAddress?.slice(0, 12) +
                          "..." +
                          item?.hodlerAddress?.slice(
                            item?.hodlerAddress.length - 4,
                            item.hodlerAddress.length
                          )}
                      </span>
                    </span>
                    <span className="col-span-2 flex justify-between  align-middle items-center">
                      <span className="text-gray-200 text-12 md:hidden">
                        Status
                      </span>
                      <span className="text-gray-300">{item?.status}</span>
                    </span>
                    <span className="col-span-3 text-primary text-right flex justify-between">
                      <span className="text-gray-200 text-12 md:hidden">
                        Reward amount
                      </span>

                      <div className="flex flex-wrap gap-1">
                        <span className=" h-fit my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                          <span className="bg-primary rounded-full px-2">
                            {item.totalLtc.toFixed(4)}{" "}
                          </span>{" "}
                          <IconLTC width={20} />
                        </span>

                        <span className="h-fit my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                          <span className="bg-primary rounded-full px-2">
                            {item.totalKda.toFixed(2)}{" "}
                          </span>
                          <IconKDA width={14} />
                        </span>
                        <span className="h-fit my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                          <span className="bg-primary rounded-full px-2">
                            {item.totalCkb.toFixed(0)}{" "}
                          </span>{" "}
                          <IconCKB width={18} />
                        </span>
                      </div>
                    </span>

                    <span className="col-span-2 flex justify-center flex-wrap  align-middle items-center  gap-1">
                      {txData.map((tx, index) => {
                        if (tx?.claimRequestId === item?.claimRequestId) {
                          return (
                            <div className="flex flex-wrap gap-1" key={index}>
                              {tx?.LTC ? (
                                <>
                                  <Link
                                    href={
                                      `https://blockexplorer.one/litecoin/mainnet/tx/` +
                                      tx?.LtcHash
                                    }
                                  >
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <span className=" my-3 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                                        <>
                                          <IconLTC width={20} />
                                          <span className="bg-primary rounded-full px-1 ">
                                            ✓
                                          </span>
                                        </>
                                      </span>
                                    </a>
                                  </Link>
                                </>
                              ) : (
                                <></>
                              )}

                              {tx?.KDA ? (
                                <>
                                  <Link
                                    href={
                                      `https://kdaexplorer.com/tx-details/` +
                                      tx?.KdaHash
                                    }
                                  >
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <span className="my-3 pl-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                                        <>
                                          <IconKDA width={14} />
                                          <span className="bg-primary rounded-full px-2">
                                            ✓
                                          </span>
                                        </>
                                      </span>
                                    </a>
                                  </Link>
                                </>
                              ) : (
                                <></>
                              )}

                              {tx?.CKB ? (
                                <>
                                  <Link
                                    href={
                                      `https://explorer.nervos.org/transaction/` +
                                      tx?.CkbHash
                                    }
                                  >
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                                        <>
                                          <IconCKB width={18} />
                                          <span className="bg-primary rounded-full px-2">
                                            ✓
                                          </span>{" "}
                                        </>
                                      </span>{" "}
                                    </a>
                                  </Link>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          );
                        }

                        return <></>;
                      })}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center align-middle">
            {" "}
            Connect Your Wallet
          </div>
        </>
      )}
    </MainLayout>
  );
};

export const getServerSideProps = async (context) => {
  let ip = null;
  const { req, params } = context;

  if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"].split(",")[0];
  } else if (req.headers["x-real-ip"]) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.connection.remoteAddress;
  }

  return {
    props: {
      ip: ip,
    },
  };
};

export default HomePage;
