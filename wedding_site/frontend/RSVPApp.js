import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar';

import GuestWidget from './GuestForm';


export default class RSVPApp extends React.Component {
  constructor() {
    super();
    this.state = {
      guests: []
    }
  }

  render() {
    let guests = [{
      id: 1,
      firstName: 'Jeff',
      lastName: 'Bain',
      attending: null,
      foodChoice: null,
      notes: '',
    }, {
      id: 2,
      firstName: 'Nicole',
      lastName: 'Bain',
      attending: null,
      foodChoice: null,
      notes: '',
      guest: {id: 'test'}
    }]
    //{ guests } = this.state;

    const forms = guests.map((guest) => {
      return (
        <GuestWidget
          key={guest.id}
          initialGuestData={guest}
          mealChoices={this.props.mealChoices}
        />
      );
    })

    return (
      <div>
        <Toolbar style={{backgroundColor: 'bf4d28', color: 'ffffff'}}>
          <ToolbarTitle text="RSVP" />
        </Toolbar>
        <AppBar title="RSVP"/>

        {forms}
      </div>
    );
  }
}
