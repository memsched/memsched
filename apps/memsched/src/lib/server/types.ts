export type NullableFields<T, K extends keyof T> = {
  [P in K]: T[P] | null;
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

export type NonNullableFields<T, K extends keyof T> = {
  [P in K]: NonNullable<T[P]>;
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

export type NullableFieldsPick<T, K extends keyof T> = {
  [P in K]: T[P] | null;
};

export type NonNullableFieldsPick<T, K extends keyof T> = {
  [P in K]: NonNullable<T[P]>;
};
