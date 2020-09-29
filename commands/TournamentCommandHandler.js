import { COMMAND_PREFIX, FINISHED_STATUS, JOIN_PHASE_STATUS, STARTED_STATUS, PAUSED_STATUS } from "../config/constants.js";
import addParams from "../utils/addParams.js";
import { Tournament } from "../models/Tournament.js";
import { getFlags } from "../utils/getFlags.js";
import { flagExists } from "../utils/flagExists.js";
import { getRoundsNumber } from "../utils/getRoundsNumber.js";
import Discord from "discord.js";

export const TOURNAMENT_COMMAND = "tr";

// Flags

// Methods
const NEW_TOURNAMENT_COMMAND = "new";
const JOIN_TOURNAMENT_COMMAND = "join";
const PAUSE_TOURNAMENT_COMMAND = "pause";
const START_TOURNAMENT_COMMAND = "start";
const FINISH_TOURNAMENT_COMMAND = "finish";
const INFO_TOURNAMENT_COMMAND = "info";

const MAX_PARAMS = 3;

// Messages
const TOURNAMENT_FINISHED_SETTED = "The tournament has been finished.";
const TOURNAMENT_PAUSED = "The tournament is currently paused... Contact to some Admin to start the join phase.";
const TOURNAMENT_ALREADY_PAUSED = "The tournament is already paused.";
const TOURNAMENT_PAUSE_SETTED = "The tournament has been paused.";
const TOURNAMENT_STARTED = "The tournament is currently started... Contact to some Admin to start a new one when this has been finished.";
const TOURNAMENT_ALREADY_STARTED = "The tournament is already started.";
const TOURNAMENT_STARTED_SETTED = "The tournament has been started.";
const TOURNAMENT_CANNOT_START_NOT_ENOUGH_COMPETITORS = "Can't start Tournament, Not Enough Competitors.";
const TOURNAMENT_NOT_FOUND = "There is no tournament currently in this server... Contact to some Admin to start a new one.";
const TOURNAMENT_JOINED = (tournamentName) => `You have joined to ${tournamentName}, Congrats.`
const TOURNAMENT_ALREADY_JOINED = (tournamentName) => `You are already joined on ${tournamentName}.`
const TOURNAMENT_CREATED = (tournamentName, status) => `${tournamentName} Tournament has been created in ${status} status.`;
const TOURNAMENT_NOT_CREATED = (tournamentName) => `${tournamentName} Tournament hasn't been created due to an Error.`;
const TOURNAMENT_SERVER_CONFLICT = "There is already a non finished tournament.";

