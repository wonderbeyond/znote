import {getRandomColor, getRandomString} from './utils';

export var notes = {};

for (var i = 0; i < 999; i++) {
    let id = getRandomString(4);
    notes[id] = {
        content: id,
        color: getRandomColor()
    };
}

export var notesOrder = Object.keys(notes);
