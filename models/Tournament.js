class Tournament {

    BYE_POINTS = 2;
    WIN_POINTS = 3;
    LOSE_POINTS = 1;

    currentRound = 0;

    name = "";
    rounds = 0;
    competitors = [];

    constructor(name, rounds) {
        this.name = name;
        this.rounds = rounds;
    }

    addCompetitor(competitor) {
        competitor.push(competitor);
    }

    startTournament() {
        currentRound = 1;
    }

    startNextRound() {
        this.currentRound++;
    }

    getPositions() {
        return this.competitors.sort((a, b) => b.points - a.points);
    }

}