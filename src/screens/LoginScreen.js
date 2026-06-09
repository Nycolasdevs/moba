import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { login } from '../services/authService';
import { sanitizeEmailInput, validateLoginForm } from '../utils/formValidation';

export default function LoginScreen({ navigation }) {
  const { formPadding, titleSize } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const clearErrors = () => {
    setError('');
    setFieldErrors({ email: false, password: false });
  };

  const handleEmailChange = (text) => {
    setEmail(sanitizeEmailInput(text));
    if (error || fieldErrors.email) clearErrors();
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (error || fieldErrors.password) clearErrors();
  };

  const handleLogin = async () => {
    const validation = validateLoginForm(email, password);
    if (validation) {
      setError(validation.message);
      setFieldErrors(validation.fields);
      return;
    }

    setError('');
    setFieldErrors({ email: false, password: false });
    setLoading(true);

    try {
      const session = await login({ email, password });
      navigation.replace(session.role === 'admin' ? 'AdminApp' : 'UserApp');
    } catch (err) {
      const message = err.message || 'Não foi possível entrar. Tente novamente.';
      setError(message);

      if (message.toLowerCase().includes('senha')) {
        setFieldErrors({ email: false, password: true });
      } else if (message.toLowerCase().includes('e-mail')) {
        setFieldErrors({ email: true, password: false });
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
          <Text style={[styles.title, { fontSize: titleSize }]}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Não foi possível entrar</Text>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, fieldErrors.email && styles.inputError]}
            value={email}
            onChangeText={handleEmailChange}
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
            onChangeText={handlePasswordChange}
            placeholder="Sua senha"
            placeholderTextColor={COLORS.grayDark}
            secureTextEntry
            textContentType="password"
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !canSubmit && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {!canSubmit && !loading ? (
            <Text style={styles.helperText}>Preencha o e-mail e a senha para continuar.</Text>
          ) : null}

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>
              Não tem conta? <Text style={styles.linkHighlight}>Criar conta</Text>
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
