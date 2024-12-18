import { Button } from "@/components/Form";

import { IconCKB, IconClosed, IconKDA, IconLTC } from "@/components/Icon";
import { MainLayout } from "@/components/Layout";

import { IconCheck, IconError, IconSpinner } from "@/components/Ui/Snippets";
import {
  aceMinerContracts,
  alchemySettings,
  chainURL,
  contrAceMinersPhase1,
  contrAceMinersPhase2,
} from "@/constant/consonants";

import BlacklistTable from "@/components/blacklistTable";
import UserWalletsTable from "@/components/userWalletsTable";
import { useAddress } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Alchemy, Network } from "alchemy-sdk";
import { parseEther, parseUnits } from "ethers/lib/utils";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";

const Admin = () => {
  let address = useAddress();
  const { register, handleSubmit } = useForm();

  const [dropData, setDropData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [blacklistData, setblacklistData] = useState([]);
  const [selectedTab, setselectedTab] = useState(1);
  const [isDeletingDrop, setisDeletingDrop] = useState(false);

  const admin = [
    "0x7496E853013eE234301C80848C2e4945f2a52980",
    "0x664250876c9d9acC92AF91427cC0114a9a22B067",
    "0xF14197dc4934B4D050c8cF64c24a469CB6e64BdA",
    "0xF14197dc4934B4D050c8cF64c24a469CB6e64BdA",
    "0xBe8E12894f04c53f6EFd9f46C11275CE54fa7609",
    "0xBe8E12894f04c53f6EFd9f46C11275CE54fa7609",
    "0x9C4762265cd47E4fC18c2709faf6f5006940BB63",
  ];

  const onSubmit = async (data) => {
    setisLoading(true);
    if (selectedTab == 1) {
      const convertedData = {
        dropId: parseInt(data.dropId),
        eachLTC: data.eachLTC,
        eachKDA: data.eachKDA,
        eachCKB: data.eachCKB,
        eachBoostLTC: data.ltcBoost,
      };

      await addDropData(convertedData);
      await getDropData();
      console.log(data);
    }
    if (selectedTab == 2) {
      const convertedData = {
        nftId: parseInt(data.nftId),
        aceMinersContractAddress: data.aceMinersContractAddress,
        isBlacklisted: data.isBlacklisted == "true" ? true : false,
      };
      console.log("Converted", convertedData);
      const add = await addBlacklistData(convertedData);
      console.log(add);
      await getBlacklistData();
    }
    setisLoading(false);
  };

  const addDropData = async (_data) => {
    try {
      const response = await fetch("/api/drop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_data),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getDropData = async () => {
    try {
      const response = await fetch("/api/drop");
      const data = await response.json();

      setDropData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBlacklistData = async () => {
    try {
      const response = await fetch("/api/blacklist");
      const data = await response.json();

      setblacklistData(data);
    } catch (error) {
      console.error(error);
    }
  };

  async function addBlacklistData(_blacklistData) {
    try {
      const response = await fetch("/api/blacklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftId: parseInt(_blacklistData.nftId),
          aceMinersContractAddress: _blacklistData.aceMinersContractAddress,
          isBlacklisted: _blacklistData.isBlacklisted,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("NFT ID:", nftId);
        console.log(data);
        getBlacklistData();
        return data;
      } else {
        console.log("Request failed:", response.status);
        return { message: "OK" };
      }
    } catch (error) {
      console.log("Error:", error);
      return { message: "OK" };
    }
  }

  useEffect(() => {
    getDropData();
    getBlacklistData();
  }, [isLoading]);

  const onCancelDrop = async (item) => {
    setisDeletingDrop(true);
    try {
      const response = await fetch("/api/drop", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      const data = await response.json();

      await getDropData();
      setisDeletingDrop(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {" "}
      <Head>
        <title>Reward Claim</title>
      </Head>
      <MainLayout>
        {admin.includes(address) ? (
          <>
            <div className=" ">
              <div>
                {" "}
                <h1 className="max-sm:text-center title-2 mb-10 text-center">
                  Admin Tools
                </h1>
              </div>

              <ul className="grid grid-flow-col text-center text-gray-50 bg-gray-400 rounded-full p-2 border mb-10">
                <li>
                  <a
                    href="#page1"
                    className={
                      selectedTab == 1
                        ? "flex justify-center  py-4 bg-primary rounded-full shadow text-gray-100"
                        : "flex justify-center text-gray-50 rounded-full bg-gray-400  py-4"
                    }
                    onClick={() => setselectedTab(1)}
                  >
                    Reward Tool
                  </a>
                </li>
                <li>
                  <a
                    href="#page2"
                    className={
                      selectedTab == 2
                        ? "flex justify-center  py-4 bg-primary rounded-full shadow text-gray-100"
                        : "flex justify-center text-gray-50 bg-gray-400 rounded-full  py-4"
                    }
                    onClick={() => setselectedTab(2)}
                  >
                    Blacklist Tool
                  </a>
                </li>
                <li>
                  <a
                    href="#page3"
                    className={
                      selectedTab == 3
                        ? "flex justify-center  py-4  bg-primary rounded-full shadow text-gray-100"
                        : "flex justify-center rounded-full text-gray-50 bg-gray-400  py-4"
                    }
                    onClick={() => setselectedTab(3)}
                  >
                    User Wallets
                  </a>
                </li>
              </ul>

              <ActiveTabContent
                selectedTab={selectedTab}
                dropData={dropData}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                register={register}
                onCancelDrop={onCancelDrop}
                isLoading={isLoading}
                isDeletingDrop={isDeletingDrop}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </MainLayout>
    </>
  );
};

export const ActiveTabContent = (props) => {
  const [blacklistData, setblacklistData] = useState([]);

  const [ltcBalance, setltcBalance] = useState([]);
  const [totalClaimed, setTotalClaimed] = useState();
  const [claimData, setclaimData] = useState();

  const getBlacklistData = async () => {
    try {
      const response = await fetch("/api/blacklist");
      const data = await response.json();

      console.log("data", data);

      setblacklistData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getBlacklistData();
  }, []);

  async function getLTCBalance(address) {
    const url = `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const balance = data.balance / 100000000; // convert from satoshis to LTC
      return balance;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const getClaimData = async (address) => {
    try {
      const response = await fetch("/api/claim-data");
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const bala = async () => {
      const balance = await getLTCBalance(
        "ltc1q6qn7t3xr4s3njq2kfqkanafujnh2vn3mynuszl"
      );
      setltcBalance(balance);
    };

    bala();
  }, []);

  function calculateTotalNFTsClaimed(data, contractAddress, rewardId) {
    let totalNFTs = 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (
        item.contractAddress === contractAddress &&
        item.dropId === rewardId &&
        item.isClaimed
      ) {
        totalNFTs++;
      }
    }

    return totalNFTs;
  }

  function createNFTsSummary(data) {
    const summary = [];

    // Iterate through each unique contract address and rewardId
    const uniqueContracts = [
      ...new Set(data?.map((item) => item.contractAddress)),
    ];
    for (const contract of uniqueContracts) {
      const uniqueRewardIds = [
        ...new Set(
          data
            ?.filter((item) => item.contractAddress === contract)
            .map((item) => item.dropId)
        ),
      ];
      for (const rewardId of uniqueRewardIds) {
        const totalNftsClaimed = calculateTotalNFTsClaimed(
          data,
          contract,
          rewardId
        );
        summary.push({
          rewardId: rewardId,
          contractAddress: contract,
          totalNftsClaimed: totalNftsClaimed,
        });
      }
    }

    const combinedData = {};
    summary.forEach((reward) => {
      const { rewardId, contractAddress, totalNftsClaimed } = reward;

      if (!combinedData[rewardId]) {
        combinedData[rewardId] = {
          rewardId: rewardId,
          contractAddress1: contractAddress,
          totalClaimed1: totalNftsClaimed,
          contractAddress2: null,
          totalClaimed2: null,
        };
      } else {
        combinedData[rewardId].contractAddress2 = contractAddress;
        combinedData[rewardId].totalClaimed2 = totalNftsClaimed;
      }
    });

    return Object.values(combinedData);
  }

  useEffect(() => {
    const getStats = async () => {
      const claimDatas = await getClaimData();
      const nftsTotalClaimed = createNFTsSummary(claimDatas);
      console.log("Claim Data new; ", nftsTotalClaimed);

      // const stats =  calculateTotalUniqueNFTsClaimed([1,2,3,4], claimDatas,boostClaimDatas);

      setTotalClaimed(nftsTotalClaimed);
      //console.log("Stats: ", stats);
    };

    try {
      getStats();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (props.selectedTab == 1)
    return (
      <>
        <div className="flex justify-center"></div>

        <div className="flex justify-center ">
          {totalClaimed ? (
            <>
              <div className="flex flex-auto flex-wrap justify-center mb-5 gap-4 p-5 flex-grow w-full">
                {totalClaimed?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap justify-center gap-2 bg-black rounded-2xl p-5"
                  >
                    <p className="flex flex-col justify-center">
                      Reward:{" "}
                      <span className=" bg-white text-black font-700 font-bold rounded-lg px-1 flex justify-center">
                        {index + 1}
                      </span>
                    </p>
                    <p className="flex flex-col justify-center">
                      P1 NFTs Claimed:{" "}
                      <span className="bg-blue-900 rounded-lg px-1 flex justify-center">
                        {item?.totalClaimed1}/500
                      </span>
                    </p>
                    <p className="flex flex-col justify-center">
                      P2 NFTs Claimed:{" "}
                      <span className="bg-blue-900 rounded-lg px-1 flex justify-center">
                        {item.totalClaimed2}/1500
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="flex px-4 py-2 rounded-lg bg-black ">
                Claim Data Loading...
              </span>
            </>
          )}
        </div>

        <div className="border-b-2 border-gray-200 mx-20 my-10"></div>

        <div className="flex  justify-center ">
          <div className=" flex justify-center  w-1/3 ">
            <div className="p-4 rounded-[3rem]">
              <div className="flex justify-center pt-2">Wallet Balance</div>
              <div className="flex justify-center py-2 mb-2 bg-primary rounded-2xl">
                LTC Balance: {ltcBalance}
              </div>

              <form
                onSubmit={props.handleSubmit(props.onSubmit)}
                className="flex flex-col align-middle justify-center gap-6 p-6 bg-black rounded-[2rem] shadow-lg"
              >
                <h2 className="text-xl font-semibold text-white text-center mb-4">
                  Add Drop Data
                </h2>

                <div className="flex gap-4 items-center">
                  <span className="text-white">Drop ID#</span>
                  <input
                    type="number"
                    {...props.register("dropId")}
                    placeholder="Drop Id: i.e 1"
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <span className="text-white">LTC/NFT</span>
                  <input
                    type="number"
                    {...props.register("eachLTC", { min: 0.0, max: 10000 })}
                    placeholder="LTC / NFT: i.e 5"
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.000001"
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <span className="text-white">KDA/NFT</span>
                  <input
                    type="number"
                    {...props.register("eachKDA", { min: 0.0, max: 10000 })}
                    placeholder="KDA / NFT: i.e 7"
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <span className="text-white">CKB/NFT</span>
                  <input
                    type="number"
                    {...props.register("eachCKB", { min: 0.0, max: 10000 })}
                    placeholder="CKB / NFT: i.e 7"
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <span className="text-white">LTC Boost</span>
                  <input
                    type="number"
                    {...props.register("ltcBoost", { min: 0.0, max: 10000 })}
                    placeholder="LTC Boost: i.e 2"
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.000001"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl transition duration-200"
                >
                  {props.isLoading ? (
                    <div className="flex justify-center">
                      <IconSpinner className="animate-spin mr-2" />{" "}
                      Submitting...
                    </div>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 pt-10 justify-center w-2/3 ">
            {props.isLoading || props.isDeletingDrop ? (
              <>
                <div className="flex justify-center">
                  {" "}
                  <IconSpinner></IconSpinner>
                </div>
              </>
            ) : (
              <>
                {props?.dropData?.map((item, index) => (
                  <div
                    className="bg-black text-white w-full max-w-2xl border border-gray-600 flex flex-col rounded-xl justify-between  max-h-fit shadow-lg p-4  relative" // Add relative positioning
                    key={index}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full w-4 h-4 border-2 border-purple-500" />
                        <div className="text-md font-bold">
                          Reward# {item.dropId}
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex justify-center flex-wrap gap-1">
                          <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                            <span className="bg-primary rounded-full px-2">
                              {parseFloat(item?.eachLTC)?.toFixed(4)}{" "}
                            </span>{" "}
                            <IconLTC width={20} />
                          </span>

                          <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                            <span className="bg-primary rounded-full px-2">
                              {parseFloat(item?.eachKDA)?.toFixed(2)}{" "}
                            </span>
                            <IconKDA width={14} />
                          </span>
                          <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                            <span className="bg-primary rounded-full px-2">
                              {parseFloat(item?.eachCKB)?.toFixed(0)}{" "}
                            </span>{" "}
                            <IconCKB width={18} />
                          </span>
                          {item?.eachBoostLTC ? (
                            <span className="my-3 pr-1 flex gap-1 bg-red-200 text-white font-300 rounded-full">
                              <span className="bg-primary rounded-full px-2">
                                {parseFloat(item?.eachBoostLTC)?.toFixed(4)}{" "}
                              </span>{" "}
                              <IconLTC width={20} /> Boost
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <span className="absolute top-2 right-1 transform translate-x-1/2 -translate-y-1/2">
                      <span className=" text-white px-1 text-xs rounded-full">
                        <button
                          className=""
                          onClick={() => props.onCancelDrop(item)}
                        >
                          <IconClosed width={25} height={25} />
                        </button>
                      </span>
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );

  if (props.selectedTab == 2)
    return (
      <>
        <div className="flex flex-wrap justify-center gap-5">
          {/* //Form */}
          <div className="p-4 border-2 border-gray-400 rounded-xl">
            <div className="text-center mb-4">Blacklist Add tool</div>
            <form
              onSubmit={props.handleSubmit(props.onSubmit)}
              className="flex flex-col align-middle justify-center gap-4"
            >
              <div className="flex gap-2 items-center">
                {" "}
                <span>NFT ID#</span>
                <input
                  type="number"
                  {...props.register("nftId")}
                  placeholder="NFT Id: i.e 1"
                  className="px-4 py-1 rounded-md"
                  min="1"
                />
              </div>

              <div className="flex gap-2 items-center">
                <span>Address:</span>
                <input
                  type="text"
                  {...props.register("aceMinersContractAddress")}
                  placeholder="AceMiners Contract Address"
                  className="px-4 py-1 rounded-md"
                />
              </div>

              <div className="flex gap-2 items-center">
                {" "}
                <span>Blacklist:</span>
                <input
                  type="decimal"
                  {...props.register("isBlacklisted")}
                  placeholder="true/false"
                  className="px-4 py-1 rounded-md"
                />
              </div>

              <Button type="submit"> Submit </Button>
            </form>
          </div>

          {/* //Table */}
          <div className="flex flex-auto justify-between ">
            {" "}
            <BlacklistTable tableData={blacklistData} />
          </div>
        </div>
      </>
    );

  if (props.selectedTab == 3)
    return (
      <>
        <div className="flex justify-center items-center">
          <UserWalletsTable />
        </div>
      </>
    );
};
export default Admin;
