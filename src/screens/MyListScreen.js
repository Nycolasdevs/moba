import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { Bookmark, Star } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import MovieCard from '../components/MovieCard';
import { getFilmesFavoritos, toggleFavorito } from '../services/userFilmesApi';
import { adaptFilme } from '../utils/filmeAdapter';
import { useResponsive } from '../hooks/useResponsive';
import { COLORS, FONTS, SPACING } from '../theme';

export default function MyListScreen({ navigation }) {
  const { gridColumns, gridCardWidth, gridGap, screenTitleSize } = useResponsive();
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
        <Text style={[styles.title, { fontSize: screenTitleSize }]}>Minha Lista</Text>
        <Text style={styles.subtitle}>
          {filmes.length} título{filmes.length !== 1 ? 's' : ''} favorito
          {filmes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {filmes.length === 0 ? (
        <View style={styles.empty}>
          <Icon as={Bookmark} size={48} color={COLORS.gray} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Sua lista está vazia</Text>
          <View style={styles.emptyHintRow}>
            <Text style={styles.emptyHint}>Toque em </Text>
            <Icon as={Star} size={14} color={COLORS.gray} />
            <Text style={styles.emptyHint}> Favoritar nos detalhes de um filme</Text>
          </View>
        </View>
      ) : (
        <FlatList
          key={`list-grid-${gridColumns}`}
          data={filmes}
          keyExtractor={(item) => String(item.id)}
          numColumns={gridColumns}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={[styles.row, { gap: gridGap }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.cardWrap, { width: gridCardWidth }]}>
              <MovieCard
                movie={item}
                onPress={handlePress}
                width={gridCardWidth}
                style={styles.gridCard}
              />
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
  gridCard: {
    marginRight: 0,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyIcon: { marginBottom: SPACING.md },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold,
    marginBottom: 8,
  },
  emptyHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emptyHint: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
