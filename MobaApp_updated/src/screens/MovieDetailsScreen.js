import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, StyleSheet, ActivityIndicator,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getFilmeById as getUserFilmeById, toggleFavorito } from '../services/userFilmesApi';
import { deleteFilme as deleteAdminFilme } from '../services/adminFilmesApi';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

export default function MovieDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [filme, setFilme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const fetchFilme = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getUserFilmeById(id);
      setFilme(data);
    } catch {
      Alert.alert('Erro', 'Filme não encontrado.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchFilme();
  }, [fetchFilme]);

  const handleDelete = () => {
    Alert.alert(
      'Excluir filme',
      `Remover "${filme?.titulo}" do catálogo? Isso afetará todos os usuários.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteAdminFilme(id);
              navigation.goBack();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir.');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorito = async () => {
    if (!filme) return;
    try {
      setFavLoading(true);
      const { data } = await toggleFavorito(filme.id, !filme.favorito);
      setFilme(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o favorito.');
    } finally {
      setFavLoading(false);
    }
  };

  if (loading || !filme) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar style="light" />
      <Image source={{ uri: filme.capa }} style={styles.cover} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.badge}>DETALHES</Text>
        <Text style={styles.title}>{filme.titulo}</Text>

        <View style={styles.metaRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{filme.genero}</Text>
          </View>
          <Text style={styles.year}>{filme.ano}</Text>
        </View>

        {filme.desc && (
          <Text style={styles.desc}>{filme.desc}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btnFav, filme.favorito && styles.btnFavActive]}
            onPress={handleToggleFavorito}
            disabled={favLoading}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnFavText, filme.favorito && styles.btnFavTextActive]}>
              {filme.favorito ? '★  Favorito' : '☆  Favoritar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={handleDelete}
            disabled={deleting}
            activeOpacity={0.85}
          >
            <Text style={styles.btnDeleteText}>{deleting ? '...' : 'Excluir do catálogo'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>URL da capa</Text>
        <Text style={styles.fieldValue} numberOfLines={2}>{filme.capa}</Text>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  cover: { width: '100%', height: 380, backgroundColor: COLORS.surface2 },
  content: { padding: SPACING.lg },
  badge: { color: COLORS.red, fontSize: 11, fontWeight: FONTS.bold, letterSpacing: 1, marginBottom: 8 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: FONTS.black, marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.lg },
  tag: { backgroundColor: COLORS.red, paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.sm },
  tagText: { color: COLORS.white, fontSize: 12, fontWeight: FONTS.bold },
  year: { color: COLORS.gray, fontSize: 16 },
  desc: { color: '#ccc', fontSize: 14, lineHeight: 22, marginBottom: SPACING.lg },
  actions: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },
  btnFav: { backgroundColor: COLORS.surface2, flex: 1, paddingVertical: 12, borderRadius: RADIUS.sm, alignItems: 'center' },
  btnFavActive: { backgroundColor: 'rgba(245,197,24,0.15)', borderColor: '#f5c518' },
  btnFavText: { color: COLORS.white, fontSize: 15, fontWeight: FONTS.bold },
  btnFavTextActive: { color: '#f5c518' },
  btnDelete: { backgroundColor: COLORS.red, flex: 1, paddingVertical: 12, borderRadius: RADIUS.sm, alignItems: 'center' },
  btnDeleteText: { color: COLORS.white, fontSize: 16, fontWeight: FONTS.bold },
  fieldLabel: { color: COLORS.gray, fontSize: 11, fontWeight: FONTS.bold, textTransform: 'uppercase', marginBottom: 4 },
  fieldValue: { color: COLORS.white, fontSize: 13, marginBottom: SPACING.xl },
});
