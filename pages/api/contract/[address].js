const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {
const prisma = new PrismaClient();
    
    const { address } = req.query;

    if (req.method === "GET") {
        console.log("Get Contract Data", address)

        try {
            const contractData = await prisma.claimRequests.findMany({
                where:{
                    contractAddress : String(address)?.toLowerCase()
                }
            });

            console.log(contractData.length)

            if (!contractData) {
                return res.status(404).json({ error: 'Data not found' });
            }

            return res.status(200).json(contractData);


        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }


}
