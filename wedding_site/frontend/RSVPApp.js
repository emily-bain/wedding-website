import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar';

import RSVP from './GuestForm';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <AppBar title="RSVP"/>
        <RSVP mealChoices={this.props.mealChoices} />
      </div>
    );
  }
}
