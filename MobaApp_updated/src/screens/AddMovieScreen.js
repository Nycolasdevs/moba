import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import { Icon } from '../components/ui/icon';
import { StatusBar } from 'expo-status-bar';
import { createFilme } from '../services/adminFilmesApi';
import { MOVIE_GENRES } from '../utils/filmeAdapter';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

const INITIAL_FORM = {
  titulo: '',
  genero: '',
  ano: '',
  capa: '',
};

export default function AddMovieScreen() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [savedTitle, setSavedTitle] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.titulo.trim()) return 'Informe o título.';
    if (!form.genero) return 'Selecione um gênero.';
    if (!form.ano.trim() || isNaN(Number(form.ano))) return 'Informe um ano válido.';
    if (!form.capa.trim() || !form.capa.startsWith('http')) {
      return 'Informe uma URL de imagem válida (http/https).';
    }
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      Alert.alert('Formulário inválido', errorMsg);
      return;
    }

    try {
      setLoading(true);
      const titulo = form.titulo.trim();
      await createFilme({
        titulo,
        genero: form.genero,
        ano: Number(form.ano),
        capa: form.capa.trim(),
      });
      setSavedTitle(titulo);
      setForm(INITIAL_FORM);
      setSuccessVisible(true);
    } catch (err) {
      Alert.alert('Erro', 'Servidor admin indisponível. Execute npm run server (porta 3001).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="light" />
        <Text style={styles.badge}>ADMIN · POST :3001</Text>
        <Text style={styles.title}>Adicionar Filme</Text>
        <Text style={styles.subtitle}>
          O filme será salvo no servidor admin e aparecerá no catálogo do usuário.
        </Text>

        <Field
          label="Título"
          value={form.titulo}
          onChangeText={(v) => updateField('titulo', v)}
          placeholder='Ex: "Interestelar"'
        />
        <GenreSelector
          value={form.genero}
          onChange={(genero) => updateField('genero', genero)}
        />
        <Field
          label="Ano"
          value={form.ano}
          onChangeText={(v) => updateField('ano', v)}
          placeholder="Ex: 2014"
          keyboardType="numeric"
        />
        <Field
          label="URL da capa"
          value={form.capa}
          onChangeText={(v) => updateField('capa', v)}
          placeholder="https://exemplo.com/imagem.jpg"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitText}>Salvar no catálogo</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Icon as={CircleCheck} size={48} color={COLORS.green} />
            <Text style={styles.modalTitle}>Filme adicionado!</Text>
            <Text style={styles.modalMessage}>
              "{savedTitle}" já está disponível no catálogo do usuário.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setSuccessVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.grayDark}
        {...props}
      />
    </View>
  );
}

function GenreSelector({ value, onChange }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.genreGrid}>
        {MOVIE_GENRES.map((genero) => {
          const selected = value === genero;
          return (
            <TouchableOpacity
              key={genero}
              style={[styles.genreChip, selected && styles.genreChipActive]}
              onPress={() => onChange(genero)}
              activeOpacity={0.8}
            >
              <Text style={[styles.genreChipText, selected && styles.genreChipTextActive]}>
                {genero}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: FONTS.black,
    marginBottom: 4,
  },
  badge: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  field: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.surface3,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.surface3,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
  },
  genreChipActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  genreChipText: {
    color: COLORS.gray,
    fontSize: 13,
    fontWeight: FONTS.semibold,
  },
  genreChipTextActive: {
    color: COLORS.white,
  },
  submitBtn: {
    backgroundColor: COLORS.red,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surface3,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: FONTS.bold,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalMessage: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalBtn: {
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    minWidth: 120,
    alignItems: 'center',
  },
  modalBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.bold,
  },
});
