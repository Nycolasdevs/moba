import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Info } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { useResponsive } from '../hooks/useResponsive';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

export default function HeroSection({ movie, onPress, onInfo }) {
  const { heroHeight, titleSize, isCompact } = useResponsive();

  if (!movie) return null;

  return (
    <View style={[styles.container, { height: heroHeight }]}>
      <View style={styles.bg}>
        {movie.capa ? (
          <Image source={{ uri: movie.capa }} style={styles.cover} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={[movie.colors[0], movie.colors[1]]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        <LinearGradient
          colors={['transparent', 'rgba(20,20,20,0.6)', '#141414']}
          style={[styles.overlay, { height: heroHeight * 0.75 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <View style={styles.content}>
          <View style={styles.genreRow}>
            {movie.genre.map((g, i) => (
              <View key={i} style={styles.genreTag}>
                <Text style={styles.genreText}>{g}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize + 2 }]}>
            {movie.title}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{movie.year}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{movie.duration}</Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageText}>{movie.ageRating}</Text>
            </View>
          </View>

          <Text style={styles.desc} numberOfLines={isCompact ? 2 : 3}>{movie.desc}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnPlay} onPress={() => onPress(movie)} activeOpacity={0.85}>
              <Icon as={Play} size={16} color="#000" fill="#000" />
              <Text style={styles.btnPlayText}>Assistir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnInfo} onPress={() => onInfo(movie)} activeOpacity={0.85}>
              <Icon as={Info} size={16} color={COLORS.white} />
              <Text style={styles.btnInfoText}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  bg: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  genreTag: {
    backgroundColor: COLORS.red,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  genreText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONTS.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.white,
    fontWeight: FONTS.black,
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadow: '1px 2px 10px rgba(0,0,0,0.8)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  metaDot: {
    color: COLORS.gray,
    fontSize: 13,
  },
  metaText: {
    color: COLORS.gray,
    fontSize: 13,
  },
  ageBadge: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
  },
  ageText: {
    color: COLORS.gray,
    fontSize: 11,
  },
  desc: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  btnPlay: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    flex: 1,
    minWidth: 140,
    justifyContent: 'center',
  },
  btnPlayText: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: '#000',
  },
  btnInfo: {
    backgroundColor: 'rgba(109,109,110,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    flex: 1,
    minWidth: 140,
    justifyContent: 'center',
  },
  btnInfoText: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
