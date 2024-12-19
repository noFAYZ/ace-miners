const { PrismaClient } = require('@prisma/client')
import { async } from '@firebase/util'
import { nanoid } from 'nanoid'


export default async function handler(req, res) {

    const prisma = new PrismaClient()
    const newUid = nanoid()

    const addDataInDb = async (_eachDropData) => {

        _eachDropData.forEach(async (drop) => {

            let dbArrray = []
            drop?.nfts.forEach((nft) => {
                dbArrray.push({
                    id: nanoid(),
                    claimRequestId: newUid,
                    nftId: parseInt(nft.nftId),
                    contractAddress: String(nft.nftContractAddress),
                    isClaimed: Boolean(true),
                    requestStatus: "pending",
                    holderEthAddress: String(drop.holderAddress),
                    dropId: parseInt(nft.dropId),
                    eachLTC: String(drop.drop_id.eachLTC),
                    eachKDA: String(drop.drop_id.eachKDA),
                    eachCKB: String(drop.drop_id.eachCKB)
                })
            })


            const claimData = await prisma.claimRequests.createMany({
                data: dbArrray
            })
            console.log(claimData)


        })




        return true

    }

    const addDataInDbBoost = async (_eachDropData) => {

        _eachDropData.forEach(async (drop) => {

            let boostArrray = []
            drop?.nfts.forEach((nft) => {
                boostArrray.push({
                    id: nanoid(),
                    claimRequestId: newUid,
                    nftId: parseInt(nft.nftId),
                    contractAddress: String(nft.nftContractAddress),
                    isClaimed: Boolean(true),
                    requestStatus: "pending",
                    holderEthAddress: String(drop.holderAddress),
                    dropId: parseInt(nft.dropId),
                    eachLTC: String(drop.drop_id.eachBoostLTC),

                })
            })


            const claimDataBoost = await prisma.claimRequestsBoost.createMany({
                data: boostArrray
            })
            console.log(claimDataBoost)


        })

        return true

    }

    const getDBData = async () => {
        try {
            const dbData = await prisma.claimRequests.findMany()
            prisma.$disconnect()
            return dbData
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const checkDuplicate = async (_eachDropData) => {

        try {
            const dbData = await getDBData()

            _eachDropData.forEach(async (drop) => {
                drop?.nfts.forEach((nft) => {

                    if (dbData.some(e => {
                        e.nftId == nft.nftId &&
                            e.dropId == nft.dropId
                    })) {
                        return true
                    }
                })



            })

            return false




        } catch (error) {

        }

    }

    const getDBDataBoost = async () => {
        try {
            const dbData = await prisma.claimRequestsBoost.findMany()
            prisma.$disconnect()
            return dbData
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const checkDuplicateBoost = async (_eachDropData) => {

        try {
            const dbData = await getDBDataBoost()

            _eachDropData.forEach(async (drop) => {
                drop?.nfts.forEach((nft) => {

                    if (dbData.some(e => {
                        e.nftId == nft.nftId &&
                            e.dropId == nft.dropId
                    })) {
                        return true
                    }
                })



            })

            return false




        } catch (error) {

        }

    }

    if (req.method == "POST") {
        console.log("Claim Rewards")

        try {
            const eachDropData = req.body

            console.log('\n')
            console.log("=============================================================================")
            console.log("======                        Claim Request                        ========")
            console.log("=============================================================================")


            //Add Data in DB
            try {
                const checkDuplicates = await checkDuplicate(eachDropData?.nftsNotClaimed)
                const checkDuplicatesBoost = await checkDuplicateBoost(eachDropData?.nftsNotClaimedBoost)
                console.log("Dublicate: ", checkDuplicates, checkDuplicatesBoost)
                console.log("Data: ", eachDropData)

                if (!checkDuplicates) {
                    const addDropData = await addDataInDb(eachDropData?.nftsNotClaimed)
                    console.log("Claim Data Added: ", addDropData)
                }
                if (!checkDuplicatesBoost) {
                    const addDropDataBoost = await addDataInDbBoost(eachDropData?.nftsNotClaimedBoost)
                    console.log("Boost Claim Data Added: ", addDropDataBoost)
                }

                return res.status(200).json({ status: "SUCCESS: DATA ADDED TO DB" });
            } catch (error) {
                return res.status(500).json({ status: "FAILED" });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }



    }



}
