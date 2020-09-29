export const getFlags = (string) => {
    const regexp = new RegExp(/((\s)+(-)+(-|[a-z])+)/ig);
    let matches = string.match(regexp);
    if(matches){
        return matches.map(m => m.trim());
    } else {
        return [];
    }
}