import {
  renderTodo,
  renderInProgress,
  renderDone,
  todoWrapper,
  getCardData,
  inProgressWrapper,
  displayTime,
  boardDisplay,
  closeEditForm,
} from "./display.js";

import {
  setCountOfCards,
  calcCountTasksInProgress,
  getTime,
  getDate,
} from "./additional.js";

export let cards; // массив объектов карточек
let id; // четчик уникальных id
let deletedCard; //маркер, в который записывается объект кнопки удаления карточки для дальнейшего определения по какой доске был клик и где нужно удатиль карточку
let addOrEdit; //маркер, который показывает пользователь добавляет новую карточку или редактирует существующую
let editCard; // редактируемая форма
let idEditCard; // data-id редактируемой формы
let title; // содержание заголовка в форме добавления/редактирования карточки
let description; // содержание описания задачи в форме добавления/редактирования карточки
let user; // выбранный пользователь в форме добавления/редактирования карточки

//достаем из localstorage счетчик id и массив карточек
localStorage.getItem("id") ? (id = localStorage.getItem("id")) : (id = 0);
localStorage.getItem("cards")
  ? (cards = JSON.parse(localStorage.getItem("cards")))
  : (cards = []);

//запись в localstorage счетчика id и массива карточек
function setLocalStorage(cardsArray, idCounter) {
  cardsArray ? localStorage.setItem("cards", JSON.stringify(cardsArray)) : null;
  idCounter ? localStorage.setItem("id", idCounter) : null;
}

//объект карточки
export function createObject() {
  let [id, title, description, user, date] = arguments;
  let task = {
    id: id,
    title: title,
    description: description,
    user: user,
    date: date,
    status: "todo", //inprogress, done
    active: "true", //false - если карточка была удалена
  };
  return task;
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    displayTime(getTime);
    renderTodo();
    renderInProgress();
    renderDone();
  },
  false
);

let boardWrapper = document.querySelector(".board-wrapper"); // контейнер всех досок
let doneWrapper = document.querySelector(".done-wrapper"); // контейнер Доски done
export let cardFormWrapper = document.querySelector(".overlay"); // контейнер пустого шаблона новой/редактирования карточки
export let cardForm = document.querySelector(".task__edit"); //шаблон новой/редактируемой карточки
let confirmBtn = document.querySelector(".task__edit-confirm"); //кнопка confirm в шаблоне для подтверждения добавления/изменения карточки
let cancelTodoBtn = document.querySelector(".task__edit-cancel"); //кнопка cancel для закрытия шаблона добавления/изменения карточки
let warningWrapper = document.querySelector(".overlay-warning"); //контейнер формы Warning
let confirmWarningBtn = document.querySelector(".warning__confirm"); //кнопка в форме Warning для подтверждения действий (удаления карточек)
let cancelWarningBtn = document.querySelector(".warning__cancel"); //кнопка cancel в форме Warning

boardWrapper.addEventListener("click", (e) => {
  let el = e.target;

  //сворачивание/разворачивание доски
  el.className.includes("board__header") ? boardDisplay(el) : null;

  //прослушка на кнопку добавления новой карточки
  if (el.className.includes("board__add-todo")) {
    addOrEdit = "add"; //устанавливаем флаг в состояние add
    getCardData(); //получаем список пользователей и добавляем в шаблон новой карточки
    cardFormWrapper.classList.toggle("overlay-active"); //добавляем класс для отображения формы редактировния карточки
  }

  //прослушка на кнопку удаления всех выполненных карточек (вызов формы warning)
  if (el.className.includes("board__delete-all")) {
    warningWrapper.classList.toggle("warning-active");
    document.querySelector(".warning__text-description").innerText =
      "Do you want to delete all tasks?";
    deletedCard = el;
  }
});

//прослушка на кнопку Confirm в форме добавления/редактирования карточки для добавления изменений в массив
confirmBtn.addEventListener("click", () => {
  addOrEdit === "add" ? addNewCard() : null; //вызоваем функцию добавления в массив объекта новой карточки
  addOrEdit === "edit" ? editingCard() : null; //вызоваем функцию редактирования объекта карточки
  renderTodo();
});

//Функция добавления в массив объекта новой карточки
function addNewCard() {
  getCardFormData(cardForm);
  if (title && description) {
    id++; //инкрементируем счетчик
    let date = getDate();
    let card = createObject(id, title, description, user, date);
    cards.push(card);
    setLocalStorage(cards, id);
    closeEditForm();
  }
}

// прослушка на контейнер TODO
todoWrapper.addEventListener("click", (event) => {
  let el = event.target;

  //прослушка на кнопку редактирования карточки
  if (el.className.includes("task__btn-edit")) {
    inListenerEditCard(el);
  }

  //прослушка на кнопку удаления карточки из доски ToDo
  if (el.className.includes("task__btn-delete")) {
    warningWrapper.classList.toggle("warning-active"); //открываем окно с предупреждением
    document.querySelector(".warning__text-description").innerText =
      "Do you want to delete the current task?";
    deletedCard = el; //маркер, с помощью которго определяется какая карточка удаляется
  }

  //прослушка на кнопку перемещения карточки из TODO в IN-PROGRESS
  if (el.className.includes("to-progress")) {
    let countTasksInProgress = calcCountTasksInProgress(); // находим количество карточек In_progress
    if (countTasksInProgress < 6) {
      inListenerToProgress(el);
      setLocalStorage(cards);
      renderTodo();
      renderInProgress();
    } else {
      warningWrapper.classList.toggle("warning-active"); //открываем окно с предупреждением
      document.querySelector(".warning__confirm").hidden = true; //скрываем кнопку Confirm в форме Warning
      document.querySelector(".warning__text-description").innerText =
        "There are many tasks in progress. Complete the task and try again";
    }
  }
});

