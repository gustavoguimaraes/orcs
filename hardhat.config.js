require("dotenv").config();``
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");


module.exports = {
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    fork: {
      url: 'http://127.0.0.1:8545/',
      accounts: [process.env.PK],
      timeout: 200000000,
      gas: "auto",
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PK],
      timeout: 200000000,
      gasPrice: Number('93' + '000000000')
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PK],
      timeout: 200000000,
      gas: "auto",
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PK],
      timeout: 200000000,
      gas: "auto",
    },
  }
};
