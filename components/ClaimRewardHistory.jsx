// ClaimRewardHistory.jsx
import { IconCKB, IconKDA, IconLTC } from "@/components/Icon";
import { Card } from "@/components/Ui/Card";
import { Link } from "next/link";
import React, { memo } from "react";
// Header component
const TableHeader = memo(() => (
  <Card className="hidden md:grid grid-cols-12 bg-transparent text-gray-200 text-14 font-title font-500">
    <span className="col-span-2">Request ID</span>
    <span className="col-span-2">Address</span>
    <span className="col-span-2">Status</span>
    <span className="col-span-3">Reward amount</span>
    <span className="col-span-3">Transaction Hash</span>
  </Card>
));

// Loading component
const LoadingState = memo(() => (
  <Card className="animate-pulse grid grid-cols-12 gap-4 p-6">
    <div className="col-span-4" />
    <div className="col-span-4 h-4 bg-gray-200/20 rounded" />
    <div className="col-span-4" />
  </Card>
));

// Reward Token Badge component
const RewardBadge = memo(({ amount, Icon, iconWidth }) => (
  <span className="h-fit my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
    <span className="bg-primary rounded-full px-2">
      {Number(amount).toFixed(amount < 1 ? 4 : 2)}
    </span>
    <Icon width={iconWidth} />
  </span>
));

const TransactionLink = memo(({ type, hash }) => {
  const links = {
    LTC: `https://blockexplorer.one/litecoin/mainnet/tx/${hash}`,
    KDA: `https://kdaexplorer.com/tx-details/${hash}`,
    CKB: `https://explorer.nervos.org/transaction/${hash}`,
  };

  const icons = {
    LTC: { Component: IconLTC, width: 20 },
    KDA: { Component: IconKDA, width: 14 },
    CKB: { Component: IconCKB, width: 18 },
  };

  const { Component, width } = icons[type];

  return (
    <a
      href={links[type]}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <span className="my-3 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
        <Component width={width} />
        <span className="bg-primary rounded-full px-1">✓</span>
      </span>
    </a>
  );
});

// Row component
const ClaimRow = memo(({ item, txData }) => {
  const truncateAddress = (address, start = 6, end = 4) => {
    if (!address) return "";
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };

  return (
    <Card className="max-md:space-y-4 p-3 md:px-8 md:py-6 md:grid md:grid-cols-12 rounded-2xl mb-6 last:mb-0 text-14 font-title font-500">
      {/* Request ID */}
      <span className="col-span-2 flex justify-between items-center">
        <span className="text-gray-200 text-12 md:hidden">Request ID</span>
        <span className="text-gray-100">
          {truncateAddress(item?.claimRequestId)}
        </span>
      </span>

      {/* Address */}
      <span className="col-span-2 flex justify-start items-center">
        <span className="text-gray-200 text-12 md:hidden">Address</span>
        <span className="text-gray-100">
          {truncateAddress(item?.hodlerAddress, 12)}
        </span>
      </span>

      {/* Status */}
      <span className="col-span-2 flex justify-between items-center">
        <span className="text-gray-200 text-12 md:hidden">Status</span>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            item?.status === "completed"
              ? "bg-green-500/20 text-green-300"
              : "bg-yellow-500/20 text-yellow-300"
          }`}
        >
          {item?.status}
        </span>
      </span>

      {/* Reward Amount */}
      <span className="col-span-3 text-primary text-right flex justify-between">
        <span className="text-gray-200 text-12 md:hidden">Reward amount</span>
        <div className="flex flex-wrap gap-1">
          <RewardBadge amount={item.totalLtc} Icon={IconLTC} iconWidth={20} />
          <RewardBadge amount={item.totalKda} Icon={IconKDA} iconWidth={14} />
          <RewardBadge amount={item.totalCkb} Icon={IconCKB} iconWidth={18} />
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
      </span>

      {/* Transaction Hashes */}

      <span className="col-span-2 flex justify-center flex-wrap items-center gap-1">
        {txData
          .filter((tx) => tx?.claimRequestId == item?.claimRequestId)
          .map((tx, index) => (
            <div className="flex flex-wrap gap-1" key={index}>
              {tx?.LTC && <TransactionLink type="LTC" hash={tx?.LtcHash} />}
              {tx?.KDA && <TransactionLink type="KDA" hash={tx?.KdaHash} />}
              {tx?.CKB && <TransactionLink type="CKB" hash={tx?.CkbHash} />}
            </div>
          ))}
        {!txData.filter((tx) => tx.claimRequestId == item.claimRequestId)
          ?.length > 0 ? (
          <span className="text-gray-100">Not Sent Yet</span>
        ) : null}
      </span>

      {/*    <span className="col-span-2 flex justify-center flex-wrap items-center gap-1">
        {txData.map((tx, index) => {
          if (tx?.claimRequestId === item?.claimRequestId) {
            return (
              <div className="flex flex-wrap gap-1" key={index}>
                {tx?.LTC ? (
                  <>
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
                  </>
                ) : (
                  <></>
                )}

                {tx?.KDA ? (
                  <>
                    <Link
                      href={`https://kdaexplorer.com/tx-details/` + tx?.KdaHash}
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
                  </>
                ) : (
                  <></>
                )}

                {tx?.CKB ? (
                  <>
                    <Link
                      href={
                        `https://explorer.nervos.org/transaction/` + tx?.CkbHash
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
                  </>
                ) : (
                  <></>
                )}
              </div>
            );
          }

          return <></>;
        })}
      </span> */}
    </Card>
  );
});

// Main component
const ClaimRewardHistory = ({ loading, payouts = [], txData = [] }) => {
  if (!payouts.length && !loading) {
    return (
      <Card className="p-6 text-center text-gray-300">
        No claim history found
      </Card>
    );
  }

  return (
    <div className="2xl:col-span-2">
      <div>
        <h2 className="title-2 mb-6">Claim reward history</h2>
        <TableHeader />

        {loading ? (
          <LoadingState />
        ) : (
          payouts.map((item, index) => (
            <ClaimRow
              key={`${item?.claimRequestId || index}`}
              item={item}
              txData={txData}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default memo(ClaimRewardHistory);
