import React from 'react';
import { Link } from 'react-router'

import Paper from 'material-ui/Paper';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn
} from 'material-ui/Table';

const Hotel = (props) => {
  return (
    <Paper className='paper' style={{minHeight: '600px'}}>
      <div className='content'>
        <h2>Hotel</h2>
        <p>
          We have arranged a hotel block for November 5th at The Toronto Don
          Valley Hotel & Suites, located at 175 Wynford Drive. We have arranged
          a total of 15 rooms, which will be held until October 5th 2016, at
          which point any unbooked rooms will be released back into the general
          inventory for the hotel. The prices for the rooms we have reserved
          are as follows:
        </p>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn></TableHeaderColumn>
              <TableHeaderColumn>Single</TableHeaderColumn>
              <TableHeaderColumn>Double</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>Traditional</TableRowColumn>
              <TableRowColumn>$111.00</TableRowColumn>
              <TableRowColumn>$111.00</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Deluxe</TableRowColumn>
              <TableRowColumn>$131.00</TableRowColumn>
              <TableRowColumn>$131.00</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <p>
          Each guestroom has a choice of either 2 double beds or a king sized
          bed. A deluxe room is bigger than a standard room, with balconies on
          the 1st through 4th floors.
        </p>
        <p>
          The Toronto Don Valley Hotel & Suites is pet-friendly. You may bring
          a pet for an extra charge of $15.00 per stay.
        </p>
        <p>
          The hotel offers overnight parking for $11.95 plus tax, and allows
          for in and out charges. A full day charge is $3.50 for the first
          hour, and $1.50 per hour thereafter to a maximum of $11.95 plus tax.
        </p>
        <p>
          The hotel also offers a breakfast buffet and is near many restaurants.
        </p>
        <p>
          If you would like to book at the Toronto Don Valley Hotel & Suites,
          please call either 1-877-474-6835 or (416) 449-4111, and ask to book
          a guestroom for the Diggle &amp; Bain Wedding 2016.
        </p>
      </div>
    </Paper>
  );

}

export default Hotel;
