import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Home, Search, Bookmark, User } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import { COLORS, FONTS } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MyListScreen from '../screens/MyListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Início: Home,
  Buscar: Search,
  'Minha Lista': Bookmark,
  Perfil: User,
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(20,20,20,0.97)',
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: 0.5,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused }) => (
          <Icon
            as={TAB_ICONS[route.name]}
            size={22}
            color={focused ? COLORS.white : COLORS.gray}
            strokeWidth={focused ? 2.5 : 2}
          />
        ),
        tabBarLabel: ({ focused, children }) => (
          <Text
            style={{
              color: focused ? COLORS.white : COLORS.gray,
              fontSize: 10,
              fontWeight: focused ? FONTS.bold : FONTS.regular,
            }}
          >
            {children}
          </Text>
        ),
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.gray,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Minha Lista" component={MyListScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
