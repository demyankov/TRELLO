import { createTag, createButton, appendTag } from "./create_tag.js";
import { setCountOfCards, getTime } from "./additional.js";
import { cards, cardFormWrapper, cardForm } from "./app.js";

//отображение текущего времени в header
export function displayTime(getTime) {
  document.querySelector(".header__time").innerText = getTime();
}

//обновление текущего времени в header
setInterval(() => displayTime(getTime), 1000);

let users;
export function getCardData(card, title, description, user) {
  //запрашиваем массив пользователей
  users = fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => {
      createListOfUsers(data); // добавляем пользователей в список формы добавления/редактирования карточки
      fillingFormCard(card, title, description, user); // заполнение редактируемой карточки данными
    })
    .catch((err) => alert(err));
}

export let todoWrapper = document.querySelector(".board__task-wrapper"); //контейнер для карточек TODO
export let inProgressWrapper = document.querySelector(".in-progress-wrapper"); //контейнер для карточек INPROGRESS
let doneWrapper = document.querySelector(".done-wrapper"); //контейнер для карточек DONE

//добавляем пользователей в список формы добавления/редактирования карточки
function createListOfUsers(users) {
  let selectUsers = document.querySelector(".task__edit-user");
  selectUsers.innerHTML = "";
  users.forEach((user) => {
    let option = createTag("option", "user", user.name);
    option.innerText = user.name;
    appendTag(selectUsers, option);
  });
}

//рендер формы на доске TODO
export function renderTodo() {
  let cardsToDo = cards.filter(
    (el) => el.status === "todo" && el.active === "true"
  );
  todoWrapper.innerHTML = "";
  cardsToDo.forEach((card) => {
    let form = createTag("form", "task_to-do");
    form.classList.add("task");
    form.setAttribute("data-id", card.id); //присваиваем форме data-id
    let taskBtn = createTag("div", "task__btn");
    let btnEdit = createButton("task__btn-edit", "", "Edit");
    btnEdit.classList.add("btn");
    let btnDelete = createButton("task__btn-delete", "", "Delete");
    btnDelete.classList.add("btn");
    let taskTitle = createTag("p", "task__title", "Title");
    let taskDescription = createTag("p", "task__description", "Description");
    let taskUser = createTag("p", "task__user", "User");
    let taskDate = createTag("date", "task__date", "Date");
    let btnToProgress = createButton("to-progress");

    fillingCard("todo", card, taskTitle, taskDescription, taskUser, taskDate); //заполнение данных карточки

    appendTag(taskBtn, btnEdit, btnDelete);
    appendTag(
      form,
      taskBtn,
      taskTitle,
      taskDescription,
      taskUser,
      taskDate,
      btnToProgress
    );
    appendTag(todoWrapper, form);
  });

  if (cardsToDo.length === 0) {
    let messageIfEmpty = createTag(
      "p",
      "empty-message",
      "Currently there are no tasks to do"
    );
    appendTag(todoWrapper, messageIfEmpty);
  }
}

//рендер формы на доске INPROGRESS
export function renderInProgress() {
  let cardsInProgress = cards.filter(
    (el) => el.status === "in_progress" && el.active === "true"
  );
  inProgressWrapper.innerHTML = "";
  cardsInProgress.forEach((card) => {
    let form = createTag("form", "in-progress");
    form.classList.add("task");
    form.setAttribute("data-id", card.id); //присваиваем форме data-id
    let taskBtn = createTag("div", "task__btn");
    let btnBack = createButton("task__btn-back", "", "Back");
    btnBack.classList.add("btn");
    let btnComplete = createButton("task__btn-complete", "", "Complete");
    btnComplete.classList.add("btn");
    let taskTitle = createTag("p", "task__title", "Title");
    let taskDescription = createTag("p", "task__description", "Description");
    let taskUser = createTag("p", "task__user", "User");
    let taskDate = createTag("date", "task__date", "Date");

    fillingCard(
      "in_progress",
      card,
      taskTitle,
      taskDescription,
      taskUser,
      taskDate
    ); //заполнение данных карточки

    appendTag(taskBtn, btnBack, btnComplete);
    appendTag(form, taskBtn, taskTitle, taskDescription, taskUser, taskDate);
    appendTag(inProgressWrapper, form);
  });

  if (cardsInProgress.length === 0) {
    let messageIfEmpty = createTag(
      "p",
      "empty-message",
      "Currently there are no tasks in progress"
    );
    appendTag(inProgressWrapper, messageIfEmpty);
  }
}

