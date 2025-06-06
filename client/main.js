
var alphabet = "abcdefghijklmnopqrstuvwxyz"

var oldText = ""

var submittedWords = {}

var maxAttempts = 3

var gameEnded = false

var showPredictedScore = false

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

  $("#textbox").val("")
  oldText = ""

  updateScoreAdd()

  submittedWords[word] = addWord(word, score)

  $("#attempts").text(`${maxAttempts - Object.keys(submittedWords).length} remaining`)

  if (Object.keys(submittedWords).length >= maxAttempts) {
    endGame()
  }

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

function addWord(word, score) {

  let d = $(`<div class="submitted-word">${word.toUpperCase()}<div class="word-score">+${score}</div></div>`)

  $("#submitted").append(d)

  playAnimation(d, "appear-bounce")

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


function endGame() {
  gameEnded = true
  $("#textbox").hide()
  $("#keyboard-container").hide()
  $("#game-over").addClass("show")
  $("#game-over").addClass("appear-bounce")
  $("#attempts").hide()

}

$(()=> {

    $("#attempts").text(`${maxAttempts} remaining`)

    $("#textbox").attr("placeholder", current_letter.toUpperCase()+"..........")

    $(document).on("keydown", physicalKeyPressed)
    $("#textbox").on("input", textboxInput)
    $("#textbox").on("paste", (e) => e.preventDefault())
    // $(document).on("click", handleMouseClick)

  if (!showPredictedScore) {
    $("#score-add").hide()
  }

})