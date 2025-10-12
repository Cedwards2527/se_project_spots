import "./index.css";
import {
  enableValidation,
  validationConfig,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c380b956-47d8-4c9f-8efb-b1f2fe28fd71",
    "Content-Type": "application/json",
  },
});

let selectedCard;
let selectedCardId;

const profileAvatarElement = document.querySelector(".profile__avatar");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms["edit-profile-form"];
const editProfileSubmit = editProfileModal.querySelector(".modal__submit-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const newPostBtn = document.querySelector(".profile__plus-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const addCardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostTitleInput = newPostModal.querySelector("#card-caption-input");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

api
  .getAppInfo()
  .then(([cards, users]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileNameElement.textContent = users.name;
    profileDescriptionElement.textContent = users.about;
    profileAvatarElement.src = users.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  function toggleLikeButton(isLiked) {
    if (isLiked) {
      cardLikeBtn.classList.add("card__like-btn_active");
    } else {
      cardLikeBtn.classList.remove("card__like-btn_active");
    }
  }
  function handleCardLikeBtn(evt, id) {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_active");

    if (isLiked) {
      api
        .changeLikeStatus(id, true)
        .then((data) => {
          toggleLikeButton(false);
        })
        .catch(console.error);
    } else {
      api
        .changeLikeStatus(id, false)
        .then((data) => {
          toggleLikeButton(true);
        })
        .catch(console.error);
    }
  }

  cardLikeBtn.addEventListener("click", (evt) =>
    handleCardLikeBtn(evt, data._id)
  );

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  const handleCardDeleteBtn = (cardElement, cardId) => {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
  };
  cardDeleteBtn.addEventListener("click", (evt) =>
    handleCardDeleteBtn(cardElement, data._id)
  );

  cardImage.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}

const handleEscapeKey = function (evt) {
  if (evt.key === "Escape") {
    closeModal(document.querySelector(".modal_is-opened"));
  }
};

function closeModal(modal) {
  if (modal) modal.classList.remove("modal_is-opened");
  editProfileBtn.blur();
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatarElement.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error("Avatar update error:", err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleCreateCardsSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  const createCardInputValues = {
    name: newPostTitleInput.value,
    link: newPostLinkInput.value,
  };

  api
    .createCards({
      name: createCardInputValues.name,
      link: createCardInputValues.link,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(addCardSubmitBtn, validationConfig);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error("Card upadte error:", err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete");
    });
}

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

const cancelButtons = document.querySelectorAll(
  ".modal__submit-btn_type_cancel"
);
cancelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

addCardFormElement.addEventListener("submit", handleCreateCardsSubmit);

enableValidation(validationConfig);
