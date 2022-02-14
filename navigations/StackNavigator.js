import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen' ;

const Stack =createStackNavigator();

export default function StackNavigator(){
  return(
    <Stack.Navigator initialRouteName={"Home"} screenOptions={{headerShown:false}}>
      <Stack.Screen name="RecipeScreen" component={RecipeScreen}/>
      <Stack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen}/>
    </Stack.Navigator>
  )
}