const dotenv = require("dotenv");
dotenv.config();

const getProviderURL = async (networkName) => {
  switch (networkName) {
    case "mainnet":
      return process.env.MAINNET;
    case "polygon":
      return process.env.POLYGON;
    case "mumbai":
      return process.env.MUMBAI_URL;
    case "bsc":
      return process.env.BSC;
    case "bscTestnet":
      return process.env.BSCTESTNET_URL;
    case "avalanche":
      return process.env.AVALANCH;
    case "fuji":
      return process.env.FUJI_URL;
    case "arbitrum":
      return process.env.ARBITRUM;
    case "arb":
      return process.env.ARBSEPOLIA_URL2;
    case "arbSepolia":
      return process.env.ARBSEPOLIA_URL;
    case "sepolia":
      return process.env.SEPOLIA_URL;
  }
};

module.exports = getProviderURL;
