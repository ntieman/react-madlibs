import MadLib from './MadLib';

const story1Text = 'This is a story about [[plural noun]].';
const story2Text = 'I will [[verb]] your [[noun]].';

const pluralNoun = 'ducks';

const story1 = new MadLib(story1Text);
const story2 = new MadLib({
    text: story2Text
});

story1.setValue(1, pluralNoun);

it('creates new stories with sequential IDs', () => {
    expect(story1.id).toEqual(1);
    expect(story2.id).toEqual(2);
});

it('accepts text input', () => {
    expect(story1.text).toEqual(story1Text);
});

it('accepts object input', () => {
    expect(story2.text).toEqual(story2Text);
});

it('finds tokens in provided text', () => {
    expect(story1.tokens.length).toEqual(1);
    expect(story1.tokens[0].placeholder).toEqual('[[plural noun]]');
});

it('renders stories from provided words', () => {
    expect(story1.render()).toEqual(story1Text.replace('[[plural noun]]', pluralNoun));
});

