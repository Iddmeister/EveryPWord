
var alphabet = "abcdefghijklmnopqrstuvwxyz"

var oldText = ""

var submittedWords = {}

var discovered = []
var discoveredToday = []

var currentScore = 0
var bestScore = null

var maxAttempts = 3

var gameEnded = false

var statistics = null

var showPredictedScore = false

var practice = false

const reusePenalty = 30
const pluralPenalty = 30


const debug = false

const offsetFromDate = new Date("16 June 2025")

var current_letter = getLetterForDate(getTodaysDate())


function getTodaysDate() {
  if (debug) {
    return new Date("18 July 2025")
  } else {
    return new Date()
  }
}

function getLetterForDate(date) {
  let msOffset = date - offsetFromDate
  let dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24)
  let i = dayOffset-(Math.floor(dayOffset/letter_order.length)*letter_order.length)
  return letter_order[i]
}


function playAnimation(object, anim) {
  object.addClass(anim)
  object.on("animationend", () => {
    object.removeClass(anim)
  })
}

// function handleMouseClick(e) {


//   if (gameEnded) {
//     return
//   }


//   e.target.blur()
//   if (e.target.matches("[data-key]")) {
//       addLetter(e.target.dataset.key.toUpperCase())
//       e.target.blur()
//       return
//   }

//   if (e.target.matches("[data-enter]")) {
//       submitWord($("#textbox").val().toLowerCase())
//       return
//   }

//   if (e.target.matches("[data-delete]")) {
//       removeLetter()
//       return
//   }
// }

function physicalKeyPressed(event) {

  if (gameEnded) {
    return
  }

  $("#textbox").focus()


  if (event.key === "Enter") {
    submitWord($("#textbox").val().toLowerCase())
    return
  }

  // if (event.key === "Backspace" || event.key === "Delete") {
  //   removeLetter()
  //   return
  // }


  // if (event.key.match(/^[a-z]$/) || event.key.match(/^[A-Z]$/)) {
  //     addLetter(event.key.toUpperCase())
  //     return
  //   }
}

function shakeTextbox() {
  $("#textbox").addClass("shake")
  $("#textbox").on("animationend", () => {
    $("#textbox").removeClass("shake")
  })
}


function getWordScore(word) {

    // return Math.max(10000-words[word], 0)

    // let height = 100
    // let ease = 1/1000

    // let score = height*Math.exp(-ease*Math.pow(Math.min(words[word], 1000000), 1))

    // // score = Math.floor(Math.max(score, 1))

    // return score

    return words[word]

}

function checkPlurals(word) {


  for (let w of Object.keys(submittedWords)) {

    if (word === w+"s") {
      return true
    }
    if (word+"s" === w) {
      return true
    }

  }

  return false

}

function submitWord(word) {

  if (gameEnded) {
    return
  }

  if (Object.keys(submittedWords).includes(word)) {

    shakeTextbox()

    let box = submittedWords[word]

    $(box).addClass("shake")
    $(box).on("animationend", () => {
      $(box).removeClass("shake")
    })

    return
  }

  let score = getWordScore(word)
  let penalty = 0

  if (!score) {
    shakeTextbox()
    return
  }

  if (isWordDiscovered(word)) {

    if (!discoveredToday.includes(word)){
      penalty += reusePenalty
    }

  } else {

    discoveredToday.push(word)
    addDiscoveredWord(word.toLowerCase())

    if (checkPlurals(word)) {
      penalty += pluralPenalty
    }

  }

  currentScore += score + penalty

  $("#current-score").text(currentScore)

  $("#current-score").addClass("add")
  $("#current-score").on("animationend", () => {
    $("#current-score").removeClass("add")
  })

  $("#textbox").val("")
  oldText = ""
  $("#penalty-alert").hide()

  updateScoreAdd()

  submittedWords[word] = addWord(word, score, penalty)


  $("#attempts").text(`${maxAttempts - Object.keys(submittedWords).length} remaining`)

  if (Object.keys(submittedWords).length >= maxAttempts) {

    endGame()


  }
  
  saveDailyState()
  

}

function checkText(text) {

  for (letter of text) {

    if (!alphabet.includes(letter)) {
      return false
    }

  }

  return true

}


