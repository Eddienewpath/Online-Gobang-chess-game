const { Game } = require('./Game')
const { isOwnerExisted, findPlayer, check_result, result, add_pieces, init_arr } = require('./util');
const gameStates = require('./States')  

function Player(socket, name) {
    this.socket = socket
    this.name = name
    this.color = null // player chess color
    this.state = 0  // 0:idle, 1:playing
    this.matchable = false  // looking for a match
    this.game = null
    this.myTurn = true  // is it my turn? 
    this.isOwner = false
    gameStates['playerCount']++
    let self = this
    // listen for disconnection/leaving the game. when user close the tab or window 
    this.socket.on('disconnect', () => {
        gameStates['playerList'] = gameStates['playerList'].filter(p => p.name !== self.name)
        gameStates['playerCount']--
        // 如果退出游戏的玩家正在进行游戏，那么这局游戏也该退出
        if (self.state === 0) {
            gameStates['gameCount']--
        }
        console.log(`${self.name} left`)
    })

    // looking for a match 
    this.socket.on('play', () => {
        // if players available is greater than 2 we can starting pairing. 
        if (gameStates['playerCount'] >= 2) {
            self.matchable = true
            // if there are owners existed, then current player will stay put until he gets found. 
            if (isOwnerExisted(self, gameStates['playerList']) > 0) {
                return
            }
            // if no isOwner found, current player is set to b isOwner
            self.isOwner = true
            let player2 = null
            //add a timer prop to the player instance and matching players every 1 second until found and clear the timer .
            self.timer = setInterval(() => {
                console.log('matching...')
                if (player2 = findPlayer(self, gameStates['playerList'])) {
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

    gameStates['playerList'].push(this)
}

module.exports = {Player}