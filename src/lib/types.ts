export interface LocalUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
}
