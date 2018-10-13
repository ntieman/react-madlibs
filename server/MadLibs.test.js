import MadLibs from './MadLibs';

const story1Text = 'I want to [[verb]] your [[noun]].';
const story2Text = '[[Verb]] me like one of your [[adjective]] girls';

const story1 = MadLibs.add({
    title: 'Story One',
    text: story1Text
});

const story2 = MadLibs.add(story2Text);

it('creates stories from objects', () => {
    expect(story1.tokens.length).toEqual(2);
});

it('creates stories from text', () => {
    expect(story2.tokens.length).toEqual(2);
});

it('retrieves stories by ID', () => {
    expect(MadLibs.get(story1.id).tokens[0].description).toEqual(story1.tokens[0].description);
});

it('retrieves stories by title', () => {
    expect(MadLibs.getByTitle('Story One').text).toEqual(story1Text);
});

it('loads stories from the stories directory', () => {
    expect(MadLibs.getByTitle('How to Make an Ice Cream Sundae')).not.toBeFalsy();
});