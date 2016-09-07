#!/usr/bin/env node

const run = require('./')

const input = process.argv.slice(2)

if (!input.length) {
  console.error('Usage: jeopardy <command>')
  process.exit(1)
}

run(input[0], input.slice(1), function (err) {
  if (err) process.exit(1)
})
