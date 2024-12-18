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

import RefreshButton from "@/components/RefreshButton";
import ClaimableTokens from "@/containers/ClaimableTokens";
import { useWalletData } from "@/hooks/useWalletData";
import { useAddress } from "@thirdweb-dev/react";
import { Alchemy } from "alchemy-sdk";
import Head from "next/head";
import { useEffect, useState } from "react";

import ClaimRewardHistory from "@/components/ClaimRewardHistory";

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

  const [isNftsLoading, setisNftsLoading] = useState(false);
  const [calculating, setcalculating] = useState(false);

  const [isSendingRequest, setisSendingRequest] = useState();
  const [isClaimSent, setIsClaimSent] = useState(false);
  const [loading, setloading] = useState(false);

  const alchemy = new Alchemy(alchemySettings);

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
      console.log(wallets, claimData, claimDataBoost, dropData, txData);
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
  }, [userAmNft, claimData]);

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
              <div>
                Error loading data. Please try again.
                <RefreshButton onClick={refreshAll} />
              </div>
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
                    <div className="flex justify-between w-full">
                      <ClaimableTokens
                        nftsNotClaimed={nftsNotClaimed}
                        address={address}
                        nftsNotClaimedBoost={nftsNotClaimedBoost}
                      />
                      <div>
                        {nftsNotClaimed || nftsNotClaimedBoost ? (
                          <div className="flex gap-2 align-middle">
                            <Button className="px-6 " onClick={handleClaim}>
                              {isSendingRequest ? (
                                <>Sending...</>
                              ) : (
                                "Send Claim Request"
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2 align-middle">
                            <Button className="px-6 bg-primary " active={false}>
                              Claimed
                            </Button>
                          </div>
                        )}
                      </div>
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
