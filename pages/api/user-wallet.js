const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {

    const prisma = new PrismaClient()


    if (req.method === "POST") {
        console.log("Attach Wallet")
        const body = req.body;

        try {

            if (body.ltcWallet && body.kdaWallet == null) {
                const user = await prisma.userData.upsert({
                    where: { ethAddress: body.ethAddress },
                    update: { ltcWallet: body.ltcWallet },
                    create: body,
                })
                return res.status(200).json({ status: "SUCCESS LTC" });
            }
            else if (body.kdaWallet && body.ltcWallet == null) {
                const user = await prisma.userData.upsert({
                    where: { ethAddress: body.ethAddress },
                    update: { kdaWallet: body.kdaWallet },
                    create: body,
                })
                return res.status(200).json({ status: "SUCCESS KDA" });
            }

            else if (body.kdaWallet == null && body.ltcWallet == null && body.ckbWallet) {
                const user = await prisma.userData.upsert({
                    where: { ethAddress: body.ethAddress },
                    update: { ckbWallet: body.ckbWallet },
                    create: body,
                })
                return res.status(200).json({ status: "SUCCESS KDA" });
            }

            return res.status(200).json({ status: "SUCCESS" });

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }



}
