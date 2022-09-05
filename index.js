document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = "https://v2.jokeapi.dev/joke/"
  const jokeSection = document.querySelector('.joke-section')
  const submit = document.querySelector('#submit')
  const programming = document.querySelector('#programming')

  let programmingValue = false
  programming.addEventListener('click', e => {
    if (programmingValue) {
      programmingValue = false
    } else {
      programmingValue = true
    }
    
    console.log(programmingValue)
  })

  submit.addEventListener('click', e => {
    e.preventDefault()

    const search = document.querySelector('#search').value
    
    fetch(`${baseUrl}/any?safe-mode&contains=${search}&amount=10`)
    .then(resp => resp.json())
    .then(jokeObjs => {
      jokeObjs.jokes.forEach(jokeObj => {
        if (jokeObj.type === 'single') {
          new SingleJoke(jokeObj.category, jokeObj.type, jokeObj.joke, jokeObj.lang, jokeObj.safe, jokeObj.flags, jokeObj.id).createSingleJokeCard()
        } else {
          new TwoPartJoke(jokeObj.category, jokeObj.type, jokeObj.setup, jokeObj.delivery, jokeObj.lang, jokeObj.safe, jokeObj.flags, jokeObj.id).createSingleJokeCard()
        }
      });
    })
  })

  class SingleJoke {
    constructor(category,type,joke,lang,safe,flags,id) {
      this.category = category
      this.type = type
      this.joke = joke
      this.lang = lang
      this.safe = safe
      this.id = id
      this.flags = flags
    }

    createSingleJokeCard = () => {
      const jokeContainer = document.createElement('div')
      const jokeContent = document.createElement('div')
      const jokeDetails = document.createElement('div')
      const jokePunchline = document.createElement('h3')
      const p = document.createElement('div')
  
      p.textContent = `Category: ${this.category} | Type: ${this.type} | ID: ${this.id}`
      jokePunchline.textContent = this.joke
  
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
  }

  class TwoPartJoke {
    constructor(category,type,setup,delivery,lang,safe,flags,id) {
      this.category = category
      this.type = type
      this.setup = setup
      this.delivery = delivery
      this.lang = lang
      this.safe = safe
      this.id = id
      this.flags = flags
    }

    createSingleJokeCard = () => {
      const jokeContainer = document.createElement('div')
      const jokeContent = document.createElement('div')
      const jokeDetails = document.createElement('div')
      const jokeSetup = document.createElement('h3')
      const jokePunchline = document.createElement('h3')
      const p = document.createElement('div')
  
      p.textContent = `Category: ${this.category} | Type: ${this.type} | ID: ${this.id}`
      jokeSetup.textContent = this.setup
      jokePunchline.textContent = this.delivery
  
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
  }

})