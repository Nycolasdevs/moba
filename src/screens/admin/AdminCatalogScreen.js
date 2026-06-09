import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert, Image, RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { Star, Trash2, Plus } from 'lucide-react-native';
import { Icon } from '../../components/ui/icon';
import DeleteMovieModal from '../../components/DeleteMovieModal';
import { getFilmes, deleteFilme } from '../../services/adminFilmesApi';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';

export default function AdminCatalogScreen({ navigation }) {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFilmes = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const { data } = await getFilmes();
      setFilmes(data);
    } catch {
      setError('Servidor admin indisponível. Execute npm run server (porta 3001).');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFilmes(true);
    }, [fetchFilmes])
  );

  const handleDelete = (filme) => {
    Alert.alert(
      'Excluir filme',
      `Remover "${filme.titulo}" do catálogo? Isso reflete na tela do usuário.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFilme(filme.id);
              setFilmes((prev) => prev.filter((f) => f.id !== filme.id));
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir.');
            }
          },
        },
      ]
    );
  };

  const handleDeletePress = (filme) => {
    setMovieToDelete(filme);
  };

  const handleCancelDelete = () => {
    if (!deleting) setMovieToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    try {
      setDeleting(true);
      await deleteFilme(movieToDelete.id);
      setFilmes((prev) => prev.filter((f) => f.id !== movieToDelete.id));
      setMovieToDelete(null);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel excluir.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.red} />
        <Text style={styles.loadingText}>Carregando catálogo admin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.badge}>ADMIN</Text>
        <Text style={styles.title}>Gerenciar Catálogo</Text>
        <Text style={styles.subtitle}>
          {filmes.length} título{filmes.length !== 1 ? 's' : ''} · Servidor :3001
        </Text>
      </View>

      {error && filmes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchFilmes()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filmes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchFilmes(true)}
              tintColor={COLORS.red}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('AdminDetails', { id: item.id })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.capa }} style={styles.thumb} />
              <View style={styles.info}>
                <Text style={styles.filmTitle} numberOfLines={2}>{item.titulo}</Text>
                <Text style={styles.filmMeta}>{item.genero} · {item.ano}</Text>
                {item.favorito && (
                  <View style={styles.favTagRow}>
                    <Icon as={Star} size={11} color="#f5c518" fill="#f5c518" />
                    <Text style={styles.favTag}>Favorito dos usuários</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={(event) => {
                  event.stopPropagation?.();
                  handleDeletePress(item);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon as={Trash2} size={20} color={COLORS.red} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>Nenhum filme cadastrado. Adicione na aba </Text>
              <Icon as={Plus} size={14} color={COLORS.gray} />
            </View>
          }
        />
      )}

      <DeleteMovieModal
        visible={!!movieToDelete}
        title={movieToDelete?.titulo}
        loading={deleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  badge: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: FONTS.black,
  },
  subtitle: { color: COLORS.gray, fontSize: 13, marginTop: 4 },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  thumb: {
    width: 70,
    height: 100,
    backgroundColor: COLORS.surface2,
  },
  info: {
    flex: 1,
    padding: SPACING.sm,
  },
  filmTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.bold,
    marginBottom: 4,
  },
  filmMeta: { color: COLORS.gray, fontSize: 13 },
  favTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  favTag: { color: '#f5c518', fontSize: 11 },
  deleteBtn: {
    padding: SPACING.md,
  },
  loadingText: { color: COLORS.gray, marginTop: SPACING.md },
  errorText: {
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  retryBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  retryText: { color: COLORS.white, fontWeight: FONTS.bold },
  emptyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 4,
  },
  empty: {
    color: COLORS.gray,
    textAlign: 'center',
    fontSize: 14,
  },
});
