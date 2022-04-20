import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x7230089Cc3D6141a4F7C5231795bdD9613e636E6"
);

const token = sdk.getToken("0x988460dE836fBa285B23d60b515a557135078d48");

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

    const airdropTargets = walletAddresses.map((address) => {
      // pick random num between 1,000 and 10,000
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("✈️ Going to airdrop", randomAmount, "tokens to", address);

      // set up the target
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    console.log("🌈 Starting airdrop...");
    // call transferBatch on all our airdrop targets
    await token.transferBatch(airdropTargets);
    console.log(
      "✅ Successfully airdropped tokens to all the holders of the NFT!"
    );
  } catch (error) {
    console.error("Couldn't airdrop tokens", error);
  }
})();
