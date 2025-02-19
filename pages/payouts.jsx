import { IconCKB, IconKDA, IconLTC } from "@/components/Icon";
import ResponsivePayoutTable from "@/components/PayoutTable";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
const ITEMS_PER_PAGE = 10;
const ADMIN_ADDRESSES = [
  "0x664250876c9d9acC92AF91427cC0114a9a22B067",
  "0xF14197dc4934B4D050c8cF64c24a469CB6e64BdA",
  "0xBe8E12894f04c53f6EFd9f46C11275CE54fa7609",
];

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

const PayoutPage = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [payoutsBoost, setPayoutsBoost] = useState([]);
  const [txData, setTxData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchAddress, setSearchAddress] = useState("");
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPayingId, setIsPayingId] = useState(false);
  const address = useAddress();
  const [activeModal, setActiveModal] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchData = useCallback(async () => {
    if (isInitialLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const [claimResponse, claimResponseBoost, txResponse] = await Promise.all(
        [
          fetch("/api/claim-data").then((res) => {
            if (!res.ok) throw new Error("Failed to fetch claim data");
            return res.json();
          }),
          fetch("/api/claim-data-boost").then((res) => {
            if (!res.ok) throw new Error("Failed to fetch Boost claim data");
            return res.json();
          }),
          fetch("/api/tx-data").then((res) => {
            if (!res.ok) throw new Error("Failed to fetch transaction data");
            return res.json();
          }),
        ]
      );

      if (Array.isArray(claimResponse)) {
        const claimRequestsBoost =
          getUniquePropertyValuesBoost(claimResponseBoost);
        setPayoutsBoost(claimRequestsBoost);

        const claimRequests = getUniquePropertyValues(
          claimResponse,
          claimRequestsBoost
        );
        setPayouts(claimRequests);
      } else {
        console.error("Invalid claim data format");
        setPayouts([]);
      }

      if (Array.isArray(txResponse)) {
        setTxData(txResponse);
      } else {
        setTxData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  }, [isInitialLoading]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const filteredPayouts = useMemo(() => {
    console.log("Filtering payouts:", payouts?.length);

    if (!Array.isArray(payouts)) return [];

    return payouts.filter((payout) => {
      if (!payout || !payout.hodlerAddress) return false;

      const matchesStatus =
        statusFilter === "all" || payout.status === statusFilter;
      const matchesSearch =
        !searchAddress ||
        payout.hodlerAddress
          .toLowerCase()
          .includes(searchAddress.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [payouts, statusFilter, searchAddress]);

  const paginatedPayouts = useMemo(() => {
    console.log("Paginating results:", filteredPayouts);

    return filteredPayouts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredPayouts, currentPage]);

  const totalPages = Math.ceil((filteredPayouts?.length || 0) / ITEMS_PER_PAGE);

  const handlePay = async (item) => {
    if (!confirm("Are you sure you want to process this payment?")) return;
    setIsPayingId(item.claimRequestId);
    setProcessing(true);
    try {
      const response = await fetch(
        "https://us-central1-upheld-beach-388919.cloudfunctions.net/gcpservice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }
      );

      if (!response.ok) {
        throw new Error("Payment request failed");
      }

      // Parse the response data
    const data = await response.json();
    

    console.log("Transaction data:", data.data);

      await fetchData().finally(() => {
        setProcessing(false);
      });
      alert("Payment processed successfully");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed: " + error.message);
    } finally {
      setIsPayingId(null);
    }
  };

  const handleRemove = async (item) => {
    if (!confirm("Are you sure you want to remove this request?")) return;
    setIsRemoving(true);
    setRemovingId(item.claimRequestId);
    try {
      const response = await fetch("/api/removeRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to remove request");
      }

      const data = await response.json();
      if (data?.removed?.count) {
        await fetchData().finally(() => {
          setIsRemoving(false);
        });
        alert("Request removed successfully");
      }
    } catch (error) {
      console.error("Remove error:", error);
      alert("Failed to remove request: " + error.message);
    } finally {
      setRemovingId(null); // Clear the removing state
    }
  };

  useEffect(() => {
    fetchData();

    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing data...");
      fetchData();
    }, 12000000);

    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchAddress]);

  function getUniquePropertyValues(jsonArray, claimRequestsBoost) {
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
      let totalBoostLtc = 0;
      let reqStatus = "";
      let hodlerAddress = "";

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
          nfts: nftIds.length,
        });
      });

      resultArray.push({
        claimRequestId: uniqueValue,
        dropId: Array.from(dropIds),
        count: nfts.length,
        status: reqStatus,
        hodlerAddress: hodlerAddress,
        nfts: nfts,
        boostNfts: claimRequestsBoost.find(
          (item) => item.claimRequestId === uniqueValue
        )?.nfts,
        totalCkb: totalCkb,
        totalKda: totalKda,
        totalLtc: totalLtc,
        totalBoostLtc: claimRequestsBoost.find(
          (item) => item.claimRequestId === uniqueValue
        )?.totalLtc,
      });
    });

    return resultArray;
  }

  function getUniquePropertyValuesBoost(jsonArray) {
    const uniqueValues = new Set();
    const resultArray = [];

    jsonArray.forEach(function (jsonObject) {
      uniqueValues.add(jsonObject.claimRequestId);
    });

    uniqueValues.forEach(function (uniqueValue) {
      const dropIdNftsMap = new Map();
      const dropIds = new Set();
      const filteredObject = {};
      let totalLtc = 0;
      let reqStatus = "";
      let hodlerAddress = "";

      jsonArray.forEach(function (jsonObject) {
        if (jsonObject.claimRequestId === uniqueValue) {
          dropIds.add(jsonObject.dropId);

          const dropId = jsonObject.dropId;
          const nftId = jsonObject.nftId;

          if (!dropIdNftsMap.has(dropId)) {
            dropIdNftsMap.set(dropId, []);
          }
          dropIdNftsMap.get(dropId).push(nftId);

          totalLtc += Number(jsonObject.eachLTC);
          reqStatus = jsonObject.requestStatus;
          hodlerAddress = jsonObject.holderEthAddress;
        }
      });

      const nfts = [];
      dropIdNftsMap.forEach((nftIds, dropId) => {
        nfts.push({
          dropId: dropId,
          nfts: nftIds.length,
        });
      });

      resultArray.push({
        claimRequestId: uniqueValue,
        dropId: Array.from(dropIds),
        count: nfts.length,
        status: reqStatus,
        hodlerAddress: hodlerAddress,
        nfts: nfts,
        totalLtc: totalLtc,
      });
    });

    return resultArray;
  }

  if (!ADMIN_ADDRESSES.includes(address)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">
            Admin Access Required
          </h2>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (isInitialLoading || loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-200 flex flex-col items-center gap-4">
          <LoadingSpinner />
          <span>Loading payouts...</span>
        </div>
      </div>
    );
  }

  const CombinedNFTsDisplay = ({ item, count }) => {
    // Create a map of all dropIds and their corresponding NFTs
    const dropIdMap = new Map();

    // Process regular NFTs
    item?.nfts?.forEach((nft) => {
      dropIdMap.set(nft.dropId, { regular: nft, boost: null });
    });

    // Process boost NFTs
    item?.boostNfts?.forEach((nft) => {
      if (dropIdMap.has(nft.dropId)) {
        dropIdMap.get(nft.dropId).boost = nft;
      } else {
        dropIdMap.set(nft.dropId, { regular: null, boost: nft });
      }
    });

    // Convert map to array and sort by dropId
    const sortedNFTs = Array.from(dropIdMap.entries()).sort(
      ([a], [b]) => a - b
    );

    let printIdLength = sortedNFTs.length;

    if (count) {
      printIdLength = count;
    }

    return (
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {sortedNFTs.slice(0, count).map(([dropId, { regular, boost }]) => (
          <div key={dropId} className="flex justify-center gap-2">
            {regular && (
              <span className="bg-primary text-gray-50 text-12 rounded-full pl-2 py-1">
                Reward# {regular.dropId}{" "}
                <span className="bg-green-900 text-gray-50 rounded-full px-2 py-1">
                  {regular.nfts} NFTs
                </span>
              </span>
            )}
            {boost && (
              <span className="bg-primary text-gray-50 text-12 rounded-full pl-2 py-1">
                Reward# {boost.dropId}{" "}
                <span className="bg-red-500 text-gray-50 text-12 rounded-full px-2 py-1">
                  {boost.nfts} Boost NFTs
                </span>
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // The NFTs column component
  const NFTsColumn = ({ item }) => {
    // Show first 2 NFTs and create a "+X more" button if there are more
    const displayedNfts = item?.nfts?.slice(0, 2) || [];
    const remainingCount = (item?.nfts?.length || 0) - 2;

    return (
      <div className="col-span-3 items-center content-center align-middle justify-items-center justify-self-center">
        <div className="flex flex-col gap-2">
          {/* Preview of first 2 NFTs */}
          <CombinedNFTsDisplay item={item} count={2} />

          {/* View All button if there are more than 2 NFTs */}
          {remainingCount > 0 && (
            <button
              onClick={() => setActiveModal(item.claimRequestId)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              + View {remainingCount} more
            </button>
          )}
        </div>

        {/* Modal */}
        {activeModal === item.claimRequestId && (
          <div className="fixed inset-0 bg-gray-300/40 flex items-center justify-center z-50">
            <div className="bg-gray-500 rounded-xl p-6 max-w-lg w-full mx-4 border border-gray-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">NFT Details</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-100 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <CombinedNFTsDisplay item={item} />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Your existing header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Payouts Dashboard</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-4 py-2 rounded-2xl text-sm flex items-center gap-2 ${
              isRefreshing ? "bg-blue-600" : "bg-primary hover:bg-blue-700"
            }`}
          >
            {isRefreshing ? <LoadingSpinner /> : null}
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <ConnectWallet />
      </div>

      {/* Your existing filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black text-gray-100 rounded-lg px-4 py-2 outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="text"
          placeholder="Search by address..."
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="bg-black placeholder:text-gray-100 text-white rounded-lg px-4 py-2 outline-none flex-grow"
        />
      </div>

      {/* Error message display */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Replace your existing table with the new ResponsivePayoutTable */}
      <div className="rounded-xl shadow-xl overflow-hidden border border-gray-300">
        {payouts.length === 0 ? (
          <div className="p-8 text-center text-gray-200">
            No payouts data available
          </div>
        ) : filteredPayouts.length === 0 ? (
          <div className="p-8 text-center text-gray-200">
            No matching payouts found
          </div>
        ) : (
          <ResponsivePayoutTable
            paginatedPayouts={paginatedPayouts}
            currentPage={currentPage}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            txData={txData}
            processing={processing}
            handlePay={handlePay}
            handleRemove={handleRemove}
            isPayingId={isPayingId}
            isRemoving={isRemoving}
            removingId={removingId}
            setActiveModal={setActiveModal}
            activeModal={activeModal}
            NFTsColumn={NFTsColumn} // Pass your existing NFTsColumn component
          />
        )}
      </div>

      {filteredPayouts.length > 0 && (
        <div className="flex flex-wrap justify-between items-center mt-4 text-gray-100">
          <div>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayouts.length)} of{" "}
            {filteredPayouts.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1 ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Processing Toast */}
      {processing && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <LoadingSpinner />
          Processing transaction...
        </div>
      )}
    </div>
  );
};

export default PayoutPage;
