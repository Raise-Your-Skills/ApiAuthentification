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


// Selection page
function isAuth() {
  if (localStorage.getItem('token')) {
    document.getElementById('sign').style.display = 'none'
    document.getElementById('account').style.display = 'flex'
  } else {
    document.getElementById('sign').style.display = 'flex'
    document.getElementById('account').style.display = 'none'
  }
}
isAuth()


//
// Config
//

const apiUrl = 'http://localhost:5000'
console.log('--> URL API')
console.log(apiUrl)

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
function deleteUser (userId) {
  // console.log(`${apiUrl}/api/users/${userId}`)
  fetch(`${apiUrl}/api/users/${userId}`, { method: 'DELETE' })
  .then(response => {
    let del = ''
    if(response.ok){
      document.getElementById(`id-${userId}`).style.display = 'none'
      del = `, User #${userId} exterminate !`
    }
    document.getElementById('responseContainer')
            .insertAdjacentHTML('afterbegin', `<pre>Status: ${response.status}${del}</pre>`)
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
        document.getElementById('message').innerHTML = `<p class="bad">${data.error}</p>`
        console.log(data.error.errors)
        if (data.error.errors) {
          document.getElementById('message').innerHTML = `<p class="bad">Cette adresse email existe déjà !</p>`
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
  isAuth()
})
