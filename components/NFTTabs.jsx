import { Card } from "@/components/Ui";
import {
  aceMinerContracts,
  alchemySettings,
  chainURL,
  contrAceMinersBoost,
  contrAceMinersPhase1,
  contrAceMinersPhase2,
} from "@/constant/consonants";
import { useState } from "react";

const NFTCollectionTabs = ({ isNftsLoading, userAmNft, userAmBoostNft }) => {
  const [activeTab, setActiveTab] = useState("ace-miners-1");

  const filterNFTsByCollection = (collection) => {
    // You'll need to adjust these conditions based on your actual contract addresses
    const boostnfts = userAmNft.filter(
      (nft) =>
        nft.contract.address.toLowerCase() === contrAceMinersBoost.toLowerCase()
    );

    // console.log("BoostNFTS: ", userAmNft);

    switch (collection) {
      case "ace-miners-1":
        return userAmNft.filter(
          (nft) =>
            nft.contract.address.toLowerCase() ===
            contrAceMinersPhase1.toLowerCase()
        );
      case "ace-miners-2":
        return userAmNft.filter(
          (nft) =>
            nft.contract.address.toLowerCase() ===
            contrAceMinersPhase2.toLowerCase()
        );
      case "ace-miners-3":
        return userAmBoostNft.filter(
          (nft) =>
            nft.contract.address.toLowerCase() ===
            contrAceMinersBoost.toLowerCase()
        ); // Add logic for Ace Miners 3 when available
      default:
        return [];
    }
  };

  const tabs = [
    { id: "ace-miners-1", label: "Ace Miners P1" },
    { id: "ace-miners-2", label: "Ace Miners P2" },
    { id: "ace-miners-3", label: "Ace Miners Boost" },
  ];

  if (isNftsLoading) {
    return (
      <div className="flex justify-center items-start text-center align-middle my-40">
        Loading....
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-5">
      {/* Tab Navigation */}
      <div className="flex space-x-1 w-full md:w-1/2 bg-gray-400 p-1 rounded-3xl border-[1px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-4 py-2 rounded-2xl text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-gray-100 hover:bg-gray-600"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-12">
        {filterNFTsByCollection(activeTab).length === 0 ? (
          <Card className="border col-span-full border-gray-400 p-2 flex-shrink-0 bg-gray-500 text-center">
            <div className="mt-4 mb-3">
              <p className="text-14 text-gray-200">
                No NFTs found in this collection
              </p>
            </div>
          </Card>
        ) : (
          filterNFTsByCollection(activeTab).map((item, index) => (
            <Card
              key={index}
              className="border border-gray-400 p-2 flex-shrink-0 bg-gray-500 text-center"
            >
              <img
                className="w-full aspect-[4/5] rounded-3xl object-cover object-center mb-2"
                src={item?.rawMetadata?.image?.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )}
                alt={item?.rawMetadata?.image}
              />
              <div className="mt-4 mb-3">
                <h2 className="title-3">{item.title}</h2>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NFTCollectionTabs;
