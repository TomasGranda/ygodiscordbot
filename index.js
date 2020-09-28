const Discord = require('discord.js');
const { commandPrefix, tournamentCommand } = require('./config/constants');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith(commandPrefix)) {
    const command = msg.split(commandPrefix)[0];


    if(command.startsWith(tournamentCommand)){
      const tournamentParams = command.split(tournamentCommand)[0].split(" ");

      
    }
    
  }
});

client.login('NzU5ODk4ODQzMTI2MTY5NjMw.X3EM8g.zxkxLqbyF1R6ub335TYSNby6hls');