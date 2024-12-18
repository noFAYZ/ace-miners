import { Button } from "@/components/Form";
import { IconArrowRight } from "@/components/Icon";
import { MainLayout } from "@/components/Layout";
import { Card } from "@/components/ui";
import { contrAceMinersPhase1, contrWETH } from "@/constant/consonants";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useReducer, useState } from "react";
import ABI_CONTRACTWTH from "../constant/ABI_WETH.json";

const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/evm-utils");
// const { Storage } = require("@google-cloud/storage");
// const storage = new Storage();

const Management = () => {
  // reducer function to handle state changes
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LIST":
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };

  const address = useAddress();
  const [loading, setloading] = useState(false);
  const [payouts, setpayouts] = useState([]);
  const MORALIS_API_KEY =
    "LKwVLPKaOwISXAZqApxkns2ENMhRgIQAmxhz7ks0JH8amyOkIjRpb9WBKLSx1tSu";
  const contractAddress = "0x0770a317AF574fBa15F205A60bCA9075206ad0a8";
  const chain = EvmChain.POLYGON;
  const total = 5000;

  async function getHolders(cursor) {
    // return await Moralis.EvmApi.nft.getNFTOwners({
    //   contractAddress,
    //   chain,
    //   cursor,
    // });
    try {
      console.log(contractAddress, chain, cursor);
      return await Moralis.EvmApi.nft.getNFTOwners({
        contractAddress,
        chain,
        cursor,
      });
    } catch (e) {
      console.log("e:", e);
    }
  }

  function freq(nums) {
    return nums.reduce((acc, curr) => {
      acc[curr] = -~acc[curr];
      return acc;
    }, {});
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const allHolders = async () => {
    try {
      let i = 0;
      let j = 0;
      let fetched = 0;
      let pages = [];
      let cursors = [];
      let NftHolders = [];
      let NftHoldersAmount = [];

      let finalHoldersAddresses = [];
      let finalHoldersAmount = [];

      let page = await getHolders();
      cursors.push(page.data.cursor);
      pages.push(page.data);
      fetched += page.data.page_size;
      page.result.map((e, i) => {
        NftHolders.push(e.ownerOf._value);
      });

      while (fetched != total) {
        console.log("Total Fetched: " + fetched + "/" + total);
        // Get and return the crypto data
        page = await getHolders(cursors[i]);
        cursors.push(page.data.cursor);
        pages.push(page.data);

        page.result.map((e, i) => {
          NftHolders.push(e.ownerOf._value);
        });

        fetched += page.data.page_size;
        i += 1;
        await sleep(1000);
      }

      let count = freq(NftHolders);

      for (let [key, value] of Object.entries(count)) {
        finalHoldersAddresses.push(key);
        finalHoldersAmount.push(value);
        console.log(`${key}, ${value}`);
      }

      //WRITE DATA TO FILES ON GCLOUD BUCKET
      // await writeFileToCloudStorage("holders.json",pages)
      // await writeFileToCloudStorage("holdersAddresses.json",finalHoldersAddresses)
      // await writeFileToCloudStorage("holdersAmount.json",finalHoldersAmount)
    } catch (error) {
      // Handle errors
      console.log("error:", error);
      console.error(error);
    }
  };

  let signerThirdweb = useSigner();

  // destructuring state and dispatch, initializing fileList to empty array
  // const [data, dispatch] = useReducer(reducer, {
  //   inDropZone: false,
  //   fileList: [],
  // });

  const getPayouts = async () => {
    setloading(true);
    try {
      let payoutsLs = [];
      const respo = await fetch("/api/payout", {
        method: "GET",
      });
      const content = await respo.json();
      for (
        let rowIndex = 1;
        rowIndex < content.data.values.length;
        rowIndex++
      ) {
        let row = content.data.values[rowIndex];
        let rowData = {
          id: row[0],
          dateTime: row[1],
          address: row[2],
          amount: row[3],
          comments: row[4],
        };
        payoutsLs.push(rowData);
        console.log(rowData);
      }
      setpayouts(payoutsLs);
      console.log(payoutsLs);
      setloading(false);
    } catch (e) {
      console.log(e);
      setloading(false);
    }
    setloading(false);
  };

  const handlePay = async (v) => {
    // preventEscap(true);
    // setsacrificeLoader(true);

    if (!address) {
      console.log("Wallet is not connected", "failed");
      // setsacrificeLoader(false);
      // preventEscap(false);
      return;
    }

    // if (parseFloat(count) < parseFloat(minAmount)) {
    //   if (userNFTCount) {
    //     // console.log("Minimum " + minAmount + " USDC Required");
    //     displayMsg("Minimum " + minAmount + " USDC Required", "failed");
    //     setsacrificeLoader(false);
    //     preventEscap(false);
    //     return;
    //   } else {
    //     // console.log("Minimum " + minAmount + " USDC Required");
    //     displayMsg("Minimum " + minAmount + " USDC Required", "failed");
    //     setsacrificeLoader(false);
    //     preventEscap(false);
    //     return;
    //   }
    // }

    let amount = ethers.utils.parseUnits(v.amount.toString());
    // let amount = v.amount;

    const sdkThirdweb = ThirdwebSDK.fromSigner(signerThirdweb, "polygon");
    const contractThirdweb = await sdkThirdweb.getContractFromAbi(
      contrWETH,
      ABI_CONTRACTWTH
    );
    const providerThirdweb = await sdkThirdweb.getProvider();
    let feeData = await providerThirdweb.getFeeData();

    let gasGWEI = await contractThirdweb.estimator.currentGasPriceInGwei();
    let balanceETH = await sdkThirdweb.getBalance(address);
    let balanceGWEI = ethers.utils.formatUnits(balanceETH.value, "gwei");

    let balanceWETH = await contractThirdweb.call("balanceOf", address);
    let blncWETH = ethers.utils.formatUnits(balanceWETH);

    // console.log(balanceETH);
    // console.log(blncWETH);
    //Insufient Gas in WEI

    try {
      // console.log("Sending..:", count);
      // console.log(1);
      contractThirdweb.interceptor.overrideNextTransaction(() => ({
        gasPrice: feeData.maxFeePerGas,
      }));

      let trxData = await contractThirdweb.call("transfer", v.address, amount);
      // console.log(trxData);
      // console.log("trxData", trxData.receipt.transactionHash);

      return;
    } catch (e) {
      console.log(e);
      return;
    }
  };
  const startServer = async () => {
    await Moralis.start({
      apiKey: MORALIS_API_KEY,
    });
  };

  useEffect(() => {
    // getPayouts();
    // async function initF() {
    //   await startServer();
    //   allHolders();
    // }
    // initF();
  }, []);

  return (
    <MainLayout>
      <div>
        <Button
          onClick={() => {
            async function main() {
              [signer1, signer2] = await ethers.getSigners();

              const Bank = await ethers.getContractFactory("Bank", signer1);
              const bankContract = await Bank.deploy();

              const Matic = await ethers.getContractFactory("Matic", signer2);
              const matic = await Matic.deploy();
              const Shib = await ethers.getContractFactory("Shib", signer2);
              const shib = await Shib.deploy();
              const Usdt = await ethers.getContractFactory("Usdt", signer2);
              const usdt = await Usdt.deploy();

              await bankContract.whitelistToken(
                ethers.utils.formatBytes32String("Matic"),
                matic.address
              );
              await bankContract.whitelistToken(
                ethers.utils.formatBytes32String("Shib"),
                shib.address
              );
              await bankContract.whitelistToken(
                ethers.utils.formatBytes32String("Usdt"),
                usdt.address
              );
              await bankContract.whitelistToken(
                ethers.utils.formatBytes32String("Eth"),
                "0x09B5DC75789389d1627879bA194874F459364859"
              );

              console.log(
                "Bank deployed to:",
                bankContract.address,
                "by",
                signer1.address
              );
              console.log(
                "Matic deployed to:",
                matic.address,
                "by",
                signer2.address
              );
              console.log(
                "Shib deployed to:",
                shib.address,
                "by",
                signer2.address
              );
              console.log(
                "Tether deployed to:",
                usdt.address,
                "by",
                signer2.address
              );
            }

            main()
              .then(() => process.exit(0))
              .catch((error) => {
                console.error(error);

              });
          }}
        >
          Deploy
        </Button>
        <h2 className="title-2 mb-6">Payouts</h2>
        <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
          <span className="col-span-1">ID</span>
          <span className="col-span-3">When</span>
          <span className="col-span-2">Address</span>
          <span className="col-span-2">Amount</span>
          <span className="col-span-2">Comments</span>
          <span className="col-span-2 ml-auto pr-10 text-right flex">Pay</span>
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
        {/* <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
          <span className="col-span-1">ID</span>
          <span className="col-span-3">When</span>
          <span className="col-span-2">Address</span>
          <span className="col-span-2">Amount</span>
          <span className="col-span-2">Comments</span>
          <span className="col-span-2 ml-auto pr-10 text-right flex">Pay</span>
        </Card> */}
        {/* <Card className=" md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
          <span className="col-span-12">Loading....</span>
        </Card> */}
        {payouts.map((item, index) => (
          <div
            className="border-b-[0.5px] border-gray p-3 md:px-8 md:grid md:grid-cols-12  last:mb-0 text-14 font-title font-500"
            key={index}
          >
            <span className="col-span-1 flex justify-between">
              <span className="text-gray-200 text-12 md:hidden">ID</span>
              <span>{item.id}</span>
            </span>
            <span className="col-span-3 flex justify-between">
              <span className="text-gray-200 text-12 md:hidden">When</span>
              <span>{item.dateTime}</span>
            </span>
            <span className="col-span-2 flex justify-between">
              <span className="text-gray-200 text-12 md:hidden">Address</span>
              <span>
                {item.address.slice(0, 4) +
                  "..." +
                  item.address.slice(
                    item.address.length - 4,
                    item.address.length
                  )}
              </span>
            </span>
            <span className="col-span-2 flex justify-between">
              <span className="text-gray-200 text-12 md:hidden">When</span>
              {/* <span>{item.amount}</span> */}
              <span className="text-primary">{item.amount} WETH</span>
            </span>
            <span className="col-span-2 flex justify-between">
              <span className="text-gray-200 text-12 md:hidden">Comments</span>
              <span>{item.comments}</span>
            </span>
            <span className="col-span-2 text-primary text-right flex justify-between">
              <span className="text-gray-200 text-12 md:hidden">Action</span>
              <span className="ml-auto">
                {" "}
                <Button
                  kind="outline-primary"
                  className="flex justify-between gap-x-3 items-center"
                  onClick={() => {
                    handlePay(item);
                  }}
                >
                  <span>PAY</span>
                </Button>
              </span>
            </span>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Management;
