import {getRandomColor, getRandomString} from './utils';
import {observable} from 'mobx';
import fs from 'fs';

const notes = {
    "n001": {
        "id": "n001",
        "title": "Hello Znote1",
        "content": fs.readFileSync('/home/wonder/lab/t.txt', 'utf8'),
        "color": "#EAB2CC",
        "labels": ["蟒蛇", "python", "react"],
    },
    "n002": {
        "id": "n002",
        "title": "Hello Znote2",
        "content": "Hello, **ZNote**!\nI am writting *Markdown*",
        "color": "#e4e4ab",
        "labels": ["linux", "git"],
    },
    "n003": {
        "id": "n003",
        "title": "Hello Znote3",
        "content": fs.readFileSync('/home/wonder/lab/t.txt', 'utf8'),
        "color": "#E1E1E1",
        "labels": ["blockchain", "fs"],
    },
    "n004": {
        "id": "n004",
        "title": "Hello Znote4",
        "content": "I am Note#2",
        "color": "#fc929e",
        "labels": ["linux", "git"],
    },
    "n005": {
        "id": "n005",
        "title": "Hello Znote5",
        "content": "I am Note#2",
        "color": "#CE9357",
        "labels": ["linux", "git"],
    },
    "n006": {
        "id": "n006",
        "title": "Hello Znote6",
        "content": 
`- 市盈率(PE)：注意非经常性损益占比
- 市净率(PB)：低PB能更好的应对未来的不确定性
- 净资产收益率(ROE 或 E/B)：代表盈利能力。要同时参考负债率，随着负债率增高，ROE可以无限大。
- 总资产收益率(ROA)
- 负债率：高负债伴随高风险
- 股息率`,
        "color": "#fc929e",
        "labels": ["linux", "git"],
    },
    "n007": {
        "id": "n007",
        "title": "Hello Znote7",
        "content": "I am Note#2",
        "color": "#CE9357",
        "labels": ["linux", "git"],
    },
    "n008": {
        "id": "n008",
        "title": "Hello Znote8",
        "content": "I am Note#2",
        "color": "#92E8E3",
        "labels": ["linux", "git"],
    },
};

const notesOrder = Object.keys(notes);

class Store {
    @observable notes = notes
    @observable notesOrder = notesOrder
    @observable editingNoteID = null
}

export default new Store();
