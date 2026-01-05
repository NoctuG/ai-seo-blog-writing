export interface AuthConfig {
  username: string;
  password: string;
  hasPassword: boolean;
}

export function getAuthConfig(): AuthConfig {
  const username = process.env.ADMIN_USERNAME?.trim() || 'admin';
  const password = process.env.ADMIN_PASSWORD || '';

  return {
    username,
    password,
    hasPassword: password.length > 0,
  };
}
