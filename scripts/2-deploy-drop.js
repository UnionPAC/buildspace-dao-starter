import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    // check for wallet address
    if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
      console.log("🛑 Wallet Address not found.");
    }
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "startupDAO",
      description:
        "A community of entrepreneurs helping each other grow and build a better future! 🌈",
      image: readFileSync("scripts/assets/lego.png"),
      primary_sale_recipient: process.env.WALLET_ADDRESS,
    });

    const editionDrop = sdk.getEditionDrop(editionDropAddress);
    const metadata = await editionDrop.metadata.get();

    console.log(
      "✅ Successfully deployed editionDrop contract, address:",
      editionDropAddress
    );
    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("Failed to deploy editionDrop contract", error);
  }
})();
