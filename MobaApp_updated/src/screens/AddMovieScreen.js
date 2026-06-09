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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createFilme } from '../services/adminFilmesApi';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

const INITIAL_FORM = {
  titulo: '',
  genero: '',
  ano: '',
  capa: '',
};

export default function AddMovieScreen({ navigation }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.titulo.trim()) return 'Informe o título.';
    if (!form.genero.trim()) return 'Informe o gênero.';
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
      await createFilme({
        titulo: form.titulo.trim(),
        genero: form.genero.trim(),
        ano: Number(form.ano),
        capa: form.capa.trim(),
      });
      Alert.alert('Sucesso', 'Filme adicionado! Já disponível no catálogo do usuário.', [
        {
          text: 'OK',
          onPress: () => {
            setForm(INITIAL_FORM);
            navigation.goBack();
          },
        },
      ]);
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
        <Field
          label="Gênero"
          value={form.genero}
          onChangeText={(v) => updateField('genero', v)}
          placeholder='Ex: "Ficção Científica"'
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
});
