// Animation formulaire Login/Signup
document.querySelector(".log-in").addEventListener('click', () => {
	document.querySelector(".signIn").classList.add("active-dx");
	document.querySelector(".signUp").classList.add("inactive-sx");
	document.querySelector(".signUp").classList.remove("active-sx");
	document.querySelector(".signIn").classList.remove("inactive-dx");
});

document.querySelector(".back").addEventListener('click', () => {
	document.querySelector(".signUp").classList.add("active-sx");
	document.querySelector(".signIn").classList.add("inactive-dx");
	document.querySelector(".signIn").classList.remove("active-dx");
	document.querySelector(".signUp").classList.remove("inactive-sx");
});


//
// Functions
//

// Account page
function formTpl() {
  let useMethod = 'POST'
  let id = ``
  let avatarImg = 'avatar_default.jpg'
  let avatar = ``
  let first_name = ``
  let last_name = ``
  let email = ``

  // if (user != '') {
  //   useMethod = 'PUT'
  //   id = `<input type="hidden" id="userId" name="userId" value="${user.id}">`
  //   avatarImg = user.avatar
  //   avatar = `value="${user.avatar}"`
  //   first_name = `value="${user.first_name}"`
  //   last_name = `value="${user.last_name}"`
  //   email = `value="${user.email}"`
  // }

  return `
    <form id="addForm" method="POST">
      <p class="col-12" id="msg"></p>
      <div class="col-6">
        <div id="img-preview"><img src="images/${avatarImg}" /></div>
        <label for="avatar">Choisissez votre Avatar</label>
        <input type="file" accept="image/*" name="avatar" id="avatar" ${avatar}">
      </div>
      <div class="col-6">
        ${id}
        <input type="text" name="first_name" id="first_name" placeholder="Prénom" ${first_name} required>
        <input type="text" name="last_name" id="last_name" placeholder="Nom" ${last_name} required>
        <input type="email" name="email" id="email" placeholder="E-Mail" ${email} required>
        <textarea name="bio" id="bio" cols="30" rows="10"></textarea>
        <input type="submit" onClick="sendForm('${useMethod}')" value="Enregistrer">
      </div>
    </form>
  `
}

function avatarPreview () {
  const avatar = document.getElementById("avatar")
  const imgPreview = document.getElementById("img-preview")
  const img = document.querySelector("#img-preview img")
  avatar.addEventListener("change", function () {
    const files = avatar.files[0]
    if (files) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files)
      fileReader.addEventListener("load", function () {
        imgPreview.style.display = "block"
        img.src = this.result
      })
    }
  })
}

// const sign = document.getElementById('sign')
// sign.style.display = 'none'

const account = document.getElementById('account')
// account.style.display = 'none'
account.innerHTML = formTpl()

// Update
function updateUser (userId) {
  const user = {
    "id": userId,
    "email": document.querySelector(`#id-${userId} .email`).innerText,
    "first_name": document.querySelector(`#id-${userId} .firstName`).innerText,
    "last_name": document.querySelector(`#id-${userId} .lastName`).innerText,
    "avatar": document.querySelector(`#id-${userId} .avatar img`).src
  }

  container.style = 'display: flex'
  container.innerHTML = formTpl(user)
  avatarPreview()
  responseContainer.innerHTML = '<pre>Enregistrer un « User » pour avoir une « Response ».</pre>'
  addUser.innerHTML = '<i class="fas fa-times"></i>'
  addUser.classList.toggle('active')
}

// Delete
// function deleteUser (userId) {
//   // console.log(`https://reqres.in/api/users/${userId}`)
//   fetch(`https://reqres.in/api/users/${userId}`, { method: 'DELETE' })
//   .then(response => {
//     let del = ''
//     if(response.ok){
//       document.getElementById(`id-${userId}`).style.display = 'none'
//       del = `, User #${userId} exterminate !`
//     }
//     document.getElementById('responseContainer')
//             .insertAdjacentHTML('afterbegin', `<pre>Status: ${response.status}${del}</pre>`)
//   })
// }
