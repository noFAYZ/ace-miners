const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {

    const prisma = new PrismaClient()
    const { address } = req.query;

    if (req.method === "GET") {
        console.log("Get User Wallets")

        try {


            const user = await prisma.userData.findUnique({
                where: { ethAddress: address },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);


        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }


}
