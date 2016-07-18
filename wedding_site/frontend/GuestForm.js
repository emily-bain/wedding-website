import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';

import RSVPService  from './services';

const GuestForm = (props) => {
  const { mealChoices } = props;
  const { meal: currentMeal } = props.values;

  const firstName = (
    <div className="field">
      <TextField name="firstName"
                 floatingLabelText="First Name"
                 hintText="First Name"
                 fullWidth={true}
                 value={props.values.firstName}
                 errorText={props.errors.firstName}
                 onChange={(e, val) => props.onFieldChange('firstName', val)}
      />
    </div>
  );


  const lastName = (
    <div className="field">
      <TextField name="lasttName"
                 floatingLabelText="Last Name"
                 hintText="Surname"
                 fullWidth={true}
                 value={props.values.lastName}
                 errorText={props.errors.lastName}
                 onChange={(e, val) => props.onFieldChange('lastName', val)}
      />
    </div>
  );


  let attending;
  if (!props.plusOne) {
    attending = (
      <div className='field'>
        <Toggle toggled={props.values.attending}
                onToggle={(e, val) => props.onFieldChange('attending', val)}
                label='Will you be attending?'
                labelPosition='left'
        />
      </div>
    );
  }

  let meal;
  let notes;
  if (props.values.attending) {
    const mealOptions = mealChoices.map((option) => {
      return <RadioButton key={option.id} value={option.id.toString()} label={option.name} />;
    });

    meal = (
      <div className='field'>
        <p>Preferred Entree?</p>
        <RadioButtonGroup
          name="meal"
          valueSelected={ currentMeal ? currentMeal.toString() : null}
          onChange={(e, val) => props.onFieldChange('meal', +val)}
          children={mealOptions}
        />
      </div>
    );

    notes = (
      <div className='field'>
        <TextField name="notes"
                   floatingLabelText="Anything else we should know?"
                   hintText="Allergies, etc"
                   multiLine={true}
                   rowsMax={5}
                   value={props.values.notes}
                   errorText={props.errors.notes}
                   onChange={(e, val) => props.onFieldChange('notes', val)}
        />
      </div>
    );
  }

  return (
    <div>
      {firstName}
      {lastName}
      {attending}
      {meal}
      {notes}
      {props.extraFields}
    </div>
  );
}


class RSVP extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inviteCode: '',
      invitationError: null,
      stage: 0,
      currentGuest: null,
      plusOne: false,
      primaryGuests: [],
      plusOnes: {},
    };

  }

  fetchGuests() {
    const { inviteCode } = this.state;
    RSVPService.getGuests(inviteCode).then((guests) => {
      const guestsByID = {}
      const primaryGuests = [];
      const plusOnes = {};
      guests.map((guestData) => {
        const guest = {
          id: guestData.id,
          values: {
            firstName: guestData.firstName,
            lastName: guestData.lastName,
            attending: guestData.attending,
            meal: guestData.meal,
            notes: guestData.notes
          },
          errors: {}
        }

        guestsByID[guest.id] = guest;
        if (!guestData.guestOf) {
          primaryGuests.push(guest.id);
        } else {
          plusOnes[guestData.guestOf] = guest.id
        }

      });

      this.setState({
        stage: 1,
        currentGuest: 0,
        plusOnes,
        primaryGuests,
        guestsByID
      });
    }, (error) => {
      this.setState({
        invitationError: error
      });
    });
  }

  setGuestValue(guestID, field, value) {
    this.setState((state, props) => {
      return ({
        ...state,
        guestsByID: {
          ...state.guestsByID,
          [guestID]: {
            ...state.guestsByID[guestID],
            values: {
              ...state.guestsByID[guestID].values,
              [field]: value
            }
          }
        }
      });
    });
  }

  handleFormDataChange(field, value) {
    const guest = this.getCurrentGuest();
    this.setGuestValue(guest.id, field, value);
  }

  getCurrentGuest() {
    const { primaryGuests, currentGuest, plusOne, plusOnes, guestsByID } = this.state;
    const primaryGuestID = primaryGuests[currentGuest];
    if (plusOne) {
      return guestsByID[plusOnes[primaryGuestID]];
    } else {
      return guestsByID[primaryGuestID];
    }
  }

  completeGuest() {
    const {
      plusOne,
      plusOnes,
      currentGuest,
      primaryGuests,
      guestsByID
    } = this.state;
    const guest = this.getCurrentGuest()
    const guestOfGuest = guestsByID[plusOnes[guest.id]];

    if (plusOne || !guestOfGuest || !guestOfGuest.values.attending ) {
      if (currentGuest < primaryGuests.length - 1) {
        this.setState({
          currentGuest: currentGuest + 1,
          plusOne: false
        });
      } else {
        this.setState({
          stage: 2
        })
      }
      this.setState({});
    } else {
      this.setState({
        plusOne: true
      });
    }
  }

  submitGuests() {
    const { guests } = this.state;

    RSVPService.respond(guests).then(() => {

    }, (errors) => {

    });
  }

  renderInviteForm() {
    return (
      <TextField
        floatingLabelText="Invitation Code"
        value={this.state.inviteCode}
        errorText={this.state.invitationError}
        fullWidth={true}
        onChange={(e, val) => {
          this.setState({inviteCode: val, invitationError: null});
        }}
      />
    );
  }

  renderGuestForm() {
    const { plusOnes, guestsByID } = this.state;

    const guest = this.getCurrentGuest();
    const plusOneID = plusOnes[guest.id];
    let extraFields;
    if (plusOneID && guest.values.attending) {
      const plusOne = guestsByID[plusOneID];
      extraFields = (
        <div className='field'>
          <Toggle toggled={plusOne.values.attending}
                  label='Will you be bringing a guest?'
                  labelPosition='left'
                  onToggle={(e, val) => {
                    this.setGuestValue(plusOne.id, 'attending', val);
                  }}
          />
        </div>
      );
    }

    return (
      <GuestForm
        mealChoices={this.props.mealChoices}
        values={guest.values}
        errors={guest.errors}
        plusOne={this.state.plusOne}
        extraFields={extraFields}
        onFieldChange={this.handleFormDataChange.bind(this)}
      />
    );

  }

  renderRelevantView() {
    switch(this.state.stage) {
      case 0: return this.renderInviteForm()
      case 1: return this.renderGuestForm()
      default: return <span>Whoops</span>;
    }
  }

  renderRelevantActions() {
    switch(this.state.stage) {
      case 0:
        return (
          <RaisedButton primary={true} label="Next" onClick={this.fetchGuests.bind(this)}  />
        );
      case 1:
        return (
          <RaisedButton primary={true} label="Next" onClick={this.completeGuest.bind(this)} />
        );
      case 2:
        return (
          <RaisedButton primary={true} label="Submit" onClick={this.submitGuests.bind(this)} />
        );
    }
  }

  render() {
    return (
      <Paper className='paper'>
        <div className='content'>
          {this.renderRelevantView()}
        </div>

        <Toolbar>
          <ToolbarGroup firstChild={true}>
            {this.renderRelevantActions()}
          </ToolbarGroup>
        </Toolbar>
      </Paper>
    );
  }

}

export default RSVP;
