import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

const vote = sdk.getVote("0xc77b915818f0b91AA9360030947755bFfCA7c7cB");
const token = sdk.getToken("0x988460dE836fBa285B23d60b515a557135078d48");

(async () => {
  try {
    // Create proposal to mint 300,000 new $SDT to the treasury
    const amount = 300000;
    const description =
      "Should the DAO mint an additional " +
      amount +
      " tokens into the treasury?";
    const executions = [
      {
        toAddress: process.env.WALLET_ADDRESS,
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);
    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    // create a proposal to transfer ourselves 5,500 tokens for being awesome
    const amount = 5500;
    const description =
      "Should the DAO send " +
      amount +
      " tokens to" +
      process.env.WALLET_ADDRESS +
      "for being awesome? 🔥";
    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("transfer", [
          process.env.WALLET_ADDRESS,
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);
    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury"
    );
  } catch (error) {
    console.error("failed to create proposal to reward ourselves", error);
  }
})();
