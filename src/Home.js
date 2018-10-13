import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './Home.css';

const query = gql`
    {
        madLibs {
            id
            title
        }
    }
`;

const Home = () => (
    <div className="Home">
        <h1>MadLibs</h1>
        <p>Choose a story to begin.</p>
        <Query query={query}>
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>There was a problem loading the list of stories. Please refresh the page and try again.</p>;

                return <ul>
                    { data.madLibs.map(({ id, title }) => (
                        <li key={id}>
                            <Link to={`madlib/${id}/`}>{title}</Link>
                        </li>
                    )) }
                </ul>
            }}
        </Query>
    </div>
);

export default Home;