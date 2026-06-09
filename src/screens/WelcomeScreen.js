import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

export default function WelcomeScreen({ navigation }) {
  const { formPadding, isCompact } = useResponsive();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={[styles.content, { padding: formPadding }]}>
        <Text style={[styles.logo, isCompact && styles.logoCompact]}>MOBA</Text>
        <Text style={styles.tagline}>Catálogo de Filmes e Séries</Text>
        <Text style={styles.desc}>
          Entre na sua conta ou crie uma nova para explorar o catálogo,
          favoritar títulos e acompanhar suas séries.
        </Text>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logo: {
    color: COLORS.red,
    fontSize: 52,
    fontWeight: FONTS.black,
    letterSpacing: 4,
    textAlign: 'center',
  },
  logoCompact: {
    fontSize: 42,
  },
  tagline: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: SPACING.lg,
  },
  desc: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  btnPrimary: {
    backgroundColor: COLORS.red,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  btnPrimaryText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONTS.bold,
  },
  btnSecondary: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surface3,
  },
  btnSecondaryText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONTS.bold,
  },
});
