import React from 'react';
import Paper from 'material-ui/paper';
import TextField from 'material-ui/TextField';
import { RadioButtonGroup, RadioButton } from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';

class BaseForm extends React.Component {
  renderFirstName() {
    return (
      <div className="field">
        <TextField name="firstName"
                   floatingLabelText="First Name"
                   hintText="First Name"
                   fullWidth={true}
                   value={this.props.values.firstName}
                   errorText={this.props.errors.firstName}
                   onChange={(e, val) => this.props.onFieldChange('firstName', val)}
        />
      </div>
    );
  }

  renderLastName() {
    return (
      <div className="field">
        <TextField name="lasttName"
                   floatingLabelText="Last Name"
                   hintText="Surname"
                   fullWidth={true}
                   value={this.props.values.lastName}
                   errorText={this.props.errors.lastName}
                   onChange={(e, val) => this.props.onFieldChange('lastName', val)}
        />
      </div>
    );
  }

  renderMealChoice() {
    const { mealChoices } = this.props;
    const { meal } = this.props.values;

    const mealOptions = mealChoices.map((option) => {
      return <RadioButton key={option.id} value={option.id.toString()} label={option.name} />;
    });

    return (
      <div className='field'>
        <p>Preferred Entree?</p>
        <RadioButtonGroup
          name="meal"
          valueSelected={ meal ? meal.toString() : null}
          onChange={(e, val) => this.props.onFieldChange('meal', +val)}
          children={mealOptions}
        />
      </div>
    )
  }

  renderNotes() {
    return (
      <div className='field'>
        <TextField name="notes"
                   floatingLabelText="Anything else we should know?"
                   hintText="Allergies, etc"
                   multiLine={true}
                   rowsMax={5}
                   value={this.props.values.notes}
                   errorText={this.props.errors.notes}
                   onChange={(e, val) => this.props.onFieldChange('notes', val)}
        />
      </div>
    );

  }

}

class SubGuestForm extends BaseForm {
  render() {
    <div>
      {this.renderFirstName()}
      {this.renderLastName()}
      {this.renderMealChoice()}
      {this.renderNotes()}
    </div>
  }

}

class GuestForm extends BaseForm {

 renderAttending() {
    return (
      <div className='field'>
        <Toggle toggled={this.props.values.attending}
                onToggle={(e, val) => this.props.onFieldChange('attending', val)}
                label='Will you be attending?'
                labelPosition='left'
        />
      </div>
    );
  }

  handleGuestChange(value) {
    this.setState(function(state, props) {
      return {...state, guest: {...state.guest, attending: value}};
    });
  }

  renderGuestWidget() {
    let guestForm;
    if (this.state.guest.attending) {
      guestForm = (
        <SubGuestForm
          mealChoices={this.props.mealChoices}
          initialGuestData={this.state.guest}
          onFormDataChange={this.handleGuestFormDataChange.bind(this)}
        />
      );
    }
    const guestToggle = (
      <div className='field'>
        <Toggle toggled={this.state.guest.attending}
                onToggle={(e, val) => {this.handleGuestChange(val)}}
                label='Will you be bringing a guest?'
                labelPosition='left'
        />
      </div>
    );

    return (
      <div>
        {guestToggle}
        {guestForm}
      </div>
    );
  }

  render() {
    const { subGuest } = this.props;
    const { attending } = this.props.values;

    let mealChoice;
    let notes;
    let guestWidget;
    if (attending) {
      mealChoice = this.renderMealChoice();
      notes = this.renderNotes();
      if (subGuest) {
        // Handle +1 here
        guestWidget = this.renderGuestWidget();
      }
    }

    return (
      <div>
        {this.renderFirstName()}
        {this.renderLastName()}
        {this.renderAttending()}
        {mealChoice}
        {notes}
        {guestWidget}
      </div>
    );
  }

}

class GuestWidget extends React.Component {
  constructor(props) {
    super();

    const { initialGuestData } = props;
    this.state = {
      id: initialGuestData.id,
      values: initialGuestData,
      errors: {},
      guest: initialGuestData.guest
    };
  }

  handleFormDataChange(field, value) {
    this.setState((state, props) => {
      return ({...state, values: {...state.values, [field]: value}});
    });
  }

  handleGuestFormDataChange(field, value) {
    this.setState(function(state, props) {
      return {...state, guest: {...state.guest, [field]: value}};
    });
  }

  respond() {
    console.log(this.state.values);
  }


  render() {
    return (
      <Paper className='paper'>
        <div className='content'>
          <GuestForm
            mealChoices={this.props.mealChoices}
            onFieldChange={this.handleFormDataChange.bind(this)}
            values={this.state.values}
            errors={this.state.errors}
          />
        </div>

        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <RaisedButton primary={true} label="Respond" onClick={this.respond.bind(this)}  />
          </ToolbarGroup>
        </Toolbar>
      </Paper>
    );
  }
}

export default GuestWidget;
