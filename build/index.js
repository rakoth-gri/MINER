import { getBombCoord, filterCoords } from "./utils.js";
import { state } from "./state.js";
const $FIELD = document.body.querySelector(".field");
const $START = document.body.querySelector(".start");
const $RESET = document.body.querySelector(".reset");
let $CELLS = null;
// Формируем матрицу поля и массив координат бомб (вызываем единожды )
function createFieldState(state) {
    const { row, bombsCoords } = state;
    state.field = Array(row ** 2).fill(0);
    for (let i = 0; i < row; i++) {
        let b = getBombCoord(row ** 2);
        if (!bombsCoords.includes(b)) {
            updateBombSiblingsState(b, state)
                .filter((с) => state.field[с] >= 0)
                .forEach((с, i) => (i > 0 ? state.field[с]++ : (state.field[с] = -1)));
            bombsCoords.push(b);
        }
    }
    drawField($FIELD, state);
}
// 😧 РИСУЕМ СЕТКУ С ЯЧЕЙКАМИ
function drawField($container, { field }) {
    let html = field
        .map((el, i) => `<div class='field__cell' id='${i}'> 😧 </div>`)
        .join("");
    $container.innerHTML = html;
    $CELLS = $container.querySelectorAll(".field__cell");
    STYLING(arguments[1]);
}
// СТИЛИЗУЕМ ПОЛЕ  ///////////////////////////////////
function STYLING(state) {
    const { cellWidth, row } = state;
    $FIELD.style.width = `${cellWidth * row}px`;
    $CELLS.forEach((c) => c.setAttribute("style", `width: ${cellWidth}px; height: ${cellWidth}px;`));
}
// Вешаем Обработчик ///////////////////////////////////////
$FIELD.addEventListener("click", (e) => clickHander(e, state));
function clickHander(e, { field, cellState }) {
    if (!(e.target instanceof HTMLDivElement))
        return;
    if (!e.target.matches(".field__cell"))
        return;
    const coord = +e.target.id;
    switch (field[coord]) {
        case -1:
            $CELLS[coord].textContent = "💣";
            // setTimeout(() => resetHandler(), 2000);
            break;
        case 0:
            const siblings = updateBombSiblingsState(coord, state).filter((s) => field[s] >= 0);
            return siblings.forEach((c) => {
                switch (field[c]) {
                    case cellState.empty:
                        cellStyling($CELLS[c]);
                        updateProgress(c);
                        return ($CELLS[c].textContent = "");
                    default:
                        cellStyling($CELLS[c]);
                        updateProgress(c);
                        return ($CELLS[c].textContent = `${field[c]}`);
                }
            });
        default:
            cellStyling($CELLS[coord]);
            updateProgress(coord);
            $CELLS[coord].textContent = `${field[coord]}`;
    }
}
// стилизуем открытые клетки
function cellStyling(cell) {
    cell.style.background = "pink";
}
// обновлем Прогресс:
function updateProgress(c) {
    state.progress.includes(c)
        ? false
        : state.progress.push(c);
    console.log(state.progress);
}
// Обновляем cостояния клетки бомбы и смежных с ней клеток ----------------------
function updateBombSiblingsState(b, { row }) {
    let siblings = [];
    if (b % row === 0) {
        siblings = filterCoords([b, b + row, b - row, b + 1, b - row + 1, b + row + 1], row);
    }
    else if ((b + 1) % row === 0) {
        siblings = filterCoords([b, b + row, b - row, b - 1, b - row - 1, b + row - 1], row);
    }
    else
        siblings = filterCoords([
            b,
            b + row,
            b - row,
            b + 1,
            b - 1,
            b - row + 1,
            b - row - 1,
            b + row + 1,
            b + row - 1,
        ], row);
    return siblings;
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
function contextmenu(e) {
    if (!(e.target instanceof HTMLDivElement))
        return;
    e.preventDefault();
    if (!e.target.matches(".field__cell"))
        return;
    $CELLS[+e.target.id].textContent = "🏁";
}
