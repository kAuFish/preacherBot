// require("dotenv").config();
// Require the necessary discord.js classes
// const { token } = process.env;
const token = process.env.TOKEN;
console.log("env = "  + process.env);
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const fs = require("fs");
const { ClientRequest } = require("http");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel],
});

// Setup client
client.commands = new Collection();
client.commandArray = [];


// Setup folder structure for commands
const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

console.log("token: " + token);

// start async processes
client.handleEvents();
client.handleCommands();

// Login to Discord with your client's token
client.login(token);
