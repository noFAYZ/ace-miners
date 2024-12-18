import { Search } from "@/components/Form";
import {
  IconMenu,
  IconSocialDiscord,
  IconSun,
  IconWallet,
  Logo,
  LogoIcon,
} from "@/components/Icon";
import { Avatar } from "@/components/ui";
import { MenuContext } from "@/context/menuContext";
import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import React, { useContext } from "react";

export const TopBar = () => {
  const { setShowMenu } = useContext(MenuContext);
  return (
    <div className="flex items-center">
      <button className="lg:hidden mr-6" onClick={() => setShowMenu(true)}>
        <IconMenu className="w-6"></IconMenu>
      </button>
      <Link href="/">
        <a className="lg:hidden mr-6">
          <LogoIcon></LogoIcon>
        </a>
      </Link>
      <div className="max-md:hidden">
        {/* <Search placeholder="Search here..."></Search> */}
      </div>
      <ul className="flex gap-x-4 justify-end items-center ml-auto">
        {/* <li className="flex-shrink-0">
          <button className="input w-10 h-10 sm:w-12 sm:h-12 grid place-content-center rounded-lg">
            <IconSun className="w-6 h-6"></IconSun>
          </button>
        </li>
        <li className="flex-shrink-0">
          <button className="input w-10 h-10 sm:w-12 sm:h-12 grid place-content-center rounded-lg">
            <IconWallet className="w-6 h-6"></IconWallet>
          </button>
        </li> */}
        <li className="flex-shrink-0">
          <button className="input w-10 h-10 sm:w-12 sm:h-12 grid place-content-center rounded-lg">
            <a href="https://discord.gg/aceminersnft">
              {" "}
              <IconSocialDiscord className="w-6 h-6"></IconSocialDiscord>
            </a>
          </button>
        </li>
        <li className="flex-shrink-0">
          {/* <button className="block">
            <Avatar
              className="w-12 h-12 sm:w-14 sm:h-14"
              verified
              src="/images/user-avatar.png"
            ></Avatar>
            
          </button> */}
          <ConnectWallet />
        </li>
      </ul>
    </div>
  );
};
