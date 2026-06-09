const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeEmailInput(text) {
  return text.replace(/[^a-zA-Z0-9@._+-]/g, '');
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

export function validateLoginForm(email, password) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail && !password) {
    return { message: 'Preencha o e-mail e a senha para continuar.', fields: { email: true, password: true } };
  }
  if (!trimmedEmail) {
    return { message: 'Preencha o campo de e-mail para continuar.', fields: { email: true, password: false } };
  }
  if (!password) {
    return { message: 'Preencha o campo de senha para continuar.', fields: { email: false, password: true } };
  }
  if (!isValidEmail(trimmedEmail)) {
    return {
      message: 'O e-mail não é válido.',
      fields: { email: true, password: false },
    };
  }

  return null;
}

export function validateRegisterForm(name, email, password, confirmPassword) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const emptyFields = [];

  if (!trimmedName) emptyFields.push('nome');
  if (!trimmedEmail) emptyFields.push('e-mail');
  if (!password) emptyFields.push('senha');
  if (!confirmPassword) emptyFields.push('confirmação de senha');

  if (emptyFields.length > 0) {
    return {
      message: `Preencha todos os campos para continuar: ${emptyFields.join(', ')}.`,
      fields: {
        name: !trimmedName,
        email: !trimmedEmail,
        password: !password,
        confirmPassword: !confirmPassword,
      },
    };
  }

  if (!isValidEmail(trimmedEmail)) {
    return {
      message: 'O e-mail não é válido.',
      fields: { name: false, email: true, password: false, confirmPassword: false },
    };
  }

  if (password !== confirmPassword) {
    return {
      message: 'As senhas não coincidem. Digite a mesma senha nos dois campos.',
      fields: { name: false, email: false, password: true, confirmPassword: true },
    };
  }

  return null;
}
