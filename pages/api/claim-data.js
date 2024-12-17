const { PrismaClient } = require('@prisma/client')
import { async } from '@firebase/util'
import { nanoid } from 'nanoid'


export default async function handler(req, res) {

    const prisma = new PrismaClient()
    const newUid = nanoid()

    const calculateRewards = (nftsNotClaimed) => {

        let rewards = {
            totalKDA: 0.00,
            totalCKB: 0.00,
            totalLTC: 0.00
        }

        nftsNotClaimed.forEach((drop) => {
            rewards = {
                totalKDA: rewards.totalKDA += (parseFloat(drop.drop_id.eachKDA) * drop.nfts?.length),
                totalCKB: rewards.totalCKB += (parseFloat(drop.drop_id.eachCKB) * drop.nfts?.length),
                totalLTC: rewards.totalLTC += (parseFloat(drop.drop_id.eachLTC) * drop.nfts?.length)
            }

        })

        return rewards

    }

    const createDBinputArray = async (nftsNotClaimed) => {

        nftsNotClaimed.forEach(async (drop) => {

            let dbArrray = []
            drop?.nfts.forEach((nft) => {
                dbArrray.push({
                    id: nanoid(),
                    claimRequestId: newUid,
                    nftId: parseInt(nft.nftId),
                    contractAddress: String(nft.nftContractAddress),
                    isClaimed: Boolean(false),
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



    if (req.method == "GET") {
        console.log("Get Claim Data")

        try {
            const claimData = await prisma.claimRequests.findMany()

            return res.status(200).json(claimData);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }

    else if (req.method == "POST") {
        console.log("Attach Wallet")
        const body = req.body;



        try {
            const rewards = calculateRewards(body);
            console.log(rewards)

            const sendData = createDBinputArray(body)




            return res.status(200).json("Success");

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "OK" });
        }



    }



}
