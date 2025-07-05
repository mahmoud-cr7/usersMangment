import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

import BottomSheetLogin from "@/components/BottomSheetLogin";
import { useAuth } from "@/hooks/useAuth";
import ProfileScreen from "@/screens/Profile/ProfileScreen";
import UsersStackNavigator from "./UsersStackNavigator";

export type BottomTabsParamList = {
  UsersStack: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

interface BottomTabsNavigatorProps {
  setIsHandlingDeepLink?: (value: boolean) => void;
}

const BottomTabsNavigator: React.FC<BottomTabsNavigatorProps> = ({ setIsHandlingDeepLink }) => {
  const { isGuest } = useAuth();
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  // Handle deep link completion
  useEffect(() => {
    if (setIsHandlingDeepLink) {
      const timer = setTimeout(() => {
        setIsHandlingDeepLink(false);
      }, 2000); // Wait 2 seconds after mount to ensure deep link is handled

      return () => clearTimeout(timer);
    }
  }, [setIsHandlingDeepLink]);

  return (
    <>
      <Tab.Navigator
        initialRouteName="UsersStack"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === "UsersStack") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else {
              iconName = "help-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: styles.tabBar,
          headerShown: false,
          tabBarLabelStyle: styles.tabBarLabel,
        })}
      >
        <Tab.Screen
          name="UsersStack"
          component={UsersStackNavigator}
          options={{
            title: "Users",
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Profile",
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (isGuest) {
                e.preventDefault();
                setShowLoginSheet(true);
              }
            },
          })}
        />
      </Tab.Navigator>

      <BottomSheetLogin
        isVisible={showLoginSheet}
        onClose={() => setShowLoginSheet(false)}
        title="Profile Access Required"
        message="Please login to view and manage your profile information"
      />
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 10,
    height: Platform.OS === "ios" ? 88 : 68,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default BottomTabsNavigator;