import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop(
  "0x7230089Cc3D6141a4F7C5231795bdD9613e636E6"
);

(async () => {
  try {
    const claimConditions = [
      {
        startTime: new Date(),
        maxQuantity: 50_000,
        price: 0,
        quantityLimitPerTransaction: 1,
        waitInSeconds: MaxUint256,
      },
    ];
    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim conditions", error);
  }
})();
