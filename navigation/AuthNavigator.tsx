import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import LoginScreen from "@/screens/Auth/LoginScreen";

export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent back gesture on auth screens
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login",
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
