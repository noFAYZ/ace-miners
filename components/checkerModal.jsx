import { useEffect, useState } from "react";
import { IconCKB, IconKDA, IconLTC } from "./Icon";

const CheckerModal = (props) => {

  const [showModal, setShowModal] = useState(props?.isModal)

  useEffect(()=>{
    setShowModal(props?.isModal)
   // console.log(props)
  },[props?.isModal])


    return ( <>
    {showModal ? <><div
  className="absolute z-10"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
  
  
>
  {/*
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
From: "opacity-0"
To: "opacity-100"
    Leaving: "ease-in duration-200"
From: "opacity-100"
To: "opacity-0"
  */}
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
  <div className="fixed inset-0 z-10  overflow-y-auto">
    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      {/*
  Modal panel, show/hide based on modal state.

  Entering: "ease-out duration-300"
    From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    To: "opacity-100 translate-y-0 sm:scale-100"
  Leaving: "ease-in duration-200"
    From: "opacity-100 translate-y-0 sm:scale-100"
    To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
*/}
      <div className="relative t rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 className="flex justify-center text-gray-400 pb-4 font-600 text-20">Available to claim</h3>

        {
  props?.rewards?.map((reward) => (
    <div key={reward?.nftId} className="sm:flex sm:items-center align-middle mb-2">
      <div className=" flex h-12 w-20s  items-center justify-center rounded-full bg-gray-800 sm:mx-0 sm:h-10 sm:w-20 text-xs">
        #{reward?.nftId}
      </div>
      <div className=" flex mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left gap-3 text-xs ">
        <h3 className="flex text-base font-semibold text-white align-middle items-center gap-1 rounded-lg bg-gray-800 px-1 py-[2px] text-14" id="modal-title">
          <IconLTC width={20}/> 
          <div>{Number(reward?.eachLTC).toFixed(2)}</div>
        </h3>
        <h3 className="flex text-base font-semibold text-white align-middle items-center gap-1 rounded-lg bg-gray-800 px-1 py-[2px] text-14" id="modal-title">
          <IconKDA width={16}/>
           <div>{Number(reward?.eachKDA).toFixed(2)}</div>
        </h3>
        <h3 className="flex text-base font-semibold text-white align-middle items-center gap-1 rounded-lg bg-gray-800 px-1 py-[2px] text-14" id="modal-title">
          <IconCKB width={20}/>
          <div>{Number(reward?.eachCKB).toFixed(2)}</div> 
        </h3>
      </div>
    </div>
  ))
}

          
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={(e)=>{
              e.preventDefault()
              setShowModal(false)}}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</div> </> : <></>}
    

    
    </> );
}
 
export default CheckerModal;