// функция определения заголовка, описания и исполнителя В ФОРМЕ добавляемой/редактируемой задачи (карточки)
function getCardFormData() {
  title = cardForm.querySelector(".task__edit-title").value;
  description = cardForm.querySelector(".task__edit-description").value;
  user = cardForm.querySelector(".task__edit-user").value;
}

function inListenerEditCard(el) {
  addOrEdit = "edit";
  editCard = el.closest(".task_to-do");
  idEditCard = editCard.getAttribute("data-id"); // data-id редактируемой формы

  let titleTag = cardForm.querySelector(".task__edit-title");
  let descriptionTag = cardForm.querySelector(".task__edit-description");
  let userTag = cardForm.querySelector(".task__edit-user");
  cards.forEach((card) => {
    if (card.id == idEditCard) {
      getCardData(card, titleTag, descriptionTag, userTag); //получаем список пользователей, заполняем форму данными редактируемой карточки
      cardFormWrapper.classList.toggle("overlay-active"); //добавляем класс для отображения формы редактировния карточки
    }
  });
}

//'удаляем' карточку из массива (устанавливаем флаг active=false)
function inListenerDeleteCard(el, parentClass) {
  let deletedCardId = el.closest(parentClass).getAttribute("data-id");
  cards.forEach((card) => {
    if (card.id == deletedCardId) {
      card.active = "false";
      card.date_deleted = getDate();
    }
  });
}

//прослушка на кнопку перемещения карточки из IN-PROGRESS в TODO и в Done
inProgressWrapper.addEventListener("click", (e) => {
  let el = e.target;
  //  из IN-PROGRESS в TODO
  el.className.includes("task__btn-back") ? inListenerToTodo(el) : null;
  // из IN-PROGRESS в Done
  el.className.includes("task__btn-complete") ? inListenerToDone(el) : null;

  setLocalStorage(cards); //записываем в localStorage измененный массив карточек
  renderTodo();
  renderInProgress();
  renderDone();
});

//'перемещаем' карточку из todo в in_progress (устанавливаем флаг status = in_progress)
function inListenerToProgress(el) {
  let toProgressCardId = el.closest(".task_to-do").getAttribute("data-id");

  cards.forEach((card) => {
    if (card.id == toProgressCardId) {
      card.status = "in_progress";
      card.date_to_progress = getDate();
    }
  });
}

//'перемещаем' карточку из In-progress в Todo в  (устанавливаем флаг status = todo)
function inListenerToTodo(el) {
  let toTodoCardId = el.closest(".in-progress").getAttribute("data-id");
  cards.forEach((card) => {
    if (card.id == toTodoCardId) {
      card.status = "todo";
      card.date_to_todo = getDate();
    }
  });
}

//'перемещаем' карточку из todo в Done (устанавливаем флаг status = done)
function inListenerToDone(el) {
  let toDoneCardId = el.closest(".in-progress").getAttribute("data-id");
  cards.forEach((card) => {
    if (card.id == toDoneCardId) {
      card.status = "done";
      card.date_to_done = getDate();
    }
  });
}

//Функция редактирования карточки
function editingCard() {
  getCardFormData(editCard); //получаем данные из редактируемой карточки
  let date = getDate();
  if (title && description) {
    cards.forEach((card) => {
      if (card.id == idEditCard) {
        card.title = title;
        card.description = description;
        card.user = user;
        card.date_edit = date;
        setLocalStorage(cards); //загружаем в localStorage измененный массив
        closeEditForm(); //закрываем форму
      }
    });
  }
}

//Закрытие формы для добавления новой карточки или редактирования старой при нажатии кнопки Cancel
cancelTodoBtn.addEventListener("click", () => {
  closeEditForm();
});

//прослушка на кнопку удаления карточки из доски DONe
doneWrapper.addEventListener("click", (event) => {
  let el = event.target;
  deletedCard = el;
  if (el.className.includes("task__btn-delete")) {
    warningWrapper.classList.toggle("warning-active"); //открываем окно с предупреждением
    document.querySelector(".warning__text-description").innerText =
      "Do you want to delete the current task?";
  }
});

//функция вызова прослушки на кнопку confirm с указанием, где происходит удаление карточек
confirmWarningBtn.addEventListener("click", () => {
  warningWrapper.classList.toggle("warning-active"); //закрываем окно с предупреждением
  //если происходит удаление карточек на доске Done
  if (deletedCard.closest(".task_done")) {
    inListenerDeleteCard(deletedCard, ".task_done");
    setLocalStorage(cards);
    renderDone();
  }
  //если происходит удаление карточек на доске Todo
  if (deletedCard.closest(".task_to-do")) {
    inListenerDeleteCard(deletedCard, ".task_to-do");
    setLocalStorage(cards);
    renderTodo();
    setCountOfCards();
  }

  //если происходит удаление всех карточек
  if (deletedCard.className.includes("board__delete-all")) {
    cards = [];
    setLocalStorage(cards);
    renderTodo();
    renderInProgress();
    renderDone();
    setCountOfCards();
  }
});

//закрытие формы warning при нажатии кнопки Cancel
cancelWarningBtn.addEventListener("click", () => {
  warningWrapper.classList.toggle("warning-active");
  document.querySelector(".warning__confirm").hidden = false;
});
