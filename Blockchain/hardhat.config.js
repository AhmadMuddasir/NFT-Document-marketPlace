require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;
const RPC_URL = process.env.SEPOLIA_RPC_URL
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337,
      // Optional: Enable mining interval for better local testing
      // mining: {
      //   auto: true,
      //   interval: 5000
      // }
    },
    sepolia: {
      url: RPC_URL,
      accounts: [privateKey],
      chainId: 11155111,
    }
  }
};