//This whole thing is dumb as fuck
function textboxInput(e) {

  //This is not good but it is fucking 3:47am
  if (!Object.keys(submittedWords).includes($("#textbox").val().toLowerCase())) {

    if (isWordDiscovered($("#textbox").val().toLowerCase())) {

      $("#penalty-alert").html(`You have used this word before<br>+${reusePenalty} penalty will be added`)
      $("#penalty-alert").addClass("show")
      $("#penalty-alert").show()

    } else if(getWordScore($("#textbox").val().toLowerCase()) && checkPlurals($("#textbox").val().toLowerCase())) {

      $("#penalty-alert").html(`This word is too similar<br>+${pluralPenalty} penalty will be added`)
      $("#penalty-alert").addClass("show")
      $("#penalty-alert").show()

    } else {
      $("#penalty-alert").hide()
    }
  }


  let newText = e.originalEvent.data

  let start = e.target.selectionStart
  let end = e.target.selectionEnd


  if (!newText) {

    oldText = e.target.value
    return

  }

  if (e.target.value[0].toLowerCase() != current_letter) {
    shakeTextbox()
    $("#textbox").val(oldText)
  }

  else if (!checkText(newText.toLowerCase())) {
    shakeTextbox()
    $("#textbox").val(oldText)
  } else {

    e.target.value = e.target.value.toUpperCase()
    oldText = e.target.value

  }

  e.target.setSelectionRange(start, end);


}

function addWord(word, score, penalty=0) {

  let p = penalty !== 0 ? `<div class="penalty">+${penalty}</div>` : ""

  let d = $(`<div class="submitted-word"><div class="word-text">${word.toUpperCase()}</div><div class="word-score">+${score} ${p}</div></div>`)

  d.data("penalty", penalty)

  if (score+penalty <= 10) {

    d.children().addClass("rainbow")

  } else if (score+penalty <= 100) {

    d.children().addClass("good")

  }

  $("#submitted").append(d)

  playAnimation(d, "appear-bounce")

  // d.data("word", word)

  return d


}


function addWordStats(word, score, penalty=0) {

  let p = penalty !== 0 ? `<div class="penalty">+${penalty}</div>` : ""

  let d = $(`<div class="submitted-word"><div class="word-text">${word.toUpperCase()}</div><div class="word-score">+${score} ${p}</div></div>`)

  d.data("penalty", penalty)

  if (score+penalty <= 10) {

    d.children().addClass("rainbow")

  } else if (score+penalty <= 100) {

    d.children().addClass("good")

  }

  $("#best-words").append(d)

  playAnimation(d, "appear-bounce")

  // d.data("word", word)

  return d


}

function updateScoreAdd() {

  if (currentScore == 0) {

  }

  let add = getWordScore($("#textbox").val().toLowerCase())

  if (add) {
    $("#score-add").text(`+${getWordScore($("#textbox").val().toLowerCase())}`)
  } else {
    $("#score-add").text("")
  }


}


function loadDiscoveredWords(letter) {

  let saveString = window.localStorage.getItem("discovered-words")

  if (saveString) {

    let discoveredAll = JSON.parse(saveString)

    discovered = discoveredAll[letter]

  } else {

    let discoveredAll = {}

    for (let i = 0; i < alphabet.length; i++) {
      discoveredAll[alphabet[i]] = []
    }

    window.localStorage.setItem("discovered-words", JSON.stringify(discoveredAll))


  }

}

function isWordDiscovered(word) {
  return discovered.includes(word.toLowerCase())
}

function addDiscoveredWord(word) {
  
  word = word.toLowerCase()

  discovered.push(word)

  let saveString = window.localStorage.getItem("discovered-words")

  if (saveString) {

    discoveredAll = JSON.parse(saveString)

    discoveredAll[word[0]] = discovered

    window.localStorage.setItem("discovered-words", JSON.stringify(discoveredAll))

  }


}

function retrieveSave() {

  let saveString = window.localStorage.getItem("days")

  let days = {}

  if (saveString) {

    days = JSON.parse(saveString)

  }

  let today = days[getTodaysDate().toDateString()]

  if (today) {
    if (today["daily"]) {
      bestScore = today["best"]
      startPracticeGame()
    }
  }

}

function saveDailyGame(score, words=[], penalties=[]) {

  let saveString = window.localStorage.getItem("days")

  let days = {}

  if (saveString) {

    days = JSON.parse(saveString)

  }

  days[getTodaysDate().toDateString()] = {
    "daily":score,
    "best":score,
    "words":words,
    "penalties":penalties,
  }

  bestScore = score

  window.localStorage.setItem("days", JSON.stringify(days))

}

