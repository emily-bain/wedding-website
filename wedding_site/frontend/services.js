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
      }, response => {
        const errors = {};
        if (false) {
          // handle proper error response
        } else {
          errors['__all__'] = "Something went wrong. Try again?";
        }
        reject(errors);
      });
    });
  }

}

export default new RSVPService();
