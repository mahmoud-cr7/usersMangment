import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import AddEditUserScreen from "@/screens/Users/AddEditUserScreen";
import UserDetailsScreen from "@/screens/Users/UserDetailsScreen";
import UsersScreen from "@/screens/Users/UsersScreen";

export type UsersStackParamList = {
  UsersList: undefined;
  UserDetails: { userId: string };
  AddEditUser: { userId?: string };
};

const Stack = createNativeStackNavigator<UsersStackParamList>();

const UsersStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="UsersList"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#007AFF",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="UsersList"
        component={UsersScreen}
        options={{
          title: "Users",
        }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{
          title: "User Details",
        }}
      />
      <Stack.Screen
        name="AddEditUser"
        component={AddEditUserScreen}
        options={({ route }) => ({
          title: route.params?.userId ? "Edit User" : "Add User",
        })}
      />
    </Stack.Navigator>
  );
};

export default UsersStackNavigator;
