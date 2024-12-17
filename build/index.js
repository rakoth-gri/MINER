import {
  getBombCoord,
  filterOutOfRangeCoords,
  calcCurrProgress,
} from "./utils.js";
import { state } from "./state.js";
import { $START, $FIELD, $RESET, $PROGRESS } from "./const.js";




$START.addEventListener("click", () => createInitialFieldState(state));
// Формируем матрицу поля и массив координат бомб (вызываем единожды )
function createInitialFieldState(state) {
  const { row, bombsCoords } = state;
  state.field = Array(row ** 2).fill(0);
  for (let i = 0; i < row; i++) {
    let b = getBombCoord(row ** 2);
    if (!bombsCoords.includes(b)) {
      defineBombSiblings(b, state).forEach((с, i) =>
        i > 0 ? state.field[с]++ : (state.field[с] = -1)
      );
      bombsCoords.push(b);
    }
  }
  drawField($FIELD, state);
}

// 😧 РИСУЕМ СЕТКУ С ЯЧЕЙКАМИ --------------------------------------------------------------------
function drawField($container, state) {
  let html = state.field
    .map((_, i) => `<div class='field__cell' id='${i}'> 😧 </div>`)
    .join("");
  $container.innerHTML = html;
  // Переопределяем глобальную переменную:
  state.$CELLS = $container.querySelectorAll(".field__cell");  
  styleField(state);
}
// СТИЛИЗУЕМ ПОЛЕ  --------------------------------------------------------------------
function styleField(state) {
  const { cellWidth, row } = state;
  $FIELD.style.width = `${cellWidth * row}px`;
  state.$CELLS.forEach((c) =>
    c.setAttribute("style", `width: ${cellWidth}px; height: ${cellWidth}px;`)
  );
}
// Вешаем Обработчик --------------------------------------------------------------------
$FIELD.addEventListener("click", (e) => fieldClickHandler(e, state));

function fieldClickHandler(e, state) {
  if (!e.target.matches(".field__cell")) return;

  const { field, cellState, $CELLS } = state;
  const coord = +e.target.id;

  switch (field[coord]) {
    case -1:
      return ($CELLS[coord].textContent = cellState[-1]);
    // return resetHandler();
    case 0:
      defineEmptyCellSiblings(coord, state).forEach((coord) => {
        switch (field[coord]) {
          case cellState[0]:
            $CELLS[coord].textContent = cellState[0];
            return updateProgress(coord, state);
          default:
            $CELLS[coord].textContent = `${field[coord]}`;
            return updateProgress(coord, state);
        }
      });
      break;
    default:
      $CELLS[coord].textContent = `${field[coord]}`;
      break;
  }
  updateProgress(coord, state);
}

// обновлем Прогресс: --------------------------------------------------------------------
function updateProgress(c, state) {
  !state.progress.includes(c) && state.progress.push(c);
  $PROGRESS.value = calcCurrProgress(state);  
}

const defineEmptyCellSiblings = (coord, state) => {
  let res = [];
  defineBombSiblings(coord, state).forEach((s) =>
    res.push(...defineBombSiblings(s, state))
  );
  return new Set(res);
};

// Обновляем cостояния клетки бомбы и смежных с ней клеток ----------------------
function defineBombSiblings(b, { row, field }) {
  if (b % row === 0) {
    return filterOutOfRangeCoords(
      [b, b + row, b - row, b + 1, b - row + 1, b + row + 1],
      field
    );
  } else if ((b + 1) % row === 0) {
    return filterOutOfRangeCoords(
      [b, b + row, b - row, b - 1, b - row - 1, b + row - 1],
      field
    );
  } else {
    return filterOutOfRangeCoords(
      [
        b,
        b + row,
        b - row,
        b + 1,
        b - 1,
        b - row + 1,
        b - row - 1,
        b + row + 1,
        b + row - 1,
      ],
      field
    );
  }
}
$RESET.addEventListener("click", resetHandler);
function resetHandler() {
  state.bombsCoords = [];
  state.progress = [];
  $PROGRESS.value = 0;
  createInitialFieldState(state);
}

// Установка флага будущей попытки ----------
$FIELD.addEventListener("contextmenu", attemptHandler);
function attemptHandler(e) {
  e.preventDefault();
  if (!e.target.matches(".field__cell")) return;
  state.$CELLS[+e.target.id].textContent = state.cellState.flag;
}
