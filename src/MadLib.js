import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './Home.css';
import './MadLib.css';

const query = gql`
    query MadLib($id: ID!) {
        madLib(id: $id) {
            id
            title
            text
            tokens {
                id
                placeholder
                description
                start
                end
                value
            }
        }
        
        songs {
            name
            uri
        }
        
        words {
            type
            word
        }
    }
`;

class MadLib extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            mode: props.mode || 'input',
            values: props.values || {},
            complete: props.complete || false,
            continuous: props.continuous || true,
            speaking: props.speaking || false,
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.onInputSubmit = this.onInputSubmit.bind(this);
        this.onResetClick = this.onResetClick.bind(this);
        this.onResetInputClick = this.onResetInputClick.bind(this);
        this.onReadItClick = this.onReadItClick.bind(this);
        this.speak = this.speak.bind(this);
        this.goHome = this.goHome.bind(this);
        this.pickRandomWords = this.pickRandomWords.bind(this);

        this.speechArea = React.createRef();
        this.audio = React.createRef();
        this.synth = window.speechSynthesis;
        this.autoSpeak = false;
    }

    componentDidUpdate() {
        if(this.audio.current) {
            this.audio.current.volume = .25;
        }

        if(this.autoSpeak) {
            this.autoSpeak = false;
            
            setTimeout(() => {
                this.speak();
            }, 3000);
        }
    }

    onValueChange(e) {
        const input = e.currentTarget;
        const value = input.value;
        const tokenID = input.getAttribute('data-token-id');
        const values = this.state.values;

        values[tokenID] = value;

        let filledInValues = 0;

        for(let id in values) {
            if(values.hasOwnProperty(id) && values[id]) {
                filledInValues++;
            }
        }

        const complete = filledInValues === this.madLib.tokens.length;
        this.setState({ values, complete });
    }

    onInputSubmit(e) {
        e.preventDefault();
        this.setState({ mode: 'display' });
        this.autoSpeak = true;
    }

    onResetClick() {
        this.synth.cancel();
        this.setState({ mode: 'input' });
        this.autoSpeak = false;
    }

    onResetInputClick() {
        const values = this.state.values;

        for(let tokenID in values) {
            values[tokenID] = '';
        }

        this.setState({ values });
    }

    onReadItClick() {
        if(this.synth.speaking) {
            this.synth.cancel();
            this.setState({ speaking: false });
        } else {
            this.speak();
            this.setState({ speaking: true });
        }
    }

    speak() {
        const synth = this.synth;
        const voices = synth.getVoices();
        const normalVoice = voices[0];
        const insertVoice = voices[0];

        synth.cancel();

        if(this.state.continuous) {
            const utterance = new SpeechSynthesisUtterance(this.speechArea.current.textContent);

            utterance.voice = normalVoice;
            utterance.pitch = .25 + Math.random() * 1.75;

            utterance.onend = () => {
                this.setState({ speaking: false });
            };

            synth.speak(utterance);
        } else {
            const parsedText = this.parsedText;
            let textIndex = 0;

            const getNextUtterance = () => {
                if(textIndex < parsedText.length) {
                    const parsedFragment = parsedText[textIndex++];
                    const utterance = new SpeechSynthesisUtterance(parsedFragment.text);

                    if(parsedFragment.type === 'normal') {
                        utterance.voice = normalVoice;
                    } else {
                        utterance.voice = insertVoice;
                        utterance.pitch = .25 + (Math.random() > .5 ? 1.5 : 0);
                    }

                    utterance.onend = getNextUtterance;
                    synth.speak(utterance);
                } else {
                    this.setState({ speaking: false });
                }
            };

            getNextUtterance();
        }

        this.setState({ speaking: true });
    }

    goHome() {
        this.synth.cancel();
        this.setState({ mode: 'home', speaking: false });
    }

    pickRandomWords() {
        const values = this.state.values;
        const wordsByType = {};

        this.madLib.tokens.forEach(token => {
            const wordType = token.description;

            if(!wordsByType[wordType]) {
                wordsByType[wordType] = this.words.filter(word => word.type === wordType).map(word => word.word);
            }

            values[token.id] = wordsByType[wordType][Math.floor(Math.random() * wordsByType[wordType].length)];
        });

        this.setState({ values, complete: true });
    }

    renderInput() {
        const { title, tokens } = this.madLib;

        return <form onSubmit={this.onInputSubmit}>
            <h1>{title}</h1>
            <p>Enter your words.</p>
            <div>
                <button type="button" onClick={this.pickRandomWords}>Pick For Me</button>
            </div>
            <ul>
                { tokens.map(({ id, description }) => <li key={id}>
                    <label>
                        <span>{description}</span>
                        <input value={this.state.values[id] || ''} data-token-id={id} onChange={this.onValueChange} />
                    </label>
                </li>) }
            </ul>
            <div>
                <button type="submit" disabled={!this.state.complete}>Done</button>
                <button type="button" onClick={this.onResetInputClick}>Reset</button>
                <button type="button" onClick={this.goHome}>Pick Another Story</button>
            </div>
        </form>
    }

    renderDisplay() {
        let { title, text, tokens } = this.madLib;
        let renderedText = '<h1>'  + title + '</h1>';
        let parsedText = [];

        if(tokens.length) {
            const values = this.state.values;
            let lastIndex = 0;

            tokens.forEach(token => {
                let before = text.substring(lastIndex, token.start);

                parsedText.push({
                    type: 'normal',
                    text: before.replace(/<[a-z/]+>/g, '')
                });

                parsedText.push({
                    type: 'token',
                    description: token.description,
                    text: values[token.id]
                });

                renderedText += before;
                renderedText += '<span class="token ' + token.description.replace(/[^a-z]+/gi, '-') + '">' + values[token.id] + '</span>';
                lastIndex = token.end;
            });

            const end = text.substr(lastIndex).replace(/<[a-z/]+>/g, '');

            renderedText += end;
            parsedText.push({
                type: 'normal',
                text: end
            })
        } else {
            renderedText += text;
            parsedText.push({
                type: 'normal',
                text: text
            });
        }

        this.parsedText = parsedText;

        if(!this.song) {
            this.song = this.songs[Math.floor(Math.random() * this.songs.length)];
        }

        return <div>
            <div ref={this.speechArea} dangerouslySetInnerHTML={{ __html: renderedText }} />
            <audio ref={this.audio} controls loop autoPlay volume="0.25">
                <source type="audio/mpeg" src={this.song.uri} />
            </audio>
            <div style={{ marginTop: '1em' }}>
                <button type="button" onClick={this.onReadItClick}>{ this.state.speaking ? 'Stop Reading' : 'Read It' }</button>
                <button type="button" onClick={this.onResetClick}>Go Back</button>
                <button type="button" onClick={this.goHome}>Pick Another Story</button>
            </div>
        </div>
    }

    render() {
        if(this.state.mode === 'home') {
            return <Redirect to="/" />;
        }

        return <div className="MadLib">
            <Query query={query} variables={{ id: this.state.id }}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;

                    if (error) {
                        console.error(error);

                        return <p>There was a problem loading the story. Please refresh the page and try again.</p>;
                    }
                    
                    this.madLib = data.madLib;
                    this.songs = data.songs;
                    this.words = data.words;

                    switch(this.state.mode) {
                        case 'display': return this.renderDisplay();
                        default:
                        case 'input': return this.renderInput();
                    }
                }}
            </Query>
        </div>
    }
}

export default MadLib;
