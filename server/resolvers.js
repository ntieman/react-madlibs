const MadLibs = require('./MadLibs.js');
const fs = require ('fs');
const path = require('path');

var os = require('os');
var ifaces = os.networkInterfaces();
var address = 'http://localhost';

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            address = 'http://' + iface.address;
        }
        ++alias;
    });
});

const musicDir = path.join(__dirname, '..', 'music');
const songs = [];

fs.readdirSync(musicDir).forEach(file => {
    const filePath = path.join(musicDir, file);

    songs.push({
        name: file.replace('.txt', ''),
        file: file,
        uri: address + ':3000/music/' + file
    });
});

const wordsDir = path.join(__dirname, 'words');
const words = [];

const capitalize = (word) => word.substr(0, 1).toUpperCase() + word.substr(1);

fs.readdirSync(wordsDir).forEach(file => {
    const filePath = path.join(wordsDir, file);
    const text = fs.readFileSync(filePath, 'utf8');
    const wordType = file.replace('.txt', '');
    const capitalWordType = capitalize(wordType);
    const wordTypeWords = text.split(/\n/g);
    
    wordTypeWords.forEach(word => {
        word = word.trim();

        if(!word) {
            return;
        }

        words.push({
            type: wordType,
            word: word
        });
        
        words.push({
            type: capitalWordType,
            word: capitalize(word)
        });
        
        if(wordType === 'verb') {
            words.push({
                type: 'verb -ing',
                word: word + 'ing'
            });
            
            words.push({
                type: 'Verb -ing',
                word: capitalize(word) + 'ing' 
            });
        } else if(wordType === 'noun') {
            words.push({
                type: 'plural noun',
                word: word + 's'
            });

            words.push({
                type: 'Plural Noun',
                word: capitalize(word) + 's'
            });
        }
    });
});

const resolvers = {
    Query: {
        madLib: (_, { id }) => MadLibs.get(id),
        madLibByTitle: (_, { title }) => MadLibs.getByTitle(title),
        madLibs: () => MadLibs.madLibs.sort((a, b) => a.title.localeCompare(b.title)),
        song: (_, { name }) => songs.find(song => song.name === name),
        songs: () => songs,
        words: () => words,
        wordsByType: (_, { type }) => words.filter(word => word.type === type)
    },
    Mutation: {
        newMadLib: (_, { title, text }) => MadLibs.add({
            title: title,
            text: text
        })
    }
};

module.exports = resolvers;