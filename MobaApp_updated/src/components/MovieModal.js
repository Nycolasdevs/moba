import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, Dimensions, Alert, Image, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { toggleFavorito } from '../services/userFilmesApi';

const { height } = Dimensions.get('window');

export default function MovieModal({ movie, visible, onClose, onUpdated, onDeleted }) {
  const [loading, setLoading] = useState(false);

  if (!movie) return null;

  const imdbNum = parseFloat(movie.imdb || '0');
  const starsCount = Math.round(imdbNum / 2);

  const handlePlay = () => {
    Alert.alert('MOBA', `▶ Reproduzindo "${movie.title}"`, [{ text: 'OK' }]);
  };

  const handleToggleFavorito = async () => {
    try {
      setLoading(true);
      const { data } = await toggleFavorito(movie.id, !movie.favorito);
      onUpdated?.(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o favorito.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>

          <View style={styles.header}>
            {movie.capa ? (
              <Image source={{ uri: movie.capa }} style={styles.headerCover} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={movie.colors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.headerEmoji}>{movie.emoji}</Text>
              </LinearGradient>
            )}
            <LinearGradient
              colors={['transparent', '#181818']}
              style={styles.headerOverlay}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false} bounces={false}>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnPlay} onPress={handlePlay} activeOpacity={0.85}>
                <Text style={styles.btnPlayText}>▶  Assistir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnList, movie.favorito && styles.btnListActive]}
                onPress={handleToggleFavorito}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={[styles.btnListText, movie.favorito && styles.btnListTextActive]}>
                  {movie.favorito ? '★  Favorito' : '☆  Favoritar'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{movie.title}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.match}>{movie.rating} relevante</Text>
              <Text style={styles.metaDivider}>·</Text>
              <Text style={styles.meta}>{movie.year}</Text>
              <Text style={styles.metaDivider}>·</Text>
              <Text style={styles.meta}>{movie.duration}</Text>
              {movie.ageRating ? (
                <View style={styles.ageBadge}>
                  <Text style={styles.ageText}>{movie.ageRating}</Text>
                </View>
              ) : null}
            </View>

            {movie.imdb ? (
              <View style={styles.ratingRow}>
                <View style={styles.imdbBadge}>
                  <Text style={styles.imdbLabel}>IMDB</Text>
                </View>
                <Text style={styles.imdbScore}>{movie.imdb}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Text key={i} style={styles.star}>
                      {i <= starsCount ? '★' : '☆'}
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}

            <Text style={styles.desc}>{movie.desc}</Text>

            <View style={styles.tagsRow}>
              {movie.genre.map((g, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{g}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoGrid}>
              {movie.director ? (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Direção</Text>
                  <Text style={styles.infoValue}>{movie.director}</Text>
                </View>
              ) : null}
              {movie.cast?.length > 0 ? (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Elenco</Text>
                  <Text style={styles.infoValue}>{movie.cast.join(', ')}</Text>
                </View>
              ) : null}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ano</Text>
                <Text style={styles.infoValue}>{movie.year}</Text>
              </View>
              <View style={[styles.infoItem, styles.infoItemLast]}>
                <Text style={styles.infoLabel}>Duração</Text>
                <Text style={styles.infoValue}>{movie.duration}</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.78)',
  },
  backdropTouch: { flex: 1 },
  sheet: {
    backgroundColor: '#181818',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: height * 0.92,
    overflow: 'hidden',
  },
  header: {
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  headerCover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerEmoji: {
    fontSize: 88,
    marginTop: 40,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
  body: { padding: SPACING.md },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.md,
  },
  btnPlay: {
    backgroundColor: COLORS.red,
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  btnPlayText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.bold,
  },
  btnList: {
    backgroundColor: COLORS.surface2,
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  btnListActive: {
    backgroundColor: 'rgba(245,197,24,0.15)',
    borderColor: '#f5c518',
  },
  btnListText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.bold,
  },
  btnListTextActive: { color: '#f5c518' },
  title: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: FONTS.black,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  match: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: FONTS.bold,
  },
  metaDivider: { color: COLORS.gray, fontSize: 13 },
  meta: { color: COLORS.gray, fontSize: 13 },
  ageBadge: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
  },
  ageText: { color: COLORS.gray, fontSize: 11 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  imdbBadge: {
    backgroundColor: '#f5c518',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  imdbLabel: {
    color: '#000',
    fontSize: 11,
    fontWeight: FONTS.black,
  },
  imdbScore: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.bold,
  },
  starsRow: { flexDirection: 'row' },
  star: { color: '#f5c518', fontSize: 14 },
  desc: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  tag: {
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  tagText: { color: COLORS.gray, fontSize: 12 },
  infoGrid: { gap: 0 },
  infoItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface3,
    paddingVertical: 12,
  },
  infoItemLast: { borderBottomWidth: 0 },
  infoLabel: {
    color: COLORS.gray,
    fontSize: 11,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: { color: COLORS.white, fontSize: 14 },
});
