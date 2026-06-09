import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { Home, Bookmark, ChevronRight, LogOut } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { getFilmes, getFilmesFavoritos } from '../services/userFilmesApi';
import { getSession, logout } from '../services/authService';
import { navigateToWelcome } from '../utils/navigation';

const QUICK_ACTIONS = [
  { icon: Home, label: 'Catálogo', tab: 'Início' },
  { icon: Bookmark, label: 'Favoritos', tab: 'Minha Lista' },
];

export default function ProfileScreen({ navigation }) {
  const [favCount, setFavCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const [all, fav, session] = await Promise.all([
        getFilmes(),
        getFilmesFavoritos(),
        getSession(),
      ]);
      setTotalCount(all.data.length);
      setFavCount(fav.data.length);
      setUserName(session?.name || 'Usuário');
    } catch {
      setTotalCount(0);
      setFavCount(0);
      setUserName('Usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.title}>MOBA</Text>
          <Text style={styles.subtitle}>Olá, {userName}</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'No catálogo', value: loading ? '...' : String(totalCount) },
            { label: 'Favoritos', value: loading ? '...' : String(favCount) },
          ].map(({ label, value }, index) => (
            <View
              key={label}
              style={[styles.statItem, index === 1 && styles.statItemLast]}
            >
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Acesso rápido</Text>
        <View style={styles.actionsList}>
          {QUICK_ACTIONS.map(({ icon, label, tab }, index) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.actionItem,
                index === QUICK_ACTIONS.length - 1 && styles.actionItemLast,
              ]}
              onPress={() => navigation.navigate(tab)}
              activeOpacity={0.7}
            >
              <Icon as={icon} size={18} color={COLORS.white} style={styles.actionIcon} />
              <Text style={styles.actionLabel}>{label}</Text>
              <Icon as={ChevronRight} size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={async () => {
            await logout();
            navigateToWelcome(navigation);
          }}
          activeOpacity={0.85}
        >
          <Icon as={LogOut} size={16} color={COLORS.white} />
          <Text style={styles.switchBtnText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MOBA v1.0.0 · AVP2</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingTop: SPACING.md },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: FONTS.black,
  },
  title: {
    color: COLORS.red,
    fontSize: 28,
    fontWeight: FONTS.black,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderRightWidth: 0.5,
    borderRightColor: COLORS.surface2,
  },
  statItemLast: { borderRightWidth: 0 },
  statValue: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: FONTS.black,
  },
  statLabel: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#e5e5e5',
    fontSize: 16,
    fontWeight: FONTS.bold,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  actionsList: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface2,
    gap: 12,
  },
  actionItemLast: { borderBottomWidth: 0 },
  actionIcon: { width: 28 },
  actionLabel: { color: COLORS.white, fontSize: 14, flex: 1 },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surface3,
  },
  switchBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: FONTS.bold,
  },
  version: {
    color: COLORS.grayDark,
    fontSize: 12,
    textAlign: 'center',
  },
});
