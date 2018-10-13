function MadLib(properties) {
    if(!properties) {
        properties = {};
    } else if(typeof(properties) === 'string') {
        properties = {
            text: properties
        };
    }

    this.id = properties.id || ++MadLib.seed;
    this.title = properties.title || '';
    this.text = properties.text || '';
    this.tokens = properties.tokens || MadLib.parseTokens(this.text);
}

MadLib.seed = 0;

MadLib.parseTokens = (text) => {
    const search = /\[\[([^\]]+)\]\]/g;
    const tokens = [];
    let tokenSeed = 0;
    let match;

    while(match = search.exec(text)) {
        let placeholder = match[0];

        tokens.push({
            id: ++tokenSeed,
            placeholder: placeholder,
            description: placeholder.substring(2, placeholder.length - 2),
            start: search.lastIndex - placeholder.length,
            end: search.lastIndex,
            value: ''
        });
    }

    return tokens;
};

MadLib.prototype.clearValues = function() {
    this.tokens.forEach(token => token.value = '');
};

MadLib.prototype.parseTokens = function() {
    this.tokens = MadLib.parseTokens(this.text);

    return this.tokens;
};

MadLib.prototype.setValue = function(id, value) {
    this.tokens.find(token => token.id == id).value = value;
};

MadLib.prototype.clearValue = function(id) {
    this.setValue(id, '');
};

MadLib.prototype.render = function() {
    const originalText = this.text;
    let renderedText = originalText;

    this.tokens.forEach(token => renderedText = originalText.substr(0, token.start) + token.value + originalText.substr(token.end));

    return renderedText;
};

module.exports = MadLib;
