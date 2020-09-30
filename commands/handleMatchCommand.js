import { COMMAND_PREFIX, FINISHED_STATUS, JOIN_PHASE_STATUS, STARTED_STATUS, PAUSED_STATUS } from "../config/constants.js";
import addParams from "../utils/addParams.js";
import { Tournament } from "../models/Tournament.js";
import { getFlags } from "../utils/getFlags.js";
import { flagExists } from "../utils/flagExists.js";
import { getRoundsNumber } from "../utils/getRoundsNumber.js";
import Discord from "discord.js";
import { getMatchMaking } from '../tournamentLogic/getMatchMaking.js'
import { getActiveTournament } from "../tournamentLogic/getActiveTournament.js";
import { TOURNAMENT_NOT_FOUND } from "./handleTournamentCommand.js";

export const TOURNAMENT_COMMAND = "match";

// Flags

// Methods
const NORMAL_WIN_COMMAND = "win";
const PERFECT_WIN_COMMAND = "pwin";

const MAX_PARAMS = 1;

// Messages
const TOURNAME2NT_FINISHED_SETTED = "The tournament has been finished.";

export const handleMatchCommand = (msg) => {
    let messageText = msg.content;
    const flags = getFlags(messageText);
    flags.forEach((f) => messageText = messageText.replace(f, ""));

    const regexp = new RegExp(`${COMMAND_PREFIX}${TOURNAMENT_COMMAND} ${addParams(MAX_PARAMS)}`, "ig");
    const words = Object.values(regexp.exec(messageText).groups).filter((p) => !!p);

    // const params = words.slice(1);

    const commandMapper = () => {
        switch (words[0]) {
            case NORMAL_WIN_COMMAND:
                normalWinCheck();
                break;
            case PERFECT_WIN_COMMAND:
                perfectWinCheck();
                break;
        }
    }

    const normalWinCheck = () => {
        const activeTournament = getActiveTournament(msg.guild.id);

        if (activeTournament) {
            const MatchResult = new Discord.MessageEmbed()
                .setTitle();

        } else {
            msg.reply(TOURNAMENT_NOT_FOUND);
        }
    }

    // Always at the end
    commandMapper();
}