export const getBombCoord = (size) => Math.floor(Math.random() * size);
export const filterCoords = (l, row, field) => l.filter((c) => c >= 0 && c < row ** 2 && field[c] >= 0);
