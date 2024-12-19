const getBombCoord = (size) => Math.floor(Math.random() * size);
const filterOutOfRangeCoords = (l, field) =>
  l.filter((coord) => field[coord] !== undefined);

const calcCurrProgress = ({ bombsCoords, field, progress }) =>
  (progress.length / (field.length - bombsCoords.length)) * 100;

export { calcCurrProgress, getBombCoord, filterOutOfRangeCoords };
