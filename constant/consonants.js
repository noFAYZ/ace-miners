// import ABI_ACEMINERS1 from "./ABI_ACEMINERS1.json";
// import ABI_ACEMINERS2 from "./ABI_ACEMINERS1.json";

import { Network } from "alchemy-sdk";


/*
export const contrAceMinersPhase1 =
  "0x0770a317AF574fBa15F205A60bCA9075206ad0a8";
export const contrAceMinersPhase2 =
  "0xe635Bd48F69276D6f52cc2e577E5DdecCf16B79c";
*/

export const contrAceMinersPhase1 =
  "0xba72b008D53D3E65f6641e1D63376Be2F9C1aD05";
export const contrAceMinersPhase2 =
  "0xe635Bd48F69276D6f52cc2e577E5DdecCf16B79c";
export const contrAceMinersBoost =
  "0xDe20F7d79de049341610780758c65fFDc178C309";



export const aceMinerContracts = [contrAceMinersPhase1, contrAceMinersPhase2, contrAceMinersBoost];

export const contrWETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

export const appTitle = "Ace Miners";

//export const alchemyKey = "ER4NcPuR-qH_GEpB4Yi_vh5ui5Z6D470";

export const alchemyKey = "LGfX5FFw6v-8BoZwirt57HiQiUdviu0X";

export const cryptoKey = "AceMinerNov2022";

export const chainURL = "https://eth-mainnet.g.alchemy.com/v2/LGfX5FFw6v-8BoZwirt57HiQiUdviu0X";

//export const chainURL = "https://polygon-mumbai.g.alchemy.com/v2/ER4NcPuR-qH_GEpB4Yi_vh5ui5Z6D470";

/*
export const alchemySettings = {
  apiKey: alchemyKey,
  network: Network.MATIC_MUMBAI,
};

*/

export const alchemySettings = {
  apiKey: alchemyKey,
  network: Network.ETH_MAINNET,
};
