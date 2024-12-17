import {
    IconCKB,
    IconKDA,
    IconLTC
} from "@/components/Icon";
import { aceMinerContracts } from "@/constant/consonants";
import {

    useQuery
} from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from 'react';



function ClaimableTokens(props) {

    const [totalRewards, settotalRewards] = useState({
        totalCKB: 0,
        totalKDA: 0,
        totalLTC: 0
    })

    const [isLoading, setisLoading] = useState(true)


    const calculateRewards = () => {
        setisLoading(true)
        let rewards = {
            totalKDA: 0.00,
            totalCKB: 0.00,
            totalLTC: 0.00
        }

        props.nftsNotClaimed.forEach((drop) => {
            rewards = {
                totalKDA: rewards.totalKDA += (parseFloat(drop.drop_id.eachKDA) * drop.nfts?.length),
                totalCKB: rewards.totalCKB += (parseFloat(drop.drop_id.eachCKB) * drop.nfts?.length),
                totalLTC: rewards.totalLTC += (parseFloat(drop.drop_id.eachLTC) * drop.nfts?.length)
            }

        })


        settotalRewards(rewards)
        setisLoading(false)

    }

    useEffect(() => {
        if (props?.nftsNotClaimed?.length > 0) {
            calculateRewards();
        }

    }, [props.nftsNotClaimed])

    if (isLoading) {
        return <>Loading...</>
    }



    return (props.address && totalRewards ?
        <>


            <div className="flex flex-wrap gap-1 justify-center bg-gray-400 border px-2 rounded-full">
                <div className=" flex my-3 pl-3 pr-1 ">Available to Claim</div>
                <div className="flex flex-wrap gap-1">

                    <span className=" my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                        <span className="bg-primary rounded-full px-2">{totalRewards.totalLTC.toFixed(3)} </span> <IconLTC width={20} />
                    </span>

                    <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                        <span className="bg-primary rounded-full px-2">{totalRewards.totalKDA.toFixed(3)} </span><IconKDA width={14} />
                    </span>
                    <span className="my-3 pr-1 flex gap-1 bg-gray-200 text-white font-300 rounded-full">
                        <span className="bg-primary rounded-full px-2">{totalRewards.totalCKB.toFixed(3)} </span> <IconCKB width={18} />
                    </span></div>

            </div></> : <></>
    )
}

export default ClaimableTokens