//рендер формы на доске DONE
export function renderDone() {
  let cardsDone = cards.filter(
    (el) => el.status === "done" && el.active === "true"
  );
  doneWrapper.innerHTML = "";
  cardsDone.forEach((card) => {
    let form = createTag("form", "task_done");
    form.classList.add("task");
    form.setAttribute("data-id", card.id); //присваиваем форме data-id
    let taskBtn = createTag("div", "task__btn");
    let btnDelete = createButton("task__btn-delete", "", "Delete");
    btnDelete.classList.add("btn");
    let taskTitle = createTag("p", "task__title", "Title");
    let taskDescription = createTag("p", "task__description", "Description");
    let taskUser = createTag("p", "task__user", "User");
    let taskDate = createTag("date", "task__date", "Date");

    fillingCard("done", card, taskTitle, taskDescription, taskUser, taskDate); //заполнение данных карточки

    appendTag(taskBtn, btnDelete);
    appendTag(form, taskBtn, taskTitle, taskDescription, taskUser, taskDate);
    appendTag(doneWrapper, form);
  });

  if (cardsDone.length === 0) {
    let messageIfEmpty = createTag(
      "p",
      "empty-message",
      "Currently there are no done tasks"
    );
    appendTag(doneWrapper, messageIfEmpty);
  }
}

//наполнение карточек данными
export function fillingCard() {
  let [status, card, taskTitle, taskDescription, taskUser, taskDate] =
    arguments;
  taskTitle ? (taskTitle.innerText = card.title) : null;
  taskDescription ? (taskDescription.innerText = card.description) : null;
  taskUser ? (taskUser.innerText = card.user) : null;

  status === "todo" && taskDate ? (taskDate.innerText = card.date) : null;
  status === "in_progress" && taskDate
    ? (taskDate.innerText = card.date_to_progress)
    : null;
  status === "done" && taskDate
    ? (taskDate.innerText = card.date_to_done)
    : null;

  setCountOfCards();
}

//наполнение формы изменения карточки данными
function fillingFormCard() {
  let [card, taskTitle, taskDescription, taskUser] = arguments;
  taskTitle ? (taskTitle.value = card.title) : null;
  taskDescription ? (taskDescription.value = card.description) : null;
  taskUser ? (taskUser.value = card.user) : null;
}

//закрытие формы добавления/изменения карточек
export function closeEditForm() {
  cardFormWrapper.classList.toggle("overlay-active");
  let form = document.querySelector(".task__edit");
  form.querySelector(".task__edit-title").value = "";
  form.querySelector(".task__edit-description").value = "";
}

//функция сворачивания/разворачивания досок
export function boardDisplay(el) {
  let board = el.closest(".board");
  let boardId = board.id;
  let todoHeader = document.querySelector("#todo-header"); // header доски todo
  let inProgressHeader = document.querySelector("#in-progress-header"); // header доски in-progress
  let doneHeader = document.querySelector("#done-header"); // header доски done

  boardId !== "board_todo"
    ? todoHeader.closest(".board").classList.add("task-hidden")
    : null;
  boardId !== "board_in-progress"
    ? inProgressHeader.closest(".board").classList.add("task-hidden")
    : null;
  boardId !== "board_done"
    ? doneHeader.closest(".board").classList.add("task-hidden")
    : null;
  board.classList.toggle("task-hidden");
}
