import { cards } from "./app.js";

//количество карточек в TODO
function calcCountTasksInToDo() {
  return cards.filter((el) => {
    return el.status == "todo" && el.active == "true";
  }).length;
}

//количество карточек в INPROGRESS
export function calcCountTasksInProgress() {
  return cards.filter((el) => {
    return el.status == "in_progress" && el.active == "true";
  }).length;
}

//количество карточек в DONE
export function calcCountTasksInDone() {
  return cards.filter((el) => {
    return el.status == "done" && el.active == "true";
  }).length;
}

export function setCountOfCards() {
  document.querySelector("#count_todo").innerText = calcCountTasksInToDo();
  document.querySelector("#count_in-progress").innerText =
    calcCountTasksInProgress();
  document.querySelector("#count_done").innerText = calcCountTasksInDone();
}

//формирование текущей даты
export function getDate() {
  let dateNow = new Date();
  let dayNow;
  let monthNow;
  dateNow.getDate() < 10
    ? (dayNow = `0${dateNow.getDate()}`)
    : (dayNow = dateNow.getDate());
  dateNow.getMonth() < 9
    ? (monthNow = `0${dateNow.getMonth() + 1}`)
    : (monthNow = dateNow.getMonth() + 1);
  return `${dayNow}.${monthNow}.${dateNow.getFullYear()}`;
}

//формирование текущего времени
export function getTime() {
  let timeNow = new Date();
  let hoursNow;
  let minutesNow;
  timeNow.getMinutes() < 10
    ? (minutesNow = `0${timeNow.getMinutes()}`)
    : (minutesNow = timeNow.getMinutes());
  timeNow.getHours() < 9
    ? (hoursNow = `0${timeNow.getHours()}`)
    : (hoursNow = timeNow.getHours());
  return `${hoursNow}:${minutesNow}`;
}
