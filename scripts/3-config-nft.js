import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop(
  "0x7230089Cc3D6141a4F7C5231795bdD9613e636E6"
);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "startupDAO membership v1",
        description: "This NFT will give you access to startupDAO",
        image: readFileSync("scripts/assets/lego.png"),
      },
    ]);
  } catch (error) {
      console.error('failed to create the new NFT:', error);
  }
})();
