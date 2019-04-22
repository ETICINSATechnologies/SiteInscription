import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Redirect, Switch} from "react-router";
import { BrowserRouter as Router, Route} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

// views
import Home from './views/home/home';
import Inscription from './views/inscription/inscription';

let consultantprops = {isConsultant : true};
let memberprops = {isConsultant : false};

ReactDOM.render(
    <Router>
        <React.Fragment>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/consultant' render={(routeProps) => (
                    <Inscription {...routeProps} {...consultantprops} />
                )}/>
                <Route exact path='/member' render={(routeProps) => (
                    <Inscription {...routeProps} {...memberprops} />
                )}/>
                <Redirect to='/'/>
            </Switch>
        </React.Fragment>
    </Router>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
