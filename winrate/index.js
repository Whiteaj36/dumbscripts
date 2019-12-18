const fetch = require('node-fetch')
const round = require('lodash.round')
function isWin(radiantWon, playerSlot) {
    if (playerSlot < 100)  {
        return radiantWon
    }
    return !radiantWon
}

function convertStartTimesToHourBegan(epochStartTime) {
    let d = new Date(0)
    d.setUTCSeconds(epochStartTime)
    return d.getHours()
}

function computeWinrate(booleanWinrateArray) {
    return booleanWinrateArray.filter(wasWon => wasWon).length/booleanWinrateArray.length 
}

const NAMES = {
   alex: 25259392,
   steven: 59426995,
    berto: 59427819,
    rob: 65859563,
    mj: 84216667,
    chris: 61387321,
    will: 23034529,
	timby: 32399328,
	giacobe: 57267636
}

const playerID = NAMES[process.argv[2]] || process.argv[2]
const limit = process.argv[3]
const limitQueryParam = `${limit ? 'limit='+limit : null}`
fetch(`https://api.opendota.com/api/players/${playerID}/matches?${limitQueryParam}`)
.then(res => res.json())
.then(jsonResult => {
    const startTimesWithWins = jsonResult.map(match => { return { matchId: match.match_id, startingHour: convertStartTimesToHourBegan(match.start_time), isWin: isWin(match.radiant_win, match.player_slot)}})
    const winDict = {}
    startTimesWithWins.forEach(time => {
        if (winDict[time.startingHour]) {
            winDict[time.startingHour].push(time.isWin)
        } else {
            winDict[time.startingHour] = [time.isWin]
        }
    })

    const hourKeys = Object.keys(winDict)
    const winrateArray = {}
    hourKeys.forEach(key => winrateArray[key] = `${round(computeWinrate(winDict[key])*100, 2)}%`)
    console.log('Your winrate by starting hour (GMT-5) is: \n')
    console.log(winrateArray)
} )

