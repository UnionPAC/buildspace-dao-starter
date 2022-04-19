import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const tokenAddress = await sdk.deployer.deployToken({
      name: "startupDAO Token",
      symbol: "SDT",
      primary_sale_recipient: AddressZero,
    });
    console.log('Successfully deployed token module, address:', tokenAddress);
  } catch (error) {
      console.error('Failed to deploy token module', error);
  }
})();
