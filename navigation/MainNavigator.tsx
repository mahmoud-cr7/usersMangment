import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import BottomTabsNavigator from "./BottomTabsNavigator";

export type MainStackParamList = {
  Main: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={BottomTabsNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
