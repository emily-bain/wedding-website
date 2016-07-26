import React from 'react';
import { Link } from 'react-router'

import Paper from 'material-ui/Paper';

const Home = (props) => {
  return (
    <Paper className='paper' style={{minHeight: '600px'}}>
      <div className='content'>
        <p>Welcome to Jeff and Nicole's Wedding Website!</p>
        <p>If you're looking to RSVP, you can click here: <Link to="/rsvp">RSVP</Link></p>
        <p>If you will need a hotel, hotel info is here: <Link to="/hotel">Hotels</Link></p>
        <h4>When?</h4>
          <p>The wedding will take place on Saturday, November 5th at 5:00PM</p>
        <h4>Where?</h4>
          <p>
            The ceremony and reception will both be held in Cinderella's Cottage
            at Fantasy Farms, located at 15 Pottery Road, Toronto.
          </p>
          <p>
            Weather permitting the ceremony will be outside on the terrace and
            should be a short ceremony, so dress accordingly.
          </p>
          <p>
            There is parking available on-site, and guests are permitted to
            leave their car overnight so long as it's picked up before noon
            the next morning. Conveniently, one can travel from the hotel block
            to the venue via TTC by taking the 100 Flemington bus.
          </p>
        <h4>Contact us</h4>
          <p>
            If you have any questions, you can contact the groom by email at
            <a href='mailto:Jeff@JeffBain.ca'>Jeff@JeffBain.ca</a> or the bride
            at <a href='mailto:nicolediggle@gmail.com'>NicoleDiggle@gmail.com</a>
          </p>
      </div>
    </Paper>
  );

}

export default Home;
