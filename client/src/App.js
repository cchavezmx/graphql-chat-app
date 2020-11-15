import './App.scss';
import { Container } from 'react-bootstrap'
import ApolloProvider from './ApolloProvider'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

// pages
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'


function App() {
  return (
    <ApolloProvider>
      <Router>
    <Container className="pt-5">
      <Switch>
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Login} />
      <Route exact path="/" component={Home} />
      </Switch>
    </Container>
    </Router>
    </ApolloProvider>
  );
}

export default App;
