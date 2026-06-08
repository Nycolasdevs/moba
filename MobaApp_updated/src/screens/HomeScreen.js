import React, { useState, useCallback } from 'react';
import {
  View, ScrollView, StyleSheet, ActivityIndicator, Text, TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import { getFilmes } from '../services/userFilmesApi';
import { adaptFilme, buildRows } from '../utils/filmeAdapter';
import { COLORS, FONTS, SPACING } from '../theme';

export default function HomeScreen({ navigation }) {
  const [rawFilmes, setRawFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filmes = rawFilmes.map(adaptFilme);

  const fetchFilmes = useCallback(async () => {
    try {
      setError(null);
      const { data } = await getFilmes();
      setRawFilmes(data);
    } catch {
      setError('Servidor do usuário indisponível. Execute npm run server (porta 3000).');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFilmes();
    }, [fetchFilmes])
  );

  const featuredMovie = filmes.find((m) => m.featured) || filmes[0];
  const rows = buildRows(rawFilmes);

  const handleMoviePress = useCallback((movie) => {
    navigation.navigate('Details', { id: movie.id });
  }, [navigation]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Updates and deletions are handled by refetch on focus

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.red} />
        <Text style={styles.loadingText}>Carregando catálogo...</Text>
      </View>
    );
  }

  if (error && filmes.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchFilmes}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeroSection
          movie={featuredMovie}
          onPress={handleMoviePress}
          onInfo={handleMoviePress}
        />

        {rows.map((row) => (
          <MovieRow
            key={row.id}
            title={row.label}
            movies={row.movies}
            onPress={handleMoviePress}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Details now open in a dedicated screen via navigation */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  scroll: { flex: 1 },
  content: { paddingTop: 0 },
  loadingText: {
    color: COLORS.gray,
    marginTop: SPACING.md,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  retryBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
  },
});
