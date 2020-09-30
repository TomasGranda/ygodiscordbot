import { FINISHED_STATUS } from "../config/constants.js";
import { Tournament } from "../models/Tournament.js";

export const getActiveTournament = async (guildId) => {
    const tournaments = await getTournaments(guildId);
    return tournaments.find((t) => t.status != FINISHED_STATUS);
}

const getTournaments = async (guildId) => {
    return await Tournament.find((_, t) => t.discordServerId == guildId);
}