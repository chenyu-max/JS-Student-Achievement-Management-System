function setLocal(key, value) {
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

function getLocal(key) {
    var value = localStorage.getItem(key);
    if (value === null) {
        return null;
    }
    if (value[0] === '[' || value[0] === '{') {
        return JSON.parse(value);
    }
    return value;
}
