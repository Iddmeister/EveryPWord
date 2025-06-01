
var textBoxEmpty = true

var submittedWords = {}

var maxAttempts = 5

var gameEnded = false

var showPredictedScore = false

function playAnimation(object, anim) {
  object.addClass(anim)
  object.on("animationend", () => {
    object.removeClass(anim)
  })
}

function handleMouseClick(e) {

  if (gameEnded) {
    return
  }


  e.target.blur()
  if (e.target.matches("[data-key]")) {
      addLetter(e.target.dataset.key.toUpperCase())
      e.target.blur()
      return
  }

  if (e.target.matches("[data-enter]")) {
      submitWord($("#textbox").text().toLowerCase())
      return
  }

  if (e.target.matches("[data-delete]")) {
      removeLetter()
      return
  }
}

function physicalKeyPressed(event) {

  if (gameEnded) {
    return
  }


  if (event.key === "Enter") {
      submitWord($("#textbox").text().toLowerCase())
      return
    }
  
    if (event.key === "Backspace" || event.key === "Delete") {
      removeLetter()
      return
    }


  if (event.key.match(/^[a-z]$/) || event.key.match(/^[A-Z]$/)) {
      addLetter(event.key.toUpperCase())
      return
    }
}

function shakeTextbox() {
  $("#textbox").addClass("shake")
  $("#textbox").on("animationend", () => {
    $("#textbox").removeClass("shake")
  })
}

function submitWord(word) {

  if (gameEnded) {
    return
  }

  if (Object.keys(submittedWords).includes(word)) {

    shakeTextbox()

    let box = submittedWords[word]
    console.log(box)

    $(box).addClass("shake")
    $(box).on("animationend", () => {
      $(box).removeClass("shake")
    })

    return
  }

  let score = getWordScore(word)

  if (!score) {
    shakeTextbox()
    return
  }

  currentScore += score

  $("#current-score").text(currentScore)

  $("#current-score").addClass("add")
  $("#current-score").on("animationend", () => {
    $("#current-score").removeClass("add")
  })

  $("#textbox").text("")
  textBoxEmpty = true
  displayTextboxEmpty(true)

  updateScoreAdd()

  submittedWords[word] = addWord(word, score)

  if (Object.keys(submittedWords).length >= maxAttempts) {
    endGame()
  }

}

function addWord(word, score) {

  let d = $(`<div class="submitted-word">${word.toUpperCase()}<div class="word-score">+${score}</div></div>`)

  $("#submitted").append(d)

  playAnimation(d, "appear-bounce")

  return d


}

function updateScoreAdd() {

  if (currentScore == 0) {
    
  }

  let add = getWordScore($("#textbox").text().toLowerCase())

  if (add) {
    $("#score-add").text(`+${getWordScore($("#textbox").text().toLowerCase())}`)
  } else {
    $("#score-add").text("")
  }


}

function addLetter(letter) {

  if (textBoxEmpty) {
    if (letter.toLowerCase() != current_letter) {
      shakeTextbox()
      return
    }
  }

  let prevText = $("#textbox").text()

  if (textBoxEmpty) {
   displayTextboxEmpty(false)
   textBoxEmpty = false
   prevText = ""
  }

  $("#textbox").text(prevText+letter)

  updateScoreAdd()


}

function removeLetter() {

  if (textBoxEmpty) {
    return
  }

  $("#textbox").text($("#textbox").text().slice(0, -1))

  if ($("#textbox").text() == "") {
    textBoxEmpty = true
    displayTextboxEmpty(true)
  } 

  updateScoreAdd()

}

function displayTextboxEmpty(empty=true) {
  if (empty) {
    $("#textbox").text(current_letter.toUpperCase()+"..........")
    $("#textbox").addClass("empty")
  } else {
    $("#textbox").removeClass("empty") 
  }
}

function endGame() {
  gameEnded = true
  $("#textbox").hide()
  $("#keyboard-container").hide()
  $("#game-over").addClass("show")
  $("#game-over").addClass("appear-bounce")


}

$(()=> {
    displayTextboxEmpty(true)
    $(document).on("keydown", physicalKeyPressed)
    $(document).on("click", handleMouseClick)

  if (!showPredictedScore) {
    $("#score-add").hide()
  }

})