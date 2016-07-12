import React from 'react';
import Paper from 'material-ui/paper';
import TextField from 'material-ui/TextField';
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton';

class GuestForm extends React.Component {
  constructor(props) {
    super();

    const { initialGuestData } = props;
    this.state = {
      formData: initialGuestData,
      mutableName: !(initialGuestData.firstName && initialGuestData.lastName)
    };
  }

  handleFormDataChange(field, val) {
    this.setState((state, props) => {
      return ({formData: {...state.formData, [field]: val}})
    });

  }

  handleFirstNameChange(e, val) {
    this.handleFormDataChange('firstName', val);
  }

  handleLastNameChange(e, val) {
    this.handleFormDataChange('lasttName', val);
  }

  handleAttendingChange(e, val) {
    val = val === "yes";
    this.handleFormDataChange('attending', val);
  }

  renderFirstName() {
    return (
      <fieldset>
        <label htmlFor="firstName">First Name:</label>
        <TextField name="firstName"
                   disabled={!this.state.mutableName}
                   hintText="First Name"
                   value={this.state.formData.firstName}
                   onChange={this.handleFirstNameChange.bind(this)}
        />
      </fieldset>
    );
  }

  renderLastName() {
    return (
      <fieldset>
        <label htmlFor="lastName">First Name:</label>
        <TextField name="lasttName"
                   disabled={!this.state.mutableName}
                   hintText="Surname"
                   value={this.state.formData.lastName}
                   onChange={this.handleLastNameChange.bind(this)}
        />

      </fieldset>
    );
  }

  renderAttending() {
    return (
      <fieldset>
        <label htmlFor="attending">Will you be attending?</label>
        <RadioButtonGroup name="attending"
                          valueSelected={this.state.formData.attending === true ? "yes" :
                                         this.state.formData.attending === false ? "no" :
                                         ""}
                          onChange={this.handleAttendingChange.bind(this)}
        >
          <RadioButton
            value="yes"
            label="Yes"
          />
          <RadioButton
            value="no"
            label="No"
          />
        </RadioButtonGroup>
      </fieldset>
    );
  }

  respond() {
    console.log(this.state.formData);
  }

  render() {
    return (
      <Paper className='paper'>
        {this.renderFirstName()}
        {this.renderLastName()}
        {this.renderAttending()}
        <RaisedButton label="Respond" onClick={this.respond.bind(this)}  />
      </Paper>
    );
  }
}

export default class RSVPApp extends React.Component {
  render() {
    const guests = [{
      id: 1,
      firstName: 'Jeff',
      lastName: 'Bain',
      attending: null
    }, {
      id: 2,
      firstName: 'Nicole',
      lastName: 'Bain',
      attending: null
    }]

    const forms = guests.map((guest) => {
      return <GuestForm key={guest.id} initialGuestData={guest} />
    })

    return (
      <div>
        <h1>RSVP</h1>
        {forms}
      </div>
    );
  }

}
