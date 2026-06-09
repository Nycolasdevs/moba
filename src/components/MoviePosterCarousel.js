import React, { useEffect, useRef, useMemo } from 'react';
import {
  View, Text, Image, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Film } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { useResponsive } from '../hooks/useResponsive';
import { COLORS, RADIUS, FONTS } from '../theme';

function PosterImage({ capa, style, iconSize = 32 }) {
  if (capa) {
    return (
      <Image source={{ uri: capa }} style={style} resizeMode="cover" />
    );
  }

  return (
    <LinearGradient colors={['#333', '#111']} style={style}>
      <Icon as={Film} size={iconSize} color="rgba(255,255,255,0.5)" />
    </LinearGradient>
  );
}

export default function MoviePosterCarousel({ movies, selectedId, onSelect }) {
  const listRef = useRef(null);
  const {
    heroPosterWidth,
    heroPosterHeight,
    thumbWidth,
    thumbHeight,
    thumbGap,
    titleSize,
    isCompact,
  } = useResponsive();

  const thumbItemSize = thumbWidth + thumbGap;
  const selectedMovie = movies.find((movie) => movie.id === selectedId);

  const styles = useMemo(() => StyleSheet.create({
    wrapper: {
      backgroundColor: COLORS.bg,
      paddingTop: 16,
      paddingBottom: 8,
    },
    heroSection: {
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    heroCard: {
      width: heroPosterWidth,
      height: heroPosterHeight,
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
      backgroundColor: COLORS.surface2,
      shadowColor: COLORS.red,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 12,
    },
    heroImage: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroRing: {
      ...StyleSheet.absoluteFillObject,
      borderWidth: 3,
      borderColor: COLORS.red,
      borderRadius: RADIUS.lg,
    },
    heroTitle: {
      color: COLORS.white,
      fontSize: titleSize,
      fontWeight: FONTS.black,
      textAlign: 'center',
      marginTop: 14,
      paddingHorizontal: 8,
    },
    heroMeta: {
      color: COLORS.gray,
      fontSize: isCompact ? 12 : 14,
      marginTop: 4,
      textAlign: 'center',
    },
    carouselLabel: {
      color: COLORS.gray,
      fontSize: 12,
      fontWeight: FONTS.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 4,
    },
    thumbCard: {
      width: thumbWidth,
      height: thumbHeight,
      marginRight: thumbGap,
      borderRadius: RADIUS.sm,
      overflow: 'hidden',
      backgroundColor: COLORS.surface2,
    },
    thumbCardInactive: {
      opacity: 0.5,
    },
    thumbCardActive: {
      opacity: 1,
    },
    thumbImage: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbRing: {
      ...StyleSheet.absoluteFillObject,
      borderWidth: 2,
      borderColor: COLORS.red,
      borderRadius: RADIUS.sm,
    },
  }), [heroPosterWidth, heroPosterHeight, thumbWidth, thumbHeight, thumbGap, titleSize, isCompact]);

  useEffect(() => {
    const index = movies.findIndex((movie) => movie.id === selectedId);
    if (index < 0 || !listRef.current) return;

    listRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  }, [selectedId, movies, thumbItemSize]);

  if (!movies.length || !selectedMovie) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.heroSection}>
        <View style={styles.heroCard}>
          <PosterImage
            capa={selectedMovie.capa}
            style={styles.heroImage}
            iconSize={isCompact ? 40 : 56}
          />
          <View style={styles.heroRing} />
        </View>
        <Text style={styles.heroTitle} numberOfLines={2}>{selectedMovie.titulo}</Text>
        <Text style={styles.heroMeta}>{selectedMovie.genero} · {selectedMovie.ano}</Text>
      </View>

      <Text style={styles.carouselLabel}>Outros filmes</Text>
      <FlatList
        ref={listRef}
        horizontal
        data={movies}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={thumbItemSize}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: thumbItemSize,
          offset: thumbItemSize * index,
          index,
        })}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;

          return (
            <TouchableOpacity
              style={[
                styles.thumbCard,
                isSelected ? styles.thumbCardActive : styles.thumbCardInactive,
              ]}
              onPress={() => onSelect(item)}
              activeOpacity={0.85}
            >
              <PosterImage capa={item.capa} style={styles.thumbImage} iconSize={20} />
              {isSelected ? <View style={styles.thumbRing} /> : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
