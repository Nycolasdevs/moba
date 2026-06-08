import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import MovieCard from '../components/MovieCard';
import { getFilmesFavoritos, toggleFavorito } from '../services/userFilmesApi';
import { adaptFilme } from '../utils/filmeAdapter';
import { COLORS, FONTS, SPACING } from '../theme';

export default function MyListScreen({ navigation }) {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const fetchFavoritos = useCallback(async () => {
    try {
      const { data } = await getFilmesFavoritos();
      setFilmes(data.map(adaptFilme));
    } catch {
      setFilmes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavoritos();
    }, [fetchFavoritos])
  );

  const handlePress = useCallback((movie) => {
    navigation.navigate('Details', { id: movie.id });
  }, [navigation]);

  const handleUpdated = useCallback((updated) => {
    const adapted = adaptFilme(updated);
    if (!updated.favorito) {
      setFilmes((prev) => prev.filter((m) => m.id !== updated.id));
      setModalVisible(false);
    } else {
      setFilmes((prev) =>
        prev.map((m) => (m.id === updated.id ? adapted : m))
      );
    }
    setSelectedMovie(adapted);
  }, []);

  const handleDeleted = useCallback((id) => {
    setFilmes((prev) => prev.filter((m) => m.id !== id));
    setSelectedMovie(null);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Minha Lista</Text>
        <Text style={styles.subtitle}>
          {filmes.length} título{filmes.length !== 1 ? 's' : ''} favorito
          {filmes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {filmes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>Sua lista está vazia</Text>
          <Text style={styles.emptyHint}>
            Toque em ☆ Favoritar nos detalhes de um filme
          </Text>
        </View>
      ) : (
        <FlatList
          data={filmes}
          keyExtractor={(item) => String(item.id)}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <MovieCard movie={item} onPress={handlePress} />
            </View>
          )}
        />
      )}

      {/* Details now open via navigation */}
    </View>
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
  header: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: FONTS.black,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  cardWrap: {},
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold,
    marginBottom: 8,
  },
  emptyHint: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
