const { PrismaClient } = require('@prisma/client')


export default async function handler(req, res) {

    const prisma = new PrismaClient()


    if (req.method == "GET") {

        const miningData = await prisma.miningData.findMany()

        console.log(miningData)
        return res.status(200).send(miningData);
    }

    if (req.method == "POST") {

        const body = JSON.parse(req.body);

        const addMiningStats = await prisma.miningData.create({
            data: {
                LTC: String(body.ltc),
                CKB: String(body.ckb),
                KDA: String(body.kda)
            }
        })

        console.log(addMiningStats)


        return res.status(200).send(body);
    }




}
