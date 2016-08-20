import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import { Link } from 'react-router';


export default class App extends React.Component {
  render() {
    const options = {
      '/': 'Home',
      '/rsvp': 'RSVP',
      '/hotel': 'Hotels',
      '/registry': 'Registry'
    }

    const menuItems = Object.keys(options).map(key => {
      const link = <Link to={key}>{options[key]}</Link>;
      return (<MenuItem key={key} primaryText={link} />);
    });

    const menu = (
      <IconMenu
        children={menuItems}
        iconButtonElement={<IconButton><MenuIcon /></IconButton>}
      />
    );

    return (
      <div>
        <AppBar title="Jeff and Nicole's Wedding"
          iconElementLeft={menu}
        />
        { this.props.children }
      </div>
    );
  }
}
