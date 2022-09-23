document.addEventListener('DOMContentLoaded', () => {
  let addJoke = false
  const addJokeForm = document.querySelector('#add-joke-form')
  const addJokeButton = document.querySelector('#add-joke-button')
  const baseUrl = "https://v2.jokeapi.dev/joke/"
  const jokeSection = document.querySelector('.joke-section')
  const submit = document.querySelector('#search-form')
  const categoriesNodeList = document.querySelectorAll('.checkbox')
  const localUrl = "http://localhost:3000/jokes"

  let categoriesArray = [...categoriesNodeList]
  let categories = []
  let urlCategories = 'any'

  for (let category of categoriesArray) {
    category.addEventListener('click', () => {
      const index = categories.indexOf(category.value)
      categories.includes(category.value) ? categories.splice(index,1) : categories.push(category.value) 
      urlCategories = categories.join(',')

      if (categories.length === 0) {
        urlCategories = 'any'
      }
      return urlCategories
    })
  }

  submit.addEventListener('submit', e => {
    e.preventDefault()

    removeAllChildNodes(jokeSection)

    let search = document.querySelector('#search').value

    fetch(`${baseUrl}/${urlCategories}?safe-mode&contains=${search}&amount=9`)
    .then(resp => resp.json())
    .then(jokeObjs => {
      jokeObjs.jokes.forEach(jokeObj => createJokeCard(jokeObj));
    })
    .catch(() => {
      alert('Sorry, no jokes were found in the API. You may see one from the local database if the criteria matches.')
    })

    fetch(localUrl)
    .then(resp => resp.json())
    .then(jokeObjs => {
      console.log(jokeObjs)
      let randomId = Math.floor(Math.random() * jokeObjs.length)
      let idArr = []
      jokeObjs.forEach(jokeObj => {
        if (categories.length === 0 && search.length === 0) {
          createJokeCard(jokeObjs[randomId])
        } else if((categories.includes(jokeObj.category) && jokeObj.joke.includes(search)) || (jokeObj.joke.includes(search) && search.length !== 0 && categories.length === 0)){
          idArr.push(jokeObj)
        } 
      })

      if (idArr.length > 0) {
        randomId = Math.floor(Math.random() * idArr.length)
        createJokeCard(idArr[randomId])
      }
    })
    document.querySelector('#search').value = ''
  })

  const createJokeCard = (jokeObj) => {
    const jokeContainer = document.createElement('div')
    const jokeContent = document.createElement('div')
    const jokeDetails = document.createElement('div')
    const jokePunchline = document.createElement('h3')
    const p = document.createElement('div')
    const jokeSetup = document.createElement('h3')

    p.textContent = `Category: ${jokeObj.category} | Type: ${jokeObj.type}`
    jokeSetup.textContent = jokeObj.setup

    jokeObj.type === 'twopart' ? jokePunchline.textContent = jokeObj.delivery : jokePunchline.textContent = jokeObj.joke

    p.classList.add('joke-category')
    jokeSetup.classList.add('joke-setup')
    jokePunchline.classList.add('joke-punchline')
    jokeContainer.classList.add('joke-container')
    jokeContent.classList.add('joke-content')
    jokeDetails.classList.add('joke-details')

    jokeDetails.appendChild(p)
    jokeDetails.append(jokeSetup)
    jokeDetails.appendChild(jokePunchline)
    jokeContent.appendChild(jokeDetails)
    jokeContainer.appendChild(jokeContent)
    jokeSection.appendChild(jokeContainer)
  }

  const submitData = (e) => {
    e.preventDefault()
    const submitCategory = document.querySelector('#submit-category').value
    let jokeInput = document.querySelector('#joke-input').value

    const configurationObject = {
      method:'POST',
      headers: {
        "Content-Type": 'application/json',
        "Accept": "application/json"
      },
      body: JSON.stringify({
        category: submitCategory,
        joke: jokeInput,
        type: 'single',
        lang: "en",
        safe: true,
        flags: {
          "nsfw": false,
          "religious": false,
          "political": false,
          "racist": false,
          "sexist": false,
          "explicit": false
        },
      })
    }

    fetch("http://localhost:3000/jokes", configurationObject)
    .then(resp => resp.json())
    .then(createJokeCard)

    addJokeForm.reset()
  }

  const mouseOver = (event) => {
    event.target.style.cursor = "pointer";
  }

  addJokeButton.addEventListener('click', () => {
    addJoke = !addJoke;
    if (addJoke) {
      addJokeForm.style.display = "block"
      addJokeButton.textContent = 'Nevermind.'
    } else {
      addJokeForm.style.display = "none" 
      addJokeButton.textContent = 'So, you think you\'re funny, huh? ( Add a joke )'
    }
  })

  addJokeButton.addEventListener('mouseover', mouseOver)
  addJokeForm.addEventListener('submit', submitData)

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
})

