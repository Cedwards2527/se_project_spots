const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__plus-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormElement = newPostModal.querySelector(".modal__form");

const profileNameInput = document.querySelector(".profile__name");
const DescriptionInput = document.querySelector(".profile__description");

const newPostTitleInput = newPostModal.querySelector("#card-caption-input");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameInput.textContent;
  editProfileDescriptionInput.value = DescriptionInput.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostBtn.addEventListener("click", function () {
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameInput.textContent = editProfileNameInput.value;
  DescriptionInput.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  console.log(newPostLinkInput.value);
  console.log(newPostTitleInput.value);

  newPostModal.classList.remove("modal_is-opened");
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);
