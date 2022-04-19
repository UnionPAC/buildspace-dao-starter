import { useAddress, useMetamask, useEditionDrop, useToken } from "@thirdweb-dev/react";
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
        <p>Congrats on being a member in the fastest growing entrepreneurial DAO 🔥</p>
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
