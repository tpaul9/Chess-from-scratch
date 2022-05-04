function cacheDOMElements() {
  boardElement = document.getElementById("board");
}
let boardElement;

cacheDOMElements();

let pieces = new Map();
pieces.set(0, { type: "rook", color: "b" });
pieces.set(1, { type: "knight", color: "b" });
pieces.set(2, { type: "bishop", color: "b" });
pieces.set(3, { type: "queen", color: "b" });
pieces.set(4, { type: "king", color: "b" });
pieces.set(5, { type: "bishop", color: "b" });
pieces.set(6, { type: "knight", color: "b" });
pieces.set(7, { type: "rook", color: "b" });
pieces.set(8, { type: "pawn", color: "b" });
pieces.set(9, { type: "pawn", color: "b" });
pieces.set(10, { type: "pawn", color: "b" });
pieces.set(11, { type: "pawn", color: "b" });
pieces.set(12, { type: "pawn", color: "b" });
pieces.set(13, { type: "pawn", color: "b" });
pieces.set(14, { type: "pawn", color: "b" });
pieces.set(15, { type: "pawn", color: "b" });
pieces.set(48, { type: "pawn", color: "w" });
pieces.set(49, { type: "pawn", color: "w" });
pieces.set(50, { type: "pawn", color: "w" });
pieces.set(51, { type: "pawn", color: "w" });
pieces.set(52, { type: "pawn", color: "w" });
pieces.set(53, { type: "pawn", color: "w" });
pieces.set(54, { type: "pawn", color: "w" });
pieces.set(55, { type: "pawn", color: "w" });
pieces.set(56, { type: "rook", color: "w" });
pieces.set(57, { type: "knight", color: "w" });
pieces.set(58, { type: "bishop", color: "w" });
pieces.set(59, { type: "queen", color: "w" });
pieces.set(60, { type: "king", color: "w" });
pieces.set(61, { type: "bishop", color: "w" });
pieces.set(62, { type: "knight", color: "w" });
pieces.set(63, { type: "rook", color: "w" });


class BoardState {
  constructor(other, lastMove, b_leftRookMoved, b_rightRookMoved, b_kingMoved, w_leftRookMoved, w_rightRookMoved, w_kingMoved, b_kingPos, w_kingPos) {
    if (other instanceof BoardState) {
      this.turn = other.turn;
      this.lastMove = other.lastMove;
      this.b_leftRookMoved = other.b_leftRookMoved;
      this.b_rightRookMoved = other.b_rightRookMoved;
      this.b_kingMoved = other.b_kingMoved;
      this.w_leftRookMoved = other.w_leftRookMoved;
      this.w_rightRookMoved = other.w_rightRookMoved;
      this.w_kingMoved = other.w_kingMoved;
      this.b_kingPos = other.b_kingPos;
      this.w_kingPos = other.w_kingPos;
    } else {
      this.turn = other;
      this.lastMove = lastMove;
      this.b_leftRookMoved = b_leftRookMoved;
      this.b_rightRookMoved = b_rightRookMoved;
      this.b_kingMoved = b_kingMoved;
      this.w_leftRookMoved = w_leftRookMoved;
      this.w_rightRookMoved = w_rightRookMoved;
      this.w_kingMoved = w_kingMoved;
      this.b_kingPos = b_kingPos;
      this.w_kingPos = w_kingPos;
    }
  }
}

class Move {
  //board contains a board after the proposed move
  //This means to contains an index to the piece we care about.
  constructor(type, from, to, prevBoard, board) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.prevBoard = prevBoard;
    this.board = board;
  }
}

class Board {
  constructor(pieces, state) {
    this.pieces = pieces;
    this.state = state;
  }
}

let state = new BoardState("w", null, false, false, false, false, false, false, 4, 60);
let board = new Board(pieces, state);

