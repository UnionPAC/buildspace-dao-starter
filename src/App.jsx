import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";

const App = () => {
  const address = useAddress();
  const connectWithMetaMask = useMetamask();
  console.log("Address:", address);

  // Initialize our editionDrop contract
  const editionDrop = useEditionDrop(
    "0x7230089Cc3D6141a4F7C5231795bdD9613e636E6"
  );
  const token = useToken("0xC8E82aB8b6b6c7d68b0C1317014640eF42CB8c3f");

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  // shorten wallet address
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

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
