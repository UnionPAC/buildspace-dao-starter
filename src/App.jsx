import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
  useVote,
  useNetwork,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetaMask = useMetamask();
  console.log("Address:", address);

  // Initialize our editionDrop contract
  const editionDrop = useEditionDrop(
    "0x7230089Cc3D6141a4F7C5231795bdD9613e636E6"
  );
  const vote = useVote("0xc77b915818f0b91AA9360030947755bFfCA7c7cB");
  const token = useToken("0x988460dE836fBa285B23d60b515a557135078d48");

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  // shorten wallet address
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // retrieve all proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // call to vote.getAll() to grab the proposals
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
      } catch (error) {
        console.log("Failed to get proposals", error);
      }
    };

    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // check if the user has already voted
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.log("Failed to check if wallet addy has voted", error);
      }
    };

    checkIfUserHasVoted();
  }, [address, hasClaimedNFT, proposals, vote]);

  // grab all the addresses of our members holding startupDAO NFT v1
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // grab the users who hold our NFT w/ tokenId 0
    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [editionDrop.history, hasClaimedNFT]);

  // grab the # of token each member holds
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("Couldn't get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  // Combine member addresses and member token amounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // check if we are finding the address in the memberTokenAmounts array
      // if so, return that token amount to user
      // if not, return zero
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // if they don't have a connected account --> return
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("You have a startupDAO membership!");
        } else {
          setHasClaimedNFT(false);
          console.log(
            "You don't have a membership yet, go ahead and mint one!"
          );
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get address NFT balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  // mint startupDAO membership NFT
  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(
        `Minted startupDAO NFT membership! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0 `
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (address) {
    if (network?.[0].data.chain.id !== ChainId.Rinkeby) {
      return (
        <div className="unsupported-network">
          <h2>Please connect to Rinkeby</h2>
          <p>
            This dapp only works on the Rinkeby network, please switch networks
            in your connected wallet.
          </p>
        </div>
      );
    }
  }

  // if user hasn't connected their wallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to startupDAO</h1>
        <button onClick={connectWithMetaMask} className="btn-hero">
          Connect Wallet
        </button>
      </div>
    );
  }

  // if user has membershipNFT
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>startupDAO Dashboard</h1>
        <h2>✨ Member Page Only ✨</h2>
        <p>
          Congrats on being a member in the fastest growing entrepreneurial DAO
          🔥
        </p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // disable the button to prevent double clicks
                setIsVoting(true);

                // get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposals.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposals.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );
                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                  ? "You Already Voted"
                  : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Mint a free startupDAO membership NFT!</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
};

export default App;
