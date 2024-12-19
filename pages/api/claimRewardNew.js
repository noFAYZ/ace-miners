import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

// Helper function to create database records
const createClaimRequests = async (drops, claimRequestId, isBoost = false) => {
    try {
        const records = drops.flatMap(drop =>
            drop.nfts.map(nft => ({
                id: nanoid(),
                claimRequestId,
                nftId: parseInt(nft.nftId),
                contractAddress: String(nft.nftContractAddress),
                isClaimed: true,
                requestStatus: "pending",
                holderEthAddress: String(drop.holderAddress),
                dropId: parseInt(nft.dropId),
                eachLTC: String(isBoost ? drop.drop_id.eachBoostLTC : drop.drop_id.eachLTC),
                ...((!isBoost) && {
                    eachKDA: String(drop.drop_id.eachKDA),
                    eachCKB: String(drop.drop_id.eachCKB)
                })
            }))
        )



        const model = isBoost ? prisma.claimRequestsBoost : prisma.claimRequests
        return await model.createMany({ data: records })
    } catch (error) {
        console.error(`Error creating ${isBoost ? 'boost' : 'regular'} claims:`, error)
        throw error
    }
}

// Helper function to check for duplicates
const checkDuplicates = async (drops, isBoost = false) => {
    try {
        const model = isBoost ? prisma.claimRequestsBoost : prisma.claimRequests
        const existingRecords = await model.findMany({
            select: {
                nftId: true,
                dropId: true,
                contractAddress: true
            }
        })

        // Create a Set of existing nftId-dropId-contractAddress combinations
        const existingCombos = new Set(
            existingRecords.map(record =>
                `${record.nftId}-${record.dropId}-${record.contractAddress}`
            )
        )

        // Check if any of the new records already exist
        return drops.some(drop =>
            drop.nfts.some(nft =>
                existingCombos.has(
                    `${nft.nftId}-${nft.dropId}-${nft.nftContractAddress}`
                )
            )
        )
    } catch (error) {
        console.error(`Error checking duplicates for ${isBoost ? 'boost' : 'regular'} claims:`, error)
        throw error
    }
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            status: "ERROR",
            message: "Method not allowed"
        })
    }

    try {
        const { nftsNotClaimed, nftsNotClaimedBoost } = req.body

        // Validate request data
        if (!nftsNotClaimed || !Array.isArray(nftsNotClaimed)) {
            return res.status(400).json({
                status: "ERROR",
                message: "Invalid request data format"
            })
        }

        // Generate a single claim request ID for both regular and boost claims
        const claimRequestId = nanoid()

        // Process regular and boost claims in parallel
        const [hasDuplicates, hasBoostDuplicates] = await Promise.all([
            nftsNotClaimed && checkDuplicates(nftsNotClaimed),
            nftsNotClaimedBoost && checkDuplicates(nftsNotClaimedBoost, true)
        ])


        if (hasDuplicates || hasBoostDuplicates) {
            return res.status(409).json({
                status: "ERROR",
                message: "Duplicate claims detected"
            })
        }

        // Process claims in parallel
        const results = await Promise.all([
            nftsNotClaimed && createClaimRequests(nftsNotClaimed, claimRequestId),
            nftsNotClaimedBoost && createClaimRequests(nftsNotClaimedBoost, claimRequestId, true)
        ])

        return res.status(200).json({
            status: "SUCCESS",
            message: "Claims processed successfully",
            data: {
                claimRequestId,
                regularClaims: results[0]?.count ?? 0,
                boostClaims: results[1]?.count ?? 0
            }
        })

    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({
            status: "ERROR",
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        await prisma.$disconnect()
    }
}