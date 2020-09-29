import mongoose from 'mongoose';
import { JOIN_PHASE_STATUS } from '../config/constants.js';

export const TournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rounds: {
        type: Number,
        min: 0,
        required: true,
        default: 3,
    },
    competitors: {
        type: [mongoose.Types.Mixed],
    },
    winPoints: {
        type: Number,
        default: 3,
    },
    byePoints: {
        type: Number,
        default: 2,
    },
    currentRound: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: JOIN_PHASE_STATUS,
    },
    discordServerId: {
        type: String,
        required: true,
    },
    customRoundsNumber: {
        type: Boolean,
        default: false,
    },
});

export const Tournament = mongoose.model('Tournament', TournamentSchema);
