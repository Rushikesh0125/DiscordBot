const ethers = require("ethers");

const preCheckDrip = async (contract, userAddress, provider, chain) => {
  const currentBlock = await provider.getBlockNumber();
  const blocktime =
    chain == "sepolia"
      ? 12
      : chain == "mumbai"
      ? 2.1
      : chain == "bscTestnet"
      ? 3
      : chain == "arbSepolia"
      ? 2
      : 2.5;

  const startBlock = currentBlock - (24 * 60 * 60) / blocktime;

  return 0;
};

module.exports = preCheckDrip;
