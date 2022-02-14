import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CreateRecipe from '../screens/CreateRecipe';
import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile';
import firebase from 'firebase';
import CustomSideBarMenu from '../screens/CustomSideBarMenu';

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
      isUpdated: false
    };
  }

  // changeUpdated(){
  //   this.setState({
  //     isUpdated: true
  //   })
  // }

  // removeUpdated(){
  //   this.setState({
  //     isUpdated: false
  //   })
  // }

  componentDidMount() {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value',(snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' ? true : false });
      });
  }

  // renderStack = (props) =>{
  //   return <StackNavigator setUpdateToFalse={this.removeUpdated} {...props}/>
  // }

  // renderCreateRecipe = (props) =>{
  //   return <CreateRecipe setUpdateToTrue={this.changeUpdated} {...props}/>
  // }

  render() {
    let props = this.props;
    return (
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#121212',
          inactiveTintColor: this.state.light_theme ? '#121212' : 'white',
          itemStyle: { marginVertical: 5 },
        }}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: '#e91e63',
          drawerInactiveTintColor: 'lightblue',
        }}
        drawerContent={(props) => <CustomSideBarMenu {...props} />}
        initialRouteName="Home">
        <Drawer.Screen name="Home" component={StackNavigator} />
        <Drawer.Screen name="Create Recipe" component={CreateRecipe} />
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    );
  }
}

