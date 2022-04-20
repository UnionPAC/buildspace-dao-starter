import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x988460dE836fBa285B23d60b515a557135078d48");

(async () => {
  try {
    const amountOfTokens = 1000000;
    await token.mint(amountOfTokens);
    const totalSupply = await token.totalSupply();
    
  } catch (error) {
      console.error("Failed to mint tokens", error);
  }
})();
