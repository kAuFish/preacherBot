require("dotenv").config();
// Require the necessary discord.js classes
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { ClientRequest } = require("http");
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Setup client
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

// start async processes
client.handleEvents();
client.handleCommands();

// Login to Discord with your client's token
client.login(token);

//respond to messages
client.on("message", function (messages) {
  if (messages.content.toLocaleLowerCase() === "preacher")
    console.log(
      "```" + "what's good bitch" + "```" + " " + messages.author.username
    );
  messages.channel.send(
    "```" + "what's good bitch" + "```" + " " + messages.author.username
  );
});

client.on("message", function (messages) {
  if (messages.content.toLocaleLowerCase() === "hello")
    messages.channel.send("hello" + " " + messages.author.username);
});
