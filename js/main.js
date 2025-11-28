//IGNACIO MARTIN BRAVO
import postCollection from "./postCollection.js";

const form = document.getElementById("form");
const msg = document.getElementById("msg");
const petName = document.getElementById("petName");
const description = document.getElementById("Description");
const image = document.getElementById("Image");
const petCode = document.getElementById("PetCode");
const birthdate = document.getElementById("Birthdate");
const price = document.getElementById("Price");
const sold = document.getElementById("Sold");
const pets = document.getElementById("pets");
const formButton = document.getElementById("Btn");
const btnDelete = document.getElementById("delete");

let editFlag = false;
let postIdToUpdate;

let initialPosts = [
  {
    PetName: "Nacho",
    Description: "So good pet",
    Image: "Noimage.jpg",
    Birthdate: Date.now(),
    Price: 4.9,
    Sold: true,
    PetCode: "CAT1234",
  },
];

let savedPosts = localStorage.getItem("collection");

let collection;
if (savedPosts) {
  collection = new postCollection(JSON.parse(savedPosts));
} else {
  collection = new postCollection(initialPosts);
  localStorage.setItem("collection", JSON.stringify(collection.getAllPosts()));
}

displayPets(collection.getAllPosts());

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const flag = formValidation();

  if (!flag) return;

  const newPost = {
    PetName: petName.value,
    Description: description.value,
    Image: image.value,
    Birthdate: birthdate.value,
    Price: price.value,
    Sold: sold.checked,
    PetCode: petCode.value,
  };

  if (editFlag) {
    updatePet(postIdToUpdate);
  } else {
    const newPostId = collection.addNewPost(newPost);
    if (newPostId) {
      console.log("Pet added with id " + newPostId);
    }
    localStorage.setItem(
      "collection",
      JSON.stringify(collection.getAllPosts())
    );
  }

  displayPets(collection.getAllPosts());
  petName.value = "";
  description.value = "";
  image.value = "";
  birthdate.value = "";
  price.value = "";
  sold.checked = false;
  petCode.value = "";
});

btnDelete.addEventListener("click", (ev) => {
  localStorage.setItem("collection", "");
});

const deletePost = (id) => {
  collection.deleteById(id);
  localStorage.setItem("collection", JSON.stringify(collection.getAllPosts()));
  displayPets(collection.getAllPosts());
};

function formValidation() {
  let flag = true;

  if (!validatePetName(petName)) flag = false;
  if (!validateImage(image)) flag = false;
  if (!validatDate(birthdate)) flag = false;
  if (!validatePrice(price)) flag = false;
  if (!validatePetCode(petCode)) flag = false;

  return flag;
}

function validatePetName(input) {
  if (input.value.length < 1) {
    input.parentElement.classList.add("is-not-valid-field");
    return false;
  } else {
    input.parentElement.classList.remove("is-not-valid-field");
    return true;
  }
}

function validateImage(input) {
  const imageRegex = /.(jpg|jpeg|png|gif|bmp|webp)$/i;
  const url = input.value.trim();
  if (input.value.length < 1 || !imageRegex.test(url)) {
    input.parentElement.classList.add("is-not-valid-field");
    return false;
  } else {
    input.parentElement.classList.remove("is-not-valid-field");
    return true;
  }
}

function validatDate(input) {
  let fecha = input.valueAsDate;
  let hoy = Date.now();
  if (input.value.length < 1 || fecha > hoy) {
    input.parentElement.classList.add("is-not-valid-field");
    return false;
  } else {
    input.parentElement.classList.remove("is-not-valid-field");
    return true;
  }
}

function validatePrice(input) {
  if (input.value.length < 1 || input.value <= 0) {
    input.parentElement.classList.add("is-not-valid-field");
    return false;
  } else {
    input.parentElement.classList.remove("is-not-valid-field");
    return true;
  }
}

function validatePetCode(input) {
  const petCodeRegex = /^[A-Z]+(?: [A-Z]+)*\d{3}$/;
  if (input.value.length < 1 || !petCodeRegex.test(input.value)) {
    input.parentElement.classList.add("is-not-valid-field");
    return false;
  } else {
    input.parentElement.classList.remove("is-not-valid-field");
    return true;
  }
}

const editPost = (id) => {
  editFlag = true;
  postIdToUpdate = id;

  let postInfo = collection.findById(id);
  petName.value = postInfo.PetName;
  description.value = postInfo.Description;
  image.value = postInfo.Image;
  birthdate.value = new Date(postInfo.Birthdate).toISOString().split("T")[0];
  price.value = postInfo.Price;
  petCode.value = postInfo.PetCode;
  sold.checked = postInfo.Sold;

  formButton.textContent = "Update";
};

function updatePet(code) {
  const existingPet = collection.findById(code);
  if (!existingPet) return;

  const updatedPet = {
    PetName: petName.value,
    Description: description.value,
    Image: image.value,
    Birthdate: birthdate.value,
    Price: price.value,
    Sold: sold.checked,
    PetCode: code,
  };

  collection.updatePost(updatedPet);
  localStorage.setItem("collection", JSON.stringify(collection.getAllPosts()));

  editFlag = false;
  formButton.textContent = "Add";
  form.reset();

  displayPets(collection.getAllPosts());
}

function changeSold(petCode) {
  const post = collection.findById(petCode);
  if (!post) return;

  post.Sold = !post.Sold;
  collection.updatePost(post);
  localStorage.setItem("collection", JSON.stringify(collection.getAllPosts()));

  displayPets(collection.getAllPosts());
}

function displayPets(posts) {
  pets.innerHTML = "";
  posts.forEach((element) => {
    let message = element.Sold ? "sold" : "not sold";
    pets.innerHTML += `
      <div class="col">
        <div class="card">
          <div class="card__media">
            <img src="${element.Image}" alt="Imagen de la mascota" default="descarga.jpg">
          </div>
          <div class="card__body">
            <div class="meta">
              <div>
                <div class="pet-name">${element.PetName}</div>
                <div class="desc">${element.Description}</div>
              </div>
              <div class="badge">${message}</div>
            </div>
            <div class="row">
              <div class="muted">Nacimiento</div>
              <div class="muted">${element.Birthdate}</div>
            </div>
            <div class="row">
              <div class="muted">Código</div>
              <div class="code">${element.PetCode}</div>
            </div>
            <div class="row" style="margin-top:10px;">
              <div class="muted">Precio</div>
              <div class="price">${element.Price}</div>
            </div>
          </div>
          <div class="card__footer">
            <button class="btn btn--primary editBtn" data-code="${element.PetCode}">Edit</button>
            <button class="btn btn--outline toggleSoldBtn" data-code="${element.PetCode}">Toggle Sold</button>
            <button class="btn btn--outline delete" data-code="${element.PetCode}">Delete</button>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".toggleSoldBtn").forEach((btn) => {
    btn.addEventListener("click", () =>
      changeSold(btn.getAttribute("data-code"))
    );
  });
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", () =>
      editPost(btn.getAttribute("data-code"))
    );
  });
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () =>
      deletePost(btn.getAttribute("data-code"))
    );
  });
}
