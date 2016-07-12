import React from 'react';
import { render } from 'react-dom';
import RSVPApp from './RSVPApp';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from './theme';

render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <RSVPApp />
  </MuiThemeProvider>,
  document.getElementById('mount')
);
