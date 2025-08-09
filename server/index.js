const http = require("http")

const ws = require("ws");

var currentDate = (new Date()).toDateString()

console.log(`Server starting, the date is ${currentDate}`)

setInterval(() => {
    
    let c = (new Date()).toDateString()

    if (c != currentDate) {
        currentScores = {}
        currentHistogram = calculateHistogram()
        currentDate = c

        console.log("Data Reset!")
        console.log(`The date is now ${currentDate}`)
    }

}, 30000)


const histTicks = [3, 30, 100, 250, 500, 1000, 10000, 100000, 1000000]

const divisor = 4

var histBins = []

for (let t = 0; t < histTicks.length; t++) {
  
  if (t == 0) {
    histBins.push(histTicks[0])
  } else {

    let gap = histTicks[t]-histTicks[t-1]

    for (let d = 1; d < divisor+1; d++) {

      let value = histTicks[t-1] + ( ((histTicks[t]-histTicks[t-1])/divisor)*d )

      histBins.push(value)

    }
  }

}


var currentScores = {}

var currentHistogram = calculateHistogram()


const server = http.createServer()


const socket = new ws.WebSocketServer({server})

// ws.on('error', console.error);


socket.on("connection", (client) => {
    console.log("client connected")

    sendHistogram(client)
    
    client.on("message", (raw) => {
        
        let data = undefined

        try {

            data = JSON.parse(String(raw))

        } catch {

            console.log("Recieved incompatible data")

        }

        if (!data) {
            return
        }
        
        try {

            switch (data.request) {

                case "histogram":
    
                    sendHistogram(client)
    
                    break;

                case "score":

                    console.log("Score Added!")
                    addNewScore(data.score, data.name)
                    
                    break;

            }
        } catch {
            console.log("Data does not contain correct info")
        }


    })
})

function sendHistogram(client) {
    client.send(JSON.stringify({type:"histogram", histogram:currentHistogram}))
}

function addNewScore(score, name) {

    let bin = getBinForScore(score)

    if (!bin) {
        return
    }

    currentScores[name] = bin

    recalculateHistogram()

}

function recalculateHistogram() {

    currentHistogram = calculateHistogram()

}

function getBinForScore(score) {

    for (let b = 0; b < histBins.length; b++) {
  
        if (score <= histBins[b]) {
            return histBins[b]
        }
  
      }

    return undefined

}


function calculateHistogram() {

    let scores = Object.values(currentScores)

    let finalBins = {}
  
    for (let bin of histBins) {
      finalBins[bin] = 0
    }

    for (let score of scores) {
        finalBins[score] += 1
    }

    if (scores.length > 0) {
        for (let bin of Object.keys(finalBins)) {
            finalBins[bin] = (finalBins[bin] / (scores.length))
            }
    }


    return finalBins

  
  }

server.listen(4003, "0.0.0.0")