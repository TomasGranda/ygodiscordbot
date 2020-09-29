const addParams = (numberOfParams) => {
    const textparam = "((\\s)*(?<param>([a-z]|[0-9]|(-))*))"
    let string = textparam.repeat(numberOfParams);
    let index = 0;
    string = string.replace(/param/gi, () => {
        return "param" + index++;
    });
    return string;
}

export default addParams;