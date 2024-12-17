import { Button } from "@/components/Form";
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
  IconTriangleUp
} from "@/components/Icon";
import { MainLayout } from "@/components/Layout";
import { Card } from "@/components/Ui";
import { contrAceMinersPhase1, contrWETH } from "@/constant/consonants";
import { ConnectWallet, useAddress, useSigner } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";
import ABI_CONTRACTWTH from "../constant/ABI_WETH.json";

// import DropZone from "../components/DropZone";
// import stylesDZ from "../styles/DropZone.module.css";
// import stylesFP from "../styles/FilePreview.module.css";
// import stylesHome from "../styles/Home.module.css";

const Payout = () => {
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

  const admin = [
    "0x664250876c9d9acC92AF91427cC0114a9a22B067",
    "0xF14197dc4934B4D050c8cF64c24a469CB6e64BdA", "0xBe8E12894f04c53f6EFd9f46C11275CE54fa7609"
  ];

  const address = useAddress();
  const [loading, setloading] = useState(false);
  const [isPaid, setisPaid] = useState(false);
  const [isRemoving, setisRemoving] = useState(false);
  const [payouts, setpayouts] = useState([]);
  const [txData, settxData] = useState([]);
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
      const respo = await fetch("/api/claim-data", {
        method: "GET",
      });
      const content = await respo.json();



      const getTxhashes = await fetch('api/tx-data', {
        method: "GET",
      })

      const getTxhashesData = await getTxhashes.json();

      settxData(getTxhashesData)


      const claimRequests = getUniquePropertyValues(content)


      console.log(claimRequests)

      setpayouts(claimRequests);

      setloading(false);
    } catch (e) {
      console.log(e);
      setloading(false);
    }
    setloading(false);
  };

  const handlePay = async (item) => {
    setisPaid(true)
    // preventEscap(true);
    // setsacrificeLoader(true);

    if (!address) {
      console.log("Wallet is not connected", "failed");
      // setsacrificeLoader(false);
      // preventEscap(false);
      return;
    }

    if (item?.claimRequestId) {
      try {
        const response = await fetch("https://us-central1-upheld-beach-388919.cloudfunctions.net/gcpservice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });

        //https://us-central1-upheld-beach-388919.cloudfunctions.net/gcpservice
        const data = await response.json();
        console.log("Claim Data: ", data);
        setisPaid(false)

      } catch (error) {
        console.error(error);
      }
    }


  };

  function getUniquePropertyValuesss(jsonArray) {
    const uniqueValues = new Set();
    const resultArray = [];

    const dropIds = new Set();

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

          nfts.push({
            dropId: jsonObject?.dropId,
            nfts: nfts + 1
          });


          dropIds.add(jsonObject.dropId);


          filteredObject = {
            claimRequestId: jsonObject.claimRequestId,
            dropId: dropIds,
            count: 1,
            status: jsonObject.requestStatus,
            hodlerAddress: jsonObject.holderEthAddress,
            nfts: nfts,
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

  function getUniquePropertyValues(jsonArray) {
    const uniqueValues = new Set();
    const resultArray = [];

    jsonArray.forEach(function (jsonObject) {
      uniqueValues.add(jsonObject.claimRequestId);
    });

    uniqueValues.forEach(function (uniqueValue) {
      const dropIdNftsMap = new Map();
      const dropIds = new Set();
      const filteredObject = {};
      let totalCkb = 0,
        totalKda = 0,
        totalLtc = 0;
      let reqStatus = '';
      let hodlerAddress = ''

      jsonArray.forEach(function (jsonObject) {
        if (jsonObject.claimRequestId === uniqueValue) {


          dropIds.add(jsonObject.dropId);

          const dropId = jsonObject.dropId;
          const nftId = jsonObject.nftId;

          if (!dropIdNftsMap.has(dropId)) {
            dropIdNftsMap.set(dropId, []);
          }
          dropIdNftsMap.get(dropId).push(nftId);

          totalCkb += Number(jsonObject.eachCKB);
          totalKda += Number(jsonObject.eachKDA);
          totalLtc += Number(jsonObject.eachLTC);
          reqStatus = jsonObject.requestStatus;
          hodlerAddress = jsonObject.holderEthAddress;
        }
      });

      const nfts = [];
      dropIdNftsMap.forEach((nftIds, dropId) => {
        nfts.push({
          dropId: dropId,
          nfts: nftIds.length
        });
      });

      resultArray.push({
        claimRequestId: uniqueValue,
        dropId: Array.from(dropIds),
        count: nfts.length,
        status: reqStatus,
        hodlerAddress: hodlerAddress,
        nfts: nfts,
        totalCkb: totalCkb,
        totalKda: totalKda,
        totalLtc: totalLtc,
      });
    });

    return resultArray;
  }

  const handleRemoveRequest = async (item) => {
    setisRemoving(true)
    console.log(item)

    if (!address) {
      console.log("Wallet is not connected", "failed");
      // setsacrificeLoader(false);
      // preventEscap(false);
      return;
    }

    if (item?.claimRequestId) {
      try {
        const response = await fetch("/api/removeRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });


        const data = await response.json();
        console.log("Removed Data: ", data?.removed?.count);

        alert("Data Removed", data?.removed?.count)

        setisRemoving(false)
      } catch (error) {
        console.error(error);
      }
    }




  }



  useEffect(() => {
    getPayouts();

  }, [isPaid, isRemoving]);

  return (
    <div className="m-20">
      <div className="flex flex-wrap justify-end"><ConnectWallet /></div>

      {admin.includes(address) ? <><div>
        <h2 className="title-2 mb-6">Payouts</h2>
        <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
          <span className="col-span-1">ID</span>

          <span className="col-span-1">Claim Request ID</span>
          <span className="col-span-2">Holders Address</span>
          <span className="col-span-2">Amount</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-2">Tx Hash</span>
          <span className="col-span-1 ">NFT IDs</span>
          <span className="col-span-1 ">Pay</span>

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

        {payouts?.map((item, index) => (
          <div
            className="border-b-[0.5px] border-gray p-2 md:px-2 md:grid md:grid-cols-12  last:mb-0 text-14 font-title font-500"
            key={index}
          >
            <span className="col-span-1 flex justify-between align-middle items-center w-fit">
              <span className="text-gray-200 text-12 md:hidden">ID</span>
              <span>{index + 1}</span>
            </span>

            <span className="col-span-1 flex justify-between align-middle items-center">
              <span className="text-gray-200 text-12 md:hidden">Claim Request ID</span>
              <span> {item?.claimRequestId?.slice(0, 6) +
                "..." +
                item?.claimRequestId?.slice(
                  item?.claimRequestId.length - 4,
                  item.claimRequestId.length
                )}</span>
            </span>
            <span className="col-span-2 flex justify-between align-middle items-center mr-2">
              <span className="text-gray-200 text-12 md:hidden">Address</span>
              <span>
                {item?.hodlerAddress?.slice(0, 12) +
                  "..." +
                  item?.hodlerAddress?.slice(
                    item?.hodlerAddress.length - 4,
                    item.hodlerAddress.length
                  )}
              </span>
            </span>
            <span className="col-span-2 flex justify-between align-middle items-center">
              <span className="text-gray-200 text-12 md:hidden">Claim Request ID</span>

              <div className="flex flex-wrap gap-1">


                <span className=" my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                  <span className="bg-primary rounded-full px-2">
                    {item?.totalLtc.toFixed(4)}{" "}
                  </span>{" "}
                  <IconLTC width={20} />
                </span>

                <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                  <span className="bg-primary rounded-full px-2">
                    {item?.totalKda.toFixed(2)}{" "}
                  </span>
                  <IconKDA width={14} />
                </span>
                <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                  <span className="bg-primary rounded-full px-2">
                    {item?.totalCkb.toFixed(0)}{" "}
                  </span>{" "}
                  <IconCKB width={18} />
                </span>
              </div>

            </span>
            <span className="col-span-1 flex justify-between align-middle items-center">
              <span className="text-gray-200 text-12 md:hidden">Status</span>
              <span>{item?.status}</span>
            </span>


            <span className="col-span-2 flex justify-between align-middle items-center">
              <span className="text-gray-200 text-12 md:hidden">Status</span>
              <div className="flex flex-wrap gap-1">

                {txData.map((tx) => {
                  if (tx?.claimRequestId === item?.claimRequestId) {
                    return (<>




                      {tx?.LTC ? <>
                        <Link href={`https://blockexplorer.one/litecoin/mainnet/tx/` + tx?.LtcHash}>
                          <a target="_blank" rel="noopener noreferrer">
                            <span className=" my-3 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                              <><IconLTC width={20} />
                                <span className="bg-primary rounded-full px-1 ">
                                  ✓
                                </span></>
                            </span>
                          </a>
                        </Link>
                      </> : <></>}






                      {tx?.KDA ? <>
                        <Link href={`https://kdaexplorer.com/tx-details/` + tx?.KdaHash} >

                          <a target="_blank" rel="noopener noreferrer">
                            <span className="my-3 pl-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">

                              <>

                                <IconKDA width={14} />
                                <span className="bg-primary rounded-full px-2">
                                  ✓
                                </span>

                              </>



                            </span></a>
                        </Link>
                      </> : <></>}









                      {tx?.CKB ? <>
                        <Link href={`https://explorer.nervos.org/transaction/` + tx?.CkbHash} >

                          <a target="_blank" rel="noopener noreferrer">
                            <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                              <>

                                <IconCKB width={18} />
                                <span className="bg-primary rounded-full px-2">
                                  ✓
                                </span>{" "}

                              </>


                            </span> </a>
                        </Link>
                      </> : <></>}









                    </>)
                  }

                  return <></>
                })}

              </div>
            </span>

            <span className="col-span-2 flex justify-between align-middle items-center ">
              <span className="text-gray-200 text-12 md:hidden break-words">NFT IDs</span>
              <span>

                <div style={{ width: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item?.nfts?.map((e, index) => (

                    <div className="py-1 flex justify-start text-left">
                      <span key={index}>
                        Reward: <span className="bg-primary rounded-lg p-1">{e.dropId}</span>  NFTs: <span className="bg-primary rounded-lg p-1">{e.nfts}</span>

                      </span>
                    </div>





                  ))}
                </div>








              </span>
            </span>


            <span className="col-span-1 text-primary text-center flex justify-between gap-2">
              <span className="text-gray-200 text-12 md:hidden">Action</span>
              <span className="">

                {/*              {txData.length > 0 ? <>     {txData.map((tx) => {
                  if (txData.length > 0 && tx?.claimRequestId === item?.claimRequestId && tx?.LTC && tx?.KDA && tx?.CKB) {
                    return (<>
                      <Button
                        kind="outline-primary"
                        className="flex justify-between items-center bg-primary"
                        disabled
                      >
                        <span>PAID</span>
                      </Button>
                    </>)
                  }
                  if (txData.length > 0 && tx?.claimRequestId != item?.claimRequestId) {
                    return (<><Button
                      kind="outline-primary"
                      className="flex justify-between items-center"
                      onClick={() => {
                        handlePay(item);
                      }}
                    >
                      <span>PAY</span>
                    </Button> </>)
                  }

                })}</>

                  :

                  <>

                    <Button
                      kind="outline-primary"
                      className="flex justify-between items-center"
                      onClick={() => {
                        handlePay(item);
                      }}
                    >
                      <span>PAY</span>
                    </Button>

                  </>} */}

                {txData.length > 0 ? (
                  <>
                    {txData.map((tx) => {
                      if (tx?.claimRequestId === item?.claimRequestId) {
                        if (
                          tx?.LTC === false ||
                          tx?.KDA === false ||
                          tx?.CKB === false ||
                          (!tx?.LTC && !tx?.KDA && !tx?.CKB)
                        ) {
                          return (
                            <>
                              <Button
                                kind="outline-primary"
                                className="flex justify-between items-center"
                                onClick={() => {
                                  handlePay(item);
                                }}
                              >
                                <span>PAY</span>
                              </Button>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <Button
                                kind="outline-primary"
                                className="flex justify-between items-center bg-primary"
                                disabled
                              >
                                <span>PAID</span>
                              </Button>
                            </>
                          );
                        }
                      }
                    })}
                    {txData.every((tx) => tx?.claimRequestId !== item?.claimRequestId) && (
                      <>
                        <Button
                          kind="outline-primary"
                          className="flex justify-between items-center"
                          onClick={() => {
                            handlePay(item);
                          }}
                        >
                          <span>PAY</span>
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      kind="outline-primary"
                      className="flex justify-between items-center"
                      onClick={() => {
                        handlePay(item);
                      }}
                    >
                      <span>PAY</span>
                    </Button>
                  </>
                )}





              </span>
              <button

                className="flex justify-between items-center bg-red-700 outline-none text-16 px-2 py-1 rounded-full font-title text-white shadow-lg"
                onClick={() => {
                  handleRemoveRequest(item)
                }}
              >
                <span>Remove</span>

              </button>
            </span>

          </div>
        ))}
      </div></> : <></>}
    </div>

  );
};

export default Payout;
