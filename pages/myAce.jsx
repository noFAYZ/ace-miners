import CheckerModal from "@/components/checkerModal";
import { Button } from "@/components/Form";
import { IconSearch } from "@/components/Icon";
import { MainLayout } from "@/components/Layout";
import { IconSpinner } from "@/components/Ui/Snippets";
import {
  aceMinerContracts,
  alchemySettings,
  chainURL,
  contrAceMinersPhase1,
  contrAceMinersPhase2,
} from "@/constant/consonants";
import React, { useEffect, useState } from "react";

const MyAce = () => {
  const [nftList, setNftList] = useState();
  const [claimData, setclaimData] = useState();
  const [dropData, setdropData] = useState();
  const [rewardData, setRewardData] = useState();
  const [isChecking, setisChecking] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const getClaimData = async (address) => {
    try {
      const response = await fetch("/api/contract/" + address);
      const data = await response.json();

      setclaimData(data);
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

  const handleCheckNftStatus = () => {
    setisChecking(true);
    if (claimData && nftList && dropData) {
      const idsArray = stringToIntArray(nftList);

      const rewardsData = getRewardsToClaim(claimData, idsArray, dropData);
      setRewardData(rewardsData);
      console.log("Rewards", rewardsData);
    }

    setisChecking(false);
  };

  function stringToIntArray(inputString, limit) {
    try {
      // Split the input string by commas, convert each part to an integer, and limit the array length
      const intArray = inputString
        .split(",")
        .map(Number)
        .filter((num) => !isNaN(num))
        .slice(0, limit);
      return intArray;
    } catch (error) {
      // Handle the case where conversion to integers fails
      console.error("Error: Input contains non-integer values.");
      return null;
    }
  }

  const getContractAddress = (value) => {
    if (value == "p1") return contrAceMinersPhase1;
    return contrAceMinersPhase2;
  };

  function getRewardsToClaim(claimData, nftIds, dropData) {
    const rewardsToClaim = [];

    nftIds.forEach((nftId) => {
      const claimDetails = claimData.filter((claim) => claim.nftId === nftId);
      console.log(nftId, claimDetails);
      const dropDetails = dropData.find(
        (drop) => drop.dropId === claimDetails?.dropId
      );

      if (claimDetails?.length === dropData?.length) {
        const rewards = {
          nftId: nftId,
          eachLTC: 0,
          eachKDA: 0,
          eachCKB: 0,
        };

        rewardsToClaim.push(rewards);
      } else if (claimDetails?.length <= 0 || !claimDetails) {
        let rewards = {
          nftId: nftId,
          eachLTC: 0.0,
          eachKDA: 0.0,
          eachCKB: 0.0,
        };

        dropData?.forEach((item) => {
          //console.log(dropData?.eachKDA,dropData?.eachLTC,dropData?.eachCKB)
          rewards.eachLTC += Number(item?.eachLTC);
          rewards.eachCKB += Number(item?.eachCKB);
          rewards.eachKDA += Number(item?.eachKDA);
        });

        rewardsToClaim.push(rewards);
      } else {
        let rewards = {
          nftId: nftId,
          eachLTC: 0.0,
          eachKDA: 0.0,
          eachCKB: 0.0,
        };
        //const claimDetails = claimData.find((claim) => claim.nftId === nftId && );
        dropData?.forEach((item) => {
          const isFound = claimDetails.find(
            (claim) => claim.dropId === item?.dropId
          );
          console.log(isFound);
          if (!isFound) {
            rewards.eachLTC += Number(item?.eachLTC);
            rewards.eachCKB += Number(item?.eachCKB);
            rewards.eachKDA += Number(item?.eachKDA);
          }
        });
        rewardsToClaim.push(rewards);
      }

      if (
        claimDetails &&
        dropDetails &&
        !claimDetails.isClaimed &&
        claimDetails.requestStatus === "completed"
      ) {
        const rewards = {
          nftId: claimDetails.nftId,
          eachLTC: dropDetails.eachLTC,
          eachKDA: dropDetails.eachKDA,
          eachCKB: dropDetails.eachCKB,
        };

        rewardsToClaim.push(rewards);
      }
    });

    return rewardsToClaim;
  }

  useEffect(() => {
    getDropData();
    console.log(dropData);
  }, []);

  return (
    <MainLayout>
      <div className="flex justify-center container pt-10 align-middle items-center">
        <div className="flex flex-col rounded-lg shadow-md gap-4 bg-gray-400 py-10 px-20 items-center text-center text-white drop-shadow-lg">
          <title className=" flex items-center text-center text-18 ">
            Check your NFT Reward Status
          </title>

          <div>
            <select
              id="contracts"
              className="  text-gray-900  rounded-lg block w-full p-2.5  dark:text-white border-none drop-shadow-md "
              value={selectedValue}
              onChange={async (e) => {
                setSelectedValue(e.target.value);
                await getClaimData(getContractAddress(e.target.value));
              }}
            >
              <option defaultValue="">Select AceMiners Contract</option>
              <option value="p1">AceMiners Phase 1</option>
              <option value="p2">AceMiners Phase 2</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="121,222,153,.."
            className="px-2 py-1 rounded text-white w-full"
            onChange={(e) => setNftList(e.target.value)}
          ></input>

          {isChecking ? (
            <>
              <button
                className="flex gap-2 border rounded px-3 py-1 border-slate-600 hover:bg-slate-800"
                onClick={handleCheckNftStatus}
              >
                <IconSpinner /> Checking...
              </button>
            </>
          ) : (
            <>
              <button
                className="flex gap-2 border rounded px-3 py-1 border-slate-600 hover:bg-slate-800"
                onClick={handleCheckNftStatus}
              >
                <IconSearch width={20} /> Check
              </button>
            </>
          )}
          <CheckerModal
            isModal={rewardData?.length > 0 ? true : false}
            rewards={rewardData}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default MyAce;
