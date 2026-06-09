import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { COLORS } from '../theme';

export default function ResponsiveContainer({ children }) {
  const { width, isWide } = useResponsive();

  if (Platform.OS !== 'web') {
    return <View style={styles.native}>{children}</View>;
  }

  const maxWidth = isWide ? Math.min(width, 960) : width;

  return (
    <View style={styles.webOuter}>
      <View style={[styles.webInner, { width: maxWidth, maxWidth: '100%' }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
    width: '100%',
  },
  webOuter: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  webInner: {
    flex: 1,
    width: '100%',
  },
});
