class Competitor {

    username;
    points;

    constructor(username) {
        this.username = username;
    }

    addPoints(points) {
        if (points != this.BYE_POINTS || points != this.LOSE_POINTS || points != this.WIN_POINTS)
            throw new Error("Competitor.addPoints InvalidPoints");

        this.points += points;
    }
}