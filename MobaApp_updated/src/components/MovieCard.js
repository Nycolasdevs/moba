import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, CARD, RADIUS, FONTS } from '../theme';

export default function MovieCard({ movie, onPress, size = 'normal' }) {
  const isWide = size === 'wide';
  const width = isWide ? 200 : CARD.width;
  const height = isWide ? 115 : CARD.height;

  return (
    <TouchableOpacity
      style={[styles.card, { width, height }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}
    >
      {movie.capa ? (
        <View style={[styles.gradient, { width, height }]}>
          <Image source={{ uri: movie.capa }} style={styles.cover} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.bottomOverlay}
          >
            <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
            <Text style={styles.year}>{movie.year} · {movie.genre[0]}</Text>
          </LinearGradient>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{movie.rating}</Text>
          </View>
          {movie.favorito && (
            <View style={styles.favBadge}>
              <Text style={styles.favText}>★</Text>
            </View>
          )}
        </View>
      ) : (
        <LinearGradient
          colors={movie.colors}
          style={[styles.gradient, { width, height }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.emoji, { fontSize: isWide ? 36 : 44 }]}>{movie.emoji}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{movie.rating}</Text>
          </View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.bottomOverlay}
          >
            <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
            <Text style={styles.year}>{movie.year} · {movie.genre[0]}</Text>
          </LinearGradient>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginRight: 8,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    textAlign: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: FONTS.bold,
  },
  favBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  favText: {
    color: '#f5c518',
    fontSize: 10,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingTop: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: FONTS.bold,
  },
  year: {
    color: COLORS.gray,
    fontSize: 10,
    marginTop: 2,
  },
});
