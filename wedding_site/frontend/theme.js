import getMuiTheme from 'material-ui/styles/getMuiTheme';

const red = 'bf4d28';
const fadedRed = 'df6d48';
const orange = 'e6ac27';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: red,
    //primary2Color: 'bf4d28',
    //primary3Color: 'bf4d28',
    accent1Color: orange,
    //accent2Color: 'e6ac27',
    //accent3Color: 'e6ac27',
    //canvasColor: 'f6f7bd'
  },

  toggle: {
    trackOnColor: fadedRed
  }

});

export default muiTheme;
