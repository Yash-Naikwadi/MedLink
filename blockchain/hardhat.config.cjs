require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: process.env.GANACHE_URL,          // Ganache RPC URL
      accounts: [process.env.FUNDER_PRIVATE_KEY], // Your funder private key
    },
  },
};
