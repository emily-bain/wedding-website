import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from './theme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Paper from 'material-ui/Paper';

import App from './App';
import RSVP from './RSVP';
import Home from './Home';
import Hotel from './Hotels';

injectTapEventPlugin();

render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route mealChoices={context.mealChoices} path="rsvp" component={RSVP}/>
        <Route path="hotel" component={Hotel} />
      </Route>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('mount')
);
