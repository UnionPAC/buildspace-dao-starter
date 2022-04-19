import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x7230089Cc3D6141a4F7C5231795bdD9613e636E6"
);

const token = sdk.getToken("0xC8E82aB8b6b6c7d68b0C1317014640eF42CB8c3f");

(async () => {
  try {
    // grab all the addresses of people who own our membership NFT, which has a tokenId of 0
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFT's have been claimed yet, get some people to claim your NFT's!"
      );
      process.exit(0);
    }

    

  } catch (error) {}
})();
