import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { register } from '../services/authService';
import { sanitizeEmailInput, validateRegisterForm } from '../utils/formValidation';

const EMPTY_FIELD_ERRORS = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
};

export default function RegisterScreen({ navigation }) {
  const { formPadding, titleSize } = useResponsive();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(EMPTY_FIELD_ERRORS);
  const [loading, setLoading] = useState(false);

  const canSubmit = (
    name.trim().length > 0
    && email.trim().length > 0
    && password.length > 0
    && confirmPassword.length > 0
    && !loading
  );

  const clearErrors = () => {
    setError('');
    setFieldErrors(EMPTY_FIELD_ERRORS);
  };

  const handleRegister = async () => {
    const validation = validateRegisterForm(name, email, password, confirmPassword);
    if (validation) {
      setError(validation.message);
      setFieldErrors(validation.fields);
      return;
    }

    setError('');
    setFieldErrors(EMPTY_FIELD_ERRORS);
    setLoading(true);

    try {
      await register({ name, email, password });
      navigation.replace('UserApp');
    } catch (err) {
      const message = err.message || 'Não foi possível criar a conta. Tente novamente.';
      setError(message);

      if (message.toLowerCase().includes('e-mail')) {
        setFieldErrors({ ...EMPTY_FIELD_ERRORS, email: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { padding: formPadding }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logo}>MOBA</Text>
          <Text style={[styles.title, { fontSize: titleSize }]}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para acessar o catálogo</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Não foi possível criar a conta</Text>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[styles.input, fieldErrors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => { setName(text); if (error) clearErrors(); }}
            placeholder="Seu nome"
            placeholderTextColor={COLORS.grayDark}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, fieldErrors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => { setEmail(sanitizeEmailInput(text)); if (error) clearErrors(); }}
            placeholder="seu@email.com"
            placeholderTextColor={COLORS.grayDark}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <Text style={styles.hint}>Somente e-mail</Text>

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, fieldErrors.password && styles.inputError]}
            value={password}
            onChangeText={(text) => { setPassword(text); if (error) clearErrors(); }}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={COLORS.grayDark}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={[styles.input, fieldErrors.confirmPassword && styles.inputError]}
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); if (error) clearErrors(); }}
            placeholder="Repita a senha"
            placeholderTextColor={COLORS.grayDark}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !canSubmit && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          {!canSubmit && !loading ? (
            <Text style={styles.helperText}>Preencha todos os campos para continuar.</Text>
          ) : null}

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>
              Já tem conta? <Text style={styles.linkHighlight}>Entrar</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logo: {
    color: COLORS.red,
    fontSize: 42,
    fontWeight: FONTS.black,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: FONTS.bold,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: SPACING.xl,
  },
  errorBox: {
    backgroundColor: 'rgba(229,9,20,0.15)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(229,9,20,0.4)',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: FONTS.bold,
    marginBottom: 4,
  },
  error: {
    color: '#ffb3b8',
    fontSize: 13,
    lineHeight: 20,
  },
  label: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 6,
  },
  hint: {
    color: COLORS.grayDark,
    fontSize: 11,
    marginTop: -8,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surface3,
    color: COLORS.white,
    fontSize: 15,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    marginBottom: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  primaryBtn: {
    backgroundColor: COLORS.red,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
  helperText: {
    color: COLORS.grayDark,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  linkBtn: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  linkText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  linkHighlight: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  backText: {
    color: COLORS.grayDark,
    fontSize: 14,
  },
});
