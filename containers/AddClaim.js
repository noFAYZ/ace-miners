import { Button } from "@/components/Form";
import { Card } from "@/components/Ui";
import { useAddress } from "@thirdweb-dev/react";
import Head from "next/head";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
/* This example requires Tailwind CSS v2.0+ */
import { IconCheck, IconError, IconSpinner } from "@/components/Ui/Snippets";
import {
  alchemySettings,
  contrAceMinersPhase1,
  contrAceMinersPhase2
} from "@/constant/consonants";

import useOutSideClick from "@/hooks/useOutSideClick";
import { addressToScript, parseAddress } from '@ckb-lumos/helpers';
import { CellCollector, Indexer, RPC, Script } from '@ckb-lumos/lumos';

import { Pact, signWithChainweaver } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';
import CKB from '@nervosnetwork/ckb-sdk-core';
//import { addressToScript } from '@nervosnetwork/ckb-sdk-utils';
import { BI, helpers } from '@ckb-lumos/lumos';
import { Alchemy } from "alchemy-sdk";
// import { useAuth } from "../utils/authContext";
const WAValidator = require("multicoin-address-validator");

import {

  IconCKB,

  IconKDA,
  IconLTC
} from "@/components/Icon";


export function VerifyLTCWallet(props) {
  const [fieldValue, setfieldValue] = useState();
  const [showModal, setShowModal] = useState(false);
  const address = useAddress();
  const [status, setStatus] = useState(""); //send,sending,sent,error
  const [isAutoModel, setisAutoModel] = useState(false);
  const [verStatus, setverStatus] = useState(""); //error,verified,verifing,verify
  const [ltcBalance, setltcBalance] = useState();

  const [ltcWallet, setltcWallet] = useState();

  //   const [kdaStatus, setkdaStatus] = useState(""); //error,verified,verifing,verify
  const alchemy = new Alchemy(alchemySettings);



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

  async function addLTCaddresstoDB(_data) {

    try {
      const response = await fetch('/api/user-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      })
      const data = await response.json()


    } catch (error) {
      console.error(error)

    }

  }


  const verifyLTC = async () => {
    if (!fieldValue) {
      console.log("Empty Input");
      return;
    }

    try {
      setverStatus("verifing");
      setStatus(".");

      // return;
      if (!props.unfts.length) {
        setverStatus("error");
        console.log("Has no nft");
        return;
      }
      const valid = WAValidator.validate(fieldValue, 'LTC');
      if (valid) {
        const balance = await getLTCBalance(fieldValue);
        setltcBalance(balance)
        console.log('This is a valid address');
        setverStatus("verified");
        setStatus("Found " + props.unfts.length + " NFTs");

        const userData = {
          ethAddress: address,
          kdaWallet: null,
          ltcWallet: fieldValue
        }
        await addLTCaddresstoDB(userData)
        setltcWallet(fieldValue)


        console.log(balance)
        setShowModal(false);
        setisAutoModel(false);

        getWallets(fieldValue)

      }

      else {
        console.log('Address INVALID');
        setverStatus("error");
      }


    } catch (e) {
      console.log(e);
      setStatus(e);
      setverStatus("error");
    }
  };



  const handleChange = async (e) => {
    e.preventDefault();
    setfieldValue(e.target.value);
  };

  const modalBackdropRef = useRef();
  useOutSideClick(modalBackdropRef, () => {
    setShowModal(false);
    setisAutoModel(false);
  });

  const getWallets = async (_address) => {

    try {
      const balance = await getLTCBalance(_address);
      console.log("LTC Balance ", balance)
      setltcBalance(balance)
      setltcWallet(_address)
    } catch (error) {

    }




  };

  useEffect(() => {
    props.ltcWallet ? getWallets(props?.ltcWallet) : null
  }, [props?.ltcWallet]);






  return (
    <>

      {ltcWallet || props.ltcWallet ? (
        <>
          <div className="flex-grow">
            <p className="text-18 text-white-200 max-sm:mb-3">
              <a
                className="hover:text-primary"
                href={
                  "https://blockchair.com/litecoin/address/" + ltcWallet
                }
                target="_blank"
              >
                {ltcWallet ? <>{ltcWallet?.slice(0, 20)}...</> : <> {props.ltcWallet?.slice(0, 20)}...</>}


              </a>
            </p>
            <h3 className="font-700 text-18 md:text-24"></h3>
          </div>
        </>
      ) : (
        <>
          <div className="flex-grow">
            <p className="text-14 text-gray-200 max-sm:mb-3">Verify</p>
            <h3 className="font-700 text-18 md:text-24">LTC Wallet</h3>
          </div>
        </>
      )}

      <span className="flex gap-1  whitespace-nowrap  text-center lg:text-14 sm:text-10 bg-gray-200 rounded-full pr-1">
        <span className="bg-primary rounded-full px-2">{ltcBalance}</span> <IconLTC width={20} />
      </span>
      <Button

        onClick={() => {
          setShowModal(true);
        }}
      >


        {props.ltcWallet ? <>  <span className="flex-1  whitespace-nowrap  text-left">
          Change
        </span></> : <>  <span className="flex-1 whitespace-nowrap  text-left">
          Verify Now
        </span></>}



      </Button>

      {showModal ? (
        <>
          <div className="flex items-center justify-center bg-gray-800 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-opacity-50 backdrop-blur">
            <div
              className="relative my-6 mx-auto max-w-lg w-full cursor-auto drop-shadow-lg"
              ref={modalBackdropRef}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between p-5 border-b border-solid border-gold-200/30 rounded-t">
                  <h3 className="text-sm font-monument uppercase text-gold-200">
                    Verify LTC Wallet
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {

                      setShowModal(false);
                      setisAutoModel(false);
                    }}
                  >
                    {/* <IconClose className="text-gold-200 h-5 w-5"></IconClose> */}
                  </button>
                </div>


                {/*body*/}

                <div className="p-4 mt-4">
                  <span className="px-2 pb-3 flex flex-wrap text-yellow-600">Note: Verify wallet address for balance and ensure it's correct to receive rewards. You'll see the balance after you verify.</span>
                  <label className="relative">
                    <div className=" inline-flex flex w-full ">
                      <input
                        className="inline rounded-xl p-4 pr-10 bg-gray-600 font-monument block focus:outline-none ring-0 w-full text-white placeholder:text-gray-300"
                        placeholder="LWQ8RENaywyW19754K9F..."
                        // onChange={handleChange}
                        onInput={handleChange}
                        value={fieldValue}
                      />
                      <div className="absolute right-0 mr-4 mt-3 h-8 w-8">
                        {verStatus == "verifing" ? <IconSpinner /> : <></>}
                        {verStatus == "error" ? <IconError /> : <></>}
                        {verStatus == "verified" ? <IconCheck /> : <></>}
                      </div>
                    </div>
                    {/* </input> */}

                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      {/* {valid ? (
                              <IconCheck className="text-green-500 h-5 w-5"></IconCheck>
                            ) : (
                              <IconError className="text-red-500 h-5 w-5"></IconError>
                            )} */}
                    </div>
                  </label>
                </div>
                {/* <div className="p-4 grid grid-rows-1 grid-flow-col gap-4 ">
                  <label className="row-span-2">Status:</label>
                  <label className="col-span-2 text-white">{"type"}</label>
                  <label className="row-span-2 ">
                    {verStatus == "verifing" ? <IconSpinner /> : <></>}
                    {verStatus == "error" ? <IconError /> : <></>}
                    {verStatus == "verified" ? <IconCheck /> : <></>}
                  </label>
                </div> */}

                {/*footer*/}
                <div className="flex items-center justify-end ml-8 p-4">
                  <Button onClick={(verifyLTC)} className="px-10">
                    Confirm
                  </Button>
                  {/* <span className="px-4"></span> */}

                  {/* <Button onClick={verifyKDA} className="px-10">
                    Add KDA
                  </Button> */}
                  {/* {status == "send" ? (
                    <>
                      {" "}
                      <Button onClick={handleSave} className="px-10">
                        Send Verification
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setStatus("send");
                          setisAutoModel(false);
                          setShowModal(false);
                        }}
                        className="px-10"
                      >
                        Close
                      </Button>
                    </>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export function VerifyKDAWallet(props) {
  const [fieldValue, setfieldValue] = useState();
  const [valid, setValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const address = useAddress();
  const [status, setStatus] = useState(""); //send,sending,sent,error
  const [isAutoModel, setisAutoModel] = useState(false);
  const [verStatus, setverStatus] = useState(""); //error,verified,verifing,verify
  const [kdaBalance, setkdaBalance] = useState();
  const [kdaWallet, setkdaWallet] = useState(props.kdaWallet);
  //   const [kdaStatus, setkdaStatus] = useState(""); //error,verified,verifing,verify
  const alchemy = new Alchemy(alchemySettings);

  const apiHost = (chainId, network = '', networkId = 'mainnet01', apiVersion = '0.0') => {
    return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
  };

  const testnetChain1ApiHost = apiHost('1');




  async function addKDAaddresstoDB(_data) {
    try {
      const response = await fetch('/api/user-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      })
      const data = await response.json()


    } catch (error) {
      console.error(error)

    }

  }

  function keyFromAccount(account) {
    return account.split(':')[1];
  }

  async function getBalance(account) {
    const res = await Pact.modules.coin['get-balance'](account).local(
      testnetChain1ApiHost,
    );

    console.log("kdaaa: ", res)

    return res;
  }

  const verifyKDA = async () => {
    if (!fieldValue) {
      console.log("Invalid Input");
      return;
    }

    try {
      setverStatus("verifing");
      setStatus(".");


      // return;
      if (!props.unfts.length) {
        setverStatus("error");
        console.log("Has no NFT");
        return;
      }
      const res = await getBalance(fieldValue).catch(console.error);




      if (res.result.status == 'failure') {
        console.log("Does Not exist")

        setverStatus("error");
      }
      if (res.result.status == 'success') {
        console.log(" exist")
        setkdaBalance(res.result.data)

        const userData = {
          ethAddress: address,
          kdaWallet: fieldValue,
          ltcWallet: null
        }
        await addKDAaddresstoDB(userData)



        setverStatus("verified");
        setStatus("Found " + props.unfts.length + " NFTs");
        setkdaWallet(fieldValue)
        getWallets(fieldValue)

        setShowModal(false);
      }






    } catch (e) {
      console.log(e);
      setStatus(e);
      setverStatus("error");
    }
  };


  const handleChange = async (e) => {
    e.preventDefault();
    setfieldValue(e.target.value);
  };

  const modalBackdropRef = useRef();
  useOutSideClick(modalBackdropRef, () => {
    setShowModal(false);
    setisAutoModel(false);
  });

  const getWallets = async (_address) => {
    try {

      try {
        const res = await getBalance(_address).catch(console.error);

        setkdaBalance(res.result.data)

        console.log("KDA Balance", res)
      } catch (error) {

      }
      setkdaWallet(_address);


    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    props.kdaWallet ? getWallets(props.kdaWallet) : null

  }, [props.kdaWallet]);

  return (
    <>

      {kdaWallet || props.kdaWallet ? (
        <>
          <div className="flex-grow">
            <p className="text-18 text-white-200 max-sm:mb-3">
              <a
                className="hover:text-primary"
                href={
                  "https://explorer.chainweb.com/mainnet/account/" + kdaWallet + '?token=coin'
                }
                target="_blank"
              >
                {kdaWallet ? <>{kdaWallet?.slice(0, 20)}...</> : <> {props?.kdaWallet?.slice(0, 20)}...</>}


              </a>
            </p>
            <h3 className="font-700 text-18 md:text-24"></h3>
          </div>
        </>
      ) : (
        <>
          <div className="flex-grow">
            <p className="text-14 text-gray-200 max-sm:mb-3">Verify</p>
            <h3 className="font-700 text-18 md:text-24">KDA Wallet</h3>
          </div>
        </>
      )}


      <span className="flex gap-1  whitespace-nowrap  text-center lg:text-14 sm:text-10 bg-gray-200 rounded-full pr-2 ">
        <span className="bg-primary rounded-full px-2">{kdaBalance?.toFixed(3)}</span>  <IconKDA width={14} />
      </span>

      <Button

        onClick={() => {
          setShowModal(true);
        }}
      >

        {props.kdaWallet ? <>  <span className="flex-1  whitespace-nowrap  text-left">
          Change
        </span></> : <>  <span className="flex-1 whitespace-nowrap  text-left">
          Verify Now
        </span></>}
      </Button>

      {showModal ? (
        <>
          <div className="flex items-center justify-center bg-gray-800 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-opacity-50 backdrop-blur">
            <div
              className="relative my-6 mx-auto max-w-lg w-full cursor-auto drop-shadow-lg"
              ref={modalBackdropRef}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between p-5 border-b border-solid border-gold-200/30 rounded-t">
                  <h3 className="text-sm font-monument uppercase text-gold-200">
                    Verify KDA Wallet
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      setShowModal(false);
                      setisAutoModel(false);
                    }}
                  >
                    {/* <IconClose className="text-gold-200 h-5 w-5"></IconClose> */}
                  </button>
                </div>
                {/*body*/}

                <div className="p-4 mt-4">
                  <span className="px-2 pb-3 flex flex-wrap text-yellow-600">Note: Verify wallet address for balance and ensure it's correct to receive rewards. You'll see the balance after you verify.</span>
                  <label className="relative">
                    <div className="inline-flex w-full">
                      <input
                        className="rounded-xl p-4 pr-10 bg-gray-600 font-monument block focus:outline-none ring-0 w-full text-white placeholder:text-gray-300"
                        placeholder="k:4aab9f08f1bd86c3ce...."
                        // onChange={handleChange}
                        onInput={handleChange}
                        value={fieldValue}
                      />
                      <div className="absolute right-0 mt-3 mr-4">
                        {verStatus == "verifing" ? <IconSpinner /> : <></>}
                        {verStatus == "error" ? <IconError /> : <></>}
                        {verStatus == "verified" ? <IconCheck /> : <></>}
                      </div>
                    </div>

                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      {/* {valid ? (
                                <IconCheck className="text-green-500 h-5 w-5"></IconCheck>
                              ) : (
                                <IconError className="text-red-500 h-5 w-5"></IconError>
                              )} */}
                    </div>
                  </label>
                </div>
                {/* <div className="p-4 grid grid-rows-1 grid-flow-col gap-4 ">
                  <label className="row-span-2">Status:</label>
                  <label className="col-span-2 text-white">{ }</label>
                  <label className="row-span-2 ">
                    {verStatus == "verifing" ? <IconSpinner /> : <></>}
                    {verStatus == "error" ? <IconError /> : <></>}
                    {verStatus == "verified" ? <IconCheck /> : <></>}
                  </label>
                </div> */}

                {/*footer*/}
                <div className="flex items-center justify-end p-4">
                  {/* <Button onClick={verifyLTC} className="px-10">
                    Add LTC
                  </Button>
                  <span className="px-4"></span> */}

                  <Button onClick={verifyKDA} className="px-10">
                    Confirm
                  </Button>
                  {/* {status == "send" ? (
                      <>
                        {" "}
                        <Button onClick={handleSave} className="px-10">
                          Send Verification
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setStatus("send");
                            setisAutoModel(false);
                            setShowModal(false);
                          }}
                          className="px-10"
                        >
                          Close
                        </Button>
                      </>
                    )} */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}


export function VerifyCKBWallet(props) {
  const [fieldValue, setfieldValue] = useState();
  const [valid, setValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const address = useAddress();
  const [status, setStatus] = useState(""); //send,sending,sent,error
  const [isAutoModel, setisAutoModel] = useState(false);
  const [verStatus, setverStatus] = useState(""); //error,verified,verifing,verify
  const [ckbBalance, setckbBalance] = useState();
  const [ckbWallet, setckbWallet] = useState(props.ckbWallet);

  const alchemy = new Alchemy(alchemySettings);




  async function addCKBaddresstoDB(_data) {
    try {
      const response = await fetch('/api/user-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      })
      const data = await response.json()


    } catch (error) {
      console.error(error)

    }

  }


  async function getBalance(address) {
    const rpc = new RPC('https://testnet.ckb.dev/rpc');
    const indexer = new Indexer('	https://mainnet.ckb.dev/indexer');
    const ckb = new CKB('	https://mainnet.ckb.dev/');

    //const scripts = await validateAddress(fieldValue)

    const collector = indexer.collector({
      lock: helpers.parseAddress(address),
    });

    let capacities = BI.from(0);
    for await (const cell of collector.collect()) {
      capacities = capacities.add(cell.cellOutput.capacity);
    }



    return capacities.div(10 ** 8).toString();
  }



  const verifyCKB = async () => {
    if (!fieldValue) {
      console.log("Invalid Input");
      return;
    }

    try {
      setverStatus("verifing");
      setStatus(".");

      // return;
      if (!props.unfts.length) {
        setverStatus("error");
        console.log("Has no NFT");
        return;
      }
      const res = await getBalance(fieldValue).catch(console.error);


      if (!res) {
        console.log("Does Not exist")

        setverStatus("error");
      }
      if (res) {
        console.log(" exist")
        setckbWallet(fieldValue)
        setckbBalance(res)

        const userData = {
          ethAddress: address,
          kdaWallet: null,
          ltcWallet: null,
          ckbWallet: fieldValue
        }
        await addCKBaddresstoDB(userData)



        setverStatus("verified");
        setStatus("Found " + props.unfts.length + " NFTs");
        setShowModal(false)

        getWallets(fieldValue)



      }






    } catch (e) {
      console.log(e);
      setStatus(e);
      setverStatus("error");
    }
  };



  const handleChange = async (e) => {
    e.preventDefault();
    setfieldValue(e.target.value);
  };

  const modalBackdropRef = useRef();
  useOutSideClick(modalBackdropRef, () => {
    setShowModal(false);
    setisAutoModel(false);
  });

  const getWallets = async (_address) => {

    try {
      const res = await getBalance(_address).catch(console.error);

      setckbBalance(res)
      console.log("CKB Balance", res)
    } catch (error) {

    }

    setckbWallet(_address);


  };
  useEffect(() => {
    props.ckbWallet ? getWallets(props.ckbWallet) : null

  }, [props.ckbWallet]);



  return (
    <>

      {ckbWallet || props.ckbWallet ? (
        <>
          <div className="flex-grow">
            <p className="text-18 text-white-200 max-sm:mb-3">
              <a
                className="hover:text-primary"
                href={
                  "https://explorer.nervos.org/address/" + ckbWallet
                }
                target="_blank"
              >
                {ckbWallet ? <>{ckbWallet?.slice(0, 20)}...</> : <> {props?.ckbWallet?.slice(0, 20)}...</>}


              </a>
            </p>
            <h3 className="font-700 text-18 md:text-24"></h3>
          </div>
        </>
      ) : (
        <>
          <div className="flex-grow">
            <p className="text-14 text-gray-200 max-sm:mb-3">Verify</p>
            <h3 className="font-700 text-18 md:text-24">CKB Wallet</h3>
          </div>
        </>
      )}


      <span className="flex gap-1  whitespace-nowrap  text-center lg:text-16 sm:text-10 bg-gray-200 rounded-full pr-2 ">
        <span className="bg-primary rounded-full px-2">{ckbBalance}</span> <IconCKB width={18} />
      </span>

      <Button

        onClick={() => {
          setShowModal(true);
        }}
      >

        {props.ckbWallet ? <>  <span className="flex-1  whitespace-nowrap  text-left">
          Change
        </span></> : <>  <span className="flex-1 whitespace-nowrap  text-left">
          Verify Now
        </span></>}
      </Button>

      {showModal ? (
        <>
          <div className="flex items-center justify-center bg-gray-800 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-opacity-50 backdrop-blur">
            <div
              className="relative my-6 mx-auto max-w-lg w-full cursor-auto drop-shadow-lg"
              ref={modalBackdropRef}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between p-5 border-b border-solid border-gold-200/30 rounded-t">
                  <h3 className="text-sm font-monument uppercase text-gold-200">
                    Verify CKB Wallet
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      setShowModal(false);
                      setisAutoModel(false);
                    }}
                  >
                    {/* <IconClose className="text-gold-200 h-5 w-5"></IconClose> */}
                  </button>
                </div>
                {/*body*/}

                <div className="p-4 mt-4">
                  <span className="px-2 pb-3 flex flex-wrap text-yellow-600">Note: Verify wallet address for balance and ensure it's correct to receive rewards. You'll see the balance after you verify.</span>
                  <label className="relative">
                    <div className="inline-flex w-full">
                      <input
                        className="rounded-xl p-4 pr-10 bg-gray-600 font-monument block focus:outline-none ring-0 w-full text-white placeholder:text-gray-300"
                        placeholder="ckb1qzda0cr08m85hc8j..."
                        // onChange={handleChange}
                        onInput={handleChange}
                        value={fieldValue}
                      />
                      <div className="absolute right-0 mt-3 mr-4">
                        {verStatus == "verifing" ? <IconSpinner /> : <></>}
                        {verStatus == "error" ? <IconError /> : <></>}
                        {verStatus == "verified" ? <IconCheck /> : <></>}
                      </div>
                    </div>

                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      {/* {valid ? (
                                <IconCheck className="text-green-500 h-5 w-5"></IconCheck>
                              ) : (
                                <IconError className="text-red-500 h-5 w-5"></IconError>
                              )} */}
                    </div>
                  </label>
                </div>
                {/* <div className="p-4 grid grid-rows-1 grid-flow-col gap-4 ">
                  <label className="row-span-2">Status:</label>
                  <label className="col-span-2 text-white">{ }</label>
                  <label className="row-span-2 ">
                    {verStatus == "verifing" ? <IconSpinner /> : <></>}
                    {verStatus == "error" ? <IconError /> : <></>}
                    {verStatus == "verified" ? <IconCheck /> : <></>}
                  </label>
                </div> */}

                {/*footer*/}
                <div className="flex items-center justify-end p-4">
                  {/* <Button onClick={verifyLTC} className="px-10">
                    Add LTC
                  </Button>
                  <span className="px-4"></span> */}

                  <Button onClick={verifyCKB} className="px-10">
                    Confirm
                  </Button>
                  {/* {status == "send" ? (
                      <>
                        {" "}
                        <Button onClick={handleSave} className="px-10">
                          Send Verification
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setStatus("send");
                            setisAutoModel(false);
                            setShowModal(false);
                          }}
                          className="px-10"
                        >
                          Close
                        </Button>
                      </>
                    )} */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
