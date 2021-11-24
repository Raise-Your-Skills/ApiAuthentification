// Animation formulaire Login/Signup
document.querySelector(".log-in").addEventListener('click', () => {
	document.querySelector(".signIn").classList.add("active-dx")
	document.querySelector(".signUp").classList.add("inactive-sx")
	document.querySelector(".signUp").classList.remove("active-sx")
	document.querySelector(".signIn").classList.remove("inactive-dx")
})

document.querySelector(".back").addEventListener('click', () => {
	document.querySelector(".signUp").classList.add("active-sx")
	document.querySelector(".signIn").classList.add("inactive-dx")
	document.querySelector(".signIn").classList.remove("active-dx")
	document.querySelector(".signUp").classList.remove("inactive-sx")
})


//
// Config
//

// const apiUrl = 'http://localhost:5000'
const apiUrl = 'https://bastienrc-apiauth.herokuapp.com'
console.log('--> URL API')
console.log(apiUrl)


//
// Selection page
//
function isAuth() {
  if (localStorage.getItem('token')) {
    document.getElementById('sign').style.display = 'none'
    document.getElementById('account').style.display = 'flex'
    accountPage('profil')
  } else {
    document.getElementById('sign').style.display = 'flex'
    document.getElementById('account').style.display = 'none'
  }
}
isAuth()


//
// Functions
//
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

// Account
function accountPage (page) {
  document.getElementById('message').innerHTML = ''
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  fetch(`${apiUrl}/api/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    console.log(`Status: ${response.status}`)
    if(response.ok) {
      response.json().then(data => {
        if (page=== 'profil') {
          accountReadProfil(data)
        }
        if (page=== 'edit') {
          accountEditProfil(data)
        }
      })
    }
  })
}

function accountReadProfil (objUser) {
  // console.log(objUser)
  console.log('--> View Profil')
  const avatar = objUser.avatarUrl ? objUser.avatarUrl : "avatar_default.jpg"
  const firstname = objUser.firstname ? objUser.firstname : "No Firstname"
  const lastname = objUser.lastname ? objUser.lastname : "No Lastname"
  const email = objUser.email ? objUser.email : 'No Email'
  const bio = objUser.bio ? objUser.bio : "No Bio"

  document.getElementById('accountProfil').innerHTML = `
    <div class="col-6">
      <div id="img-preview">
        <img id="avatar" src="./images/${avatar}" />
      </div>
    </div>
    <div class="col-6">
      <div id="info" >
        <p><span>Prénom : </span>${firstname}</p>
        <p><span>Nom : </span>${lastname}</p>
        <p><span>Email : </span>${email}</p>
        <p><span>Bio : </span>${bio}</p>
      </div>
    </div>

    <div class="col-12" id="footer">
      <p>ID:${objUser._id} ~ C:${objUser.createdAt} ~ U:${objUser.updatedAt}</p>
    </div>
  `
}

function accountEditProfil (objUser) {
  console.log('--> Edit Profil')
  // console.log(objUser)
  const avatar = objUser.avatarUrl ? objUser.avatarUrl : "avatar_default.jpg"
  const firstname = objUser.firstname ? objUser.firstname : ""
  const lastname = objUser.lastname ? objUser.lastname : ""
  const email = objUser.email ? objUser.email : ''
  const bio = objUser.bio ? objUser.bio : ""

  // <div class="col-6">
  // 	<div id="img-preview"><img id="avatar" src="/images/avatar_default.jpg" /></div>
  // 	<label for="avatar">Choisissez votre Avatar</label>
  // 	<input type="file" accept="image/*" name="avatar" id="avatar">
  // </div>

  document.getElementById('accountProfil').innerHTML = `
    <div class="col-6">
      <div id="img-preview">
        <img id="avatar" src="./images/${avatar}" />
      </div>
    </div>
    <div class="col-6">
      <form id="accountForm" method="post">
        <input type="text" name="firstname" id="firstname" placeholder="Prénom" value="${firstname}">
        <input type="text" name="lastname" id="lastname" placeholder="Nom" value="${lastname}">
        <input type="email" name="email" id="email" placeholder="E-Mail" value="${email}" required>
        <textarea name="bio" id="bio" cols="30" rows="10" placeholder="Bio">${bio}</textarea>
        <input type="submit" onClick="updateUser()" value="Enregistrer">
      </form>
    </div>

    <div class="col-12">
      <div style="font-size:0.6rem;text-align:center;margin:1px;color:#999">
        <p>ID:${objUser._id} ~ C:${objUser.createdAt} ~ U:${objUser.updatedAt}</p>
      </div>
    </div>
  `
}

// Update
function updateUser() {
  const accountForm = document.getElementById("accountForm")
  accountForm.addEventListener('submit', e => {
    e.preventDefault()
    console.log('--> AccountForm')

    // Je récupére les entrées
    let submitAccountForm = {}
    Array.from(new FormData(accountForm), (entry) => {
      if (entry[0] === 'avatar') {
        submitAccountForm[entry[0]] = entry[1].name
      } else {
        submitAccountForm[entry[0]] = entry[1]
      }
    })

    // Afficher les entrées pour verifier que ca marche !
    // console.log(submitAccountForm)

    // Je récupére l'userId et le token du localStorage
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    // console.log(`${apiUrl}/api/users/${userId}`)

    // Je mets mon user à jour
    fetch(`${apiUrl}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(submitAccountForm)
    })
    .then(response => {
      console.log(`Status: ${response.status}`)
      if(response.ok) {
        isAuth()
        response.json().then(data => {
          console.log(data.message)
          document.getElementById('message').innerHTML = `<p class="good">${data.message}</p>`
        })
      } else {
        response.json().then(data => {
          // console.log(data.error.errors)
          document.getElementById('message').innerHTML = ''
          if (data.error.keyPattern) {
            document.getElementById('message').innerHTML += `<p class="bad">Cette adresse email existe déjà !</p>`
          } else if (data.error.errors) {
            document.getElementById('message')
              .innerHTML += data.error.errors.lastname
                ? `<p class="bad">Nom: ${data.error.errors.lastname.message}</p>`
                : ''
            document.getElementById('message')
              .innerHTML += data.error.errors.firstname
                ? `<p class="bad">Prénom: ${data.error.errors.firstname.message}</p>`
                : ''
          }
      })
      }
    })
  })
}

