'use strict'

const child = require('child_process')
const eos = require('end-of-stream')
const wrap = require('spawn-wrapper')
const path = require('path')
const jeopardy = path.resolve(__dirname, 'jeopardy.mp3')

module.exports = function run (command, args, callback) {
  const main = child.spawn(command, args, {
    stdio: 'inherit'
  })

  wrap(main, [
    'afplay',
    [jeopardy]
  ])

  eos(main, callback)
}
