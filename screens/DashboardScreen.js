import * as React from 'react';
import DrawerNavigator from '../navigations/DrawerNavigator'
import { NavigationContainer } from "@react-navigation/native";

export default function DashboardScreen() {
    return(
      <NavigationContainer>
        <DrawerNavigator/>
      </NavigationContainer>
    )
}