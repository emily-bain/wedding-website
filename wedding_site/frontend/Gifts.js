import React from 'react';
import { Link } from 'react-router'

import Paper from 'material-ui/Paper';

const Gifts = (props) => {
  return (
    <Paper className='paper' style={{minHeight: '600px'}}>
      <div className='content'>
        <h2>Registry</h2>
        <p>
          Thank you to anyone who is looking to give us a gift to celebrate
          our special day. Please don't feel obligated, but if you'd like to
          we appreciate it all the same.
        </p>
        <p>
           For anyone who is looking for gift ideas for us, we've got an&nbsp;
           <a href="http://www.amazon.ca/registry/wishlist/2G4JSLZYCR36C">
            Amazon wishlist
           </a>
        </p>
        <p>
          For the less traditional we are also happy to receive money, as
          anything we get will be going towards helping us fund our honeymoon
          which we'll be planning once the wedding is done. There will be a
          place set up during the cocktail hour between the ceremony and the
          reception for anyone who would like to give us a card.
        </p>
        <p>
          For anyone who would like to send us stuff at our home, our address
          is
            <pre>
              B2-90 Heath Street W.<br/>
              Toronto, Ontario<br/>
              Canada M4v 1T4
            </pre>
        </p>
      </div>
    </Paper>
  );

}

export default Gifts;