let htmlString = "";
htmlString = htmlString.concat(`<div class="board-row">`);
for (let i = 0; i < 64; i++) {
  if (i % 8 === 0 && i > 0) {
    htmlString = htmlString.concat("</div><div class=\"board-row\">");
  }
  if (i % 2 === 0) {
    if (Math.floor(i / 8) % 2 === 0) {
      htmlString = htmlString.concat(`<button id="square${i}" class="square"></button>`);
    } else {
      htmlString = htmlString.concat(`<button id="square${i}" class="square" style="background:black"></button>`);
    }
  } else {
    if (Math.floor(i / 8) % 2 === 0) {
      htmlString = htmlString.concat(`<button id="square${i}" class="square" style="background:black"></button>`);
    } else {
      htmlString = htmlString.concat(`<button id="square${i}" class="square"></button>`);
    }
  }
}
htmlString = htmlString.concat("</div>");
boardElement.innerHTML = htmlString;

function renderPieces() {
  for (let i = 0; i < boardRows * boardCols; i++) {
    let piece = board.pieces.get(i)
    if (piece !== undefined) {
      if(piece.type==="promotion"){
        let htmlString="";
        htmlString=htmlString.concat(`<img id="promote-q" class="promotion-image" style="top:0;left:0" src="images/queen_${piece.color}.png"></img>`);
        htmlString=htmlString.concat(`<img id="promote-r" class="promotion-image" style="top:0;right:0" src="images/rook_${piece.color}.png"></img>`);
        htmlString=htmlString.concat(`<img id="promote-k" class="promotion-image" style="bottom:0;left:0" src="images/knight_${piece.color}.png"></img>`);
        htmlString=htmlString.concat(`<img id="promote-b" class="promotion-image" style="bottom:0;right:0" src="images/bishop_${piece.color}.png"></img>`);

        document.getElementById(`square${i}`).innerHTML=htmlString
        document.getElementById("promote-q").onclick=(e => {
          piece.type="queen"
          board.state.turn=piece.color==="w"?"b":"w"
          renderPieces();
        });
        document.getElementById("promote-r").onclick=(e => {
          piece.type="rook"
          board.state.turn=piece.color==="w"?"b":"w"
          renderPieces();
        });
        document.getElementById("promote-k").onclick=(e => {
          piece.type="knight"
          board.state.turn=piece.color==="w"?"b":"w"
          renderPieces();
        });
        document.getElementById("promote-b").onclick=(e => {
          piece.type="bishop"
          board.state.turn=piece.color==="w"?"b":"w"
          renderPieces();
        });
      }else{
        document.getElementById(`square${i}`).innerHTML = `<img class="square-image" src="images/${piece.type}_${piece.color}.png"></img>`
      }
    } else {
      document.getElementById(`square${i}`).innerHTML = "";
    }
  }
}

//Possible board state variables...
let moves = null;
let castleMoves = null;
let selected = null;
let boardRows = 8;
let boardCols = 8;
let king_pos = new Map();
let en_passant = null;
king_pos.set("b", 4);
king_pos.set("w", 60);
let whiteCheck = null;
let blackCheck = null;
let whiteCheckmate = null;
let blackCheckmate = null;
let lastMove = null;

for (let i = 0; i < 64; i++) {
  document.getElementById(`square${i}`).onclick = (e => {
    handleClick(i);
  });
  document.getElementById(`square${i}`).addEventListener('contextmenu', e => {
    e.preventDefault();
    handleRightClick();
  });
}
renderPieces()

function numToCoord(i) {
  return [Math.floor(i / boardCols), i % boardCols];
}

function coordToNum(x, y) {
  if (x >= 0 && x < boardRows && y >= 0 && y < boardCols) {
    return boardCols * x + y;
  } else {
    return undefined;
  }
}

