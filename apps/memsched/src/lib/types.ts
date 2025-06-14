export interface LocalUser {
  id: string;
  admin: boolean;
  email: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
