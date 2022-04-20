import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0xc77b915818f0b91AA9360030947755bFfCA7c7cB");
const token = sdk.getToken("0x988460dE836fBa285B23d60b515a557135078d48");

(async () => {
  try {
    // give our treasury the power to mint additional token if needed
    await token.roles.grant("minter", vote.getAddress());
    console.log(
      "Successfully gave startupDAO governance permission to act on token contract"
    );
  } catch (error) {
    console.error(
      "Failed to grant startupDAO governance permission on token contract"
    );
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

    // grab 90% of the supply that we hold
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = (Number(ownedAmount) / 100) * 90;

    // transfer the 90% to our voting contract
    await token.transfer(vote.getAddress(), percent90);
    console.log(
      "✅ Successfully transferred " +
        percent90 +
        " tokens to startupDAO governance"
    );
  } catch (error) {
    console.error("Failed to transfer tokens to vote contract", error);
  }
})();
