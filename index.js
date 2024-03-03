const {Client, Collection, Events, GatewayIntentBits} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("node:fs");
const path = require("node:path");
const Sequelize = require("sequelize");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

const Claims = sequelize.define("claims", {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  lastClaim: Sequelize.TIME,
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  Claims.sync();
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (messgae) => {
  if (messgae.author.bot) return;
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.user.bot) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    const userName = interaction.user.username;
    const claim = await Claims.findOne({where: {username: userName}});

    if (claim) {
      const lastClaim = new Date(claim.lastClaim).getTime();
      const elapsedTime = Date.now() - lastClaim;

      if (elapsedTime >= 12 * 60 * 60 * 1000) {
        // 12 hours in milliseconds
        await Claims.update(
          {lastClaim: new Date()},
          {where: {username: userName}}
        );
      } else {
        const remainingTime = 12 * 60 * 60 * 1000 - elapsedTime;
        await interaction.reply({
          content: `You can claim after ${Math.ceil(
            remainingTime / (60 * 60 * 1000)
          )} hours.`,
          ephemeral: true,
        });
        return;
      }
    } else {
      await Claims.create({
        username: userName,
        lastClaim: new Date(),
      });
    }

    // Execute the command after checking claim status
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.BOT_TOKEN);
