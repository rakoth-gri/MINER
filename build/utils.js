export const getBombCoord = (size) => Math.floor(Math.random() * size);
export const filterCoords = (l, row) => l.filter((c) => c >= 0 && c < row ** 2);
