const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {

    const prisma = new PrismaClient()

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { address } = req.query;

    if (!address) {
        try {
            const claimData = await prisma.claimRequestStatus.findMany()

            return res.status(200).json(claimData);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Failed to fetch prev transaction data" });
        }
    }

    if (req.method == "GET") {
        console.log("Get Claim Data")

        try {
            const claimData = await prisma.claimRequestStatus.findMany({
                where: {
                    holderEthAddress: address,
                }
            })

            return res.status(200).json(claimData);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Failed to fetch prev transaction data" });
        }


    }





}
