import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import "./index.css";
import { Inbox } from "./pages/Inbox/Inbox";
import { Settings } from "./pages/Settings/Settings";
import { Send } from "./pages/Send/Send";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Router>
          <Switch>
            <Route path='/login' exact component={Login} />
            <Route path='/' exact component={Inbox} />
            <Route path='/settings' exact component={Settings} />
            <Route path='/send' exact component={Send} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
