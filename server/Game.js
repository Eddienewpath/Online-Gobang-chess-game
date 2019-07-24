const gameStates = require('./States')  
const { isOwnerExisted, findPlayer, check_result, result, add_pieces, init_arr } = require('./util');

function Game(play1, play2) {
    gameStates['gameCount']++
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
    this.play1.myTurn = this.play1.color === 'white' ? true : false
    this.play2.myTurn = this.play2.color === 'white' ? true : false

    var self = this

    this.play1.socket.emit('play', { 'name': this.play2.name, 'color': this.play1.color })
    this.play2.socket.emit('play', { 'name': this.play1.name, 'color': this.play2.color })
}

module.exports = { Game }