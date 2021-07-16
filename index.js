const PORT = process.env.PORT || 3000
const WebSocketServer = require('ws').Server
const express = require('express')

const path = require('path')
const server = express().use(express.static(path.join(__dirname, 'public'))).listen(PORT, () => console.log(`Listening on ${PORT}`))

const wss = new WebSocketServer({ server })

const aesjs = require('aes-js')

const key256 = [228, 117, 72, 79, 9, 55, 197, 218, 148, 48, 60, 11, 155, 190, 139, 240, 107, 208, 98, 37, 218, 229, 137, 133, 75, 4, 53, 211, 213, 137, 219, 236]
// for(let i = 0; i<256/8; i++)key_256[i]=rand(0, 255);
// console.log(key_256);
const counterNum = key256[0]
const aes = new aesjs.ModeOfOperation.ctr(key256, new aesjs.Counter(counterNum))

wss.on('connection', function connection (ws) {
  ws.id = rand(0, 2 ** 128, true)
  ws.on('message', function (message) {
    message = receiveAES(message.toString())
    console.log(ws.id + ': ' + message)
    // if (message === 'terminate') return ws.terminate()
    ws.send(sendAES('echo: ' + message))
  })
  ws.on('close', function () {
    console.log('connection closed')
  })

  console.log('new client connected!')
})

function sendAES (text, key = key256) {
  return aesjs.utils.hex.fromBytes(aes.encrypt(aesjs.utils.utf8.toBytes(text)))
}
function receiveAES (text, key = key256) {
  return aesjs.utils.utf8.fromBytes(aes.decrypt(aesjs.utils.hex.toBytes(text)))
}

function rand (min, max, hex) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  if (hex) return num.toString(16)
  return num
}
