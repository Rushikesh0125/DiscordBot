const { SlashCommandBuilder } = require("discord.js");
const dripBuds = require("../../utils/Drip.js");
const ethers = require("ethers");
const getProviderURL = require("../../utils/getProviderURL.js");
const preCheckDrip = require("../../utils/PreCheckDrip.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drip")
    .setDescription("Drips 6969 Buds to address")
    .addStringOption((option) =>
      option
        .setName("address")
        .setDescription("address where you want your buds")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("network")
        .setDescription("Network where you want buds. eg.mumbai")
        .addChoices(
          { name: "Polygon Mumbai", value: "mumbai" },
          { name: "Ethereum sepolia", value: "sepolia" },
          { name: "Avalanche Fuji", value: "fuji" },
          { name: "Binance smart chain", value: "bscTestnet" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const userAddress = interaction.options.getString("address");
    const chain = interaction.options.getString("network");
    if (
      userAddress == "0x000000000000000000000000000000000000000" ||
      userAddress == "0x000000000000000000000000000000000000dEaD"
    ) {
      await interaction.reply("Can't drip at burn address");
    }
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",

      "function transfer(address to, uint amount) returns (bool)",

      "event Transfer(address indexed from, address indexed to, uint amount)",
    ];
    const provider = new ethers.JsonRpcProvider(await getProviderURL(chain));
    const signer = new ethers.Wallet(process.env.PK, provider);
    const budsAddress = "0x4E6708Ba3Effdb8bB5aE2852EE446feB1f2eEaac";
    const contract = new ethers.Contract(budsAddress, abi, signer);
    const canClaim = await preCheckDrip(contract, userAddress, provider);
    if (canClaim != 0) {
      await interaction.reply(
        `You can't claim it now, try again after ${canClaim} hours`
      );
    }
    await interaction.deferReply({
      content: `6969 Buds will be dripped at ${userAddress}... `,
      ephemeral: true,
    });
    await dripBuds(contract, userAddress);
    await interaction.followUp({
      content: `6969 Buds dripped at ${userAddress}`,
      ephemeral: true,
    });
  },
};