function handleClick(i) {
  if (selected === null && board.pieces.get(i) !== undefined) {
    if (board.state.turn !== board.pieces.get(i).color) {
      return;
    }
    selected = i;
    moves = calculateMoves(board, i,board.state.turn==="b");
  } else if (board.pieces.get(selected) !== undefined) {
    let move = moves.find(ele => ele.to === i)
    if (move !== undefined) {
      board = move.board;
      moves = null;
      selected = null;
      blackCheck = null;
      whiteCheck = null;
      let kingPos=board.state.turn==="w"?board.state.w_kingPos:board.state.b_kingPos;
      if(isAttacked(board,kingPos,board.state.turn==="w"?"b":"w")){
        let canMove=false;
        for([pos,piece] of board.pieces){
          if(piece.color===board.state.turn&&calculateMoves(board,pos,true).length!==0){
            canMove=true;
          }
        }
        if (!canMove&&(board.state.turn==="w"||board.state.turn==="b")) {
          console.log(`${board.state.turn === "w" ? "Black" : "White"} checkmates ${board.state.turn === "b" ? "Black" : "White"}`)
          if (board.state.turn === "b") {
            blackCheckmate = board.state.b_kingPos;
          } else {
            whiteCheckmate = board.state.w_kingPos;
          }
        } else {
          if (board.state.turn === "b") {
            blackCheck = board.state.b_kingPos;
          } else {
            whiteCheck = board.state.w_kingPos;
          }
          console.log(`Check: ${board.state.turn === "b" ? "black" : "white"} to move`);
        }
      }
      renderPieces()
      console.log(board)
      //End game if neither player can win
      let canWin=false;
      let piece1;
      let piece2;
      if(board.pieces.size<=4){
        for(let [pos,piece] of board.pieces){
          if(piece.type==="queen"||piece.type==="pawn"||piece.type==="rook"){
            canWin=true;
            break;
          }else if(piece.type==="bishop"||piece.type==="knight"){
            if(piece1===undefined){
              piece1=piece;
            }else{
              piece2=piece;
            }
          }
        }
        if(piece1!==undefined&&piece2!==undefined&&piece1.color===piece2.color&&(piece1.type==="bishop"||piece2.type==="bishop")){
          canWin=true;
        }
        if(!canWin){
          board.state.turn="n";
          console.log("Draw by insufficient material.")
        }
      }
      //AI logic
      if(board.state.turn==="b"){
        let depth=4;
        if(board.pieces.size<10){
          depth=5;
        }
        if(board.pieces.size<5){
          depth=6;
        }
        let blackMove=minimax(board,depth,depth,board.state.turn==="w",Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY)
        console.log(blackMove)
        if(blackMove!==null){
          setTimeout(() => {
            handleClick(blackMove.from)
            handleClick(blackMove.to);
          }, "50")
        }
      }
    }
  }
}

function compareMaps(map1,map2){
  for(let [key, value] of map1){
    if(map2.get(key)!==value){
      return false;
    }
  }
  return true;
}

function evaluateBoard(board) {
  //turn of the player who will take over after the proposed move.
  let sum = 0;
  for (let [pos,piece] of board.pieces) {
      let dir = piece.color === "w" ? 1 : -1;
      if (piece.type === "pawn") {
        sum += 1 * dir;
      } else if (piece.type === "bishop" || piece.type === "knight") {
        sum += 3 * dir;
      } else if (piece.type === "rook") {
        sum += 5 * dir;
      } else if (piece.type === "queen") {
        sum += 9 * dir;
      } else {
        sum += 1000 * dir;
      }
  }
  sum+=Math.random()/10
  //Penalize repetition
  let curr=board.lastMove?.prevBoard;
  while(curr!==undefined){
    if(curr.pieces.size!==board.pieces.size){
      break;
    }
    if(compareMaps(board.pieces,curr.pieces)){
      sum+=1*dir;
    }
    curr=curr.lastMove?.prevBoard;
  }
  return sum;
}

function handleRightClick() {
  selected = null;
  moves = null;
}

