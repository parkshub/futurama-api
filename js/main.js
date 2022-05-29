const log = console.log
let cleanUpEpisodes
let cleanUpCharacters

let selectContainer = document.querySelector('#characters')

document.querySelector('#episodeButton').addEventListener('click', getEpisode)


// just the episodes
function getEpisode(){
  
  const url = 'https://api.sampleapis.com/futurama/episodes'

  let count = Number(1)
  let season = Number(1)
  
  if (!document.querySelector('#season').value) {
    alert ('Like my granny used to say back in her tar paper shack on Montego Bay, "If you want a box thrown into the sun, you got to do it yourself."\n-Hermes\n\nPlease input both a season and an episode.')

  }

  let userSeason = document.querySelector('#season').value
  let userEpisode = document.querySelector('#episode').value

  fetch(url)
      .then(res => res.json())
      .then(data => {
        log(data)        
        cleanUpEpisodes = data
        // you could change this to data instead of cleanUp and erase let cleanUp above if you want
        cleanUpEpisodes.forEach(x => {
          if (x.number.split(' - ')[1] == count || x.number.split(' - ')[1] > 1) {
            x['season'] = Number(season)
            count += 1
          }
          else {
            season += 1
            count = 2
            x['season'] = Number(season)
          }
          x['episode'] = Number(x.number.split(' - ')[1])
        })
        if (!cleanUpEpisodes.filter(x => x.season == userSeason && x.episode == userEpisode)[0]) {
          alert("I can't find that combination of season and episode. Please try again.")
        }
        let filtered = cleanUpEpisodes.filter(x=> (x.episode==userEpisode && x.season==userSeason))[0]

        document.querySelector('#seasonNum').innerText = 'Season ' + filtered.season
        document.querySelector('#episodeNum').innerText = 'Episode ' + filtered.episode
        document.querySelector('#airDate').innerText = 'aired on ' + filtered.originalAirDate
        document.querySelector('#writer').innerText = 'written by ' + filtered.writers
        document.querySelector('#episodeDesc').innerText = filtered.desc

      })
      
      

      .catch(err => {
          console.log(`error ${err}`)
      });
  }



// adding all the characters as an option automagically
fetch ('https://api.sampleapis.com/futurama/characters')
  .then (res => res.json())
  .then (data => {
    
    cleanUpCharacters = data
    cleanUpCharacters = cleanUpCharacters.map(x => Object.values(x.name))
    let cleanUpCharactersArray = cleanUpCharacters

    cleanUpCharacters = cleanUpCharacters.map(x => x.filter(String))
    cleanUpCharacters = cleanUpCharacters.map(x => x.join(' '))

    log(cleanUpCharacters) 

    cleanUpCharacters.forEach((x, i) => {
      let option = document.createElement('option')
      option.value = cleanUpCharactersArray[i]
      option.innerText = x
      selectContainer.appendChild(option)
    })
  })

// setting up action to collect data from 

document.querySelector('#characterButton').addEventListener('click', getCharacter)

function getCharacter() {
  let userName = document.querySelector('select').options[selectContainer.selectedIndex].value.split(',')
  log(userName)
  
  fetch ('https://api.sampleapis.com/futurama/characters')
    .then (res => res.json())
    .then (data => {
      log(data)

      let userFetch = data.filter(x => x.name.first == userName[0] && x.name.last == userName[2])[0]
      log(userFetch)
      document.querySelector('#name').innerText = document.querySelector('select').options[selectContainer.selectedIndex].text
      document.querySelector('img').src = userFetch.images.main
      document.querySelector('#gender').innerText = 'Gender: ' + userFetch.gender
      document.querySelector('#species').innerText = 'Species: ' + userFetch.species
      document.querySelector('#homePlanet').innerText = 'Home Planet: ' + userFetch.homePlanet
      document.querySelector('#occupation').innerText =  'Occupation: ' + userFetch.occupation
      let randomQuote = Math.floor(Math.random()*(userFetch.sayings).length)
      document.querySelector('#catchPhrase').innerText = `Random Catch Phrase ${randomQuote+1 + '/' + userFetch.sayings.length}:\n` + userFetch.sayings[randomQuote]

    })
  }