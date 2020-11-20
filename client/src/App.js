import './App.scss';
import { Container } from 'react-bootstrap'
import ApolloProvider from './ApolloProvider'
import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import DynamicRouters from './util/DynamicRouters'
import { AuthProvider } from './context/authContext'
import { MessageProvider } from './context/Message'

// pages
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/home/Home'


function App() {
  return (
    <AuthProvider>
    <ApolloProvider>
      <MessageProvider>
      <Router>
    <Container className="pt-5">
      <Switch>
      <DynamicRouters path="/register" component={Register} guest/>
      <DynamicRouters path="/login" component={Login} guest/>
      <DynamicRouters exact path="/" component={Home} auth/>
      </Switch>
    </Container>
    </Router>
    </MessageProvider>
    </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
