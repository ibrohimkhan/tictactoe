(function() {

  let game = {}
  let gameState = {
    INPROGRESS : false,
    DRAW : false,
    WIN : false
  }

  initialize()    

  function play(selectedItem) {        
    let user, ai
    let board = [null, null, null, null, null, null, null, null, null]
    gameState.INPROGRESS = true

    const cells = document.getElementsByClassName('cell')        
    Array.from(cells).forEach((cell) => cell.addEventListener('click', cellHandler))

    function cellHandler(event) {            
      let index = event.target.id.charAt(5)
      if (board[index] != null || !gameState.INPROGRESS) return

      event.target.innerHTML = user.item
      board[index] = user.item

      game = checkBoard(user.item, board)
      if (game.INPROGRESS) ai.move(board)
      else displayGameOver(user.item, board)
    }

    if (selectedItem === 'X') {
      user = new User('X')
      ai = new AI('O') 
        
    } else {
      user = new User('O')
      ai = new AI('X')
      ai.move(board)
    }        
  }

  function displayGameOver(item, board) {
    markBoard()

    let over = document.getElementById('endOfGame')
    over.style.display = 'block'
    if (game.WIN) over.innerHTML += '<p style=\'color: red;\'>\'' + item + '\' has won!</p>'
    else if (game.DRAW) over.innerHTML += '<p style=\'color: red;\'>DRAW!</p>'

    setTimeout(() => window.location.reload(true), 5000)

    function markBoard() {
      if (item === board[0] && item === board[1] && item === board[2]) {
        mark('cell_0', 'cell_1', 'cell_2')

      } else if (item === board[3] && item === board[4] && item === board[5]) {
        mark('cell_3', 'cell_4', 'cell_5')

      } else if (item === board[6] && item === board[7] && item === board[8]) {
        mark('cell_6', 'cell_7', 'cell_8')

      } else if (item === board[0] && item === board[3] && item === board[6]) {
        mark('cell_0', 'cell_3', 'cell_6')

      } else if (item === board[1] && item === board[4] && item === board[7]) {
        mark('cell_1', 'cell_4', 'cell_7')

      } else if (item === board[2] && item === board[5] && item === board[8]) {
        mark('cell_2', 'cell_5', 'cell_8')

      } else if (item === board[0] && item === board[4] && item === board[8]) {
        mark('cell_0', 'cell_4', 'cell_8')

      } else if (item === board[2] && item === board[4] && item === board[6]) {
        mark('cell_2', 'cell_4', 'cell_6')
      }

      function mark(item1, item2, item3) {
        let cell_0 = document.getElementById(item1)
        let cell_1 = document.getElementById(item2)
        let cell_2 = document.getElementById(item3)

        cell_0.style.color = 'red'
        cell_1.style.color = 'red'
        cell_2.style.color = 'red'
      }
    }
  }

  function checkBoard(item, board) {
    if (item === board[0] && item === board[1] && item === board[2]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (item === board[3] && item === board[4] && item === board[5]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (item === board[6] && item === board[7] && item === board[8]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (item === board[0] && item === board[3] && item === board[6]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (item === board[1] && item === board[4] && item === board[7]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (item === board[2] && item === board[5] && item === board[8]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (item === board[0] && item === board[4] && item === board[8]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (item === board[2] && item === board[4] && item === board[6]) { gameState.WIN = true; gameState.INPROGRESS = false }
    else if (!board.includes(null)) { gameState.DRAW = true; gameState.INPROGRESS = false}
    else { gameState.INPROGRESS = true }
       
    return gameState
  }

  function initialize() {
    const itemX = document.getElementById('xItem')
    const itemO = document.getElementById('oItem')

    itemX.addEventListener('click', itemSelectedHandler)
    itemO.addEventListener('click', itemSelectedHandler)

    const greetingSection = document.getElementById('greetingSection')
    const gameSection = document.getElementById('gameSection')
        
    function itemSelectedHandler(event) {
      let selectedItem = event.target.textContent
      displayBoard()
      play(selectedItem)
    }    

    function displayBoard() {        
      greetingSection.style.display = 'none'
      gameSection.style.display = 'grid'
    }
  }   

  class AI {
    constructor(item) {
      this.item = item
    }

    move(board) {
      let index = this.selectCell(board)
      let cell = document.getElementById('cell_' + index)
            
      cell.innerHTML = this.item
      board[index] = this.item

      game = checkBoard(this.item, board)
      if (game.WIN || game.DRAW) displayGameOver(this.item, board)
    }

    selectCell(board) {
      let item = this.item            
      let enemy = item === 'X' ? 'O' : 'X'
      let that = this
            
      let index = makeDecision()
      return index
            
      function makeDecision() {
        if (board[4] === null) return 4
                                
        let index = scan(item)
        if (index !== -1) return index

        index = scan(enemy)
        if (index !== -1) return index

        index = someHints(item, enemy)                
        if      (index !== -1) return index
        else if (board[0] === null) return 0
        else if (board[2] === null) return 2
        else if (board[6] === null) return 6
        else if (board[8] === null) return 8
        else return that.generateRandomValue(0, 9, board)
      }

      function someHints(item, enemy) {                
        if (enemy === board[6] && enemy === board[2] && item === board[4] && board[5] === null) return 5
        else if (enemy === board[0] && enemy === board[8] && item === board[4] && board[3] === null) return 3

        return -1
      }

      function scan(item) {
        if      (item === board[0] && item === board[1] && board[2] === null) return 2 
        else if (item === board[0] && item === board[2] && board[1] === null) return 1
        else if (item === board[1] && item === board[2] && board[0] === null) return 0
        else if (item === board[3] && item === board[4] && board[5] === null) return 5
        else if (item === board[3] && item === board[5] && board[4] === null) return 4
        else if (item === board[4] && item === board[5] && board[3] === null) return 3
        else if (item === board[6] && item === board[7] && board[8] === null) return 8
        else if (item === board[6] && item === board[8] && board[7] === null) return 7
        else if (item === board[7] && item === board[8] && board[6] === null) return 6
        else if (item === board[0] && item === board[3] && board[6] === null) return 6
        else if (item === board[0] && item === board[6] && board[3] === null) return 3
        else if (item === board[3] && item === board[6] && board[0] === null) return 0
        else if (item === board[1] && item === board[4] && board[7] === null) return 7
        else if (item === board[1] && item === board[7] && board[4] === null) return 4
        else if (item === board[4] && item === board[7] && board[1] === null) return 1
        else if (item === board[2] && item === board[5] && board[8] === null) return 8
        else if (item === board[2] && item === board[8] && board[5] === null) return 5
        else if (item === board[5] && item === board[8] && board[2] === null) return 2
        else if (item === board[0] && item === board[4] && board[8] === null) return 8
        else if (item === board[0] && item === board[8] && board[4] === null) return 4
        else if (item === board[4] && item === board[8] && board[0] === null) return 0
        else if (item === board[2] && item === board[4] && board[6] === null) return 6
        else if (item === board[2] && item === board[6] && board[4] === null) return 4
        else if (item === board[4] && item === board[6] && board[2] === null) return 2
        else if (item === board[4] && item === board[6] && board[8] === null) return 8

        return -1
      }            
    }

    generateRandomValue(min, max, board) {
      let random = Math.floor(Math.random() * (max - min)) + min
      if (board[random] != null) return this.generateRandomValue(0, 9, board) 

      return random
    }
  }

  class User {
    constructor(item) {
      this.item = item
    }
  }     

})()