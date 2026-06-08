import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { User, Wrench } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.logo}>MOBA</Text>
        <Text style={styles.tagline}>Catálogo de Filmes e Séries</Text>
        <Text style={styles.desc}>
          Escolha como deseja entrar. O administrador gerencia o catálogo; o usuário
          visualiza e favorita títulos em tempo real.
        </Text>

        <TouchableOpacity
          style={styles.btnUser}
          onPress={() => navigation.replace('UserApp')}
          activeOpacity={0.85}
        >
          <Icon as={User} size={32} color={COLORS.white} style={styles.btnIcon} />
          <View style={styles.btnTexts}>
            <Text style={styles.btnTitle}>Entrar como Usuário</Text>
            <Text style={styles.btnSub}>
              Catálogo · Detalhes · Favoritos
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnAdmin}
          onPress={() => navigation.replace('AdminApp')}
          activeOpacity={0.85}
        >
          <Icon as={Wrench} size={32} color={COLORS.red} style={styles.btnIcon} />
          <View style={styles.btnTexts}>
            <Text style={styles.btnTitle}>Entrar como Administrador</Text>
            <Text style={styles.btnSub}>
              Adicionar · Editar · Excluir filmes
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.servers}>
          <Text style={styles.serverLabel}>Servidores locais (JSON Server)</Text>
          <View style={styles.serverItem}>
            <Icon as={User} size={14} color={COLORS.white} />
            <Text style={styles.serverText}>Usuário → porta 3000</Text>
          </View>
          <View style={styles.serverItem}>
            <Icon as={Wrench} size={14} color={COLORS.white} />
            <Text style={styles.serverText}>Admin → porta 3001</Text>
          </View>
          <Text style={styles.serverHint}>Execute: npm run server</Text>
        </View>
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
  btnUser: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surface3,
  },
  btnAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229,9,20,0.12)',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  btnIcon: {
    marginRight: SPACING.md,
  },
  btnTexts: { flex: 1 },
  btnTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONTS.bold,
    marginBottom: 4,
  },
  btnSub: {
    color: COLORS.gray,
    fontSize: 13,
  },
  servers: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  serverLabel: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  serverText: {
    color: COLORS.white,
    fontSize: 13,
  },
  serverHint: {
    color: COLORS.grayDark,
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
