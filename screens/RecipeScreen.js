import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import * as Font from 'expo-font';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import RecipeCard from './RecipeCard';
import firebase from 'firebase';

let customFonts = {
  Pacifo: require('../assets/fonts/SunnyspellsRegular-MV9ze.otf'),
};

let recipes = require('./temp_recipes.json');

export default class RecipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      recipes: recipes,
      light_theme: true,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchRecipes();
    this.fetchUser();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' });
      });
  };

  fetchRecipes =async () => {
    await firebase
      .database()
      .ref('/recipes/')
      .on(
        'value',
        (snapshot) => {
          let recipes = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              recipes.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
          }
          this.setState({ recipes: recipes });
          //this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
        }
      );
  };

  renderItem = ({ item: recipe }) => {
    return <RecipeCard recipe={recipe} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/icon.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                FOODY RECIPES
              </Text>
            </View>
          </View>
         {!this.state.recipes[0] ? (
            <View style={styles.noRecipes}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.noStoriesTextLight
                    : styles.noStoriesText
                }>
                No Recipes Available
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.recipes}
                renderItem={this.renderItem}
              />
            </View>
          )}
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(33),
    fontFamily: 'Pacifo',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Pacifo',
  },
  cardContainer: {
    flex: 0.85,
  },
  noRecipes: {
    flex: 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecipesTextLight: {
    fontSize: RFValue(40),
    fontFamily: 'Pacifo',
  },
  noRecipesText: {
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Pacifo',
  },
});