import { describe, it, expect } from 'vitest';
import { sanitizeUsername } from './utils';

describe('sanitizeUsername', () => {
  // Basic functionality tests
  it('should return a valid username unchanged', () => {
    expect(sanitizeUsername('validusername')).toBe('validusername');
    expect(sanitizeUsername('valid_user_name')).toBe('valid_user_name');
    expect(sanitizeUsername('valid-user-name')).toBe('valid-user-name');
    expect(sanitizeUsername('valid123')).toBe('valid123');
    expect(sanitizeUsername('123valid')).toBe('123valid');
  });

  // Whitespace handling tests
  it('should trim leading and trailing whitespace', () => {
    expect(sanitizeUsername('  username  ')).toBe('username');
    expect(sanitizeUsername('\t username \n')).toBe('username');
    expect(sanitizeUsername(' user name ')).toBe('username'); // Space in middle becomes empty
    expect(sanitizeUsername('   ')).toBe(''); // All whitespace becomes empty string
  });

  // Special character removal tests
  it('should remove special characters', () => {
    expect(sanitizeUsername('user@name')).toBe('username');
    expect(sanitizeUsername('user!name')).toBe('username');
    expect(sanitizeUsername('user#name')).toBe('username');
    expect(sanitizeUsername('user$name')).toBe('username');
    expect(sanitizeUsername('user%name')).toBe('username');
    expect(sanitizeUsername('user^name')).toBe('username');
    expect(sanitizeUsername('user&name')).toBe('username');
    expect(sanitizeUsername('user*name')).toBe('username');
    expect(sanitizeUsername('user(name)')).toBe('username');
    expect(sanitizeUsername('user+name')).toBe('username');
    expect(sanitizeUsername('user=name')).toBe('username');
    expect(sanitizeUsername('user:name')).toBe('username');
    expect(sanitizeUsername('user;name')).toBe('username');
    expect(sanitizeUsername('user"name')).toBe('username');
    expect(sanitizeUsername("user'name")).toBe('username');
    expect(sanitizeUsername('user<name>')).toBe('username');
    expect(sanitizeUsername('user?name')).toBe('username');
    expect(sanitizeUsername('user/name')).toBe('username');
    expect(sanitizeUsername('user\\name')).toBe('username');
    expect(sanitizeUsername('user|name')).toBe('username');
  });

  // Combined special characters
  it('should handle combinations of special characters', () => {
    expect(sanitizeUsername('user@#$%name')).toBe('username');
    expect(sanitizeUsername('!@#$%^&*()_+username')).toBe('username');
    expect(sanitizeUsername('username!@#$%^&*()')).toBe('username');
    expect(sanitizeUsername('user@#name$%^test')).toBe('usernametest');
  });

  // Underscore handling tests
  it('should collapse multiple consecutive underscores', () => {
    expect(sanitizeUsername('user__name')).toBe('user_name');
    expect(sanitizeUsername('user___name')).toBe('user_name');
    expect(sanitizeUsername('user____name')).toBe('user_name');
    expect(sanitizeUsername('u_s_e_r__n_a_m_e')).toBe('u_s_e_r_n_a_m_e');
  });

  // Dash handling tests
  it('should collapse multiple consecutive dashes', () => {
    expect(sanitizeUsername('user--name')).toBe('user-name');
    expect(sanitizeUsername('user---name')).toBe('user-name');
    expect(sanitizeUsername('user----name')).toBe('user-name');
    expect(sanitizeUsername('u-s-e-r--n-a-m-e')).toBe('u-s-e-r-n-a-m-e');
  });

  // Trim underscores and dashes from ends
  it('should trim underscores and dashes from start and end', () => {
    expect(sanitizeUsername('_username')).toBe('username');
    expect(sanitizeUsername('username_')).toBe('username');
    expect(sanitizeUsername('_username_')).toBe('username');
    expect(sanitizeUsername('-username')).toBe('username');
    expect(sanitizeUsername('username-')).toBe('username');
    expect(sanitizeUsername('-username-')).toBe('username');
    expect(sanitizeUsername('__username__')).toBe('username');
    expect(sanitizeUsername('--username--')).toBe('username');
    expect(sanitizeUsername('_-username-_')).toBe('username');
    expect(sanitizeUsername('-_username_-')).toBe('username');
  });

  // Mixed underscore and dash tests
  it('should handle mixed underscores and dashes properly', () => {
    expect(sanitizeUsername('user_-name')).toBe('user_-name');
    expect(sanitizeUsername('user-_name')).toBe('user-_name');
    expect(sanitizeUsername('user_--_name')).toBe('user_-_name');
    expect(sanitizeUsername('user-__-name')).toBe('user-_-name');
    expect(sanitizeUsername('_-_-username-_-_')).toBe('username');
  });

  // Edge cases
  it('should handle edge cases', () => {
    expect(sanitizeUsername('')).toBe('');
    expect(sanitizeUsername('_')).toBe('');
    expect(sanitizeUsername('-')).toBe('');
    expect(sanitizeUsername('_-_')).toBe('');
    expect(sanitizeUsername('___')).toBe('');
    expect(sanitizeUsername('---')).toBe('');
    expect(sanitizeUsername('!@#$%^&*()')).toBe('');
    expect(sanitizeUsername('_-._-.')).toBe('');
  });

  // Case handling
  it('should preserve case', () => {
    expect(sanitizeUsername('UserName')).toBe('UserName');
    expect(sanitizeUsername('USERNAME')).toBe('USERNAME');
    expect(sanitizeUsername('userName')).toBe('userName');
    expect(sanitizeUsername('UsEr_NaMe')).toBe('UsEr_NaMe');
  });

  // Mixed alphanumeric with allowed special characters
  it('should handle mixed alphanumeric with allowed special characters', () => {
    expect(sanitizeUsername('user123_name456')).toBe('user123_name456');
    expect(sanitizeUsername('123_user-456_name')).toBe('123_user-456_name');
    expect(sanitizeUsername('user-123_name-456')).toBe('user-123_name-456');
    expect(sanitizeUsername('1_2-3_4-5')).toBe('1_2-3_4-5');
  });

  // Non-English characters
  it('should remove non-English characters', () => {
    expect(sanitizeUsername('üsérñämé')).toBe('srm');
    expect(sanitizeUsername('用户名')).toBe('');
    expect(sanitizeUsername('пользователь')).toBe('');
    expect(sanitizeUsername('user名name')).toBe('username');
  });

  // Complex combinations
  it('should handle complex combinations correctly', () => {
    expect(sanitizeUsername(' _-user@#$%^&*()name_- ')).toBe('username');
    expect(sanitizeUsername('__--User 123_-_- Name--__')).toBe('User123_-_-Name');
    expect(sanitizeUsername('---___user--name___---')).toBe('user-name');
    expect(sanitizeUsername('  _-@#$user_-_-name$#@-_  ')).toBe('user_-_-name');
  });
}); 