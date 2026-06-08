import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Film, Star } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { COLORS, CARD, RADIUS, FONTS } from '../theme';

export default function MovieCard({ movie, onPress, size = 'normal', width: widthProp, style }) {
  const isWide = size === 'wide';
  const width = widthProp ?? (isWide ? 200 : CARD.width);
  const height = isWide
    ? 115
    : widthProp
      ? Math.round(width * (CARD.height / CARD.width))
      : CARD.height;

  return (
    <TouchableOpacity
      style={[styles.card, { width, height }, style]}
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
              <Icon as={Star} size={10} color="#f5c518" fill="#f5c518" />
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
          <Icon as={Film} size={isWide ? 36 : 44} color="rgba(255,255,255,0.85)" />
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
