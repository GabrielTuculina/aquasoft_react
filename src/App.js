import './App.css';
import RouterComponent from './components/Router';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useDispatch } from 'react-redux';
import {addApolloClient} from './components/redux/actions';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

function App() {
  const dispatch = useDispatch();
  dispatch(addApolloClient(client));

  return (
    <div>
      <RouterComponent />
    </div>
  );
}

export default App;
