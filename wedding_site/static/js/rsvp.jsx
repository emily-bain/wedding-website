
var Field = React.components.createClass({
    render: function () {
        var children = this.props.children
        return (
            <fieldset>


        )
    }
})

var GuestForm = React.components.createClass({
    render: function () {


    }
})


var GuestView = React.components.createClass({
    render: function () {
        return (
            <div class="person form-horizontal">
                <fieldset class='.form-group'>
                    <label class="col-sm-3 control-label" for="first_name">First Name:</label>
                    <input class="col-sm-9" type='text' name='first_name' />
                </fieldset>
                <fieldset class='.form-group'>
                    <label class="col-sm-3 control-label" for="last_name">Last Name:</label>
                    <input class="col-sm-9" type='text' name='last_name' />
                </fieldset>
                <fieldset class=".form-group attending">
                    <input type="hidden"  class='attending-field' name='attending' value = ''/>
                    <span class="col-sm-3 control-label">Attending?</span>
                    <span class="col-sm-9">
                        <input type="button" value="Yes!" class="btn btn-yes" />
                        <input type="button" value="No" class="btn btn-no" />
                    </span>
                </fieldset>
                <fieldset class=".form-group">
                    <label class="col-sm-3 control-label" for="food_choice">Food Preference:</label>
                    <span class="col-sm-9">
                        <select name="food_choice">
                            <option val="chicken">Chicken</option>
                            <option val="steak">Steak</option>
                            <option val="salmon">Salmon</option>
                            <option val="vegetarian">Vegetarian</option>
                        </select>
                    </span>
                </fieldset>
                <fieldset class=".form-group">
                    <label class="col-sm-2" for="food_notes">Notes (Allergies, etc):</label>
                    <div class="col-sm-2">
                        <textarea placeholder="Allergies, etc." name="food_notes" rows="4" cols="50" ></textarea>
                    </div>
                </fieldset>
                <fieldset class=".form-group">
                    <div class="col-sm-2">
                        <input value="RSVP" type="button" />
                    <div/>
                </fieldset>
            </div>
        )
    }

})

        <div class="person">
            <form class="form-horizontal">
                <fieldset class='.form-group'>
                    <label class="col-sm-3 control-label" for="first_name">First Name:</label>
                    <input class="col-sm-9" type='text' name='first_name' />
                </fieldset>
                <fieldset class='.form-group'>
                    <label class="col-sm-3 control-label" for="last_name">Last Name:</label>
                    <input class="col-sm-9" type='text' name='last_name' />
                </fieldset>
                <fieldset class=".form-group attending">
                    <input type="hidden"  class='attending-field' name='attending' value = ''/>
                    <span class="col-sm-3 control-label">Attending?</span>
                    <span class="col-sm-9">
                        <input type="button" value="Yes!" class="btn btn-yes" />
                        <input type="button" value="No" class="btn btn-no" />
                    </span>
                </fieldset>
                <fieldset class=".form-group">
                    <label class="col-sm-3 control-label" for="food_choice">Food Preference:</label>
                    <span class="col-sm-9">
                        <select name="food_choice">
                            <option val="chicken">Chicken</option>
                            <option val="steak">Steak</option>
                            <option val="salmon">Salmon</option>
                            <option val="vegetarian">Vegetarian</option>
                        </select>
                    </span>
                </fieldset>
                <fieldset class=".form-group">
                    <label class="col-sm-2" for="food_notes">Notes (Allergies, etc):</label>
                    <div class="col-sm-2">
                        <textarea placeholder="Allergies, etc." name="food_notes" rows="4" cols="50" ></textarea>
                    </div>
                </fieldset>
                <fieldset class=".form-group">
                    <div class="col-sm-2">
                        <input value="RSVP" type="button" />
                    <div/>
                </fieldset>
            </form>
        </div>
