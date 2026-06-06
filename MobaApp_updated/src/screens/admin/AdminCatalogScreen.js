import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert, Image, RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { getFilmes, deleteFilme } from '../../services/adminFilmesApi';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';

export default function AdminCatalogScreen({ navigation }) {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

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
                  <Text style={styles.favTag}>★ Favorito dos usuários</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum filme cadastrado. Adicione na aba ➕</Text>
          }
        />
      )}
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
  favTag: { color: '#f5c518', fontSize: 11, marginTop: 4 },
  deleteBtn: {
    padding: SPACING.md,
  },
  deleteText: { fontSize: 20 },
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
  empty: {
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
