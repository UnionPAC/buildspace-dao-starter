import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

// check for private key
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("🛑 Private key not found.");
}

// check for Infura API URL
if (!process.env.INFURA_API_URL || process.env.INFURA_API_URL == "") {
  console.log("🛑 Infura API URL not found.");
}

// check for wallet address
if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(process.env.INFURA_API_URL)
  )
);

(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log('👋 SDK initialized by address:', address);
    } catch (error) {
        console.error('Failed to get apps from the sdk', error);
        process.exit(1);
    }
})();

export default sdk;