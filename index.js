'use strict'

const child = require('child_process')
const eos = require('end-of-stream')
const wrap = require('spawn-wrapper')
const path = require('path')
const which = require('which')
const jeopardy = path.resolve(__dirname, 'jeopardy.mp3')

const players = [
  { name: 'afplay', getCommand: (audioFile) => ['afplay', [ audioFile ]] },
  { name: 'mplayer', getCommand: (audioFile) => ['mplayer', [ audioFile ]] },
  { name: 'mpv', getCommand: (audioFile) => ['mpv', [ '--no-audio-display', audioFile]] },
  { name: 'vlc', getCommand: (audioFile) => ['vlc',[ '-I', 'rc',  audioFile ]] }
]

const findPlayer = function (remainingPlayers, callback) {
  if (remainingPlayers.length < 1) {
    return callback(
     new Error('No suitable player was found on your system 🙁 See https://github.com/bendrucker/jeopardy#readme for a list of supported ones.')
    )
  }

  const { name, getCommand } = remainingPlayers.pop()

  which(name, (err) => {
    if (!err) {
      return callback(null, getCommand)
    }
    findPlayer(remainingPlayers, callback)
  })
}

module.exports = function run (command, args, callback) {
  findPlayer(players, (err, getPlayerCommand) => {
    if (err) {
      return callback(err)
    }

    const main = child.spawn(command, args, {
      stdio: 'inherit'
    })

    wrap(main, getPlayerCommand(jeopardy))

    eos(main, callback)
  })
}
