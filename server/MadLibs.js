const MadLib = require('./MadLib');
const fs = require ('fs');
const path = require('path');

function MadLibs() {}

MadLibs.madLibs = [];

MadLibs.get = (id) => MadLibs.madLibs.find(madLib => madLib.id == id);
MadLibs.getByTitle = (title) => MadLibs.madLibs.find(madLib => madLib.title === title);

MadLibs.add = (madLib) => {
    madLib = new MadLib(madLib);
    MadLibs.madLibs.push(madLib);

    return madLib;
};

const storyDir = path.join(__dirname, '..', 'stories');

fs.readdirSync(storyDir).forEach(file => {
    const filePath = path.join(storyDir, file);
    const text = fs.readFileSync(filePath, 'utf8');

    MadLibs.add({
        title: file.replace('.txt', ''),
        text: text
    });
});

module.exports = MadLibs;
