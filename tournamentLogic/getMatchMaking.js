export const getMatchMaking = (competitors) => {
    if (!competitors.every(c => c.points == 0)) {
        competitors.sort((a, b) => a - b);
    } else {
        competitors.sort((a, b) => Math.round(Math.random(2) - 1));
    }
    const competitorsPairs = competitors.reduce(function (result, value, index, array) {
        if (index % 2 === 0)
            result.push(array.slice(index, index + 2));
        return result;
    }, []);

    return competitorsPairs;
}