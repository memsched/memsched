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

export type NullableFields<T, K extends keyof T> = {
  [P in K]?: T[P] | null;
} & {
  [P in Exclude<keyof T, K>]: T[P];
};
