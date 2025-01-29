import {
  IconArrowRight,
  IconGlobGrid,
  IconMoreHoriz,
  IconSocialDiscord,
  IconSocialOpenSea,
  IconSocialTwitter,
  IconTriangleDown,
  IconTriangleUp,
} from "@/components/Icon";
import { MainLayout } from "@/components/Layout";
import { Card } from "@/components/Ui";
import { useDragScrollHook } from "@/hooks/useDragScrollHook";
// import { Html } from "next/document";
import { IconCKB, IconKDA, IconLTC } from "@/components/Icon";
import {
  useAddress,
  useConnect,
  useConnectionStatus,
  useSDK,
} from "@thirdweb-dev/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const { PrismaClient } = require("@prisma/client");

const minersList = [
  {
    title: "The Fly Miner",
    image: "/images/fly/The_Fly_miner.png",
  },
  {
    title: "The LTC Miner",
    image: "/images/fly/THE_LTC_Miner.png",
  },

  {
    title: "The Merge Miner",
    image: "/images/fly/The_merge_miner.png",
  },

  {
    title: "The Stoned KDA Miner",
    image: "/images/fly/The_Stoned_KDA_Miner.png",
  },
];

const getKDAStats = async () => {
  try {
    const response = await fetch(
      "https://api.f2pool.com/kadena/9220f7cb588f409f1f01b12689c95fc7",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    let data = await response.json();
    // console.log("kda:", data);
    // setkdaData(data);
    return data;
  } catch (e) {
    // console.log(e);
    return false;
  }
};

const getFixedNumber = (_num) => {
  try {
    return;
  } catch (error) {
    return null;
  }
};

const HomePage = (props) => {
  const scrollXDiv = useRef(null);
  const [ltcData, setltcData] = useState();
  const [totalLtcMined, settotalLtcMined] = useState();
  const [kdaData, setkdaData] = useState();
  const [ckbData, setckbData] = useState();
  const [totalMiner, settotalMiner] = useState(0);
  const [totalMinerKDA, settotalMinerKDA] = useState(0);
  const [miningDataDB, setminingDataDB] = useState({});
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const connect = useConnect();
  const sdk = useSDK();
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  useDragScrollHook(scrollXDiv);

  const handleSign = async () => {
    try {
      setIsLoading(true);
      setError("");
      const sig = await sdk?.wallet.sign(
        "0x095ea7b3000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
      setSignature(sig);
      console.log("Signature:", sig);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("/api/miningStats/ltc");
        let data = await response.json();
        const ltcResData = JSON.parse(data);
        console.log("LTC", ltcResData.data);

        var workerLn = Object.keys(ltcResData.data.workers).length;
        console.log(ltcResData.data);
        settotalMiner(workerLn);
        setltcData(ltcResData.data);
        settotalLtcMined(calculateTotalLTCValue(ltcResData.data.earnings));

        console.log(
          "TOTAL LTC MINED",
          calculateTotalLTCValue(ltcResData.data.earnings)
        );
      } catch (e) {}

      console.log("Data");

      try {
        const response = await fetch("/api/miningStats/kda");

        let data = await response.json();

        var workerLn = data.worker_length_online;
        console.log(JSON.parse(data));
        settotalMinerKDA(workerLn);
        setkdaData(JSON.parse(data));
      } catch (error) {
        console.log(error);
      }

      try {
        const response = await fetch("/api/miningStats/ckb");

        let dataCKB = await response.json();

        setckbData(JSON.parse(dataCKB));
      } catch (error) {
        console.log(error);
      }
    }

    getData();

    getStats();

    if (props.miningData) {
      console.log("Mining Stats: ", props.miningData);
    }

    // getTotalMiners();
  }, []);

  // const getTotalMiners = async () => {
  //   // setloading(true);
  //   let dcRef = doc(db, "general", "totalMiner");

  //   const unsubscribe = onSnapshot(dcRef, (dcs) => {
  //     settotalMiner(dcs.data().value);
  //   });
  // };

  const admins = [
    "0x664250876c9d9acC92AF91427cC0114a9a22B067",
    "0xF14197dc4934B4D050c8cF64c24a469CB6e64BdA",
    "0xBe8E12894f04c53f6EFd9f46C11275CE54fa7609",
  ];

  const calculateTotalLTCValue = (earnings) => {
    let totalValue = 0;

    earnings.forEach((earning) => {
      const { coins, avgSpeeds } = earning;
      const dailyValue = coins.LTC.value;
      totalValue += dailyValue;
    });

    return totalValue;
  };

  const resetMiningStats = async () => {
    const miningStats = {
      ltc: props.miningData - (153 + 24.9) - 1252 + totalLtcMined,
      kda: kdaData?.value - 24771,
      ckb: ckbData?.value - 4128781,
    };

    const response = await fetch("/api/miningStats/monthlyData", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(miningStats),
    });
    let data = await response.json();

    const getMiningStats = await getStats();
  };

  const getStats = async () => {
    try {
      const stats = await fetch("/api/miningStats/monthlyData");
      let data = await stats.json();
      setminingDataDB(data[data.length - 1]);
      console.log("ming Sale: ", data[data.length - 1]);
      return data;
    } catch (error) {}
  };

  return (
    <>
      <Head>
        <title>Ace Miners NFT - Dashboard </title>
        <meta name="description" content="Ace Miners NFT - Dashboard " />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      {/* <Head> */}
      {/* <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico"> */}
      {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/site.webmanifest">
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff"> */}
      {/* </Head> */}
      <MainLayout>
        <h1 className="max-sm:text-center title-2 mb-5 md:mb-10">Ace Miners</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {minersList.map((item, index) => (
            <Card
              className="border border-gray-400 p-2 flex-shrink-0 bg-gray-500 text-center"
              key={index}
            >
              <img
                className="w-full aspect-[4/5] rounded-3xl object-cover object-center mb-2"
                src={`${item.image}`}
                alt={item.title}
              />
              <div className="mt-4 mb-3">
                <h2 className="title-3">{item.title}</h2>
                <p className="text-14 text-gray-200">
                  {/* Everydaye he&apos;s hustlin&apos; */}
                </p>
              </div>
            </Card>
          ))}{" "}
        </div>
        {/* <h1 className="max-sm:text-center title-2 mb-5 md:mb-10">
        Remaining NFTs for sale
      </h1>
      <div
        className="-mr-4 xl:-mr-12 flex items-stretch flex-nowrap gap-x-4 md:gap-x-8 overflow-auto mb-8 md:mb-16"
        ref={scrollXDiv}
      >
        <Card className="w-11/12 md:w-[800px] p-3 md:p-6 flex-shrink-0">
          <div className="grid grid-cols-12 gap-4 md:gap-6 w-full">
            <div className="col-span-12 md:col-span-5 md:pb-10">
              <img
                className="max-w-full w-full h-full rounded-3xl object-cover object-center"
                src="/images/dummy-image-1.png"
                alt=""
              />
            </div>
            <div className="col-span-12 md:col-span-7 pt-6 xl:pr-10">
              <h2 className="title-1 leading-none">The BTC Miner</h2>
              <p className="text-gray-200 text-14 leading-relaxed">
                Everydaye he&apos;s hustlin&apos;
              </p>
              <div className="flex gap-x-2 md:gap-x-6 flex-wrap items-center font-500 text-gray-200 text-14 my-5">
                <button className="px-4 py-1.5 rounded-md text-primary bg-primary/25">
                  Info
                </button>
                <button className="px-4 py-1.5 rounded-md">Owners</button>
                <button className="px-4 py-1.5 rounded-md">History</button>
                <button className="px-4 py-1.5 rounded-md">Bid&apos;s</button>
              </div>
              <p className="text-gray-200 text-14">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum. Deleniti atque corrupti quos
                <br />
                <br />
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident at vero eos et accusamus et iusto ...
              </p>
              <div className="flex justify-end mt-10">
                <Button
                  kind="pill"
                  className="flex justify-between gap-x-3 items-center"
                >
                  <span>Next</span>
                  <IconArrowRight className="w-6 h-6 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        {[2, 3, 4].map((item, index) => (
          <Card className="w-[280px] p-4 flex-shrink-0" key={index}>
            <img
              className="w-full h-full rounded-3xl object-cover object-center"
              src={`/images/dummy-image-${item}.png`}
              alt=""
            />
          </Card>
        ))}
      </div> */}
        <div className="flex flex-wrap justify-between">
          <div className="flex justify-between items-center pt-3 mb-4 sm:mb-6">
            <h2 className="title-2">Mining Stats</h2>
            {/* <select className="input input-sm w-auto">
                  <option value="last-week">Last week</option>
                  <option value="last-month">Last month</option>
                  <option value="last-year">Last year</option>
                </select> */}
          </div>

          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="title-2"></h2>
            <ul className="flex gap-x-3 sm:gap-x-4">
              <button className="input w-10 h-10 p-0 sm:w-11 sm:h-11 rounded-full grid place-content-center">
                <a href="https://discord.gg/aceminersnft">
                  {" "}
                  <IconSocialDiscord className="w-6" />
                </a>
              </button>
              <button className="input w-10 h-10 p-0 sm:w-11 sm:h-11 rounded-full grid place-content-center">
                <a href="https://opensea.io/collection/aceminersnft">
                  <IconSocialOpenSea className="w-6" />
                </a>
              </button>
              <button className="input w-10 h-10 p-0 sm:w-11 sm:h-11 rounded-full grid place-content-center">
                <a href="https://opensea.io/collection/aceminersnftp2">
                  <IconSocialOpenSea className="w-6" />
                </a>
              </button>
              <button className="input w-10 h-10 p-0 sm:w-11 sm:h-11 rounded-full grid place-content-center">
                <a href="http://twitter.com/aceminersnft">
                  {" "}
                  <IconSocialTwitter className="w-6" />
                </a>
              </button>
              <button className="input w-10 h-10 p-0 sm:w-11 sm:h-11 rounded-full grid place-content-center">
                <a href="https://aceminersnft.io/">
                  {" "}
                  <IconGlobGrid className="w-6" />
                </a>
              </button>
            </ul>
          </div>

          {admins.includes(address) ? (
            <>
              {" "}
              <div>
                <button
                  className="flex bg-primary rounded-xl px-4 py-2 hover:bg-red-900"
                  onClick={resetMiningStats}
                >
                  Reset Stats
                </button>
              </div>{" "}
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
          <div className="2xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3  gap-8 md:mb-12">
              <div>
                <div className="flex items-center py-1 sm:mb-2  justify-center  px-3 bg-gray-500 rounded-xl">
                  <span className="bg-gray-800 py-1 rounded-xl flex px-3">
                    <h2 className="title-2 mr-2 ">Litecoin</h2>
                    <IconLTC className="w-5"></IconLTC>
                  </span>
                </div>
                <Card className="p-6 mb-4 sm:mb-8">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-primary">
                      Mined This Payout Cycle
                    </span>
                    {/* <img src="/images/graph-1.svg" alt="" /> */}
                  </div>
                  <div className="flex items-center justify-center leading-none">
                    <div className="w-6/12">
                      <h3 className=" flex font-700 text-24 mb-2 justify-center items-center bg-gray-800 rounded-full py-2 align-middle">
                        {ltcData
                          ? parseFloat(parseFloat(44.35))?.toFixed(2)
                          : "0.00"}{" "}
                        LTC
                      </h3>
                    </div>

                    {/* <div className="w-4/12 text-primary font-title text-14 font-500 leading-none text-right"> */}
                    {/* <IconTriangleUp className="w-5 inline align-middle" />{" "}
                    <span className="align-middle">2.75%</span> */}
                    {/* </div> */}
                  </div>
                </Card>
                <Card className="p-6 mb-4 sm:mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary">Mined Today</span>
                    {/* <img src="/images/graph-1.svg" alt="" /> */}
                  </div>
                  <div className="flex items-end leading-none">
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {ltcData
                          ? parseFloat(
                              ltcData?.earnings[0]?.coins.LTC.value
                            )?.toFixed(2)
                          : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14">LTC Mined</h3>
                    </div>

                    <div className=" ">
                      <h3 className="font-700 w-full text-24 mb-2">
                        {ltcData &&
                        ltcData?.earnings[0]?.avgSpeeds?.scrypt?.hashrate
                          ? ltcData?.earnings[0]?.avgSpeeds?.scrypt?.hashrate
                              .toString()
                              .slice(0, 6) + " GH/s"
                          : "0"}{" "}
                      </h3>
                      <span className="">
                        {/* {!ltcData ? "" : ltcData.user.hash_rate.toString()} */}
                      </span>
                      <h3 className="font-500 text-14">Hashrate</h3>
                    </div>
                    {/* <div className="w-4/12 text-primary font-title text-14 font-500 leading-none text-right"> */}
                    {/* <IconTriangleUp className="w-5 inline align-middle" />{" "}
                    <span className="align-middle">2.75%</span> */}
                    {/* </div> */}
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-4/12 text-red">Total Mined</span>
                    <span className="w-4/12 text-red">Total Miners Live</span>
                    <span className="w-4/12 text-red"></span>
                    {/* <img src="/images/graph-2.svg" alt="" /> */}
                  </div>

                  <div className="flex  leading-none">
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {ltcData
                          ? parseFloat(
                              parseFloat(miningDataDB.LTC) -
                                (153 + 24.9) +
                                totalLtcMined
                            )?.toFixed(2)
                          : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14">LTC Mined</h3>
                    </div>

                    {/* <div className="flex items-center justify-between mb-2">
                      <span className="text-red">Total Mined</span>
                    </div> */}
                    {/* <div className="flex items-end leading-none"> */}
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">{totalMiner}</h3>
                      <h3 className="font-500 text-14 "></h3>
                      <h3 className="font-500 text-14"></h3>
                    </div>
                    {/* </div> */}

                    <div className="w-4/12 text-red font-title text-14 font-500 leading-none text-right">
                      {/* <IconTriangleDown className="w-5 inline align-middle" />{" "}
                      <span className="align-middle">2.75%</span> */}
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <div className="flex items-center py-1 sm:mb-2  justify-center  px-3 bg-gray-500 py-1 rounded-xl mb-4">
                  <span className="bg-gray-800 py-1 rounded-xl flex px-3">
                    <h2 className="title-2 mr-2 ">Kadena</h2>
                    <IconKDA className="w-4"></IconKDA>
                  </span>
                </div>
                <Card className="p-6 mb-4 sm:mb-8">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-primary">
                      Mined This Payout Cycle
                    </span>
                    {/* <img src="/images/graph-1.svg" alt="" /> */}
                  </div>
                  <div className="flex items-center justify-center leading-none">
                    <div className="w-6/12">
                      <h3 className=" flex font-700 text-24 mb-2 px-2 justify-center items-center bg-gray-800 rounded-full py-2 align-middle">
                        {kdaData
                          ? parseFloat(
                              parseFloat(kdaData?.value) -
                                parseFloat(miningDataDB.KDA) -
                                24771
                            )?.toFixed(0)
                          : "0.00"}{" "}
                        KDA
                      </h3>
                    </div>

                    {/* <div className="w-4/12 text-primary font-title text-14 font-500 leading-none text-right"> */}
                    {/* <IconTriangleUp className="w-5 inline align-middle" />{" "}
                    <span className="align-middle">2.75%</span> */}
                    {/* </div> */}
                  </div>
                </Card>
                <Card className="p-6 mb-4 sm:mb-8 ">
                  <div className="flex items-center justify-between ">
                    <span className="text-primary">Mined Today</span>
                    {/* <img src="/images/graph-1.svg" alt="" /> */}
                  </div>
                  <div className="flex items-end leading-none ">
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {kdaData
                          ? parseFloat(kdaData?.value_last_day)?.toFixed(2)
                          : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14">KDA Mined</h3>
                    </div>
                    <div className="">
                      <h3 className="font-700 text-24 mb-2">
                        {kdaData
                          ? (
                              parseFloat(kdaData.hashrate) / 1000000000000
                            )?.toFixed(2)
                          : "0.00"}{" "}
                        TH/s
                      </h3>
                      <h3 className="font-500 text-14">Hashrate</h3>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="w-4/12 text-red">Total Mined</span>
                    <span className="w-4/12 text-red">Total Miners Live</span>
                    <span className="w-4/12 text-red"></span>
                    {/* <img src="/images/graph-2.svg" alt="" /> */}
                  </div>
                  <div className="flex items-end leading-none ">
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {kdaData
                          ? parseFloat(kdaData?.value)?.toFixed(2)
                          : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14">KDA Mined</h3>
                    </div>
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {" "}
                        {kdaData ? kdaData.worker_length_online : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14 "></h3>
                      <h3 className="font-500 text-14"></h3>
                    </div>
                    {/* </div> */}

                    <div className="w-4/12 text-red font-title text-14 font-500 leading-none text-right">
                      {/* <IconTriangleDown className="w-5 inline align-middle" />{" "}
                      <span className="align-middle">2.75%</span> */}
                    </div>
                  </div>
                </Card>

                {/* <Card className="p-6 mb-4 sm:mb-8">
                <div className="flex items-center justify-between leading-none">
                  <div className="w-8/12">
                    <span className="text-gray-200 mb-4 block">
                      LTC Hashrate (24H)
                    </span>
                    <h3 className="font-700 text-24">
                      {ltcData ? ltcData.user.hash_rate : "0000"} MH/s
                    </h3>
                  </div>
                  <div className="w-4/12">
                    <span className="text-gray-200 mb-4 block">LTC Mined</span>
                    <h3 className="font-700 text-24">
                      {ltcData
                        ? parseFloat(ltcData.user.past_24h_rewards).toFixed(2)
                        : "0.00"}
                    </h3>
                  </div>
                </div>
              </Card>
              <Card className="p-6 mb-4 sm:mb-8">
                <div className="flex items-center justify-between leading-none">
                  <div className="w-8/12">
                    <span className="text-gray-200 mb-4 block">
                      KDA Hashrate (24H)
                    </span>
                    <h3 className="font-700 text-24">
                      {kdaData ? kdaData.hashes_last_day : "0.00"} MH/s
                    </h3>
                  </div>
                  <div className="w-4/12">
                    <span className="text-gray-200 mb-4 block">KDA Mined</span>
                    <h3 className="font-700 text-24">
                      {kdaData ? kdaData.value_last_day : "0"}
                    </h3>
                  </div>
                </div>
              </Card> */}
              </div>

              <div>
                <div className="flex items-center py-1 sm:mb-2  justify-center px-3 bg-gray-500 py-1 rounded-xl mb-4">
                  <span className="bg-gray-800 py-1 rounded-xl flex px-3 ">
                    <h2 className="title-2 mr-2 ">Nervos</h2>
                    <IconCKB className="w-5"></IconCKB>
                  </span>
                </div>
                <Card className="p-6 mb-4 sm:mb-8">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-primary">
                      Mined This Payout Cycle
                    </span>
                    {/* <img src="/images/graph-1.svg" alt="" /> */}
                  </div>
                  <div className="flex items-center justify-center leading-none">
                    <div className="w-6/12">
                      <h3 className=" flex font-700 text-24 mb-2 justify-center items-center bg-gray-800 rounded-full py-2 align-middle">
                        {ckbData
                          ? parseFloat(
                              parseFloat(ckbData.value) -
                                parseFloat(miningDataDB.CKB) -
                                4128781
                            )?.toFixed(0)
                          : "0.00"}{" "}
                        CKB
                      </h3>
                    </div>

                    {/* <div className="w-4/12 text-primary font-title text-14 font-500 leading-none text-right"> */}
                    {/* <IconTriangleUp className="w-5 inline align-middle" />{" "}
                    <span className="align-middle">2.75%</span> */}
                    {/* </div> */}
                  </div>
                </Card>

                <Card className="p-6 mb-4 sm:mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary">Mined Today</span>
                    {/* <img src="/images/graph-1.svg" alt="" /> */}
                  </div>
                  <div className="flex items-end leading-none">
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {ckbData
                          ? parseFloat(ckbData?.value_last_day)?.toFixed(2)
                          : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14">CKB Mined</h3>
                    </div>
                    <div className="">
                      <h3 className="font-700 text-24 mb-2">
                        {ckbData
                          ? (
                              parseFloat(ckbData.hashrate) / 1000000000000
                            )?.toFixed(2)
                          : "0.00"}{" "}
                        TH/s
                      </h3>
                      <h3 className="font-500 text-14">Hashrate</h3>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-4/12 text-red">Total Mined</span>
                    <span className="w-4/12 text-red">Total Miners Live</span>
                    <span className="w-4/12 text-red"></span>
                    {/* <img src="/images/graph-2.svg" alt="" /> */}
                  </div>
                  <div className="flex items-end leading-none">
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {ckbData ? ckbData.value?.toFixed(2) : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14">CKB Mined</h3>
                    </div>
                    <div className="w-4/12">
                      <h3 className="font-700 text-24 mb-2">
                        {ckbData ? ckbData.worker_length_online : "0.00"}
                      </h3>
                      <h3 className="font-500 text-14"></h3>
                    </div>
                    <div className="w-4/12 text-red font-title text-14 font-500 leading-none text-right">
                      {/* <IconTriangleDown className="w-5 inline align-middle" />{" "}
                    <span className="align-middle">2.75%</span> */}
                    </div>
                  </div>
                </Card>

                {/* <Card className="p-6 mb-4 sm:mb-8">
                <div className="flex items-center justify-between leading-none">
                  <div className="w-8/12">
                    <span className="text-gray-200 mb-4 block">
                      LTC Hashrate (24H)
                    </span>
                    <h3 className="font-700 text-24">
                      {ltcData ? ltcData.user.hash_rate : "0000"} MH/s
                    </h3>
                  </div>
                  <div className="w-4/12">
                    <span className="text-gray-200 mb-4 block">LTC Mined</span>
                    <h3 className="font-700 text-24">
                      {ltcData
                        ? parseFloat(ltcData.user.past_24h_rewards).toFixed(2)
                        : "0.00"}
                    </h3>
                  </div>
                </div>
              </Card>
              <Card className="p-6 mb-4 sm:mb-8">
                <div className="flex items-center justify-between leading-none">
                  <div className="w-8/12">
                    <span className="text-gray-200 mb-4 block">
                      KDA Hashrate (24H)
                    </span>
                    <h3 className="font-700 text-24">
                      {kdaData ? kdaData.hashes_last_day : "0.00"} MH/s
                    </h3>
                  </div>
                  <div className="w-4/12">
                    <span className="text-gray-200 mb-4 block">KDA Mined</span>
                    <h3 className="font-700 text-24">
                      {kdaData ? kdaData.value_last_day : "0"}
                    </h3>
                  </div>
                </div>
              </Card> */}
              </div>
            </div>
            {/* <div>
            <h2 className="title-2 mb-6">Withdraw history</h2>
            <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
              <span className="col-span-2">ID</span>
              <span className="col-span-3">When</span>
              <span className="col-span-5">Withdrawal address</span>
              <span className="col-span-2">Withdrawal amount</span>
            </Card>
            {[0].map((item, index) => (
              // <Card
              //   className="max-md:space-y-4 p-3 md:px-8 md:py-6 md:grid md:grid-cols-12 rounded-2xl mb-6 last:mb-0 text-14 font-title font-500"
              //   key={index}
              // >
              //   <span className="col-span-2 flex justify-between">
              //     <span className="text-gray-200 text-12 md:hidden">ID</span>
              //     <span>1426</span>
              //   </span>
              //   <span className="col-span-3 flex justify-between">
              //     <span className="text-gray-200 text-12 md:hidden">When</span>
              //     <span>22 Jul 2022</span>
              //   </span>
              //   <span className="col-span-5 flex justify-between">
              //     <span className="text-gray-200 text-12 md:hidden">
              //       Withdrawal address
              //     </span>
              //     <span>0esXser8............55qw00</span>
              //   </span>
              //   <span className="col-span-2 text-primary text-right flex justify-between">
              //     <span className="text-gray-200 text-12 md:hidden">
              //       Withdrawal amount
              //     </span>
              //     <span className="ml-auto">0.15 ETH</span>
              //   </span>
              // </Card>
              <Card
                className="max-md:space-y-4 p-3 md:px-8 md:py-6 md:grid md:grid-cols-12 rounded-2xl mb-6 last:mb-0 text-14 font-title font-500"
                key={index}
              >
                <span className="col-span-2 flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">ID</span>
                  <span> {""}</span>
                </span>
                <span className="col-span-3 flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">When</span>
                  <span> {""}</span>
                </span>
                <span className="col-span-5 flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">{""}</span>
                  <span>No Data</span>
                </span>
                <span className="col-span-2 text-primary text-right flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">{""}</span>
                  <span className="ml-auto"> {""}</span>
                </span>
              </Card>
            ))}
          </div> */}
          </div>
          {/* <div> 
          <div className="flex-wrap flex justify-between items-center mb-4 sm:mb-6 gap-x-2">
            <h2 className="title-2">Trending NFTs</h2>
            <select className="input input-sm w-auto sm:ml-auto">
              <option value="last-week">Last week</option>
              <option value="last-month">Last month</option>
              <option value="last-year">Last year</option>
            </select>
            <button className="input input-sm w-auto text-gray-200">
              View all
            </button>
          </div>
          <div className="max-sm:px-4 max-sm:gap-x-4 max-sm:-mx-4 max-sm:flex max-sm:flex-nowrap overflow-auto">
            {[1, 2, 3, 4].map((item, index) => (
              <Card
                className="flex-shrink-0 transition bg-transparent border rounded-2xl border-gray-400 p-4 md:p-6 sm:mb-6 flex items-center gap-x-5 relative hover:bg-gray-400 hover:shadow-glow-2 hover:shadow-gray-400"
                key={index}
              >
                <img
                  className="w-[75px] h-[75px] flex-shrink-0 rounded-2xl"
                  src={`/images/user-${item}.png`}
                  alt=""
                />
                <div className="flex-grow">
                  <h3 className="font-700 text-18 md:text-24">
                    The delirious miner
                  </h3>
                  <p className="text-14 text-gray-200">
                    He&apos;s hustlin&apos; Before ETH 2.0
                  </p>
                </div>
                <button className="grid place-content-center absolute top-4 text-center right-4 text-gray-200 w-6 h-6 rounded-full bg-gray-600">
                  <IconMoreHoriz className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>
        </div> */}
        </div>
      </MainLayout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  let kdaStats = await getKDAStats();
  // let userAgent = null;
  // let urlAffiliate = null;

  // const { req, params } = context;
  // const { affiliate } = params;

  // if (req.headers["x-forwarded-for"]) {
  //   ip = req.headers["x-forwarded-for"].split(",")[0];
  // } else if (req.headers["x-real-ip"]) {
  //   ip = req.connection.remoteAddress;
  // } else {
  //   ip = req.connection.remoteAddress;
  // }

  // if (req.headers["user-agent"]) {
  //   userAgent = req.headers["user-agent"];
  // }

  // urlAffiliate = affiliate;

  const getStats = async () => {
    try {
      const stats = await fetch("/api/miningStats/monthlyData");
      let data = await stats.json();
      console.log(data);
      return data;
    } catch (error) {}
  };

  return {
    props: {
      kdaStats: kdaStats,

      // userAgent: userAgent,
      // urlAffiliate: urlAffiliate,
    },
  };

  // return {
  //   redirect:{
  //     destination:'/sacrifice/'+affiliate.affiliate,
  //     permanent:false,
  //   },
  // }
};

export default HomePage;
