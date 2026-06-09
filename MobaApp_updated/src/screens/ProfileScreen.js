import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { getFilmes, getFilmesFavoritos } from '../services/userFilmesApi';
import { navigateToWelcome } from '../utils/navigation';

const PLANS = [
  { name: 'Basic', price: 'R$ 18,90/mês', features: ['1 tela', 'HD 1080p', 'Anúncios'] },
  { name: 'Standard', price: 'R$ 34,90/mês', features: ['2 telas', 'Full HD', 'Sem anúncios'], current: true },
  { name: 'Premium', price: 'R$ 49,90/mês', features: ['4 telas', '4K + HDR', 'Downloads'] },
];

const SETTINGS = [
  { icon: '🔔', label: 'Notificações' },
  { icon: '📱', label: 'Dispositivos conectados' },
  { icon: '🔐', label: 'Privacidade e segurança' },
  { icon: '🌐', label: 'Idioma' },
  { icon: '📺', label: 'Qualidade de streaming' },
  { icon: '❓', label: 'Ajuda e suporte' },
];

export default function ProfileScreen({ navigation }) {
  const [favCount, setFavCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [all, fav] = await Promise.all([getFilmes(), getFilmesFavoritos()]);
      setTotalCount(all.data.length);
      setFavCount(fav.data.length);
    } catch {
      setTotalCount(0);
      setFavCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const handleAction = (label) => {
    Alert.alert('MOBA', `${label} em breve!`, [{ text: 'OK' }]);
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <Text style={styles.name}>Meu Perfil</Text>
          <Text style={styles.email}>usuario@moba.com</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>✦ MOBA Standard</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Catálogo', value: loading ? '...' : String(totalCount) },
            { label: 'Favoritos', value: loading ? '...' : String(favCount) },
            { label: 'Horas', value: '138' },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statItem}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => navigateToWelcome(navigation)}
          activeOpacity={0.85}
        >
          <Text style={styles.switchBtnText}>↩  Trocar perfil (Usuário / Admin)</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Planos</Text>
        <View style={styles.plansRow}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.name}
              style={[styles.planCard, plan.current && styles.planCardActive]}
              onPress={() => !plan.current && handleAction(`Trocar para ${plan.name}`)}
              activeOpacity={plan.current ? 1 : 0.8}
            >
              {plan.current && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Atual</Text>
                </View>
              )}
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              {plan.features.map((f) => (
                <Text key={f} style={styles.planFeature}>• {f}</Text>
              ))}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.settingsList}>
          {SETTINGS.map(({ icon, label }, index) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.settingItem,
                index === SETTINGS.length - 1 && styles.settingItemLast,
              ]}
              onPress={() => handleAction(label)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingIcon}>{icon}</Text>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MOBA v1.0.0 · Feito com ❤️</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingTop: SPACING.md },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: FONTS.black,
  },
  name: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: FONTS.bold,
    marginBottom: 4,
  },
  email: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  planBadge: {
    backgroundColor: 'rgba(229,9,20,0.15)',
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  planBadgeText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: FONTS.bold,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRightWidth: 0.5,
    borderRightColor: COLORS.surface2,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: FONTS.black,
  },
  statLabel: {
    color: COLORS.gray,
    fontSize: 11,
    marginTop: 2,
  },
  addBtn: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.red,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.bold,
  },
  switchBtn: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surface3,
  },
  switchBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: FONTS.bold,
  },
  sectionTitle: {
    color: '#e5e5e5',
    fontSize: 16,
    fontWeight: FONTS.bold,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  plansRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: 8,
    marginBottom: SPACING.xl,
  },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardActive: {
    borderColor: COLORS.red,
    backgroundColor: 'rgba(229,9,20,0.08)',
  },
  currentBadge: {
    position: 'absolute',
    top: -9,
    right: 8,
    backgroundColor: COLORS.red,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currentBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: FONTS.bold,
  },
  planName: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: FONTS.bold,
    marginBottom: 4,
  },
  planPrice: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: FONTS.bold,
    marginBottom: 6,
  },
  planFeature: {
    color: COLORS.gray,
    fontSize: 10,
    lineHeight: 16,
  },
  settingsList: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface2,
    gap: 12,
  },
  settingItemLast: { borderBottomWidth: 0 },
  settingIcon: { fontSize: 18, width: 28 },
  settingLabel: { color: COLORS.white, fontSize: 14, flex: 1 },
  settingArrow: { color: COLORS.gray, fontSize: 20 },
  logoutBtn: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: SPACING.md,
  },
  logoutText: {
    color: COLORS.red,
    fontSize: 15,
    fontWeight: FONTS.bold,
  },
  version: {
    color: COLORS.grayDark,
    fontSize: 12,
    textAlign: 'center',
  },
});
