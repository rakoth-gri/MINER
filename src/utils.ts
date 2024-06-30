export const getBombCoord = (size: number) => Math.floor(Math.random() * size);
export const filterCoords = (l: number[], row: number, field: number[]) =>
  l.filter((c) => c >= 0 && c < row ** 2 && field[c] >= 0);
