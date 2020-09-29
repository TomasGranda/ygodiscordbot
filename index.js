import Discord from 'discord.js';
import { COMMAND_PREFIX } from './config/constants.js';
import { TOURNAMENT_COMMAND, handleTournamentCommand } from './commands/TournamentCommandHandler.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('Cannot read Mongo Uri');
  process.exit();
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith(COMMAND_PREFIX) && !msg.author.bot) {
    const command = msg.content.split(COMMAND_PREFIX)[1].split(" ")[0];

    switch (command) {
      case TOURNAMENT_COMMAND:
        handleTournamentCommand(msg);
        break;
    }

  }
});

client.login(process.env.BOT_TOKEN);