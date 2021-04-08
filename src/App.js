import './App.css';
import RouterComponent from './components/Router';
import { ApolloClient, InMemoryCache, ApolloProvider, from, HttpLink } from '@apollo/client';
import { useDispatch } from 'react-redux';
import {addApolloClient} from './components/redux/actions';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({uri: "http://localhost:4000"});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([
    errorLink,
    httpLink
  ]),
  cache: new InMemoryCache()
});

function App() {
  const dispatch = useDispatch();
  dispatch(addApolloClient(client));

  return (
    <div>
      <ApolloProvider client={client}>
        <RouterComponent />
      </ApolloProvider>
    </div>
  );
}

export default App;
