import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DeleteMovieModal from '../../components/DeleteMovieModal';
import MoviePosterCarousel from '../../components/MoviePosterCarousel';
import { getFilmes, getFilmeById, deleteFilme } from '../../services/adminFilmesApi';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';

export default function AdminDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [filme, setFilme] = useState(null);
  const [allFilmes, setAllFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
      await deleteFilme(filme.id);
      setDeleteModalVisible(false);
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel excluir.');
      setDeleting(false);
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
        <Text style={styles.badge}>DETALHES · ADMIN</Text>
        <Text style={styles.title}>{filme.titulo}</Text>

        <View style={styles.metaRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{filme.genero}</Text>
          </View>
          <Text style={styles.year}>{filme.ano}</Text>
        </View>

        {filme.desc ? (
          <Text style={styles.desc}>{filme.desc}</Text>
        ) : null}

        <Text style={styles.fieldLabel}>URL da capa</Text>
        <Text style={styles.fieldValue} numberOfLines={2}>{filme.capa}</Text>

        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => setDeleteModalVisible(true)}
          disabled={deleting}
          activeOpacity={0.85}
        >
          {deleting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.btnDeleteText}>Excluir do catálogo</Text>
          )}
        </TouchableOpacity>
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
  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineLoading: { alignItems: 'center', paddingVertical: 8 },
  content: { padding: SPACING.lg, paddingTop: SPACING.sm },
  badge: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: FONTS.black,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.lg,
  },
  tag: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: FONTS.bold,
  },
  year: { color: COLORS.gray, fontSize: 16 },
  desc: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fieldValue: {
    color: COLORS.white,
    fontSize: 13,
    marginBottom: SPACING.xl,
  },
  btnDelete: {
    backgroundColor: COLORS.red,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  btnDeleteText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
});
