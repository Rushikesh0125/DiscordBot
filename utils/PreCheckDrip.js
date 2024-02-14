const ethers = require("ethers");

const preCheckDrip = async (contract, userAddress, provider) => {
  const currentBlock = await provider.getBlockNumber();

  const filter = await contract.filters.Transfer(
    "0x591f2a0C92E3498bd3fF6c4362A6C8a23c39C4dE",
    userAddress
  );
  let data = [];

  data = await contract.queryFilter(filter, currentBlock - 9950, currentBlock);

  // if (
  //   data.length != 0 &&
  //   currentBlock - data[data.length - 1].blockNumber < 43200
  // ) {
  //   return (currentBlock - data[data.length - 1].blockNumber) / 3600;
  // }
  return 0;
};

module.exports = preCheckDrip;
