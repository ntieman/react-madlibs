import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import Home from './Home';
import MadLib from './MadLib';
import './App.css';

const client = new ApolloClient({
    uri: window.location.protocol + '//' + window.location.host + '/graphql'
});

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Router>
                    <div className="App">
                        <Route exact path="/" component={Home} />
                        <Route path="/madlib/:id/" component={MadLib} />
                    </div>
                </Router>
            </ApolloProvider>
        );
    }
}

export default App;
