
var alphabet = "abcdefghijklmnopqrstuvwxyz"

var oldText = ""

var submittedWords = {}

var discovered = []

var currentScore = 0
var bestScore = 0

var maxAttempts = 3

var gameEnded = false

var showPredictedScore = false

var practice = false

const debug = true

const offsetFromDate = new Date("7 June 2025")
const msOffset = getTodaysDate() - offsetFromDate
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24)

var current_letter = (() => {
  let i = dayOffset-(Math.floor(dayOffset/26)*26)
  return alphabet[i]
})()



function getTodaysDate() {
  if (debug) {
    return new Date("8 June 2025")
  } else {
    return new Date()
  }
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
    penalty += 10
  } else {
    addDiscoveredWord(word.toLowerCase())
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

    if (!practice) {
      saveDailyGame(currentScore)
    } else {
      savePracticeGame(currentScore)
    }

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

  let d = $(`<div class="submitted-word">${word.toUpperCase()}<div class="word-score">+${score}${p}</div></div>`)

  $("#submitted").append(d)

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

function saveDailyGame(score) {

  let saveString = window.localStorage.getItem("days")

  let days = {}

  if (saveString) {

    days = JSON.parse(saveString)

  }

  days[getTodaysDate().toDateString()] = {
    "daily":score,
    "best":score,
  }

  bestScore = score

  window.localStorage.setItem("days", JSON.stringify(days))

}

function savePracticeGame(score) {

  let saveString = window.localStorage.getItem("days")

  let days = {}

  if (saveString) {

    days = JSON.parse(saveString)

  }

  let today = days[getTodaysDate().toDateString()]

  if (score < today.best) {
    today.best = score
    bestScore = score
  }

  //Probably redundant but javascript could be fucking with me
  days[getTodaysDate().toDateString()] = today

  window.localStorage.setItem("days", JSON.stringify(days))

}

function saveDailyState() {

  let state = {
    "completed": gameEnded,
    "words": Object.keys(submittedWords),
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

      for (let word of state.words) {
        submitWord(word)
      }

    }

  }

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
  $("#game-over").addClass("show")
  $("#game-over").show()
  $("#game-over").addClass("appear-bounce")
  $("#attempts").hide()
  $("#info").hide()

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
}


$(() => {

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