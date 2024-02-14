const ethers = require("ethers");

const dripBuds = async (contract, userAddress) => {
  const tx = await contract.transfer(userAddress, ethers.parseEther("6969"));
};

module.exports = dripBuds;
