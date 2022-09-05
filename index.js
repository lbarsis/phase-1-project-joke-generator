document.addEventListener('DOMContentLoaded', () => {
  let addJoke = false
  const addJokeForm = document.querySelector('#add-joke-form')
  const addJokeButton = document.querySelector('#add-joke-button')
  const baseUrl = "https://v2.jokeapi.dev/joke/"
  const jokeSection = document.querySelector('.joke-section')
  const submit = document.querySelector('#submit')
  const categoriesNodeList = document.querySelectorAll('.checkbox')
  const jokeSubmit = document.querySelector('#joke-submit')
  const localUrl = "http://localhost:3000/jokes"

  // Event listener that hides the form
  addJokeButton.addEventListener('click', () => {
    addJoke = !addJoke;
    addJoke ? addJokeForm.style.display = "block" : addJokeForm.style.display = "none" 
  })

  // create array of category elements on the DOM and initiate an empty array to apply categories
  let categoriesArray = [...categoriesNodeList]
  let categories = []
  let urlCategories = 'any'

  // Add event listener to all categories and apply them to the format accepted by the API (urlCategories)
  for (let category of categoriesArray) {
    category.addEventListener('click', () => {
      const index = categories.indexOf(category.value)
      categories.includes(category.value) ? categories.splice(index,1) : categories.push(category.value) 
      urlCategories = categories.join(',')

      // this if statement changes the urlCategories back to it's initial state if the user
      // checks off categories then decides to remove them
      if (categories.length === 0) {
        urlCategories = 'any'
      }
      return urlCategories
    })
  }

  submit.addEventListener('click', e => {
    e.preventDefault()

    removeAllChildNodes(jokeSection)

    const search = document.querySelector('#search').value
    
    fetch(`${baseUrl}/${urlCategories}?safe-mode&contains=${search}&amount=9`)
    .then(resp => resp.json())
    .then(jokeObjs => {
      jokeObjs.jokes.forEach(jokeObj => {
        if (jokeObj.type === 'single') {
          createSingleJokeCard(jokeObj)
        } else {
          createTwoPartJokeCard(jokeObj)
        }
      });
    })
    .catch(() => {
      alert('Sorry, no jokes were found.')
    })

    fetch(localUrl)
    .then(resp => resp.json())
    .then(jokeObjs => {
      // Implement at least one joke from the local database into the results
      const randomId = Math.floor(Math.random() * jokeObjs.length) + 1;
      jokeObjs.forEach(jokeObj => {
        if (jokeObj.id === randomId) {
          createSingleJokeCard(jokeObj)
        } 
      })
    })

  })

  const createSingleJokeCard = (jokeObj) => {
    const jokeContainer = document.createElement('div')
    const jokeContent = document.createElement('div')
    const jokeDetails = document.createElement('div')
    const jokePunchline = document.createElement('h3')
    const p = document.createElement('div')

    p.textContent = `Category: ${jokeObj.category} | Type: ${jokeObj.type}`
    jokePunchline.textContent = jokeObj.joke

    p.classList.add('joke-category')
    jokePunchline.classList.add('joke-punchline')
    jokeContainer.classList.add('joke-container')
    jokeContent.classList.add('joke-content')
    jokeDetails.classList.add('joke-details')

    jokeDetails.appendChild(p)
    jokeDetails.appendChild(jokePunchline)
    jokeContent.appendChild(jokeDetails)
    jokeContainer.appendChild(jokeContent)
    jokeSection.appendChild(jokeContainer)
  }

  const createTwoPartJokeCard = (jokeObj) => {
    const jokeContainer = document.createElement('div')
    const jokeContent = document.createElement('div')
    const jokeDetails = document.createElement('div')
    const jokeSetup = document.createElement('h3')
    const jokePunchline = document.createElement('h3')
    const p = document.createElement('div')

    p.textContent = `Category: ${jokeObj.category} | Type: ${jokeObj.type}`
    jokeSetup.textContent = jokeObj.setup
    jokePunchline.textContent = jokeObj.delivery

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
    const jokeInput = document.querySelector('#joke-input').value
    
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
    .then(createSingleJokeCard)

  }

  jokeSubmit.addEventListener('click', submitData)

  // source: -----> https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }

})