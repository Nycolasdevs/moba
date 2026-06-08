import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import { ClipboardList, Plus } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import { navigateToWelcome } from '../utils/navigation';
import { COLORS, FONTS } from '../theme';

import AdminCatalogScreen from '../screens/admin/AdminCatalogScreen';
import AdminDetailsScreen from '../screens/admin/AdminDetailsScreen';
import AddMovieScreen from '../screens/AddMovieScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Catálogo: ClipboardList,
  Adicionar: Plus,
};

function AdminTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.bg },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: FONTS.bold },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigateToWelcome(navigation)}
            style={{ marginRight: 16 }}
          >
            <Text style={{ color: COLORS.gray, fontSize: 13 }}>Sair</Text>
          </TouchableOpacity>
        ),
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
      })}
    >
      <Tab.Screen
        name="Catálogo"
        component={AdminCatalogScreen}
        options={{ title: 'Painel Admin' }}
      />
      <Tab.Screen
        name="Adicionar"
        component={AddMovieScreen}
        options={{ title: 'Novo Filme', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
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
        name="AdminMain"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDetails"
        component={AdminDetailsScreen}
        options={{ title: 'Detalhes' }}
      />
    </Stack.Navigator>
  );
}
