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
import { default as React, useEffect, useReducer, useState } from "react";
import ABI_CONTRACTWTH from "../constant/ABI_WETH.json";

function PayoutV2() {
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
        "0xF14197dc4934B4D050c8cF64c24a469CB6e64BdA",
        "0xBe8E12894f04c53f6EFd9f46C11275CE54fa7609",
    ];

    const address = useAddress();
    const [loading, setloading] = useState(false);
    const [isPaid, setisPaid] = useState(false);
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

            const getTxhashes = await fetch("api/tx-data", {
                method: "GET",
            });

            const getTxhashesData = await getTxhashes.json();

            settxData(getTxhashesData);

            const claimRequests = getUniquePropertyValues(content);

            console.log(claimRequests);

            setpayouts(claimRequests);

            setloading(false);
        } catch (e) {
            console.log(e);
            setloading(false);
        }
        setloading(false);
    };

    const handlePay = async (item) => {
        setisPaid(true);
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
                const response = await fetch(
                    "https://us-central1-upheld-beach-388919.cloudfunctions.net/gcpservice",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(item),
                    }
                );
                const data = await response.json();
                console.log("Claim Data: ", data);
                setisPaid(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    function getUniquePropertyValues(jsonArray) {
        const uniqueValues = new Set();
        const resultArray = [];

        jsonArray.forEach(function (jsonObject) {
            uniqueValues.add(jsonObject.claimRequestId);
        });

        uniqueValues.forEach(function (uniqueValue) {
            let filteredObject = {};
            let nfts = [];
            let totalCkb = 0,
                totalKda = 0,
                totalLtc = 0;

            jsonArray.forEach(function (jsonObject) {
                if (jsonObject.claimRequestId === uniqueValue) {
                    nfts.push({
                        nftId: jsonObject.nftId,
                        contractAddress: jsonObject.contractAddress,
                    });
                    filteredObject = {
                        claimRequestId: jsonObject.claimRequestId,
                        dropId: jsonObject.dropId,
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

    useEffect(() => {
        getPayouts();
    }, [isPaid]);

    return (
        <div>
            <div className="m-10">
                <div className="flex flex-wrap justify-end mb-10">
                    <ConnectWallet />
                </div>

                {admin.includes(address) ? (
                    <>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-1 rounded-lg ">
                            <table className=" rounded-lg w-full text-sm text-left text-gray-50 dark:text-gray-100">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center rounded-lg">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Reward ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Claim Request ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Holders Address
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tx Hash
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            NFT IDs
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Pay
                                        </th>
                                    </tr>
                                </thead>

                                {loading ? (
                                    <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-50 text-14 font-title font-500">
                                        <span className="col-span-4"></span>
                                        <span className="col-span-4">Loading...</span>
                                        <span className="col-span-4"></span>
                                    </Card>
                                ) : (
                                    <></>
                                )}

                                <tbody>
                                    {payouts.map((item, index) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-center py-2"
                                            key={index}
                                        >
                                            <td className="align-middle justify-center">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    ID
                                                </span>
                                                <span>{index + 1}</span>
                                            </td>
                                            <td className="">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    ID
                                                </span>
                                                <span>Reward #{item?.dropId}</span>
                                            </td>
                                            <td className="">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    Claim Request ID
                                                </span>
                                                <span>
                                                    {" "}
                                                    {item?.claimRequestId?.slice(0, 6) +
                                                        "..." +
                                                        item?.claimRequestId?.slice(
                                                            item?.claimRequestId.length - 4,
                                                            item.claimRequestId.length
                                                        )}
                                                </span>
                                            </td>
                                            <td className="">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    Address
                                                </span>
                                                <span>{item?.hodlerAddress}</span>
                                            </td>
                                            <td className=" ">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    Claim Request ID
                                                </span>

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
                                            </td>
                                            <td className=" ">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    Status
                                                </span>
                                                <span>{item?.status}</span>
                                            </td>

                                            <td className="">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    Status
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {txData.map((tx) => {
                                                        if (tx?.claimRequestId === item?.claimRequestId) {
                                                            return (
                                                                <>
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
                                                                </>
                                                            );
                                                        }

                                                        return <></>;
                                                    })}
                                                </div>
                                            </td>

                                            <td className=" ">
                                                <span className="text-gray-200 text-12 md:hidden break-wordsn">
                                                    NFT IDs
                                                </span>
                                                <span>
                                                    <div
                                                        style={{
                                                            width: "200px",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {item?.nfts?.map((e, index) => (
                                                            <span key={index}>
                                                                {e?.nftId}
                                                                {index !== item.nfts.length - 1 ? ", " : ""}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </span>
                                            </td>

                                            <td className=" py-2">
                                                <span className="text-gray-200 text-12 md:hidden">
                                                    Action
                                                </span>
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
                                                                if (
                                                                    tx?.claimRequestId === item?.claimRequestId
                                                                ) {
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
                                                                                    className="flex justify-between items-center "
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
                                                            {txData.every(
                                                                (tx) =>
                                                                    tx?.claimRequestId !== item?.claimRequestId
                                                            ) && (
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default PayoutV2;