function minimax(board, depth, maxDepth, isMaximizingPlayer, alpha, beta){
  if(depth===0){
    return evaluateBoard(board);
  }
    
    if(isMaximizingPlayer){
        let bestVal=Number.NEGATIVE_INFINITY;
        let bestMove=null;
        let foundMove=false;
        for(let [pos,piece] of board.pieces){
          let moves=calculateMoves(board,pos,true);
          for(let move of moves){
            foundMove=true;
            let value=minimax(move.board,depth-1,maxDepth,false,alpha,beta);
            if(value>bestVal){
              bestVal=value;
              bestMove=move;
            }
            alpha=Math.max(alpha,bestVal);
            if(beta <= alpha){
              break;
            }
          }
        }
        if(depth===maxDepth){
          console.log(bestVal)
          return bestMove;
        }
        if(!foundMove){
          return isAttacked(board,board.state.turn==="w"?board.state.w_kingPos:board.state.b_kingPos,board.state.turn==="w"?"b":"w")?(board.state.turn==="w"?-1*(10000+depth):10000+depth):0;
        }
        return bestVal;
    }else{
      let bestVal=Number.POSITIVE_INFINITY;
      let bestMove=null;
      let foundMove=false;
      for(let [pos,piece] of board.pieces){
        let moves=calculateMoves(board,pos,true);
        for(let move of moves){
          foundMove=true;
          let value=minimax(move.board,depth-1,maxDepth,true,alpha,beta);
          if(value<bestVal){
            bestVal=value;
            bestMove=move;
          }
          beta=Math.min(beta,bestVal);
          if(beta <= alpha){
            break;
          }
        }
      }
      if(depth===maxDepth){
        console.log(bestVal)
        return bestMove;
      }
      if(!foundMove){
        return isAttacked(board,board.state.turn==="w"?board.state.w_kingPos:board.state.b_kingPos,board.state.turn==="w"?"b":"w")?(board.state.turn==="w"?-1*(10000+depth):10000+depth):0;
      }
      return bestVal;
    }
}

