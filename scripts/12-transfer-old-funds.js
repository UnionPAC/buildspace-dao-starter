import sdk from "./1-initialize-sdk.js";

const oldGovernanceContract = "0xcdC8343b9DD5CAe4a337FA27775790975Ad4BB15";
const newGovernanceContract = "0x1cdb9922FfD6B551bCB8c618129e3eB1402F45C1";
const vote = sdk.getVote(newGovernanceContract);
const token = sdk.getToken("0xC8E82aB8b6b6c7d68b0C1317014640eF42CB8c3f");

(async () => {
  try {
    // amount in old governance contract
    const ownedTokenBalance = await token.balanceOf(oldGovernanceContract);
    const ownedAmount = ownedTokenBalance.displayValue;
    console.log(ownedAmount);

    // set allowance of old contract to give permission to send ownedAmount (all)
    token.setAllowance(oldGovernanceContract, ownedAmount);

    // transfer amount of old governance contract from oldGovernanceContract to newGovernanceContract
    await token.transferFrom(
      oldGovernanceContract,
      newGovernanceContract,
      ownedAmount
    );

    // check the balance of the newGovernanceContract
    const newVoteTokenBalance = await token.balanceOf(newGovernanceContract);
    const newVoteAmount = newVoteTokenBalance.displayValue;
    console.log(newVoteAmount);

    console.log(
      "Successfully transfered " + ownedAmount + " to new governance contract!"
    );
  } catch (error) {
    console.error("Failed to transfer tokens to vote contract", error);
  }
})();
