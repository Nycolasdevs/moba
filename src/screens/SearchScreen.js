import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { Film } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { getFilmes } from '../services/userFilmesApi';
import { adaptFilme, GENRES } from '../utils/filmeAdapter';
import { useResponsive } from '../hooks/useResponsive';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

export default function SearchScreen({ navigation }) {
  const { gridColumns, gridCardWidth, gridGap, screenTitleSize } = useResponsive();
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('Todos');
  

  const fetchFilmes = useCallback(async () => {
    try {
      const { data } = await getFilmes();
      setFilmes(data.map(adaptFilme));
    } catch {
      setFilmes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFilmes();
    }, [fetchFilmes])
  );

  const results = useMemo(() => {
    let list = filmes;
    if (activeGenre !== 'Todos') {
      list = list.filter((m) => m.genre.includes(activeGenre));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q)) ||
          m.desc.toLowerCase().includes(q) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          (m.cast && m.cast.some((c) => c.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [query, activeGenre, filmes]);

  const handlePress = useCallback((movie) => {
    navigation.navigate('Details', { id: movie.id });
  }, [navigation]);

  const handleUpdated = useCallback((updated) => {
    setFilmes((prev) =>
      prev.map((m) => (m.id === updated.id ? adaptFilme(updated) : m))
    );
    setSelectedMovie(adaptFilme(updated));
  }, []);

  const handleDeleted = useCallback((id) => {
    setFilmes((prev) => prev.filter((m) => m.id !== id));
    setSelectedMovie(null);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={[styles.cardWrapper, { width: gridCardWidth }]}>
        <MovieCard
          movie={item}
          onPress={handlePress}
          width={gridCardWidth}
          style={styles.gridCard}
        />
      </View>
    ),
    [handlePress, gridCardWidth]
  );

  const showCount = query.length > 0 || activeGenre !== 'Todos';

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
        <Text style={[styles.screenTitle, { fontSize: screenTitleSize }]}>Buscar</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
        />

        <FlatList
          data={GENRES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.genreBtn, activeGenre === item && styles.genreBtnActive]}
              onPress={() => setActiveGenre(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.genreText, activeGenre === item && styles.genreTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {showCount && (
        <Text style={styles.resultsCount}>
          {results.length} resultado{results.length !== 1 ? 's' : ''}
        </Text>
      )}

      {results.length === 0 ? (
        <View style={styles.empty}>
          <Icon as={Film} size={48} color={COLORS.gray} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
          <Text style={styles.emptyHint}>Tente outro termo ou gênero</Text>
        </View>
      ) : (
        <FlatList
          key={`search-grid-${gridColumns}`}
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={gridColumns}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={[styles.row, { gap: gridGap }]}
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
  header: { paddingTop: SPACING.md },
  screenTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: FONTS.black,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  genreList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: 8,
  },
  genreBtn: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 4,
  },
  genreBtnActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  genreText: {
    color: COLORS.gray,
    fontSize: 13,
    fontWeight: FONTS.semibold,
  },
  genreTextActive: { color: COLORS.white },
  resultsCount: {
    color: COLORS.gray,
    fontSize: 12,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
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
  cardWrapper: {},
  gridCard: {
    marginRight: 0,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIcon: { marginBottom: 8 },
  emptyText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold,
  },
  emptyHint: { color: COLORS.gray, fontSize: 14 },
});
