import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xC8E82aB8b6b6c7d68b0C1317014640eF42CB8c3f");

(async () => {
  try {
    const amountOfTokens = 1000000;
    await token.mint(amountOfTokens);
    const totalSupply = await token.totalSupply();

    console.log(
      "There are now",
      totalSupply.displayValue,
      "SDT in circulation"
    );
  } catch (error) {
      console.error("Failed to mint tokens", error);
  }
})();
