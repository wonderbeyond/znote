const colors = [
    "#EAB2CC",
    "#CE9357",
    "#E1E1E1",
    "#92E8E3",
    "#3F8796",
    "#fc929e",
    "#9c8b8d",
    "#d1ecd1",
    "#bdbde8",
    "#e4e4ab",
    "#f3af97",
    "#ecabc7",
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomString(len=8) {
    var res = [];
    const c1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const choices = c1 + '0123456789';
    for (var i = 0; i < len; i++) {
        res.push(choices.charAt(Math.floor(Math.random() * choices.length)));
    }
    return res.join('');
}

function isTouchDevice() {
    return 'ontouchstart' in document.documentElement;
}


export {getRandomColor, getRandomString, isTouchDevice};
