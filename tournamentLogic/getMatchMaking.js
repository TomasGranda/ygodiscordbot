const getMatchMaking = (competitors) => {
    competitors.sort((a, b) => a - b);
    const competitorsPairs = competitors.reduce(function (result, value, index, array) {
        if (index % 2 === 0)
            result.push(array.slice(index, index + 2));
        return result;
    }, []);

    
}