function savePracticeGame(score, words=[], penalties=[]) {

  let saveString = window.localStorage.getItem("days")

  let days = {}

  if (saveString) {

    days = JSON.parse(saveString)

  }

  let today = days[getTodaysDate().toDateString()]

  if (score < today.best) {
    today.best = score
    bestScore = score
    today.words = words
    today.penalties = penalties
  }

  //Probably redundant but javascript could be fucking with me
  days[getTodaysDate().toDateString()] = today

  window.localStorage.setItem("days", JSON.stringify(days))

}

function saveDailyState() {

  let state = {
    "completed": gameEnded,
    "words": Object.keys(submittedWords),
    "discovered_today":discoveredToday,
    "date": getTodaysDate().toDateString(),
  }

  window.localStorage.setItem("daily-state", JSON.stringify(state))

}


function retrieveDailyState() {

  let saveString = window.localStorage.getItem("daily-state")

  if (saveString) {

    let state = JSON.parse(saveString)

    if (state.date != getTodaysDate().toDateString()) {
      return
    }

    if (state.completed) {

      // for (let word of state.words) {
      //   submitWord(word)
      // }

    } else {

      discoveredToday = state.discovered_today

      for (let word of state.words) {
        submitWord(word)
      }

    }

  }

}

function calculateStatistics() {

  let stats = {
    average: null,
    best_all: null,
    played: window.localStorage.getItem("games-played") ? JSON.parse(window.localStorage.getItem("games-played")) : 0,
    daily: null,
    best_today: bestScore == 0 ? null : bestScore,
    best_words_today: [],
  }

  let saveString = window.localStorage.getItem("days")

  let days = {}
 
  if (saveString) {

    days = JSON.parse(saveString)

  } else {
    return stats
  }

  if (days[getTodaysDate().toDateString()]) {
    let words = days[getTodaysDate().toDateString()].words
    let penalties = days[getTodaysDate().toDateString()].penalties

    if (words) {

      for (let i = 0; i < words.length; i++) {
        stats.best_words_today.push([words[i], penalties[i]])
      }

    }

  }

  stats.best_words_today

  stats.daily = (days[getTodaysDate().toDateString()] ? days[getTodaysDate().toDateString()].daily : null)

  let average = 0
  let best = null

  for (let day of Object.keys(days)) {

    average += days[day].best
    if (getLetterForDate(new Date(day)) == current_letter) {

      if (!best) {
        best = days[day].best
      } else if (days[day].best < best) {
        best = days[day].best
      }
    }

  }

  if (Object.keys(days).length > 0) {
    average /= Object.keys(days).length
    average = Math.round(average*100)/100
    stats.average = (average == 0 ? null : average)
    stats.best_all = best
  }


  return stats


}

function resetGame() {

  currentScore = 0

  $("#current-score").text(currentScore)

  gameEnded = false
  submittedWords = {}

  $("#submitted").empty()
  $("#textbox").show()
  $("#game-over").hide()
  $("#game-over").removeClass("appear-bounce")
  $("#attempts").text(`${maxAttempts - Object.keys(submittedWords).length} remaining`)
  $("#attempts").show()
  $("#end-highscore").text("")


}

function startPracticeGame() {

  practice = true

  resetGame()

  $("#info").text(`Today's Best: ${bestScore}`)
  $("#info").show()

}

function endGame() {

  gameEnded = true
  $("#textbox").hide()

  if (!bestScore) {
    $("#end-highscore").text("")
  } else if (currentScore < bestScore) {
    $("#end-highscore").text(`Previous Best: ${bestScore}`)
  } else {
    $("#end-highscore").text(`Best: ${bestScore}`)
  }

  if (currentScore == maxAttempts) {

    $("#game-over-feedback").text("Perfect!")

    if (practice) {
      $("#game-over-message").text("You managed to achieve the lowest score possible!")
    } else {
      $("#game-over-message").text("You managed to achieve the lowest score possible! On you're first attempt! You're score has been saved")
    }
  } else {

    if (practice) {
      if (currentScore >= bestScore) {
        $("#game-over-feedback").text("Nice Try")
        $("#game-over-message").text("Keep playing to try and beat your score")
      } else {
        $("#game-over-feedback").text("Nice work, new best score!")
        $("#game-over-message").text("Keep playing to try and get even lower")
      }
    } else {
      $("#game-over-feedback").text("Nice Work!")
      $("#game-over-message").text("Keep playing to try and beat your score")
    }

  }


  $("#game-over").addClass("show")
  $("#game-over").show()
  $("#game-over").addClass("appear-bounce")
  $("#attempts").hide()
  $("#info").hide()

  let saveString = window.localStorage.getItem("games-played")

  if (saveString) {
    let played = JSON.parse(saveString)
    played += 1
    window.localStorage.setItem("games-played", JSON.stringify(played))
  } else {
    window.localStorage.setItem("games-played", JSON.stringify(1))
  }

  discoveredToday = []

  let sWords = Object.keys(submittedWords)

  let penalties = []

  for (let word of sWords) {
    penalties.push(submittedWords[word].data("penalty"))
  }


  if (!practice) {
    saveDailyGame(currentScore, sWords, penalties)
  } else {
    savePracticeGame(currentScore, sWords, penalties)
  }


  updateStats()

}

