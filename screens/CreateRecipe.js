import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Button,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';

let customFonts = {
  "Pacifo": require('../assets/fonts/SunnyspellsRegular-MV9ze.otf'),
};

export default class CreateRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: 'image_1',
      dropdownHeight: 40,
      light_theme: true,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
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

  async addRecipe() {
    if (
      this.state.dish &&
      this.state.description &&
      this.state.recipe &&
      this.state.ingridients
    ) {
      let recipeData = {
        preview_image: this.state.previewImage,
        dish: this.state.dish,
        description: this.state.description,
        ingridients: this.state.ingridients,
        recipe: this.state.recipe,
        chef: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        chef_uid: firebase.auth().currentUser.uid,
        likes: 0,
      };
      await firebase
        .database()
        .ref('/recipes/' + Math.random().toString(36).slice(2))
        .set(recipeData)
        .then(function (snapshot) {});
        //this.props.setUpdateToTrue();
        this.props.navigation.navigate("RecipeScreen");
      this.setState({
        dish: '',
        recipe: '',
        ingridients: '',
        description: '',
      });

      Alert.alert('Success', 'Recipe has been successfully submitted!');
    } else {
      Alert.alert(
        'Error',
        'All fields are required!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let preview_images = {
        image_1: require('../assets/img1.jpg'),
        image_2: require('../assets/img2.png'),
        image_3: require('../assets/img3.jpg'),
        //   image_4: require('../assets/story_image_4.png'),
        //   image_5: require('../assets/story_image_5.png'),
      };
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
                Add Recipe
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                //source={require('../assets/img1.jpg')}
                style={styles.previewImage}></Image>

              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: ' Healthy Food', value: 'image_1' },
                    { label: 'Junk Food', value: 'image_2' },
                    { label: 'Deserts', value: 'image_3' },
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                    height: 40,
                    borderRadius: RFValue(20),
                    marginBottom: RFValue(20),
                    marginHorizontal: RFValue(10),
                  }}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 140 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={{ backgroundColor: 'transparent' }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  dropDownStyle={{
                    backgroundColor: '#E91e63',
                  }}
                  labelStyle={
                    this.state.light_theme
                      ? styles.dropdownLabelLight
                      : styles.dropdownLabel
                  }
                  arrowStyle={
                    this.state.light_theme
                      ? styles.dropdownLabelLight
                      : styles.dropdownLabel
                  }
                  onChangeItem={(item) =>
                    this.setState({
                      previewImage: item.value,
                    })
                  }
                />
              </View>
              <View style={{ marginHorizontal: RFValue(10) }}>
                <TextInput
                  style={[
                    this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont,
                    styles.inputFontExtra,
                    styles.inputTextBig
                  ]}
                  onChangeText={(dish) => this.setState({ dish })}
                  placeholder={'Dish'}
                  placeholderTextColor={this.state.light_theme ? 'black' : 'white'}
                />
                <TextInput
                  style={[
                    this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont,
                    styles.inputFontExtra,
                    styles.inputTextBig,
                  ]}
                  onChangeText={(description) => this.setState({ description })}
                  placeholder={'Description'}
                  multiline={true}
                  numberOfLines={4}
                  placeholderTextColor={ this.state.light_theme ? 'black' : 'white'}
                />
                <TextInput
                  style={[
                   this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont,
                    styles.inputFontExtra,
                    styles.inputTextBig,
                  ]}
                  onChangeText={(ingridients) => this.setState({ ingridients })}
                  placeholder={'Ingridients'}
                  multiline={true}
                  numberOfLines={4}
                  placeholderTextColor={this.state.light_theme ? 'black' : 'white'}
                />
                <TextInput
                  style={[
                    this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont,
                    styles.inputFontExtra,
                    styles.inputTextBig,
                  ]}
                  onChangeText={(recipe) => this.setState({ recipe })}
                  placeholder={'Recipe'}
                  multiline={true}
                  numberOfLines={20}
                  placeholderTextColor={this.state.light_theme ? 'black' : 'white'}
                />
              </View>
              <View style={styles.submitButton}>
                <Button
                  title={'Submit'}
                  color={this.state.light_theme? 'pink' : 'purple'}
                  onPress={() => {
                    this.addRecipe();
                  }}
                />
              </View>
            </ScrollView>
          </View>
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
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Pacifo',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Pacifo',
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: '93%',
    height: RFValue(250),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: 'white',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'white',
    fontFamily: 'Pacifo',
  },
  inputFontLight: {
    height: RFValue(40),
    borderColor: 'black',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'black',
    fontFamily: 'Pacifo',
  },
  dropdownLabel: {
    color: 'white',
    fontFamily: 'Pacifo',
  },
  dropdownLabelLight: {
    color: 'black',
    fontFamily: 'Pacifo',
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
