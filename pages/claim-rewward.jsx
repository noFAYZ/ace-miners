import { Button, Select, SelectBox } from "@/components/Form";
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
import { IconCheck, IconError, IconSpinner } from "@/components/Ui/Snippets";
import {
  aceMinerContracts,
  alchemySettings,
  chainURL,
  contrAceMinersPhase1,
  contrAceMinersPhase2,
} from "@/constant/consonants";
import {
  AddClaim,
  VerifyKDAWallet,
  VerifyLTCWallet,
} from "@/containers/AddClaim";
import { encrypt } from "@/helper/crypto";
import { db } from "@/helper/firebase-config";
import { useDragScrollHook } from "@/hooks/useDragScrollHook";
import {
  useAddress,
  useContract,
  useNetwork,
  useNFTCollection,
  useNFTs,
  useSDK,
  useSigner,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Alchemy, Network } from "alchemy-sdk";
import { BigNumber } from "ethers";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { useEffect, useRef, useState } from "react";
import CONTRACTA from "../constant/ABI_ACEMINERS1.json";

const HomePage = ({ ip }) => {
  let address = useAddress();
  const [kdaStatus, setkdaStatus] = useState(""); //error,verified,verifing,verify
  const [ltcStatus, setltcStatus] = useState(""); //error,verified,verifing,verify
  const [userAmNft, setuserAmNft] = useState([]);
  // const [isLTCVerified, setisLTCVerified] =  useState(false);
  const alchemy = new Alchemy(alchemySettings);

  // const sdk = new useSDK();
  // const network = useNetwork();
  // let signerThirdweb = useSigner();
  // const [verifyLTC, setverifyLTC] = useState(""); //error,verified,verifing,verify
  // const [apiCurser, apiCurserSet] = useState("");
  // const [nftList, nftListSet] = useState([]);
  // const [userNFTs, setuserNFTs] = useState([]);

  // const { contract1 } = useContract(contrAceMinersPhase1);
  // const nftCollection = useNF(contrAceMinersPhase1);
  // const { data: nfts, isLoading } = useNFTs(contract1);

  // const getNftAlchemy = async () => {
  //   // const baseURL = "<-- ALCHEMY APP HTTP URL -->";
  //   const addres = "elanhalpern.eth";
  //   const url = `${chainURL}/getNFTs/?owner=${addres}`;
  //   console.log(url);

  //   var requestOptions = {
  //     method: "get",
  //     redirect: "follow",
  //   };

  //   try {
  //     let response = await fetch(url, requestOptions);
  //     console.log(response);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   // .then((response) => console.log)
  //   // .catch((error) => console.log("error", error));
  // };

  // const getRemainingNFT = async () => {
  //   console.log(1);
  //   let url =
  //     "https://api.opensea.io/api/v1/assets?order_direction=desc&asset_contract_address=0xe635bd48f69276d6f52cc2e577e5ddeccf16b79c&limit=40&include_orders=false";
  //   const respo = await fetch("/api/submit", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "X-API-KEY": "0e89052da30b4f099850d9ed3aff57d0",
  //       "Content-Type": "application/json",
  //     },
  //     // body: JSON.stringify(sheetRec),
  //   });
  //   console.log(2);
  //   console.log(respo.body);
  //   console.log(3);
  // };
  // const { contract } = useNFTCollection(contrAceMinersPhase2, "nft-collection");

  // const getNFTs = async (addr) => {
  //   // if (!address) {
  //   //   console.log("Wallet not connected");
  //   //   return;
  //   // }
  //   let idsnft = [];

  //   // let vaddr = "0xB961915457503006468FBe46809A66890566bFFb";
  //   try {
  //     // console.log(index);
  //     let url =
  //       "https://api.opensea.io/api/v1/assets?owner=" +
  //       addr +
  //       "&order_direction=desc&asset_contract_address=0x0770a317af574fba15f205a60bca9075206ad0a8&limit=20&include_orders=false";
  //     const respo = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "X-API-KEY": "0e89052da30b4f099850d9ed3aff57d0",
  //       },
  //       // body: JSON.stringify(sheetRec),
  //     });
  //     // .then((rs) => rs.json())
  //     // .then((data) => {
  //     //   console.log(data);
  //     //   // setLoading(false)
  //     // });
  //     let userNFT = [];

  //     const respoJson = await respo.json();
  //     // const respoData = await respoJson
  //     for (let i = 0; i < respoJson.assets.length; i++) {
  //       let nft = respoJson.assets[i];
  //       userNFT.push(nft);
  //       idsnft.push(nft.token_id);
  //     }

  //     setuserNFTs(userNFT);
  //     console.log(respoJson.assets);
  //     // console.log(await respo);
  //     // console.log(3);
  //     // setverifyLTC("verified");
  //     return idsnft;
  //   } catch (e) {
  //     console.log(e);
  //     // setverifyLTC("error");
  //     return idsnft;
  //   }
  // };

  // const verifyAddress = async (type) => {
  //   if (!address) {
  //     console.log("Wallet not connected");
  //     return;
  //   }

  //   try {
  //     setverifyLTC("verifing");

  //     const sdkThirdweb = ThirdwebSDK.fromSigner(signerThirdweb, "polygon");
  //     const contractThirdweb = await sdkThirdweb.getContractFromAbi(
  //       contrAceMinersPhase1,
  //       CONTRACTA
  //     );

  //     let getNFTBalance = await contractThirdweb.call(
  //       "balanceOf",
  //       address
  //       // "0xB961915457503006468FBe46809A66890566bFFb"
  //     ); // Sample address:0xB961915457503006468FBe46809A66890566bFFb
  //     // console.log(getNFTBalance);
  //     const hasNFT = BigNumber.from(getNFTBalance).toNumber();
  //     // if (!hasNFT) {
  //     //   console.log("Dont have nft");
  //     //   return;
  //     // }
  //     // console.log("idsNFT0");
  //     const idsNFT = await getNFTs(address);
  //     // console.log("idsNFT", idsNFT);
  //     let sheetRec = {
  //       dateTime: new Date().toUTCString(),
  //       ip: ip,
  //       address: address,
  //       hasNFT: hasNFT,
  //       idsNFT: idsNFT.length > 0 ? idsNFT.toString() : "",
  //     };

  //     const respo = await fetch("/api/submit", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(sheetRec),
  //     });
  //     const content = await respo.json();
  //     setverifyLTC("verified");
  //   } catch (e) {
  //     console.log(e);
  //     setverifyLTC("error");
  //   }
  // };

  const addInFirestore = async (rec) => {
    try {
      let verification = {
        dateTime: Timestamp.fromDate(new Date()),
        ip: rec.ip,
        address: rec.address.toLowerCase(),
        type: rec.type,
        hasNFT: rec.hasNFT,
        idsNFT: rec.idsNFT.split(","),
      };
      const vuCol = collection(db, "verified-users");
      let addUserRec = await addDoc(vuCol, verification);

      return true;
    } catch (e) {
      return false;
    }
  };

  const getVerifications = async () => {
    let usersSnaps = [];
    const queryData = query(
      collection(db, "verified-users"),
      where("address", "==", address.toLowerCase())
    );
    const allDocs = await getDocs(queryData);

    usersSnaps = allDocs.docs.map((item) => item.data());

    for (let i = 0; i < usersSnaps.length; i++) {
      if (usersSnaps[i].type == "KDA") {
        setkdaStatus("verified");
      }
      if (usersSnaps[i].type == "LTC") {
        setltcStatus("verified");
      }
    }
  };

  const getNFTsFromAlchemy = async (adr) => {
    let amNFT = [];
    try {
      const userAllNFT = await alchemy.nft.getNftsForOwner(adr);
      userAllNFT.ownedNfts.forEach((e) => {
        // amNFT.push(e);
        if (
          e.contract.address.toLowerCase() == contrAceMinersPhase1.toLowerCase()
        ) {
          amNFT.push(e);
        }

        if (
          e.contract.address.toLowerCase() == contrAceMinersPhase2.toLowerCase()
        ) {
          amNFT.push(e);
        }

        // console.log(e.contract.address);
      });
    } catch (e) {
      console.log(e);
    }
    setuserAmNft(amNFT);

    return amNFT;
  };

  const verifyKDA = async () => {
    if (!address) {
      console.log("Wallet not connected");
      return;
    }

    try {
      setkdaStatus("verifing");

      let unfts = await getNFTsFromAlchemy(address); //0x117c87915A5208d1315DFD85f0F90Df7eEAdde60

      let unftsTitles = unfts.map((value, index) => value.title);

      // console.log("dddd:", unftsTitles);

      // return;
      let sheetRec = {
        dateTime: new Date().toUTCString(),
        ip: ip,
        address: address,
        type: "KDA",
        hasNFT: unfts.length,
        idsNFT: unftsTitles.toString(),
      };
      await addInFirestore(sheetRec);
      const respo = await fetch("/api/verify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encrypt(sheetRec)),
      });
      const content = await respo.json();
      console.log(content);
      setkdaStatus("verified");
    } catch (e) {
      console.log(e);
      setkdaStatus("error");
    }
  };

  const verifyLTC = async () => {
    if (!address) {
      console.log("Wallet not connected");
      return;
    }

    try {
      setltcStatus("verifing");

      let unfts = await getNFTsFromAlchemy(address); //0x117c87915A5208d1315DFD85f0F90Df7eEAdde60

      let unftsTitles = unfts.map((value, index) => value.title);

      // console.log("dddd:", unftsTitles);

      // return;
      let sheetRec = {
        dateTime: new Date().toUTCString(),
        ip: ip,
        address: address,
        type: "LTC",
        hasNFT: unfts.length,
        idsNFT: unftsTitles.toString(),
      };
      await addInFirestore(sheetRec);

      const respo = await fetch("/api/verify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encrypt(sheetRec)),
      });
      const content = await respo.json();
      console.log(content);
      setltcStatus("verified");
    } catch (e) {
      console.log(e);
      setltcStatus("error");
    }
  };

  useEffect(() => {
    if (address) {
      getNFTsFromAlchemy(address);
      getVerifications();
      console.log(userAmNft);
    }

    // console.log("contract:", contract);
  }, [address]);

  return (
    <MainLayout>
      <h1 className="max-sm:text-center title-2 mb-5 md:mb-10">Your NFTs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {/* {[1].map((item, index) => (
          <Card
            className="border border-gray-400 p-2 flex-shrink-0 bg-gray-500 text-center"
            key={index}
          >
            <img
              className="w-full aspect-[4/5] rounded-3xl object-cover object-center mb-2"
              src={`/images/dummy-image-${item}.png`}
              alt=""
            />
            <div className="mt-4 mb-3">
              <h2 className="title-3">The BTC Miner</h2>
              <p className="text-14 text-gray-200">
                Everydaye he&apos;s hustlin&apos;
              </p>
            </div>
          </Card>
        ))} */}
        {!userAmNft.length ? (
          <>
            <Card
              className="border col-span-5 border-gray-400 p-2 flex-shrink-0 bg-gray-500 text-center"
              key={"index"}
            >
              {/* <img
                className="w-full aspect-[4/5] rounded-3xl object-cover object-center mb-2"
                // src={`/images/dummy-image-${item}.png`}
                src={item.image_url}
                alt=""
              /> */}
              <div className="mt-4 mb-3">
                {/* <h2 className="title-3">No Data</h2> */}
                <p className="text-14 text-gray-200">No Data!</p>
              </div>
            </Card>
          </>
        ) : (
          <></>
        )}
        {userAmNft.map((item, index) => (
          <Card
            className="border border-gray-400 p-2 flex-shrink-0 bg-gray-500 text-center"
            key={index}
          >
            <img
              className="w-full aspect-[4/5] rounded-3xl object-cover object-center mb-2"
              // src={`https:///images/dummy-image-${item}.png`}
              src={item.rawMetadata.image.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              )}
              // src={item.image}
              alt={item.rawMetadata.image}
            />
            <div className="mt-4 mb-3">
              <h2 className="title-3">{item.title}</h2>
              <p className="text-14 text-gray-200">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
        <div>
          <div className="flex-wrap flex justify-between items-center mb-4 sm:mb-6 gap-x-2">
            <h2 className="title-2">Verifications</h2>
          </div>

          {/* <div
            id="alert-4"
            className="flex p-4 mb-4 bg-yellow-100 rounded-lg dark:bg-yellow-200"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="flex-shrink-0 w-5 h-5 text-yellow-700 dark:text-yellow-800"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div className="ml-3 text-sm font-medium text-yellow-700 dark:text-yellow-800">
              We are currently verifying with your ETH address as rewards are
              currently paid out in ETH Polygon, future updates to come.
             
            </div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-yellow-100 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex h-8 w-8 dark:bg-yellow-200 dark:text-yellow-600 dark:hover:bg-yellow-300"
              data-dismiss-target="#alert-4"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-6 flex-wrap">
            <Card
              className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
              key={"index"}
            >
              <div className="flex-grow">
                <p className="text-14 text-gray-200 max-sm:mb-3">Verify</p>
                <h3 className="font-700 text-18 md:text-24">LTC Wallet</h3>
              </div>
              <VerifyLTCWallet />
              {/* <Button
                onClick={async () => {
                  if (ltcStatus == "verified") {
                    return;
                  }
                  await verifyLTC();
                }}
                kind="outline-primary"
                className="max-sm:w-full inline-flex "
              >
                Verify now
                {ltcStatus == "verifing" ? <IconSpinner /> : <></>}
                {ltcStatus == "error" ? <IconError /> : <></>}
                {ltcStatus == "verified" ? <IconCheck /> : <></>}
              </Button> */}
            </Card>
            <Card
              className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
              key={"index1"}
            >
              <div className="flex-grow">
                <p className="text-14 text-gray-200 max-sm:mb-3">Verify</p>
                <h3 className="font-700 text-18 md:text-24">KDA Wallet</h3>
              </div>
              <VerifyKDAWallet />
              {/* <Button
                onClick={async () => {
                  // nfts
                  // return;
                  try {
                    // return;
                    await verifyKDA();   } catch (e) {
                    console.log(e);
                  } 
                }}
                kind="outline-primary"
                className="max-sm:w-full inline-flex"
              >
                Verify Now
                {kdaStatus == "verifing" ? <IconSpinner /> : <></>}
                {kdaStatus == "error" ? <IconError /> : <></>}
                {kdaStatus == "verified" ? <IconCheck /> : <></>}
              </Button>  */}
            </Card>
            {/* {[1, 2].map((item, index) => (
              <Card
                className="max-sm:flex-col max-sm:justify-center max-sm:text-center max-sm:gap-y-3 flex-shrink-0 transition bg-gray-400 rounded-2xl p-4 md:p-6 flex items-center gap-x-5 relative"
                key={index}
              >
                <div className="flex-grow">
                  <p className="text-14 text-gray-200 max-sm:mb-3">Verify</p>
                  <h3 className="font-700 text-18 md:text-24">LTC Wallet</h3>
                </div>
                <Button
                  onClick={() => {
                    verifyFromOS(index);
                  }}
                  kind="outline-primary"
                  className="max-sm:w-full"
                >
                  Verify now
                </Button>
              </Card>
            ))} */}
          </div>
        </div>
        <div className="2xl:col-span-2">
          <div>
            <h2 className="title-2 mb-6">Claim reward history</h2>
            <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
              <span className="col-span-2">ID</span>
              <span className="col-span-3">When</span>
              <span className="col-span-5">Rewards</span>
              <span className="col-span-2">Reward amount</span>
            </Card>
            <Card
              className="max-md:space-y-4 p-3 md:px-8 md:py-6 md:grid md:grid-cols-12 rounded-2xl mb-6 last:mb-0 text-14 font-title font-500"
              key={"index"}
            >
              <span className="col-span-2 flex justify-between">
                <span className="text-gray-200 text-12 md:hidden">ID</span>
                <span> </span>
              </span>
              <span className="col-span-3 flex justify-between">
                <span className="text-gray-200 text-12 md:hidden">When</span>
                <span> </span>
              </span>
              <span className="col-span-5 flex justify-between">
                <span className="text-gray-200 text-12 md:hidden">Rewards</span>
                <span className="text-gray-300">No Record</span>
              </span>
              <span className="col-span-2 text-primary text-right flex justify-between">
                <span className="text-gray-200 text-12 md:hidden">
                  Reward amount
                </span>
                <span className="ml-auto"> </span>
              </span>
            </Card>
            {/* {[0, 1, 2].map((item, index) => (
              <Card
                className="max-md:space-y-4 p-3 md:px-8 md:py-6 md:grid md:grid-cols-12 rounded-2xl mb-6 last:mb-0 text-14 font-title font-500"
                key={index}
              >
                <span className="col-span-2 flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">ID</span>
                  <span>1426</span>
                </span>
                <span className="col-span-3 flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">When</span>
                  <span>22 Jul 2022</span>
                </span>
                <span className="col-span-5 flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">
                    Rewards
                  </span>
                  <span>Claim reward history</span>
                </span>
                <span className="col-span-2 text-primary text-right flex justify-between">
                  <span className="text-gray-200 text-12 md:hidden">
                    Reward amount
                  </span>
                  <span className="ml-auto">0.15 ETH</span>
                </span>
              </Card>
            ))} */}
          </div>
        </div>
      </div>
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