//autoPromote attribute controls whether to autoPromote to queen. (Use this for when evaluating AI moves, but not when the player promotes.)
function calculateMoves(board, index, autoPromote) {
  let [x, y] = numToCoord(index);
  let myMoves = [];
  let movingPiece = board.pieces.get(index);
  if (movingPiece !== undefined && board.state.turn === movingPiece.color) {
    if (movingPiece.type === "knight") {
      for (let xMagnitude of [1, 2]) {
        for (let xDirection of [-1, 1]) {
          for (let yDirection of [-1, 1]) {
            let pos = coordToNum(x + xMagnitude * xDirection, y + (xMagnitude === 1 ? 2 : 1) * yDirection);
            if (pos !== undefined) {
              let piece = board.pieces.get(pos)
              if (piece === undefined || piece.color !== movingPiece.color) {
                let newPieces = new Map(board.pieces);
                newPieces.delete(index)
                newPieces.set(pos, movingPiece);
                let newState = new BoardState(board.state);
                newState.turn = board.state.turn === "w" ? "b" : "w";
                let newBoard = new Board(newPieces, newState);
                let newMove = new Move("normal", index, pos, board, newBoard);
                newBoard.state.lastMove = newMove;
                if (movingPiece.color === "w") {
                  if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                    myMoves.push(newMove);
                  }
                } else {
                  if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                    myMoves.push(newMove);
                  }
                }
              }
            }
          }
        }
      }
    } else if (movingPiece.type === "rook") {
      for (let dir of [-1, 1]) {
        for (let upDown of [1, 0]) {
          for (let offset = 1; offset < boardRows; offset++) {
            let pos = coordToNum(x + offset * dir * upDown, y + offset * dir * (upDown - 1));
            if (pos !== undefined) {
              let piece = board.pieces.get(pos)
              if (piece === undefined || piece.color !== movingPiece.color) {
                let newPieces = new Map(board.pieces);
                newPieces.delete(index)
                newPieces.set(pos, movingPiece);
                let newState = new BoardState(board.state);
                newState.turn = board.state.turn === "w" ? "b" : "w";
                //0,7,56,63
                if (pos === 0) {
                  newState.b_leftRookMoved = true;
                } else if (pos === 7) {
                  newState.b_rightRookMoved = true;
                } else if (pos === 56) {
                  newState.w_leftRookMoved = true;
                } else if (pos === 63) {
                  newState.w_rightRookMoved = true;
                }
                let newBoard = new Board(newPieces, newState);
                let newMove = new Move("normal", index, pos, board, newBoard);
                newBoard.state.lastMove = newMove;
                if (movingPiece.color === "w") {
                  if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                    myMoves.push(newMove);
                  }
                } else {
                  if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                    myMoves.push(newMove);
                  }
                }
              }
              if (piece !== undefined) {
                break;
              }
            } else {
              break;
            }
          }
        }
      }
    } else if (movingPiece.type === "bishop") {
      possibleMoves = [];
      for (let xDir of [-1, 1]) {
        for (let yDir of [-1, 1]) {
          for (let offset = 1; offset < boardRows; offset++) {
            let pos = coordToNum(x + offset * xDir, y + offset * yDir);
            if (pos !== undefined) {
              let piece = board.pieces.get(pos)
              if (piece === undefined || piece.color !== movingPiece.color) {
                let newPieces = new Map(board.pieces);
                newPieces.delete(index)
                newPieces.set(pos, movingPiece);
                let newState = new BoardState(board.state);
                newState.turn = board.state.turn === "w" ? "b" : "w";
                let newBoard = new Board(newPieces, newState);
                let newMove = new Move("normal", index, pos, board, newBoard);
                newBoard.state.lastMove = newMove;
                if (movingPiece.color === "w") {
                  if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                    myMoves.push(newMove);
                  }
                } else {
                  if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                    myMoves.push(newMove);
                  }
                }
                if (piece !== undefined) {
                  break;
                }
              } else {
                break;
              }
            }
          }
        }
      }
    } else if (movingPiece.type === "queen") {
      for (let dir of [-1, 1]) {
        for (let upDown of [1, 0]) {
          for (let offset = 1; offset < boardRows; offset++) {
            let pos = coordToNum(x + offset * dir * upDown, y + offset * dir * (upDown - 1));
            if (pos !== undefined) {
              let piece = board.pieces.get(pos)
              if (piece === undefined || piece.color !== movingPiece.color) {
                let newPieces = new Map(board.pieces);
                newPieces.delete(index)
                newPieces.set(pos, movingPiece);
                let newState = new BoardState(board.state);
                newState.turn = board.state.turn === "w" ? "b" : "w";
                let newBoard = new Board(newPieces, newState);
                let newMove = new Move("normal", index, pos, board, newBoard);
                newBoard.state.lastMove = newMove;
                if (movingPiece.color === "w") {
                  if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                    myMoves.push(newMove);
                  }
                } else {
                  if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                    myMoves.push(newMove);
                  }
                }
                if (piece !== undefined) {
                  break;
                }
              } else {
                break;
              }
            }
          }
        }
      }
      for (let xDir of [-1, 1]) {
        for (let yDir of [-1, 1]) {
          for (let offset = 1; offset < boardRows; offset++) {
            let pos = coordToNum(x + offset * xDir, y + offset * yDir);
            if (pos !== undefined) {
              let piece = board.pieces.get(pos)
              if (piece === undefined || piece.color !== movingPiece.color) {
                let newPieces = new Map(board.pieces);
                newPieces.delete(index)
                newPieces.set(pos, movingPiece);
                let newState = new BoardState(board.state);
                newState.turn = board.state.turn === "w" ? "b" : "w";
                let newBoard = new Board(newPieces, newState);
                let newMove = new Move("normal", index, pos, board, newBoard);
                newBoard.state.lastMove = newMove;
                if (movingPiece.color === "w") {
                  if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                    myMoves.push(newMove);
                  }
                } else {
                  if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                    myMoves.push(newMove);
                  }
                }
                if (piece !== undefined) {
                  break;
                }
              } else {
                break;
              }
            }
          }
        }
      }
    } else if (movingPiece.type === "king") {
      for (let xOffset of [-1, 0, 1]) {
        for (let yOffset of [-1, 0, 1]) {
          if (xOffset !== 0 || yOffset !== 0) {
            let pos = coordToNum(x + xOffset, y + yOffset);
            if (pos !== undefined) {
              let piece = board.pieces.get(pos);
              if (piece === undefined || piece.color !== movingPiece.color) {
                let newPieces = new Map(board.pieces);
                newPieces.delete(index)
                newPieces.set(pos, movingPiece);
                let newState = new BoardState(board.state);
                newState.turn = board.state.turn === "w" ? "b" : "w";
                if (movingPiece.color === "w") {
                  newState.w_kingPos = pos;
                  newState.w_kingMoved = true;
                } else {
                  newState.b_kingPos = pos;
                  newState.b_kingMoved = true;
                }
                let newBoard = new Board(newPieces, newState);
                let newMove = new Move("normal", index, pos, board, newBoard);
                newBoard.state.lastMove = newMove;
                if (movingPiece.color === "w") {
                  if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                    myMoves.push(newMove);
                  }
                } else {
                  if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                    myMoves.push(newMove);
                  }
                }
              }
            }
          }
        }
      }
      if (movingPiece.color === "w") {
        //Left castle
        let rookIndex = index - 4;
        let rookPiece = board.pieces.get(rookIndex);
        if (!board.w_kingMoved && !board.w_leftRookMoved &&rookPiece!==undefined&&rookPiece.type === "rook") {
          let canCastle = true
          for (let i = rookIndex + 1; i < index; i++) {
            if (board.pieces.get(i) !== undefined) {
              canCastle = false;
              break;
            }
          }
          for (let i = index; i >= index - 2; i--) {
            if (isAttacked(board, i, "b")) {
              canCastle = false;
              break;
            }
          }
          if (canCastle) {
            let newPieces = new Map(board.pieces);
            newPieces.delete(index);
            newPieces.set(index - 2, movingPiece);
            newPieces.delete(rookIndex);
            newPieces.set(index - 1, rookPiece);
            let newState = new BoardState(board.state);
            newState.turn = board.state.turn === "w" ? "b" : "w";
            newState.w_kingPos = index - 2;
            newState.w_kingMoved = true;
            let newBoard = new Board(newPieces, newState);
            let newMove = new Move("castle", index, index - 2, board, newBoard);
            newBoard.state.lastMove = newMove;
            myMoves.push(newMove);
          }
        }
        //Right castle
        rookIndex = index + 3;
        rookPiece=board.pieces.get(rookIndex)
        if (!board.w_kingMoved && !board.w_rightRookMoved && rookPiece!==undefined&&rookPiece.type === "rook") {
          let canCastle = true
          for (let i = index + 1; i < rookIndex; i++) {
            if (board.pieces.get(i) !== undefined) {
              canCastle = false;
              break;
            }
          }
          for (let i = index; i <= index + 2; i++) {
            if (isAttacked(board, i, "b")) {
              canCastle = false;
              break;
            }
          }
          if (canCastle) {
            let newPieces = new Map(board.pieces);
            newPieces.delete(index);
            newPieces.set(index + 2, movingPiece);
            newPieces.delete(rookIndex);
            newPieces.set(index + 1, rookPiece);
            let newState = new BoardState(board.state);
            newState.turn = board.state.turn === "w" ? "b" : "w";
            newState.w_kingPos = index + 2;
            newState.w_kingMoved = true;
            let newBoard = new Board(newPieces, newState);
            let newMove = new Move("castle", index, index + 2, board, newBoard);
            newBoard.state.lastMove = newMove;
            myMoves.push(newMove);
          }
        }
      } else {
        //Left castle
        let rookIndex = index - 4;
        let rookPiece = board.pieces.get(rookIndex);
        if (!board.state.b_kingMoved && !board.state.b_leftRookMoved && rookPiece!==undefined&&rookPiece.type === "rook") {
          let canCastle = true
          for (let i = rookIndex + 1; i < index; i++) {
            if (board.pieces.get(i) !== undefined) {
              canCastle = false;
              break;
            }
          }
          for (let i = index; i >= index - 2; i--) {
            if (isAttacked(board, i, "w")) {
              canCastle = false;
              break;
            }
          }
          if (canCastle) {
            let newPieces = new Map(board.pieces);
            newPieces.delete(index);
            newPieces.set(index - 2, movingPiece);
            newPieces.delete(rookIndex);
            newPieces.set(index - 1, rookPiece);
            let newState = new BoardState(board.state);
            newState.turn = board.state.turn === "w" ? "b" : "w";
            newState.b_kingPos = index - 2;
            newState.b_kingMoved = true;
            let newBoard = new Board(newPieces, newState);
            let newMove = new Move("castle", index, index - 2, board, newBoard);
            newBoard.state.lastMove = newMove;
            myMoves.push(newMove);
          }
        }
        //Right castle
        rookIndex = index + 3;
        rookPiece=board.pieces.get(rookIndex);
        if (!board.state.b_kingMoved && !board.state.b_rightRookMoved && rookPiece!==undefined&&rookPiece.type === "rook") {
          let canCastle = true
          for (let i = index + 1; i < rookIndex; i++) {
            if (board.pieces.get(i) !== undefined) {
              canCastle = false;
              break;
            }
          }
          for (let i = index; i <= index + 2; i++) {
            if (isAttacked(board, i, "w")) {
              canCastle = false;
              break;
            }
          }
          if (canCastle) {
            let newPieces = new Map(board.pieces);
            newPieces.delete(index);
            newPieces.set(index + 2, movingPiece);
            newPieces.delete(rookIndex);
            newPieces.set(index + 1, rookPiece);
            let newState = new BoardState(board.state);
            newState.turn = board.state.turn === "w" ? "b" : "w";
            newState.b_kingPos = index + 2;
            newState.b_kingMoved = true;
            let newBoard = new Board(newPieces, newState);
            let newMove = new Move("castle", index, index + 2, board, newBoard);
            newBoard.state.lastMove = newMove;
            myMoves.push(newMove);
          }
        }
      }
    } else if (movingPiece.type === "pawn") {
      let xDir = movingPiece.color === "b" ? 1 : -1;
      for (let i = 1; i <= 2; i++) {
        for (let yOffset of [-1, 0, 1]) {
          if (i === 1 || (yOffset === 0 && x === (movingPiece.color === "b" ? 1 : 6))) {
            let pos = coordToNum(x + xDir * i, y + yOffset);
            let piece = board.pieces.get(pos);
            if (((piece === undefined && yOffset === 0) || (yOffset !== 0 && piece !== undefined && piece.color !== movingPiece.color)) && (i!==2||board.pieces.get(coordToNum(x + xDir, y + yOffset))===undefined)) {
              let newPieces = new Map(board.pieces);
              newPieces.delete(index)
              newPieces.set(pos, movingPiece);
              let newState = new BoardState(board.state);
              newState.turn = board.state.turn === "w" ? "b" : "w";
              let newBoard = new Board(newPieces, newState);
              let newMove = new Move("normal", index, pos, board, newBoard);
              newBoard.state.lastMove = newMove;
              //Handle promotions
              if(pos<boardCols||pos>=7*boardCols){
                if(autoPromote){
                  newPieces.set(pos,{type:"queen",color:movingPiece.color})
                }else{
                  //Nobody's turn to prevent inputs other than completing promotion.
                  newState.turn="n"
                  //Create promotion piece type, which is a placeholder to signal displaying the promotion choices.
                  newPieces.set(pos,{type:"promotion",color:movingPiece.color})
                }
              }
              if (movingPiece.color === "w") {
                if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                  myMoves.push(newMove);
                }
              } else {
                if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                  myMoves.push(newMove);
                }
              }
            } else if (i === 1 && yOffset !== 0 && piece === undefined) {
              let passant_pos = pos - xDir * boardCols;
              let passant_piece = board.pieces.get(passant_pos);
              let pos_piece_before = board.state.lastMove?.prevBoard.pieces.get(pos);
              let passant_piece_before = board.state.lastMove?.prevBoard.pieces.get(passant_pos);
              if (passant_piece !== undefined && passant_piece.color !== movingPiece.color && passant_piece.type === "pawn" && passant_piece_before === undefined && pos_piece_before === undefined) {
                let newPieces = new Map(board.pieces);
                newPieces.delete(index)
                newPieces.delete(passant_pos);
                newPieces.set(pos, movingPiece);
                let newState = new BoardState(board.state);
                newState.turn = board.state.turn === "w" ? "b" : "w";
                let newBoard = new Board(newPieces, newState);
                let newMove = new Move("normal", index, pos, board, newBoard);
                newBoard.state.lastMove = newMove;
                if (movingPiece.color === "w") {
                  if (!isAttacked(newBoard, newBoard.state.w_kingPos, "b")) {
                    myMoves.push(newMove);
                  }
                } else {
                  if (!isAttacked(newBoard, newBoard.state.b_kingPos, "w")) {
                    myMoves.push(newMove);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return myMoves;
}

//See if square x is attacked by a certain color
function isAttacked(board, index, color) {
  //Knights
  let [x, y] = numToCoord(index);

  for (let xMagnitude of [1, 2]) {
    for (let xDirection of [-1, 1]) {
      for (let yDirection of [-1, 1]) {
        let pos = coordToNum(x + xMagnitude * xDirection, y + (xMagnitude === 1 ? 2 : 1) * yDirection);
        let piece = board.pieces.get(pos);
        if (piece !== undefined && piece.type === "knight" && piece.color === color) {
          return true;
        }
      }
    }
  }

  //Rook moves
  for (let dir of [-1, 1]) {
    for (let upDown of [1, 0]) {
      for (let offset = 1; offset < boardRows; offset++) {
        let pos = coordToNum(x + offset * dir * upDown, y + offset * dir * (upDown - 1));
        if (pos === undefined) {
          break;
        } else if (board.pieces.get(pos) !== undefined) {
          let piece = board.pieces.get(pos);
          if ((piece.type === "rook" || piece.type === "queen") && piece.color === color) {
            return true;
          }
          break;
        }
      }
    }
  }

  //bishop moves

  for (let xDir of [-1, 1]) {
    for (let yDir of [-1, 1]) {
      for (let offset = 1; offset < boardRows; offset++) {
        let pos = coordToNum(x + offset * xDir, y + offset * yDir);
        if (pos === undefined) {
          break;
        } else if (board.pieces.get(pos) !== undefined) {
          let piece = board.pieces.get(pos);
          if ((piece.type === "bishop" || piece.type === "queen") && piece.color === color) {
            return true;
          }
          break;
        }
      }
    }
  }

  //Pawn moves
  let direction = color === "w" ? 1 : -1;
  for (let yOffset of [-1, 1]) {
    let pos = coordToNum(x + direction, y + yOffset);
    let piece = board.pieces.get(pos)
    if (piece !== undefined && piece.type === "pawn" && piece.color === color) {
      return true;
    }
  }

  //King Moves;
  for (xOffset of [-1, 0, 1]) {
    for (yOffset of [-1, 0, 1]) {
      if (xOffset !== 0 || yOffset !== 0) {
        let pos = coordToNum(x + xOffset, y + yOffset);
        let piece = board.pieces.get(pos);
        if (piece !== undefined && piece.type === "king" && piece.color === color) {
          return true;
        }
      }
    }
  }

  return false;
} 

window.setInterval(function updateBoard() {
  for (let i = 0; i < boardRows * boardCols; i++) {
    if (i % 2 === 0) {
      if (Math.floor(i / 8) % 2 === 0) {
        document.getElementById(`square${i}`).style.background = "white";
      } else {
        document.getElementById(`square${i}`).style.background = "black";
      }
    } else {
      if (Math.floor(i / 8) % 2 === 0) {
        document.getElementById(`square${i}`).style.background = "black";
      } else {
        document.getElementById(`square${i}`).style.background = "white";
      }
    }
  }
  if (whiteCheck) {
    document.getElementById(`square${whiteCheck}`).style.background = "red";
  }
  if (blackCheck) {
    document.getElementById(`square${blackCheck}`).style.background = "red";
  }
  if (whiteCheckmate) {
    document.getElementById(`square${whiteCheckmate}`).style.background = "red";
    document.getElementById(`square${whiteCheckmate}`).style.transform = "rotate(90deg)"
  }
  if (blackCheckmate) {
    document.getElementById(`square${blackCheckmate}`).style.background = "red";
    document.getElementById(`square${blackCheckmate}`).style.transform = "rotate(90deg)"
  }
  if (board.state.lastMove) {
    document.getElementById(`square${board.state.lastMove.to}`).style.background = "orange";
    document.getElementById(`square${board.state.lastMove.from}`).style.background = "orange";
  }
  if (selected !== null) {
    document.getElementById(`square${selected}`).style.background = "blue";
    for (const move of moves) {
      document.getElementById(`square${move.to}`).style.background = "gold";
    }
  }
}, 10);

