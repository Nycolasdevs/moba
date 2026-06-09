import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#E50914',
    background: '#141414',
    card: '#1f1f1f',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.08)',
    notification: '#E50914',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        ...(Platform.OS === 'web' ? { minHeight: '100vh', width: '100%' } : {}),
      }}
    >
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
