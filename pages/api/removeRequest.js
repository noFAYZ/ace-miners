const { PrismaClient } = require('@prisma/client')
import { async } from '@firebase/util'
import { nanoid } from 'nanoid'


export default async function handler(req, res) {

    const prisma = new PrismaClient()


    const removeFromDb = async (item) => {
        if (item?.claimRequestId) {
            const removeData = await prisma.claimRequests.deleteMany({
                where: {
                    claimRequestId: item?.claimRequestId,
                },
            })
            console.log(removeData)


            return removeData
        }



    }


    if (req.method == "POST") {
        console.log("Remove Claim Request")

        try {
            const item = req.body
            console.log(item)

            console.log('\n')
            console.log("=============================================================================")
            console.log("======                     Remove Claim Request                      ========")
            console.log("=============================================================================")


            //Remove Data in DB
            try {

                const removeRequestData = await removeFromDb(item)

                return res.status(200).json({ status: "SUCCESS", removed: removeRequestData });
            } catch (error) {
                return res.status(500).json({ status: "FAILED" });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "FAILED Data" });
        }



    }



}
