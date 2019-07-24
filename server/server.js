const express = require('express');               
const app = express();   
const serveStatic = require('serve-static')  
const path = require('path');      
const server = require('http').createServer(app) 
const io = require('socket.io').listen(server);  
const { Player } = require('./Player')  
const gameStates = require('./States')                             
const port = process.env.PORT || 3000;     

app.use(serveStatic(path.join(__dirname, '../public'), {'index': 'game.html'}))

// register connection listener listenning for connection events. 
io.on('connection', (socket) =>{
  // listen for login event 
  socket.on('login', (name) => {
    console.log(name);
    // Array.some() tests whether at least one element in the array passes the test 
    let playerExisted = gameStates['playerList'].some(player => player.name === name)
    if (playerExisted) {
      socket.emit('home', {'playerExisted': true})
    } else {
      console.log(`${name} has logged in!!`);
      let p = new Player(socket, name)
      socket.emit('home', { 'playerCount': gameStates['playerCount'], 'name': name})
    }
  })
})

// server closed
io.on('close',(socket)=> {
  console.log('server closed')
})

server.listen(port, () => {                    
  console.log('server is up on port' + port)
})  

