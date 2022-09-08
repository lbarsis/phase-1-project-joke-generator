document.addEventListener('DOMContentLoaded', () => {
  // Initiate all variables
  let addJoke = false
  const addJokeForm = document.querySelector('#add-joke-form')
  const addJokeButton = document.querySelector('#add-joke-button')
  const baseUrl = "https://v2.jokeapi.dev/joke/"
  const jokeSection = document.querySelector('.joke-section')
  const submit = document.querySelector('#search-form')
  const categoriesNodeList = document.querySelectorAll('.checkbox')
  // const jokeSubmit = document.querySelector('#joke-submit')
  const localUrl = "http://localhost:3000/jokes"

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

  // Event listener that searches for jokes in the API and local databases
  submit.addEventListener('submit', e => {
    e.preventDefault()

    removeAllChildNodes(jokeSection)

    const search = document.querySelector('#search').value
    
    // Fetch from API
    fetch(`${baseUrl}/${urlCategories}?safe-mode&contains=${search}&amount=9`)
    .then(resp => resp.json())
    .then(jokeObjs => {
      jokeObjs.jokes.forEach(jokeObj => createJokeCard(jokeObj));
    })
    .catch(() => {
      alert('Sorry, no jokes were found in the API. You may see one from the local database if the criteria matches.')
    })

    // Fetch from local database
    fetch(localUrl)
    .then(resp => resp.json())
    .then(jokeObjs => {
      // Implement at least one joke from the local database into the results
      let randomId = Math.floor(Math.random() * jokeObjs.length) + 1
      let idArr = []
      jokeObjs.forEach(jokeObj => {
        // If no parameters ar entered
        if (categories.length === 0 && search.length === 0 && jokeObj.id === randomId) {
          createJokeCard(jokeObj)
          // If parameters are entered
        } else if((categories.includes(jokeObj.category) && jokeObj.joke.includes(search)) || (jokeObj.joke.includes(search) && search.length !== 0)){
            idArr.push(jokeObj)
        } 
      })

      // generate a random joke from the list that meets the filter criteria 
      if (idArr.length > 0) {
        randomId = Math.floor(Math.random() * idArr.length)
        createJokeCard(idArr[randomId])
      }
    })
    submit.reset()
  })

  // Creates joke cards that have the type 'single'
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

  // Adds jokes to the local database 
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

  // changes cursor to pointer
  const mouseOver = (element) => {
    // element.style.color = "darkgray";
    element.style.cursor = "pointer";
  }

    // Event listener that hides the form
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

  addJokeButton.addEventListener('mouseover', mouseOver(addJokeButton))
  addJokeForm.addEventListener('submit', submitData)

  // source: -----> https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }
})