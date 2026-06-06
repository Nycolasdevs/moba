import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';
import { COLORS, FONTS, SPACING } from '../theme';

export default function MovieRow({ title, movies, onPress }) {
  if (!movies || movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onPress={onPress} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
  },
});
