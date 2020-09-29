export const getRoundsNumber = (competitors) => {
    const roundsNumber = Math.round(Math.log2(competitors));
    return roundsNumber;
};