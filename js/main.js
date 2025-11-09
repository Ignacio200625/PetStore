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

let collection = new postCollection(initialPosts);

displayPets(collection.getAllPosts());

console.log(collection.getAllPosts());

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

const deletePost = (id) => {
  console.log("Delete post: " + id);
  collection.deleteById(id);
  displayPets(collection.getAllPosts());
};

function formValidation() {
  let flag = true;

  if (!validatePetName(petName)) {
    console.log("Nombre de mascota no valido");
    flag = false;
  }

  if (!validateImage(image)) {
    console.log("imagen no valida");
    flag = false;
  }

  if (!validatDate(birthdate)) {
    console.log("birthday not valid");
    flag = false;
  }

  if (!validatePrice(price)) {
    console.log("Price not valid");
    flag = false;
  }

  if (!validatePetCode(petCode)) {
    console.log("PetCode not valid");
    flag = false;
  }

  return flag;
}

function validatePetName(input) {
  if (input.value.length < 1) {
    input.parentElement.classList.add("is-not-valid-field");
    console.log("No valido");
    return false;
  } else {
    input.parentElement.classList.remove("is-not-valid-field");
    return true;
  }
}

function validateImage(input) {
  const imageRegex = /.(jpg|jpeg|png|gif|bmp|webp)$/i;
  const url = input.value.trim();
  if (input.value.length < 1) {
    input.parentElement.classList.add("is-not-valid-field");
    console.log("invalido");
    return false;
  } else {
    console.log("valido");
    input.parentElement.classList.remove("is-not-valid-field");
  }

  if (!imageRegex.test(url)) {
    console.log("invalido");
    input.parentElement.classList.add("is-not-valid-field");
    return false;
  } else {
    console.log("valido");
    input.parentElement.classList.remove("is-not-valid-field");
    return true;
  }
}

function validatDate(input) {
  let fecha = input.valueAsDate;
  console.log(fecha);

  let hoy = Date.now();

  if (input.value.length < 1) {
    input.parentElement.classList.add("is-not-valid-field");
    console.log("invalido");
    return false;
  } else {
    console.log("valido");
    input.parentElement.classList.remove("is-not-valid-field");
    console.log(hoy);
    console.log(fecha);
    if (fecha > hoy) {
      input.parentElement.classList.add("is-not-valid-field");
      return false;
    } else {
      input.parentElement.classList.remove("is-not-valid-field");
      return true;
    }
  }
}

function validatePrice(input) {
  if (input.value.length < 1) {
    input.parentElement.classList.add("is-not-valid-field");
    console.log("invalido");
    return false;
  } else {
    console.log("valido");
    input.parentElement.classList.remove("is-not-valid-field");

    if (input.value <= 0) {
      input.parentElement.classList.add("is-not-valid-field");
      return false;
    } else {
      input.parentElement.classList.remove("is-not-valid-field");
      return true;
    }
  }
}

function validatePetCode(input) {
  const petCodeRegex = /^[A-Z]+(?: [A-Z]+)*\d{3}$/;
  if (input.value.length < 1) {
    input.parentElement.classList.add("is-not-valid-field");
    console.log("invalido");
    return false;
  } else {
    console.log("valido");
    input.parentElement.classList.remove("is-not-valid-field");
    if (!petCodeRegex.test(input.value)) {
      console.log(petCodeRegex.test(input.value));
      input.parentElement.classList.add("is-not-valid-field");
      return false;
    } else {
      input.parentElement.classList.remove("is-not-valid-field");
      return true;
    }
  }
}

const editPost = (id) => {
  let postIndex;
  console.log("Edit post: " + id);
  editFlag = true;
  postIdToUpdate = id;

  let postInfo = collection.findById(id);
  petName.value = postInfo.PetName;
  description.value = postInfo.Description;
  image.value = postInfo.Image;
  birthdate.value = new Date(postInfo.Birthdate).toISOString().split("T")[0]; // Proper format for input[type=date];
  price.value = postInfo.Price;
  petCode.value = postInfo.PetCode;
  sold.checked = postInfo.Sold;

  formButton.textContent = "Update";
};

function updatePet(code) {
  const existingPet = collection.findById(code);
  if (!existingPet) {
    console.log("No se encontró la mascota con código " + code);
    return;
  }

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

  console.log("Mascota actualizada:", updatedPet);

  editFlag = false;
  formButton.textContent = "Add";
  form.reset();

  displayPets(collection.getAllPosts());
}

function changeSold(petCode) {
  const post = collection.findById(petCode);

  if (!post) {
    console.log("No se encontró mascota con código " + petCode);
    return;
  }

  post.Sold = !post.Sold;

  collection.updatePost(post);

  displayPets(collection.getAllPosts());
}

function displayPets(posts) {
  pets.innerHTML = "";
  let message = "";

  posts.forEach((element) => {
    message = element.Sold ? "sold" : "not sold";

    pets.innerHTML += `
      <div class="col">
        <div class="card" id="petCard">
          <div class="card__media">
            <img id="petImage" src="${element.Image}" alt="Imagen de la mascota" default="descarga.jpg">
          </div>
          <div class="card__body">
            <div class="meta">
              <div>
                <div class="pet-name" id="petName">${element.PetName}</div>
                <div class="desc" id="petDesc">${element.Description}</div>
              </div>
              <div class="badge" id="petStatus">${message}</div>
            </div>
            <div class="row">
              <div class="muted">Nacimiento</div>
              <div class="muted" id="petBirth">${element.Birthdate}</div>
            </div>
            <div class="row">
              <div class="muted">Código</div>
              <div class="code" id="petCode">${element.PetCode}</div>
            </div>
            <div class="row" style="margin-top:10px;">
              <div class="muted">Precio</div>
              <div class="price" id="petPrice">${element.Price}</div>
            </div>
          </div>
          <div class="card__footer">
            <button class="btn btn--primary editBtn" id="buyBtn" data-code="${element.PetCode}" >Edit</button>
            <button class="btn btn--outline toggleSoldBtn" data-code="${element.PetCode}">Toggle Sold</button>
            <button class="btn btn--outline delete" data-code="${element.PetCode}">Delete</button>
          </div>
        </div>
      </div>
    `;
  });

  // Activar los botones de toggle
  document.querySelectorAll(".toggleSoldBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code");
      changeSold(code);
    });
  });

  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code");
      editPost(code);
    });
  });

  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code");
      deletePost(code);
    });
  });
}
