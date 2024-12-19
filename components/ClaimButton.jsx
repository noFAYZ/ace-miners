import { CheckCircle, Loader, XCircle } from "lucide-react";
import { useState } from "react";

const ClaimButton = ({ nftsNotClaimed, nftsNotClaimedBoost, refreshAll }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState("confirm"); // 'confirm' | 'success' | 'error'

  const handleClaim = async () => {
    setIsLoading(true);

    if (nftsNotClaimed?.length > 0 || nftsNotClaimedBoost?.length > 0) {
      try {
        const response = await fetch("/api/claimRewardNew", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nftsNotClaimed,
            nftsNotClaimedBoost,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to process claim");
        }

        setModalState("success");

        /*  setTimeout(() => {
          setShowModal(false);
          setModalState("confirm");
        }, 12000); */
      } catch (error) {
        console.error(error);
        setModalState("error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const checkIfNotClaimed = () => {
    const hasRegularNFTs = nftsNotClaimed.some((item) => item.nfts?.length > 0);
    const hasBoostNFTs = nftsNotClaimedBoost.some(
      (item) => item.nfts?.length > 0
    );
    2;

    if (hasRegularNFTs || hasBoostNFTs) {
      return true;
    }
    return false;
  };

  const renderModalContent = () => {
    switch (modalState) {
      case "success":
        return (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">
              Claim Submitted Successfully!
            </h3>
            <p className="text-gray-200">
              Your claim request has been processed and is being verified.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setModalState("confirm");
                refreshAll();
              }}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700"
            >
              Close
            </button>
          </div>
        );

      case "error":
        return (
          <div className="text-center py-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">
              Claim Failed
            </h3>
            <p className="text-gray-200">
              There was an error processing your claim. Please try again.
            </p>
            <button
              onClick={() => setModalState("confirm")}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return (
          <>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Confirm Claim Submission
            </h3>
            <p className="text-gray-200 mb-4">
              Are you sure you want to submit your claim request? This action
              will process:
              {nftsNotClaimed?.length > 0 && (
                <div className="mt-2">
                  • {nftsNotClaimed.length} Phase 1 & Phase 2 NFT claims
                </div>
              )}
              {nftsNotClaimedBoost?.length > 0 && (
                <div>• {nftsNotClaimedBoost.length} Boost NFT claims</div>
              )}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                }}
                disabled={isLoading}
                className="px-4 py-2 rounded-2xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleClaim}
                disabled={isLoading}
                className={`
                  px-4 py-2 rounded-2xl font-medium text-white
                  ${
                    isLoading
                      ? "bg-orange-600 cursor-not-allowed"
                      : "bg-gradient-to-br from-orange-500 to-pink-500 hover:bg-orange-800 active:bg-orange-900"
                  }
                  transition-colors duration-200
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm Claim"
                )}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <div className="flex gap-2 items-center">
        {checkIfNotClaimed() ? (
          <button
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className={`
              px-6 py-2 rounded-2xl font-medium text-white
              ${
                isLoading
                  ? "bg-orange-600 cursor-not-allowed"
                  : "bg-gradient-to-br from-orange-500 to-pink-500 hover:bg-orange-800 active:bg-orange-900"
              }
              transition-colors duration-200 min-w-[160px]
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Submit Claim"
            )}
          </button>
        ) : (
          <button
            disabled
            className="px-6 py-2 rounded-2xl font-medium text-white bg-green-800 flex items-center gap-2"
          >
            <CheckCircle className="h-6 w-6" />
            Claimed
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-300/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-500 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-500">
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimButton;
