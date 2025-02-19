import { IconCKB, IconKDA, IconLTC } from "@/components/Icon";
import { Loader, RefreshCcw } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddressPopover from "./address-popover";

const ResponsivePayoutTable = ({
  paginatedPayouts,
  currentPage,
  ITEMS_PER_PAGE,
  txData,
  processing,
  handlePay,
  handleRemove,
  isRemoving,
  removingId,
  setActiveModal,
  activeModal,
  NFTsColumn,
  isPayingId,
}) => {
  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const isPaid = (item) => {

    // If no transactions exist
    if (!txData.length) {
      return false
    }

    // Find matching transaction for this claim request
    const matchingTx = txData.find(tx => tx?.claimRequestId === item?.claimRequestId);

    // If no matching transaction found
    if (!matchingTx) {
      return false
    }
    // console.log(matchingTx)
    // Check if any payment is pending (false) or all payments are undefined
    const needsPayment =
      matchingTx?.LTC === false ||
      matchingTx?.KDA === false ||
      matchingTx?.CKB === false ||
      (!matchingTx?.LTC && !matchingTx?.KDA && !matchingTx?.CKB);

    return needsPayment
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 p-4 bg-black text-gray-200 font-medium text-sm">
        <div className="col-span-1 items-center content-center align-middle justify-items-center justify-self-center">
          ID
        </div>
        <div className="col-span-1 items-center content-center align-middle justify-items-center justify-self-center">
          Request ID
        </div>
        <div className="col-span-1 items-center content-center align-middle justify-items-center justify-self-center">
          Address
        </div>
        <div className="col-span-2 items-center content-center align-middle justify-items-center justify-self-center">
          Amount
        </div>
        <div className="col-span-1 items-center content-center align-middle justify-items-center justify-self-center">
          Status
        </div>
        <div className="col-span-2 items-center content-center align-middle justify-items-center justify-self-center">
          Transactions
        </div>
        <div className="col-span-3 items-center content-center align-middle justify-items-center justify-self-center">
          NFTs
        </div>
        <div className="col-span-1 items-center content-center align-middle justify-items-center justify-self-center">
          Actions
        </div>
      </div>

      {/* Responsive Table Body */}
      <div className="divide-y divide-gray-800">
        {paginatedPayouts.map((item, index) => (
          <div key={item.claimRequestId} className="group">
            {/* Desktop View */}
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/30 text-gray-300">
              <div className="col-span-1 text-gray-100 flex justify-center items-center content-center">
                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
              </div>
              <div className="col-span-1 font-mono text-gray-100 items-center content-center">
                <div className="font-mono text-14 text-gray-100 bg-gray-800/50 px-3 py-1.5 rounded-2xl w-fit">
                  {item.claimRequestId?.slice(0, 6)}...
                  {item.claimRequestId?.slice(-4)}
                </div>
              </div>
              <div className="col-span-1 font-mono text-gray-100 items-center content-center">
                <div className="group relative">
                  <div className="font-mono text-14 text-gray-100 bg-gray-800/50 px-3 py-1.5 rounded-2xl w-fit">
                    {item.hodlerAddress?.slice(0, 6)}...
                    {item.hodlerAddress?.slice(-4)}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-300 text-white text-sm rounded-2xl py-2 px-3 -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {item.hodlerAddress}
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              <div className="col-span-2 items-center content-center align-middle justify-items-center justify-self-center">
                <div className="flex flex-wrap justify-center gap-1 items-center content-center align-middle justify-items-center justify-self-center">
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
                  {item?.totalBoostLtc ? (
                    <>
                      {" "}
                      <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-gray-50 font-300 rounded-full">
                        <span className="bg-red-500 rounded-full px-2">
                          {item?.totalBoostLtc?.toFixed(4)}{" "}
                        </span>{" "}
                        <IconLTC width={18} />
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="col-span-1 items-center content-center align-middle justify-items-center justify-self-center">
                <span
                  className={`px-3 py-1 rounded-full text-12 ${item.status === "completed"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-yellow-500/20 text-yellow-300"
                    }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="col-span-2 items-center content-center align-middle justify-items-center justify-self-center">
                <div className="flex gap-2">
                  {txData
                    .filter((tx) => tx.claimRequestId == item.claimRequestId)
                    .map((tx) => (
                      <div key={tx.claimRequestId} className="flex gap-2">
                        {tx.LtcHash && (
                          <Link
                            href={
                              `https://blockexplorer.one/litecoin/mainnet/tx/` +
                              tx?.LtcHash
                            }
                          >
                            <a target="_blank" rel="noopener noreferrer">
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
                        )}
                        {tx.KdaHash && (
                          <Link
                            href={
                              `https://kdaexplorer.com/tx-details/` +
                              tx?.KdaHash
                            }
                          >
                            <a target="_blank" rel="noopener noreferrer">
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
                        )}
                        {tx.CkbHash && (
                          <Link
                            href={
                              `https://explorer.nervos.org/transaction/` +
                              tx?.CkbHash
                            }
                          >
                            <a target="_blank" rel="noopener noreferrer">
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
                        )}
                      </div>
                    ))}
                  {!txData.filter(
                    (tx) => tx.claimRequestId == item.claimRequestId
                  )?.length > 0 ? (
                    <span className="text-gray-100">Not Sent Yet</span>
                  ) : null}
                </div>
              </div>
              <div className="col-span-3 items-center content-center align-middle justify-items-center justify-self-center">
                <div
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <NFTsColumn item={item} />
                </div>
              </div>
              <div className="col-span-1 flex flex-col gap-2 ">
                <button
                  onClick={() => handlePay(item)}
                  disabled={processing || (item.status === "completed" && !isPaid(item))}
                  className={`px-3 py-1 rounded-xl text-gray-100 text-sm ${processing || (item.status === "completed" && !isPaid(item))
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                    }`}
                >
                  {processing && isPayingId === item.claimRequestId ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      <span>Processing</span>
                    </div>
                  ) : item.status === "completed" && !isPaid(item) ? (
                    "Paid"
                  ) : (
                    "Pay"
                  )}
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  disabled={processing}
                  className="px-3 py-1 rounded-xl text-gray-100 text-sm bg-red-800 hover:bg-red-700 hover:scale-105 hover:border-1"
                >
                  {isRemoving && removingId === item.claimRequestId ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Removing...</span>
                    </div>
                  ) : (
                    <>Remove</>
                  )}
                </button>
              </div>
            </div>
            {/* Mobile/Tablet View */}
            <div className="lg:hidden p-4 hover:bg-gray-800/30 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex gap-4 text-gray-100 font-medium">
                    ID#
                    <div className="font-mono text-sm text-gray-100 bg-gray-300/50 px-3 rounded-2xl">
                      {item.claimRequestId?.slice(0, 6)}...
                      {item.claimRequestId?.slice(-4)}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${item.status === "completed"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-yellow-500/20 text-yellow-300"
                    }`}
                >
                  {item.status}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-100">Address:</span>
                  <div className="font-mono text-sm text-gray-100 bg-gray-300/50 px-3 py-1 rounded-2xl">
                    {item.hodlerAddress?.slice(0, 6)}...
                    {item.hodlerAddress?.slice(-4)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item?.totalLtc > 0 && (
                    <span className="flex items-center gap-1 bg-gray-200 text-white rounded-full">
                      <span className="bg-primary px-2 py-1 rounded-full">
                        {item.totalLtc.toFixed(4)} LTC
                      </span>
                    </span>
                  )}
                  {item?.totalKda > 0 && (
                    <span className="flex items-center gap-1 bg-gray-200 text-white rounded-full">
                      <span className="bg-primary px-2 py-1 rounded-full">
                        {item.totalKda.toFixed(2)} KDA
                      </span>
                    </span>
                  )}
                  {item?.totalCkb > 0 && (
                    <span className="flex items-center gap-1 bg-gray-200 text-white rounded-full">
                      <span className="bg-primary px-2 py-1 rounded-full">
                        {item.totalCkb.toFixed(0)} CKB
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex bg-gray-300/50 justify-center rounded-2xl gap-1 px-2 py-2">
                <button
                  onClick={() => handlePay(item)}
                  disabled={processing || (item.status === "completed" && txData
                    .filter((tx) => tx.claimRequestId === item.claimRequestId)
                    .every((tx) => tx.LtcHash && tx.KdaHash && tx.CkbHash))}
                  className={` py-2 rounded-xl text-gray-100 text-sm flex items-center gap-2 w-1/2 text-center content-center justify-center ${processing || (item.status === "completed" && txData
                    .filter((tx) => tx.claimRequestId === item.claimRequestId)
                    .every((tx) => tx.LtcHash && tx.KdaHash && tx.CkbHash))
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {processing ? (
                    <>
                      <LoadingSpinner />
                      Processing
                    </>
                  ) : (item.status === "completed" && txData
                    .filter((tx) => tx.claimRequestId === item.claimRequestId)
                    .every((tx) => tx.LtcHash && tx.KdaHash && tx.CkbHash)) ? (
                    "Paid"
                  ) : (
                    "Pay"
                  )}
                </button>

                <button
                  onClick={() => handleRemove(item)}
                  disabled={processing}
                  className=" py-2 rounded-xl text-gray-100 text-sm bg-red-800 hover:bg-red-700 flex items-center gap-2 w-1/2 text-center content-center justify-center "
                >
                  {isRemoving && removingId === item.claimRequestId ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsivePayoutTable;