//
// Les events
//

// SignUp
const signUp = document.getElementById("signUp")
signUp.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('--> SignUp')

  // Je récupére les entrées
  let submitSignUp = {}
  Array.from(new FormData(signUp), (entry) => {
    if (entry[0] === 'avatar') {
      submitSignUp[entry[0]] = entry[1].name
    } else {
      submitSignUp[entry[0]] = entry[1]
    }
  })

  // console.log(submitSignUp)

  /* J'envoie les données à l'API et je récupére la réponse */
  let url = `${apiUrl}/api/users/signup`
  // console.log(url)
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitSignUp)
  })
  .then(response => {
    console.log(`Status: ${response.status}`)
    if(response.ok) {
      console.log(response)
      response.json().then(data => {
        console.log(data.message)
        document.getElementById('message').innerHTML = `<p class="good">${data.message}</p>`
        // On bascule sur le form de connection
        document.querySelector(".signIn").classList.add("active-dx")
        document.querySelector(".signUp").classList.add("inactive-sx")
        document.querySelector(".signUp").classList.remove("active-sx")
        document.querySelector(".signIn").classList.remove("inactive-dx")
        // On vide les inputs
        document.getElementById("signUp").email.value = ''
        document.getElementById("signUp").password.value = ''
        document.getElementById("signIn").email.value = ''
      })
    } else {
      response.json().then(data => {
        if (data.error.keyPattern) {
          document.getElementById('message').innerHTML = `<p class="bad">Cette adresse email existe déjà !</p>`
        } else if (data.error) {
          document.getElementById('message').innerHTML = `<p class="bad">${data.error}</p>`
        }
      })
    }
  })
})

// SignIn
const signIn = document.getElementById("signIn")
signIn.addEventListener('submit', e => {
  e.preventDefault()

  console.log('--> SignIn')

  // Je récupére les entrées
  let submitSignIn = {}
  Array.from(new FormData(signIn), entry => {
    submitSignIn[entry[0]] = entry[1]
  })

  // console.log(submitSignIn)

  // J'envoie les données à l'API et je récupére la réponse
  fetch(`${apiUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitSignIn)
  })
  .then(response => {
    console.log(`Status: ${response.status}`)
    if(response.ok){
      response.json().then(data => {
        // console.log(data)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('token', data.token)
        isAuth()
      })
    } else {
      response.json().then(data => {
        console.log(data)
        document.getElementById('message').innerHTML = `<p class="bad">${data.error}</p>`
      })
    }
  })
})

// Exit
const btnExit = document.getElementById("btnExit")
btnExit.addEventListener('click', e => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  isAuth()
})

// Delete
const btnDelete = document.getElementById("btnDelete")
btnDelete.addEventListener('click', e => {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  fetch(`${apiUrl}/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    console.log(`Status: ${response.status}`)
    if (response.ok) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      isAuth()
      document.getElementById('message').innerHTML = `<p class="good">Utilisateur éffacé</p>`
    }
  })
})

// Edit
const btnEdit = document.getElementById("btnEdit")
btnEdit.addEventListener('click', e => {
  accountPage('edit')
})
