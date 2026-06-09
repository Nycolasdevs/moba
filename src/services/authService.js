import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidEmail } from '../utils/formValidation';

const USERS_KEY = '@moba/users';
const SESSION_KEY = '@moba/session';

export const ADMIN_EMAIL = 'admin@gmail.com';
export const ADMIN_PASSWORD = '123456';

const ADMIN_ACCOUNT = {
  id: 'admin',
  name: 'Administrador',
  email: ADMIN_EMAIL,
  role: 'admin',
};

async function getUsers() {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveSession(user) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function register({ name, email, password }) {
  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password) {
    throw new Error('Preencha todos os campos para criar sua conta.');
  }

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('O e-mail não é válido.');
  }

  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  if (normalizedEmail === ADMIN_EMAIL) {
    throw new Error('Este e-mail é reservado para o administrador.');
  }

  const users = await getUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const user = {
    id: Date.now().toString(),
    name: trimmedName,
    email: normalizedEmail,
    password,
    role: 'user',
  };

  users.push(user);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  return saveSession(user);
}

export async function login({ email, password }) {
  const trimmedEmail = email.trim();
  const normalizedEmail = trimmedEmail.toLowerCase();

  if (!trimmedEmail && !password) {
    throw new Error('Preencha o e-mail e a senha para continuar.');
  }
  if (!trimmedEmail) {
    throw new Error('Preencha o campo de e-mail para continuar.');
  }
  if (!password) {
    throw new Error('Preencha o campo de senha para continuar.');
  }
  if (!isValidEmail(trimmedEmail)) {
    throw new Error('O e-mail não é válido.');
  }

  if (normalizedEmail === ADMIN_EMAIL) {
    if (password !== ADMIN_PASSWORD) {
      throw new Error('Senha incorreta. A senha informada não confere com esta conta de administrador.');
    }
    return saveSession(ADMIN_ACCOUNT);
  }

  const users = await getUsers();
  const userByEmail = users.find((item) => item.email === normalizedEmail);

  if (!userByEmail) {
    throw new Error('E-mail não encontrado. Verifique o e-mail digitado ou crie uma conta.');
  }

  if (userByEmail.password !== password) {
    throw new Error('Senha incorreta. A senha informada não confere com esta conta.');
  }

  return saveSession(userByEmail);
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
