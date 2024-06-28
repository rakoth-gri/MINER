export type T_OBJECT_UNIVERSAL<T extends object> = { [K in keyof T]: T[K] };

export type T_KEYS_UNIVERSAL<T extends object> = keyof T;

export type T_VALUES_UNIVERSAL<T extends object> = T[keyof T];

type T_CELL_STATE = "empty" | "bomb" | "digit";

export interface I_STATE {
  field: number[];
  row: number;
  bombsCoords: number[];
  cellWidth: number;
  progress: number[];
  cellState: Record<T_CELL_STATE, number>;
}
