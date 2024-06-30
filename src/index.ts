import { getBombCoord, filterCoords,  } from "./utils.js";
import { T_OBJECT_UNIVERSAL, T_KEYS_UNIVERSAL, I_STATE } from "./types";
import { state } from "./state.js";

const $FIELD = document.body.querySelector(".field") as HTMLDivElement;
const $START = document.body.querySelector(".start") as HTMLButtonElement;
const $RESET = document.body.querySelector(".reset") as HTMLButtonElement;
let $CELLS: NodeListOf<HTMLDivElement> | null = null;

type T_STATE = T_OBJECT_UNIVERSAL<typeof state>;
type KEYS_STATE = T_KEYS_UNIVERSAL<typeof state>;

// Формируем матрицу поля и массив координат бомб (вызываем единожды )
function createFieldState(state: I_STATE) {
  const { row, bombsCoords } = state;

  state.field = Array(row ** 2).fill(0);

  for (let i = 0; i < row; i++) {
    let b = getBombCoord(row ** 2);
    if (!bombsCoords.includes(b)) {
      updateBombSiblingsState(b, state).forEach((с, i) =>
        i > 0 ? state.field[с]++ : (state.field[с] = -1)
      );
      bombsCoords.push(b);
    }
  }
  drawField($FIELD, state);
}

// 😧 РИСУЕМ СЕТКУ С ЯЧЕЙКАМИ
function drawField($container: HTMLDivElement, { field }: I_STATE) {
  let html = field
    .map((el, i) => `<div class='field__cell' id='${i}'> 😧 </div>`)
    .join("");
  $container.innerHTML = html;
  $CELLS = $container.querySelectorAll(".field__cell");
  STYLING(arguments[1] as I_STATE);
}

// СТИЛИЗУЕМ ПОЛЕ  ///////////////////////////////////
function STYLING(state: I_STATE) {
  const { cellWidth, row } = state;
  $FIELD.style.width = `${cellWidth * row}px`;
  ($CELLS as NodeListOf<HTMLDivElement>).forEach((c) =>
    c.setAttribute("style", `width: ${cellWidth}px; height: ${cellWidth}px;`)
  );
}

// Вешаем Обработчик ///////////////////////////////////////
$FIELD.addEventListener("click", (e) => clickHander(e, state));

function clickHander(e: MouseEvent, { field, cellState }: I_STATE) {
  if (!(e.target instanceof HTMLDivElement)) return;

  if (!e.target.matches(".field__cell")) return;

  const coord = +e.target.id;

  switch (field[coord]) {
    case -1:
      ($CELLS as NodeListOf<HTMLDivElement>)[coord].textContent = "💣";
      // setTimeout(() => resetHandler(), 2000);
      break;
    case 0:
      const siblings = updateBombSiblingsState(coord, state);
      return siblings.forEach((c) => {
        switch (field[c]) {
          case cellState.empty:
            cellStyling(
              ($CELLS as NodeListOf<HTMLDivElement>)[c] as HTMLDivElement
            );
            updateProgress(c);
            return (($CELLS as NodeListOf<HTMLDivElement>)[c].textContent = "");
          default:
            cellStyling(($CELLS as NodeListOf<HTMLDivElement>)[c]);
            updateProgress(c);
            return (($CELLS as NodeListOf<HTMLDivElement>)[
              c
            ].textContent = `${field[c]}`);
        }
      });
    default:
      cellStyling(($CELLS as NodeListOf<HTMLDivElement>)[coord]);
      updateProgress(coord);
      ($CELLS as NodeListOf<HTMLDivElement>)[
        coord
      ].textContent = `${field[coord]}`;
  }
}

// стилизуем открытые клетки
function cellStyling(cell: HTMLDivElement) {
  cell.style.background = "pink";
}

// обновлем Прогресс:
function updateProgress(c: number) {
  (state as I_STATE).progress.includes(c)
    ? false
    : (state as I_STATE).progress.push(c);
}

// Обновляем cостояния клетки бомбы и смежных с ней клеток ----------------------
function updateBombSiblingsState(b: number, { row, field }: I_STATE) {
  if (b % row === 0) {
    return filterCoords(
      [b, b + row, b - row, b + 1, b - row + 1, b + row + 1],

      row,
      field
    );
  } else if ((b + 1) % row === 0) {
    return filterCoords(
      [b, b + row, b - row, b - 1, b - row - 1, b + row - 1],

      row,
      field
    );
  } else
    return filterCoords(
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
      row,
      field
    );
}

$RESET.addEventListener("click", resetHandler);
function resetHandler() {
  state.bombsCoords = [];
  state.field = [];
  state.progress = [];
  $FIELD.innerHTML = "";
}

$START.addEventListener("click", () => createFieldState(state));

$FIELD.addEventListener("contextmenu", contextmenu);
function contextmenu(e: MouseEvent) {
  if (!(e.target instanceof HTMLDivElement)) return;
  e.preventDefault();
  if (!e.target.matches(".field__cell")) return;
  ($CELLS as NodeListOf<HTMLDivElement>)[+e.target.id].textContent = "🏁";
}
