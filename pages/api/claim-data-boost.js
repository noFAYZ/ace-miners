const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {

    const prisma = new PrismaClient()




    if (req.method == "GET") {
        console.log("Get Boost Claim Data")

        try {
            const claimData = await prisma.claimRequestsBoost.findMany()

            return res.status(200).json(claimData);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Error getting ClaimData" });
        }


    }




}