function showPopup(popup) {

  $(popup).addClass("show")
  $(`${popup} > .popup`).addClass("show")

}

function hidePopup(popup) {

  $(popup).removeClass("show")
  $(`${popup} > .popup`).removeClass("show")

}

function openHelp() {
  showPopup("#help-popup")
}

function closeHelp() {
  hidePopup("#help-popup")
}

function openStats() {
  showPopup("#stats-popup")

}

function closeStats() {
  hidePopup("#stats-popup")

}

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=0, stdev=1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function calculateHistogram(scores, bins) {

  let increment = 1.0
  let finalBins = {}
  let extra = 0

  for (let bin of bins) {
    finalBins[bin.value] = 0
  }

  for (let score of scores) {

    for (let b = 0; b < bins.length; b++) {

      let bin = bins[b]

      if (score <= bin.value) {
        //The 8 is the base unit of width for the frequency density (8 == 0.125 width)
        finalBins[bin.value] += increment// / (bin.width*100)
        break
      } else if (b >= bins.length-1) {
        extra += increment
      }

    }

  }


  for (let bin of Object.keys(finalBins)) {
    finalBins[bin] = (finalBins[bin] / (scores.length-extra))
  }

  return finalBins

}

function calculateScorePosition(score, bins) {

  let cumWidth = 0
  let finalBin = 0

  for (let b = 0; b < bins.length; b++) {

    let bin = bins[b]

    if (score <= bin.value) {
      finalBin = b
      break
    } else {
      cumWidth += bin.width
    }

  }

  if (finalBin > 0) {
    return cumWidth + ((score-bins[finalBin-1].value)/(bins[finalBin].value-bins[finalBin-1].value)) * bins[finalBin].width
  } else {
    return cumWidth + ((score)/(bins[finalBin].value)) * bins[finalBin].width

  }

}

function getMostFrequent(bars) {

  let highest = 0

  for (let bar of Object.values(bars)) {

    if (bar > highest) {
      highest = bar
    }

  }

  return highest

}

function createHistogram(bars, bins, ticks, score) {

  let container = $(`<div class="histogram"></div>`)
  let bar_container = $(`<div class="bar-container"></div>`)
  let x_axis = $(`<div class="x-axis"></div>`)
  let hScore = $(`<div id="hist-score"><div class="hist-score-text"><strong>YOU<br>${score}</strong></div></div>`)

  hScore.css("width", `${calculateScorePosition(score, bins)*100}%`)

  bar_container.append(hScore)

  container.append(bar_container)
  container.append(x_axis)


  for (let b = 0; b < bins.length; b++) {

    let bin = bins[b].value

    let bar = $(`<div class="hist-bar"><div class="hist-bar-inside"></div></div>`)
    bar.css("height", `${bars[bin] * 100 * (1/getMostFrequent(bars))}%`)
    bar.css("width", `${bins[b].width*100}%`)

    bar_container.append(bar)

  }

  let cumWidth = 0

  for (let i = 0; i < ticks.length; i++) {
    let point = $(`<div class="x-tick">${ticks[i].display ? ticks[i].display : ticks[i].value}</div>`)

    point.css("width", `${(ticks[i].x*100) - cumWidth}%`)

    cumWidth = ticks[i].x*100

    x_axis.append(point)
  }



  return container

}

