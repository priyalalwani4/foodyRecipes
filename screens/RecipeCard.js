import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from 'firebase';

let customFonts = {
  "Pacifo": require("../assets/fonts/SunnyspellsRegular-MV9ze.otf")
};

export default class RecipeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      recipe_id: this.props.recipe.key,
      recipe_data: this.props.recipe.value,
      is_liked: false,
      likes: this.props.recipe.value ? this.props.recipe.value.likes : 0
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

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref("posts")
        .child(this.state.recipe_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes -= 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref("posts")
        .child(this.state.recipe_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes += 1), is_liked: true });
    }
  };

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

  render() {
    let recipe = this.state.recipe_data;
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let images = {
        "image_1": require('../assets/img1.jpg'),
        "image_2": require('../assets/img2.png'),
        "image_3": require('../assets/img3.jpg')
      }
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            this.props.navigation.navigate('RecipeDetailScreen', {
              recipe:recipe 
            })
            }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View
            style={
              this.state.light_theme
                ? styles.cardContainerLight
                : styles.cardContainer
            }
          >
            <Image
              source={images[recipe.preview_image] ? images[recipe.preview_image] : images["image_1"]}
              style={styles.recipeImage}
            ></Image>

            <View style={styles.titleContainer}>
              <View style={styles.titleTextContainer}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.storyTitleTextLight
                      : styles.storyTitleText
                  }
                >
                  {recipe.dish}
                </Text>
                <Text
                  style={
                     this.state.light_theme
                      ? styles.descriptionTextLight
                      : styles.descriptionText
                  }
                >
                  {recipe.description}
                </Text>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={
                    this.state.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }
               onPress={() => this.likeAction()}
              >
                <Ionicons
                  name={"heart"}
                  size={RFValue(30)}
                  color={this.state.light_theme ? "black" : "white"}
                />

                <Text
                  style={
                    this.state.light_theme
                      ? styles.likeTextLight
                      : styles.likeText
                  }
                >
                  {this.state.likes}
                  {/* 12k */}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        
      );
    }
  }
}

const styles = StyleSheet.create({
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#2e2e2e",
    borderRadius: RFValue(20)
  },
  cardContainerLight: {
    margin: RFValue(13),
    backgroundColor: "white",
    borderRadius: RFValue(20),
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: RFValue(0.5),
    shadowRadius: RFValue(5),
    elevation: RFValue(2)
  },
  recipeImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250)
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  titleTextContainer: {
    flex: 0.8
  },
  iconContainer: {
    flex: 0.2
  },
storyTitleText: {
    fontFamily: "Pacifo",
    fontSize: RFValue(25),
    color: "white"
  },
  storyTitleTextLight: {
    fontFamily: "Pacifo",
    fontSize: RFValue(25),
    color: "black"
  },
  storyAuthorText: {
    fontFamily: "Pacifo",
    fontSize: RFValue(18),
    color: "white"
  },
  storyAuthorTextLight: {
    fontFamily: "Pacifo",
    fontSize: RFValue(18),
    color: "black"
  },
  descriptionContainer: {
    marginTop: RFValue(5)
  },
  descriptionText: {
    fontFamily: "Pacifo",
    fontSize: RFValue(13),
    color: "white"
  },
  descriptionTextLight: {
    fontFamily: "Pacifo",
    fontSize: RFValue(13),
    color: "black"
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30)
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#eb3948",
    borderWidth: 2,
    borderRadius: RFValue(30)
  },
  likeText: {
    color: "white",
    fontFamily: "Pacifo",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6
  },
  likeTextLight: {
    color: 'black',
    fontFamily: "Pacifo",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6
  }
});