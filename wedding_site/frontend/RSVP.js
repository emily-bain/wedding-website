import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
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

    let mealError = ''
    if (props.errors.meal) {
      mealError = (
        <div className='info error'>{props.errors.meal}</div>
      )
    }
    meal = (
      <div className='field'>
        <div className='label'>Preferred Entree?</div>
        {mealError}
        <div>
        <RadioButtonGroup
          name="meal"
          valueSelected={ currentMeal ? currentMeal.toString() : null}
          onChange={(e, val) => props.onFieldChange('meal', +val)}
          children={mealOptions}
        />
        </div>
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
      globalError: null,
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
            firstName: guestData.first_name,
            lastName: guestData.last_name,
            attending: guestData.attending || false, // No nulls, no how.
            meal: guestData.meal,
            notes: guestData.notes
          },
          errors: {}
        }

        guestsByID[guest.id] = guest;
        if (!guestData.guest_of) {
          primaryGuests.push(guest.id);
        } else {
          plusOnes[guestData.guest_of] = guest.id
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
        invitationError: 'Invalid Guest Code'
      });
    });
  }

  toGuestForms() {
    this.setState({
      stage: 1,
      currentGuest: 0,
      plusOne: false
    })
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

  setGuestErrors(guestID, errors) {
    this.setState((state, props) => {
      return ({
        ...state,
        guestsByID: {
          ...state.guestsByID,
          [guestID]: {
            ...state.guestsByID[guestID],
            errors: errors
          }
        }
      });
    });
  }

  setGlobalError(error) {
    this.setState({globalError: error});
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
        });
      }
    } else {
      this.setState({
        plusOne: true
      });
    }
  }

  submitGuests() {
    const { inviteCode, guestsByID } = this.state;
    // We could really use a .items() here, Javascript
    const guests = [];
    Object.keys(guestsByID).forEach(key => {
      const guestData = guestsByID[key];
      const guest = {
        id: guestData.id,
        first_name: guestData.values.firstName,
        last_name: guestData.values.lastName,
        attending: guestData.values.attending,
        meal: guestData.values.meal,
        notes: guestData.values.notes
      };
      guests.push(guest);
    });

    // Clear the global error state
    this.setState({
      globalError: null
    });

    RSVPService.respond(inviteCode, guests).then(() => {
      this.setState({
        stage: 3
      });
    }, (errors) => {
      Object.keys(errors).map(guestID => {
        if (guestID === '__all__') {
          this.setGlobalError(errors[guestID]);
        } else {
          const guestErrors = errors[guestID];
          this.setGuestErrors(guestID, guestErrors);
        }
      });
      this.toGuestForms();
    });
  }

  renderInviteForm() {
    return (
      <TextField
        floatingLabelText="Invitation Code"
        value={this.state.inviteCode}
        errorText={this.state.invitationError}
        style={{marginBottom: '20px'}}
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
        mealChoices={this.props.route.mealChoices}
        values={guest.values}
        errors={guest.errors}
        plusOne={this.state.plusOne}
        extraFields={extraFields}
        onFieldChange={this.handleFormDataChange.bind(this)}
      />
    );

  }

  renderSummary() {
    const { guestsByID, plusOnes } = this.state;
    const { mealChoices } = this.props.route;

    const guestSummaries = Object.keys(guestsByID).map(guestID => {
      const guest = guestsByID[guestID];
      const attending = guest.values.attending
      const guestOfGuest = Object.keys(plusOnes).some(primaryGuestID => {
        return plusOnes[primaryGuestID] === guestID;
      });

      if (!attending && guestOfGuest) {
        return '';
      }

      let meal = '';
      let notes = '';
      if (attending) {
        const choice = mealChoices.find(choice => choice.id == guest.values.meal);
        meal = <div>Meal: {choice ? choice.name : "None"}</div>;
        notes = <div>Notes: {guest.values.notes}</div>;
      }

      return (
        <div key={guestID} style={{margin: '12px 0px'}}>
          <div>First Name: {guest.values.firstName}</div>
          <div>Last Name: {guest.values.lastName}</div>
          <div>Attending: {attending ? "Yes" : "No"}</div>
          {meal}
          {notes}
        </div>
      );
    });


    return (
      <div>
        <p>Does this all look right?</p>
        {guestSummaries}
      </div>
    );
  }

  renderSuccessPage() {
    const { guestsByID } = this.state;
    const anyAttending = Object.keys(guestsByID).some(function(guestID) {
      return guestsByID[guestID].values.attending;
    });

    const personalMessage = (anyAttending ?
                             "Looking forward to seeing you!" :
                             "Sorry you can't make it!");

    return (
      <div>
        <h3>Thanks!</h3>
        <p>We've successfully received your RSVP. {personalMessage}</p>
      </div>
    );
  }

  renderRelevantView() {
    switch(this.state.stage) {
      case 0: return this.renderInviteForm();
      case 1: return this.renderGuestForm();
      case 2: return this.renderSummary();
      case 3: return this.renderSuccessPage();
      default: return <span>Something went wrong</span>;
    }
  }

  renderRelevantActions() {
    switch(this.state.stage) {
      case 0:
        return (
          <ToolbarGroup lastChild={true}>
            <RaisedButton primary={true} label="Next" onClick={this.fetchGuests.bind(this)}  />
          </ToolbarGroup>
        );
      case 1:
        return (
          <ToolbarGroup lastChild={true}>
            <RaisedButton primary={true} label="Next" onClick={this.completeGuest.bind(this)} />
          </ToolbarGroup>
        );
      case 2:
        return (
          <ToolbarGroup lastChild={true}>
            <FlatButton label="Go back" onClick={this.toGuestForms.bind(this)} />
            <RaisedButton primary={true} label="Submit" onClick={this.submitGuests.bind(this)} />
          </ToolbarGroup>
        );
    }
  }

  render() {
    let globalError = '';
    if (this.state.globalError) {
      globalError = (
        <Paper
          className='paper error'
          style={{
            backgroundColor: 'bf4c28',
            color: 'ffffff'
          }}>
          {this.state.globalError}
        </Paper>
      )
    }

    return (
      <div>
        {globalError}
        <Paper className='paper'>
          <div className='content' style={{minHeight: '100px'}}>
            {this.renderRelevantView()}
          </div>

          <Toolbar style={{justifyContent: 'flex-end'}}>
              {this.renderRelevantActions()}
          </Toolbar>
        </Paper>
      </div>
    );
  }

}

export default RSVP;
