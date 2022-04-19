import { useAddress, useMetamask} from "@thirdweb-dev/react";

const App = () => {
  const address = useAddress();
  const connectWithMetaMask = useMetamask();
  console.log("Address:", address);


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

  return (
    <div className="landing">
      <h1>Wallet Connected!</h1>
    </div>
  );
};

export default App;
