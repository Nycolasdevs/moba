import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Star } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import DeleteMovieModal from '../components/DeleteMovieModal';
import MoviePosterCarousel from '../components/MoviePosterCarousel';
import { getFilmes, getFilmeById, toggleFavorito } from '../services/userFilmesApi';
import { deleteFilme as deleteAdminFilme } from '../services/adminFilmesApi';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

export default function MovieDetailsScreen({ route, navigation }) {
  const { titleSize } = useResponsive();
  const { id } = route.params;
  const [filme, setFilme] = useState(null);
  const [allFilmes, setAllFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [{ data: catalog }, { data: current }] = await Promise.all([
        getFilmes(),
        getFilmeById(id),
      ]);
      setAllFilmes(catalog);
      setFilme(current);
    } catch {
      Alert.alert('Erro', 'Filme não encontrado.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectMovie = async (movie) => {
    if (movie.id === filme?.id) return;

    try {
      setLoading(true);
      const { data } = await getFilmeById(movie.id);
      setFilme(data);
      navigation.setParams({ id: movie.id });
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar este filme.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    if (!deleting) setDeleteModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteAdminFilme(filme.id);
      setDeleteModalVisible(false);
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel excluir.');
      setDeleting(false);
    }
  };

  const handleToggleFavorito = async () => {
    if (!filme) return;
    try {
      setFavLoading(true);
      const { data } = await toggleFavorito(filme.id, !filme.favorito);
      setFilme(data);
      setAllFilmes((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o favorito.');
    } finally {
      setFavLoading(false);
    }
  };

  if (loading && !filme) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  if (!filme) return null;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar style="light" />

      <MoviePosterCarousel
        movies={allFilmes}
        selectedId={filme.id}
        onSelect={handleSelectMovie}
      />

      {loading ? (
        <View style={styles.inlineLoading}>
          <ActivityIndicator size="small" color={COLORS.red} />
        </View>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.badge}>DETALHES</Text>
        <Text style={[styles.title, { fontSize: titleSize }]}>{filme.titulo}</Text>

        <View style={styles.metaRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{filme.genero}</Text>
          </View>
          <Text style={styles.year}>{filme.ano}</Text>
        </View>

        {filme.desc ? (
          <Text style={styles.desc}>{filme.desc}</Text>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btnFav, filme.favorito && styles.btnFavActive]}
            onPress={handleToggleFavorito}
            disabled={favLoading}
            activeOpacity={0.85}
          >
            <Icon
              as={Star}
              size={16}
              color={filme.favorito ? '#f5c518' : COLORS.white}
              fill={filme.favorito ? '#f5c518' : 'transparent'}
            />
            <Text style={[styles.btnFavText, filme.favorito && styles.btnFavTextActive]}>
              {filme.favorito ? 'Favorito' : 'Favoritar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() => setDeleteModalVisible(true)}
            disabled={deleting}
            activeOpacity={0.85}
          >
            <Text style={styles.btnDeleteText}>{deleting ? '...' : 'Excluir do catálogo'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </View>

      <DeleteMovieModal
        visible={deleteModalVisible}
        title={filme.titulo}
        loading={deleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  inlineLoading: { alignItems: 'center', paddingVertical: 8 },
  content: { padding: SPACING.lg, paddingTop: SPACING.sm },
  badge: { color: COLORS.red, fontSize: 11, fontWeight: FONTS.bold, letterSpacing: 1, marginBottom: 8 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: FONTS.black, marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.lg },
  tag: { backgroundColor: COLORS.red, paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.sm },
  tagText: { color: COLORS.white, fontSize: 12, fontWeight: FONTS.bold },
  year: { color: COLORS.gray, fontSize: 16 },
  desc: { color: '#ccc', fontSize: 14, lineHeight: 22, marginBottom: SPACING.lg },
  actions: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },
  btnFav: {
    backgroundColor: COLORS.surface2,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
  },
  btnFavActive: { backgroundColor: 'rgba(245,197,24,0.15)', borderColor: '#f5c518' },
  btnFavText: { color: COLORS.white, fontSize: 15, fontWeight: FONTS.bold },
  btnFavTextActive: { color: '#f5c518' },
  btnDelete: { backgroundColor: COLORS.red, flex: 1, paddingVertical: 12, borderRadius: RADIUS.sm, alignItems: 'center' },
  btnDeleteText: { color: COLORS.white, fontSize: 16, fontWeight: FONTS.bold },
});
