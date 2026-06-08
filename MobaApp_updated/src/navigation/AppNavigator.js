import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import { COLORS, FONTS } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bg },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: FONTS.bold },
        cardStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserApp"
        component={UserNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminApp"
        component={AdminNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
