'use strict'

const child = require('child_process')
const eos = require('end-of-stream')
const wrap = require('spawn-wrapper')
const path = require('path')
const shell = require('shelljs')
const jeopardy = path.resolve(__dirname, 'jeopardy.mp3')

const players = {
  'afplay': (audioFile) => ['afplay', [ audioFile ]],
  'mplayer': (audioFile) => ['mplayer', [ audioFile ]],
  'mpv': (audioFile) => ['mpv', [ '--no-audio-display', audioFile]],
  'vlc': (audioFile) => ['vlc',[ '-I', 'rc',  audioFile ]]
}

const findPlayer = function () {
  for (const playerName of Object.keys(players)) {
    const { code } = shell.exec(`which ${playerName}`, { silent: true })

    if (code === 0) {
      return players[playerName]
    }
  }

  return () => [ 'echo' ]
}

module.exports = function run (command, args, callback) {
  const getPlayerCommand = findPlayer()
  const main = child.spawn(command, args, {
    stdio: 'inherit'
  })

  wrap(main, getPlayerCommand(jeopardy))

  eos(main, callback)
}
