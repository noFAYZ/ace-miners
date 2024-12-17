import {
  IconAuctionHammer,
  IconCart,
  IconChartDocument,
  IconDashboard,
  IconDocument,
  IconHeart,
  IconHelp,
  IconSearch,
  IconSettings,
  IconStar,
  Logo,
} from "@/components/Icon";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export const SideBar = () => {
  const router = useRouter();

  useEffect(() => {
    // console.log("router:", router.pathname);
  }, []);

  return (
    <>
      <Link href="/">
        <a className="block py-2 mb-16">
          {/* <Logo></Logo> */}
          <Image
            src="/images/logo-white.png"
            alt="Picture of the author"
            width={297}
            height={46}
          />
        </a>
      </Link>
      <ul className="space-y-6 font-500 font-title text-14">
        <li>
          <Link href="/">
            <a
              className={
                router.pathname == "/"
                  ? "text-primary flex items-center"
                  : "text-white flex items-center"
              }
            >
              <IconDashboard className="w-6 h-6 mr-4" />
              <span>Dashboard</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/claim-reward">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              {/* <IconCart className="w-6 h-6 mr-4" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={
                  router.pathname == "/claim-reward" ? "#5858ED" : "white"
                }
                className="w-6 h-6 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
              <span
                className={
                  router.pathname == "/claim-reward"
                    ? "text-primary flex items-center"
                    : "text-white flex items-center"
                }
              >
                Claim Reward
              </span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/myAce">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconSearch className="w-6 h-6 mr-4" />

              <span
                className={
                  router.pathname == "/claim-reward"
                    ? "text-primary flex items-center"
                    : "text-white flex items-center"
                }
              >
                My AceMiner
              </span>
            </a>
          </Link>
        </li>
        {/* <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconCart className="w-6 h-6 mr-4" />
              <span>Market</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconAuctionHammer className="w-6 h-6 mr-4" />
              <span>Active Bids</span> <span></span>
            </a>
          </Link>
        </li> */}
        {/* <li className="tracking-widest text-primary uppercase text-12 !mt-16">
          More
        </li>
        <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconStar className="w-6 h-6 mr-4" />
              <span>My portfolio</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconHeart className="w-6 h-6 mr-4 text-red" />
              <span>Favorites</span>
            </a>
          </Link>
        </li>
        <li className="tracking-widest text-primary uppercase text-12 !mt-16">
          Support
        </li>
        <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconChartDocument className="w-6 h-6 mr-4" />
              <span>Reports</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconDocument className="w-6 h-6 mr-4" />
              <span>Documentations</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconSettings className="w-6 h-6 mr-4" />
              <span>Settings</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a className="text-gray-100 flex items-center hover:text-primary-100">
              <IconHelp className="w-6 h-6 mr-4" />
              <span>Help</span>
            </a>
          </Link>
        </li> */}
      </ul>
    </>
  );
};
