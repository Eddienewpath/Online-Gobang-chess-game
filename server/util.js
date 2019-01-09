// looking for an owner player to match
  let isOwnerExisted = (player1, players) => {
    let availablePlayers = players.filter(player => player.state === 0 
                                                 && player.matchable
                                                 && player1 !== player 
                                                 && player.isOwner)
    return availablePlayers.length
  }
  
  let findPlayer = (player1, players) => {
    let availablePlayers = players.filter(player => player.state === 0 
                                                 && player.matchable 
                                                 && player !== player1 
                                                 && !player.isOwner)
    if (availablePlayers.length > 0) {
      // randomly pick an available player
      //~~ operator will remove everything after decimal point. 
      let index = ~~(Math.random() * availablePlayers.length)
      // return picked player
      return availablePlayers[index]
    }
    return null
  }
  
  let check_result = (self, arr, position, color) => {
    for (var i = 0; i < arr.length; i++) {
      var white = 0
      var black = 0
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === undefined) {
          white = 0
          black = 0
        } else if (arr[i][j] === 'white') {
          white++
          black = 0
        } else {
          black++
          white = 0
        }
        if (white === 5) {
          result(self, 'white won')
          return
        } else if (black === 5) {
          result(self, 'black won')
          return
        }
      }
    }
  
    for (var i = 0; i < arr.length; i++) {
      var white = 0
      var black = 0
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[j][i] === undefined) {
          white = 0
          black = 0
        } else if (arr[j][i] === 'white') {
          white++
          black = 0
        } else {
          black++
          white = 0
        }
        if (white === 5) {
          result(self, 'white won')
          return
        } else if (black === 5) {
          result(self, 'black won')
          return
        }
      }
    }
  
    for (var i = 5; i < 21; i++) {
      var white = 0
      var black = 0
      for (var j = 0; i !== j; j++) {
        if (arr[j][i - j] === undefined) {
          white = 0
          black = 0
        } else if (arr[j][i - j] === 'white') {
          white++
          black = 0
        } else {
          black++
          white = 0
        }
        if (white === 5) {
          result(self, 'white won')
          return
        } else if (black === 5) {
          result(self, 'black won')
          return
        }
      }
    }
  
    for (var i = 1; i < 17; i++) {
      var white = 0
      var black = 0
      for (var j = 20, k = 0; j >= i; j-- , k++) {
        if (arr[i + k][j] === undefined) {
          white = 0
          black = 0
        } else if (arr[i + k][j] === 'white') {
          white++
          black = 0
        } else {
          black++
          white = 0
        }
        if (white === 5) {
          result(self, 'white won')
          return
        } else if (black === 5) {
          result(self, 'black won')
          return
        }
      }
    }
  
    for (var i = 16; i >= 0; i--) {
      var white = 0
      var black = 0
      for (var j = 0; j < 21 - i; j++) {
        if (arr[j][i + j] === undefined) {
          white = 0
          black = 0
        } else if (arr[j][i + j] === 'white') {
          white++
          black = 0
        } else {
          black++
          white = 0
        }
        if (white === 5) {
          result(self, 'white won')
          return
        } else if (black === 5) {
          result(self, 'black won')
          return
        }
      }
    }
  
    for (var i = 1; i < 21; i++) {
      var white = 0
      var black = 0
      for (var j = 0; j < 21 - i; j++) {
        if (arr[i + j][j] === undefined) {
          white = 0
          black = 0
        } else if (arr[i + j][j] === 'white') {
          white++
          black = 0
        } else {
          black++
          white = 0
        }
        if (white === 5) {
          result(self, 'white won')
          return
        } else if (black === 5) {
          result(self, 'black won')
          return
        }
      }
    }
  
    self.play1.socket.emit('addPieces', {'position': position, 'color': color})
    self.play2.socket.emit('addPieces', {'position': position, 'color': color})
  }
  
  let result = (self, str) => {
    self.play1.socket.emit('result', str)
    self.play2.socket.emit('result', str)
    self.play1.myTurn = self.play1.color === 'white'? true: false
    self.play2.myTurn = self.play2.color === 'white'? true: false
    self.arr = init_arr()
  }
  
  let add_pieces = (self, position, color) => {
    if (self.arr[position.x][position.y] === undefined) {
      self.arr[position.x][position.y] = color
      if (color === self.play1.color) {
        self.play1.myTurn = false
        self.play2.myTurn = true
      } else if (color === self.play2.color) {
        self.play1.myTurn = true
        self.play2.myTurn = false
      }
      check_result(self, self.arr, position, color)
    }
  }
  
  let init_arr = () => {
    var arr = []
    for (var i = 0; i < 21; i++) {
      arr.push(new Array(21))
    }
    return arr
  }
  

  module.exports={isOwnerExisted, findPlayer, check_result, result, add_pieces, init_arr};