
class RSVPService {

  getGuests(inviteCode)  {
    return new Promise(function (resolve, reject) {
      const guests = [{
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
        guestOf: 1
      }]

      if (inviteCode !== "fail")
        resolve(guests);
      else
        reject({'error': 'Invalid Invite ID'});
    });
  }

  respond(guests) {
    return new Promise(function (resolve, reject) {


    });
  }

}

export default new RSVPService();
