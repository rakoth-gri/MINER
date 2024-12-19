import {
  getBombCoord,
  filterOutOfRangeCoords,
  calcCurrProgress,
} from "./utils.js";
import { state } from "./state.js";
import { $START, $FIELD, $RESET, $PROGRESS } from "./const.js";

$START.addEventListener("click", () => createInitialFieldState(state));
// Формируем матрицу cостояние поля и массив координат бомб:
function createInitialFieldState(state) {
  const { row, bombsCoords, field } = state;
  field.push(...Array(row ** 2).fill(0));  
  for (let i = 0; i < row; i++) {
    let bomb = getBombCoord(row ** 2);
    if (!bombsCoords.includes(bomb)) {
      let siblings = defineBombSiblings(bomb, state);      
      // изменяем стэйт клеток сиблингов, исключая клетки с бомбами:
      siblings.filter((s) => field[s] >= 0).forEach((s) => field[s]++);
      bombsCoords.push(bomb);
    }
  } 
  drawField($FIELD, state);
}

// 😧 РИСУЕМ РАБОЧЕЕ ПОЛЕ--------------------------------------------------------------
function drawField($container, state) {
  let html = state.field
    .map((_, i) => `<div class='field__cell' id='${i}'> 😧 </div>`)
    .join("");
  $container.innerHTML = html;
  // Переопределяем глобальную переменную:
  state.$CELLS = $container.querySelectorAll(".field__cell");

  styleField(state);
}
// СТИЛИЗУЕМ РАБОЧЕЕ ПОЛЕ  --------------------------------------------------------------
function styleField(state) {
  const { cellWidth, row } = state;
  $FIELD.style.width = `${cellWidth * row}px`;
  state.$CELLS.forEach((c) =>
    c.setAttribute("style", `width: ${cellWidth}px; height: ${cellWidth}px;`)
  );
}
// 1 ОБРАБОТЧИК НА ЦЕЛОЕ ПОЛЕ ------------------------------------------
$FIELD.addEventListener("click", (e) => fieldClickHandler(e, state));

function fieldClickHandler(e, state) {
  if (!e.target.matches(".field__cell")) return;

  const { field, cellState, $CELLS } = state;
  const coord = +e.target.id;
  switch (field[coord]) {
    case -1:
      $CELLS[coord].textContent = cellState[-1];
      setTimeout(() => {
        alert("Ты проиграл");
        resetHandler();
      }, 0);
      break;
    case 0:
      $CELLS[coord].textContent = cellState[0];
      return updateProgress(coord, state);
    default:
      $CELLS[coord].textContent = `${field[coord]}`;
      return updateProgress(coord, state);
  }
}

// ОБНОВЛЯЕМ ПРОГРЕCC: -------------------------------------------------------
function updateProgress(c, state) {
  !state.progress.includes(c) && state.progress.push(c);
  console.log(state.progress);
  $PROGRESS.value = calcCurrProgress(state);
  if (state.progress.length === state.field.length - state.bombsCoords.length) {
    setTimeout(() => {
      alert("Ты выйграл!");
      resetHandler();
    }, 0);
  }
}

// ВЫЧИСЛЕНИЕ СИБЛИНГОВ ПО 8 НАПРАВЛЕНИЯМ ОТ БОМБЫ ----------------------
function defineBombSiblings(coord, { row, field }) {
  // меняем стэйт клетки поля с бомбой ---!
  field[coord] = -1;
  if (coord % row === 0) {
    return filterOutOfRangeCoords(
      [
        coord,
        coord + row,
        coord - row,
        coord + 1,
        coord - row + 1,
        coord + row + 1,
      ],
      field
    );
  } else if ((coord + 1) % row === 0) {
    return filterOutOfRangeCoords(
      [
        coord,
        coord + row,
        coord - row,
        coord - 1,
        coord - row - 1,
        coord + row - 1,
      ],
      field
    );
  } else {
    return filterOutOfRangeCoords(
      [
        coord,
        coord + row,
        coord - row,
        coord + 1,
        coord - 1,
        coord - row + 1,
        coord - row - 1,
        coord + row + 1,
        coord + row - 1,
      ],
      field
    );
  }
}
$RESET.addEventListener("click", resetHandler);
function resetHandler() {
  state.bombsCoords = [];
  state.progress = [];
  state.field = [];
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
