import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import TabNavigator from './TabNavigator';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import { COLORS, FONTS } from '../theme';

const Stack = createNativeStackNavigator();

export default function UserNavigator() {
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
        name="Main"
        component={TabNavigator}
        options={({ navigation }) => ({
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('Welcome')}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: COLORS.gray, fontSize: 13 }}>Sair</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Details"
        component={MovieDetailsScreen}
        options={{ title: 'Detalhes' }}
      />
    </Stack.Navigator>
  );
}
