const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {

    const prisma = new PrismaClient()


    if (req.method === "POST") {
        console.log("Adding Blacklist")
        const body = req.body;

        console.log(body)
        const nftId = body?.nftId
        const aceMinersContractAddress = body?.aceMinersContractAddress
        const isBlacklisted = body?.isBlacklisted

        const recordExist = await prisma.blacklistStatus.findMany(
            {
                where: {
                    AND: [{ nftId: nftId },
                    { aceMinersContractAddress: aceMinersContractAddress }]
                }
            }
        )
        console.log("RECORD ECIST: ", recordExist)

        if (recordExist?.id) {
            const addBlacklistIds = await prisma.blacklistStatus.upsert({
                where: {
                    id: recordExist?.id



                },
                create: {
                    nftId: nftId,
                    isBlacklisted: isBlacklisted,
                    aceMinersContractAddress: aceMinersContractAddress
                },
                update: {
                    isBlacklisted: isBlacklisted
                }
            })

            console.log(addBlacklistIds)
            return res.status(200).json(addBlacklistIds);
        }
        else {

            const addBlacklistIds = await prisma.blacklistStatus.create({
                data: {
                    nftId: nftId,
                    isBlacklisted: isBlacklisted,
                    aceMinersContractAddress: aceMinersContractAddress
                }
            })

            console.log(addBlacklistIds)
            return res.status(200).json(addBlacklistIds);

        }



    }

    else if (req.method == "GET") {
        console.log("Get Drop Data")

        try {
            const drops = await prisma.blacklistStatus.findMany()


            return res.status(200).json(drops);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }
    if (req.method === "DELETE") {
        console.log("Deleting Blacklist");
        const body = req.body;

        try {
            await prisma.blacklistStatus.deleteMany({
                where: {
                    nftId: parseInt(body.nftId),
                    aceMinersContractAddress: body.aceMinersContractAddress,
                },
            });

            console.log("NFT iD:", body.nftId);
            return res.status(200).json({ status: "SUCCESS Blacklist Deletion" });


            return res.status(200).json({ status: "SUCCESS" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Error occurred while deleting the blacklist data" });
        }
    }




}
