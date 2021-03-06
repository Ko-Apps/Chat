import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
require("dotenv").config();

const wsLink = new WebSocketLink({

    uri: process.env.REACT_APP_Subscriptions_API,
    options: {
        reconnect: true
    }
})

const httpLink = new HttpLink({ uri: process.env.REACT_APP_Simple_API })

const link = split(

    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink,
)

const client = new ApolloClient({

    link,
    cache: new InMemoryCache()
})

ReactDOM.render(

    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
