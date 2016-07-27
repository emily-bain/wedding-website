import axios from 'axios';
import Cookies from 'js-cookie';

class RSVPService {
  getGuests(inviteCode)  {
    return new Promise(function (resolve, reject) {
      axios.get(`/invites/${inviteCode}/`).then((response) => {
        resolve(response.data.guests);
      }, (response) => {
        reject('Invalid Invite Code');
      });
    });
  }

  respond(inviteCode, guests) {
    const csrf = Cookies.get('csrftoken');

    return new Promise(function (resolve, reject) {
      axios({
        method: 'post',
        url: `/invites/${inviteCode}/`,
        data: guests,
        headers: {'X-CSRFToken': csrf}
      }).then(response => {
        resolve();
      }).catch(function(errorResponse) {
        const response = errorResponse.response
        const errors = {};
        if (response.status === 400) {
          Object.keys(response.data).map(guestId => {
            const data = response.data[guestId];
            errors[guestId] = {
              firstName: data.first_name,
              lastName: data.last_name,
              attending: data.attending,
              meal: data.meal,
              notes: data.notes
            };
          });
          errors['__all__'] = 'Something went wrong. Fix the errors below and try again.';
        } else {
          errors['__all__'] = "Something went wrong. Try again?";
        }
        reject(errors);
      });
    });
  }

}

export default new RSVPService();
