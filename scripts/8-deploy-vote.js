import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: "startupDAO governance",
      voting_token_address: "0xC8E82aB8b6b6c7d68b0C1317014640eF42CB8c3f",
      // after a proposal is created, when can members start voting?
      voting_delay_in_blocks: 0, // members can start voting right away

      // how long do members have to vote on a proposal when it's created?
      voting_period_in_blocks: 6570, // 1 day = 6570 blocks

      // the min % of totalSupply that need to vote for the proposal to be valid
      // after the time proposal has ended
      voting_quorum_fraction: 0,

      // minimum # of tokens a user needs to be allowed to create a proposal
      proposal_token_threshold: 100, // 100 $SDT are needed to create a proposal
    });

    console.log(
      '✅ Successfully deployed vote contract, address:"',
      voteContractAddress
    );
  } catch (error) {
    console.error("Failed to deploy vote contract", error);
  }
})();
