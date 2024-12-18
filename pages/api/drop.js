const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {

    const prisma = new PrismaClient()


    if (req.method === "POST") {
        console.log("Attach Wallet")
        const body = req.body;

        try {

            if (!body.dropId) {
                return res.status(500).json({ status: "No Drop Id Provided" });
            }


            const user = await prisma.dropData.upsert({
                where: { dropId: parseInt(body.dropId) },
                update: body,
                create: body,
            })

            console.log("Drop iD:", body.dropId);
            return res.status(200).json({ status: "SUCCESS Adding Drop Data" });


        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }

    else if (req.method == "GET") {
        console.log("Get Drop Data")

        try {
            const drops = await prisma.dropData.findMany()


            return res.status(200).json(drops);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }

    else if (req.method == "DELETE") {
        const body = req.body;

        console.log(body)

        try {
            const drops = await prisma.dropData.delete({
                where: { dropId: parseInt(body.dropId) },
            })


            return res.status(200).json(drops);

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "OK" });
        }


    }



}