function updateStats() {

  let getStat = (stat) => {
    return stats[stat] ? stats[stat] : "n/a"
  }

  $("#letter").text(`Scores for ${current_letter.toUpperCase()}`)

  let stats = calculateStatistics()
  
  $("#daily-score").text(`First score today: ${getStat("daily")}`)
  $("#best-score-today").text(`Today's Best: ${getStat("best_today")}`)
  $("#best-score-all").text(`Best score ever: ${getStat("best_all")}`)

  $("#average-best-score").text(`Average best score: ${getStat("average")}`)
  $("#total-games").text(`Total games played: ${getStat("played")}`)

  $("#best-words").empty(".submitted-word")

  for(let w of stats.best_words_today) {

    addWordStats(w[0], getWordScore(w[0]), w[1])

  }

  $("#histogram-container").empty(".histogram")

  // let globalInfo = []
  // let ticks = []

  // for (let i = 0; i < 50; i++) {

  //   globalInfo.push({height:Math.random(), width:1/50})


  // }

  let data = []

  // for (let i = 0; i < 10000; i++) {
  //   let d = Math.round(gaussianRandom(100000, 10000))
  //   if (d < 3) {
  //     continue
  //   }
  //   data.push(d)
  // }

  // for (let i = 0; i < 10000; i++) {
  //   let d = Math.round(gaussianRandom(500, 200))
  //   if (d < 3) {
  //     continue
  //   }
  //   data.push(d)
  // }

  // for (let i = 0; i < 10000; i++) {
  //   let d = Math.round(gaussianRandom(150, 75))
  //   if (d < 3) {
  //     continue
  //   }
  //   data.push(d)
  // }

  // for (let i = 0; i < 5000; i++) {
  //   let d = Math.round(gaussianRandom(10, 15))
  //   if (d < 3) {
  //     continue
  //   }
  //   data.push(d)
  // }

  for (let i = 0; i < 10000; i++) {
    let d = Math.round(gaussianRandom(200, 100))
    if (d < 3) {
      continue
    }
    data.push(d)
  }


  let ticks = [
    {x:0.07, value:3, display:"3"},
    {x:0.175, value:30, display:"< 30"},
    {x:0.3, value:100, display:"< 100"},
    {x:0.425, value:250, display:"< 250"},
    {x:0.575, value:500, display:"< 500"},
    {x:0.675, value:1000, display:"< 1K"},
    {x:0.775, value:10000, display:"< 10K"},
    {x:0.875, value:100000, display:"< 100K"},
    {x:1, value:1000000, display:"< 1M"},

  ]
  
  let bins = []

  // for (let t = 0; t < 50; t++) {

  //   bins.push({value:t, width:0.01})

  // }

  // for (let t = 51; t < 100; t++) {

  //   bins.push({value:t, width:0.01})

  // }

  // for (let t = 200; t < 500; t++) {

  //   bins.push({value:t, width:0.0025})

  // }

  for (let t = 0; t < ticks.length; t++) {
    
    bins.push({value:ticks[t].value, width:undefined})

    if (t == 0) {
      bins[t].width = ticks[t].x
    } else {
      bins[t].width = ticks[t].x-ticks[t-1].x
    }

  }

  console.log(bins)

  let globalInfo = calculateHistogram(data, bins)
  console.log(globalInfo)

  // for (let bin of bins) {

  //   ticks.push({x:bin/100, value:bin})

  // }


  $("#histogram-container").append(createHistogram(globalInfo, bins, ticks, getStat("best_today")))




}

var current_wordlist = current_letter+"_en_full.js"

//Add wordslist to page
var script = document.createElement("script");
script.src = "words/"+current_wordlist;
document.getElementsByTagName("head")[0].appendChild(script);

script.onload = () => {
  retrieveSave()
  loadDiscoveredWords(current_letter)
  retrieveDailyState()
  updateStats()
}

function createWavyElement(text, delay) {

  let container = $("<div></div>")

  for (let n = 0; n < text.length; n++) {

      container.append($(`<span style="animation-delay: ${n*delay}s">${text[n]}</span>`))

  }

  return container


}

$(() => {

  let t = createWavyElement("nocabulary", 0.05)

  t.attr("id", "main-title")

  $("#title").prepend(t)

  // waveEffect("#main-title")

  $("#penalty-alert").html(`You have used this word before,<br>+${reusePenalty} penalty will be added`)

  $("#letter-of-the-day").text(current_letter.toUpperCase())
  $("#current-letter").text(`words beginning with ${current_letter.toUpperCase()}`)


  $("#attempts").text(`${maxAttempts} remaining`)

  $("#textbox").attr("placeholder", current_letter.toUpperCase() + "..........")

  $(document).on("keydown", physicalKeyPressed)
  $("#textbox").on("input", textboxInput)
  $("#textbox").on("paste", (e) => e.preventDefault())
  // $(document).on("click", handleMouseClick)

  if (!showPredictedScore) {
    $("#score-add").hide()
  }



})