export const handleTournamentCommand = (msg) => {
    let messageText = msg.content;
    const flags = getFlags(messageText);
    flags.forEach((f) => messageText = messageText.replace(f, ""));

    const regexp = new RegExp(`${COMMAND_PREFIX}${TOURNAMENT_COMMAND} ${addParams(MAX_PARAMS)}`, "ig");
    const words = Object.values(regexp.exec(messageText).groups).filter((p) => !!p);

    const params = words.slice(1);

    const commandMapper = () => {
        switch (words[0]) {
            case NEW_TOURNAMENT_COMMAND:
                createNewTournament();
                break;
            case JOIN_TOURNAMENT_COMMAND:
                joinTournament();
                break;
            case PAUSE_TOURNAMENT_COMMAND:
                pauseTournament();
                break;
            case START_TOURNAMENT_COMMAND:
                startTournament();
                break;
            case FINISH_TOURNAMENT_COMMAND:
                finishTournament();
                break;
            case INFO_TOURNAMENT_COMMAND:
                getInfo();
                break;
        }
    }

    const getActiveTournament = async () => {
        const tournaments = await getTournaments();
        const activeTournament = tournaments.find((t) => t.status != FINISHED_STATUS);
        return activeTournament;
    }

    const getTournaments = async () => {
        const tournaments = await Tournament.find((_, t) => t.discordServerId == msg.guild.id);
        return tournaments;
    }

    const getInfo = async () => {
        const activeTournament = await getActiveTournament();

        if (activeTournament) {
            let Embed = new Discord.MessageEmbed()
                .setTitle(activeTournament.name + " Tournament")
                .addField("Current Round", activeTournament.currentRound ? activeTournament.currentRound : "Tournament not started")
                .addField("Competitors", activeTournament.competitors.length > 0 ? activeTournament.competitors.map(c => c.username).join("\n") : "N/A")
                .addField("Status", activeTournament.status);
            if(activeTournament.status != STARTED_STATUS){
                Embed.addField("Custom Round Number", activeTournament.customRoundsNumber ? "Yes" : "No")
            }
            if(activeTournament.customRoundsNumber || activeTournament.status == STARTED_STATUS){
                Embed.addField("Rounds", activeTournament.rounds);
            }
            msg.channel.send(Embed);
        } else {
            msg.reply(TOURNAMENT_NOT_FOUND);
        }
    }

    const finishTournament = async () => {
        const activeTournament = await getActiveTournament();

        if (activeTournament) {
            await activeTournament.remove();
            msg.reply(TOURNAMENT_FINISHED_SETTED);
        } else {
            msg.reply(TOURNAMENT_NOT_FOUND);
        }
    }

    const startTournament = async () => {
        const activeTournament = await getActiveTournament();

        if (activeTournament) {
            if (activeTournament.status == STARTED_STATUS) {
                msg.reply(TOURNAMENT_ALREADY_STARTED);
                return;
            }

            if(activeTournament.competitors.length <= 1){
                msg.reply(TOURNAMENT_CANNOT_START_NOT_ENOUGH_COMPETITORS);
                return;
            }

            if(activeTournament.currentRound == 0) {
                activeTournament.currentRound = 1;
            }

            activeTournament.status = STARTED_STATUS;

            if (!activeTournament.customRoundsNumber) {
                activeTournament.rounds = getRoundsNumber(activeTournament.competitors.length);
            }

            await activeTournament.validate();
            await activeTournament.save();
            msg.reply(TOURNAMENT_STARTED_SETTED);
        } else {
            msg.reply(TOURNAMENT_NOT_FOUND);
        }
    }

    const pauseTournament = async () => {
        const activeTournament = await getActiveTournament();

        if (activeTournament) {
            if (activeTournament.status == PAUSED_STATUS) {
                msg.reply(TOURNAMENT_ALREADY_PAUSED);
                return;
            }
            activeTournament.status = PAUSED_STATUS;
            await activeTournament.validate();
            await activeTournament.save();
            msg.reply(TOURNAMENT_PAUSE_SETTED);
        } else {
            msg.reply(TOURNAMENT_NOT_FOUND);
        }
    }

    const createNewTournament = async () => {
        const activeTournament = await getActiveTournament();

        if (!activeTournament) {
            Tournament.create({
                name: params[0],
                rounds: params[1],
                customRoundsNumber: !!params[1],
                discordServerId: msg.guild.id,
            })
                .then((t) => {
                    msg.reply(TOURNAMENT_CREATED(t.name, t.status))
                })
                .catch((e) => {
                    // TODO
                    msg.reply(TOURNAMENT_NOT_CREATED(params[0]))
                });
        } else {
            msg.reply(TOURNAMENT_SERVER_CONFLICT);
        }
    }

    const joinTournament = async () => {
        const activeTournament = await getActiveTournament();


        if (!activeTournament) {
            msg.reply(TOURNAMENT_NOT_FOUND);
            return;
        }

        switch (activeTournament.status) {
            case JOIN_PHASE_STATUS:
                if (activeTournament.competitors.indexOf((c) => c.userId == msg.author.id) == -1) {
                    activeTournament.competitors.push({
                        userId: msg.author.id,
                        username: msg.author.username,
                        points: 0,
                        wins: 0,
                        opponent: null,
                    });
                    await activeTournament.validate();
                    await activeTournament.save();

                    msg.reply(TOURNAMENT_JOINED(activeTournament.name));
                } else {
                    msg.reply(TOURNAMENT_ALREADY_JOINED(activeTournament.name));
                }
                break;
            case STARTED_STATUS:
                msg.reply(TOURNAMENT_STARTED);
                break;
            case PAUSED_STATUS:
                msg.reply(TOURNAMENT_PAUSED);
                break;
        }
    }

    // Always at the end
    commandMapper();
}