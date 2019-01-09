///////////expressjs and socket.io setup//////////////////
const express = require('express');               ////////
const app = express();                            ////////
// const hbs = require('hbs'); //handlebar           ////////
// app.set('view engine', 'hbs');                  /////////
const server = require('http').createServer(app) /////////
const io = require('socket.io').listen(server); /////////                                            /////////
const port = process.env.PORT || 3000;
////////////////////////////////////////////////////////
const {isOwnerExisted, findPlayer,check_result, result, add_pieces, init_arr} = require('./util');
//serving static files with a virtual /static directory in the front of url. 
app.use(express.static(__dirname + '/../views')); 

let playerCount = 0, gameCount = 0, players = [];

function Player(socket, name) {
  this.socket = socket  
  this.name = name  
  this.color = null // player chess color
  this.state = 0  // 0:idle, 1:playing
  this.matchable = false  // looking for a match
  this.game = null 
  this.myTurn = true  // is it my turn? 
  this.isOwner = false 

  playerCount++ 
///////////////////////
  let self = this //// self is being used to maintain a reference to the original this even as the context is changing. 
                      //It's a technique often used in event handlers
/////////////////////////  

  // listen for disconnection/leaving the game. when user close the tab or window 
  this.socket.on('disconnect', () => {
    players = players.filter(p => p.name !== self.name)
    playerCount--
    // 如果退出游戏的玩家正在进行游戏，那么这局游戏也该退出
    if (self.state === 0) {
      gameCount--
    }
    console.log(`${self.name} left`)
  })

  // looking for a match 
  this.socket.on('play', () => {
    // if players available is greater than 2 we can starting pairing. 
    if (playerCount >= 2) {
      self.matchable = true
      // if there are owners existed, then current player will stay put until he gets found. 
      if (isOwnerExisted(self, players) > 0) {
        return
      }
      // if no isOwner found, current player is set to b isOwner
      self.isOwner = true
      let player2 = null
      //add a timer prop to the player instance and matching players every 1 second until found and clear the timer .
      self.timer = setInterval(() => {
        console.log('matching...')
        if (player2 = findPlayer(self, players)) {
          console.log('match found!!')
          self.game = new Game(self, player2)
          player2.game = self.game
          clearInterval(self.timer)
        }
      }, 1000)
    } else {
      socket.emit('players needed')
    }
  })
//////////取消匹配
  this.socket.on('clearPlay', () => {
    clearInterval(self.timer)
  })

  // monitor data comming in 
  this.socket.on('data', (data) => {
    if (self.myTurn) {
      add_pieces(self.game, data, self.color)
    }
  })

  players.push(this)
}

function Game(play1, play2) {

  gameCount++

  // chess board
  this.column = 21
  this.arr = init_arr() 

  this.play1 = play1
  this.play2 = play2

  // change to playing state
  this.play1.state = 1
  this.play2.state = 1
  // should not be matched during the game. 
  this.play1.matchable = false
  this.play2.matchable = false
  // set isOwner state to false so player wont be 
  this.play1.isOwner = false
  this.play1.isOwner = false

  // random assign color
  this.play1.color = ~~(Math.random() * 2) === 0 ? 'white' : 'black'
  this.play2.color = this.play1.color === 'white' ? 'black' : 'white'
  // color white starts first. 
  this.play1.myTurn = this.play1.color === 'white'? true: false
  this.play2.myTurn = this.play2.color === 'white'? true: false

  var self = this

  this.play1.socket.emit('play', {'name': this.play2.name, 'color': this.play1.color})
  this.play2.socket.emit('play', {'name': this.play1.name, 'color': this.play2.color})
}

// register connection listener listenning for connection events. 
io.on('connection', (socket) =>{
  // listen for login event 
  socket.on('login', (name) => {
    console.log(name);
    // Array.some() tests whether at least one element in the array passes the test 
    let playerExisted = players.some(player => player.name === name)
    if (playerExisted) {
      socket.emit('home', {'playerExisted': true})
    } else {
      console.log(`${name} has logged in!!`);
  //create player instance 
      new Player(socket, name)
      // console.log(playerCount)
      //send play and playcounts back. 
      socket.emit('home', {'playerCount': playerCount, 'name': name})
    }
  })
})

// server closed
io.on('close',(socket)=> {
  console.log('server closed')
})

server.listen(port, () => {                    
  console.log('server is up on port' + port)      /////////
})  

