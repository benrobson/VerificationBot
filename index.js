const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client({
  disableEveryone: true
});
const fs = require('fs');
const chalk = require('chalk');
client.commands = new Discord.Collection();
require('./util/eventLoader.js')(client);

// Reads all commands and boots them in
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === 'js')
  if (jsfile.length <= 0) {
    console.log(chalk.red('Couldn\'t find commands.'));
    return
  }

  jsfile.forEach((files, i) => {
    let props = require(`./commands/${files}`);
    console.log(chalk.green('[Console] ') + chalk.yellow(files) + ` has been loaded.`);
    client.commands.set(props.help.name, props);
  })
});

// Message Guild Event
client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (!cmd.startsWith(prefix)) return;
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client, message, args);
});

client.login(process.env.BOT_TOKEN);

//const privatekey = require('./privatekey.json'); // Used for local development
//client.login(privatekey.token); // Used for local development
