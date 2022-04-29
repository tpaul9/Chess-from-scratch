function cacheDOMElements(){
    boardElement=document.getElementById("board");
}
let boardElement;
let squares=Array(64).fill(null);

cacheDOMElements();

squares[0]={piece: "r",player: {color:"b"},type:"right",hasMoved:false};
squares[1]={piece: "k",player: {color:"b"}};
squares[2]={piece: "b",player: {color:"b"}};
squares[3]={piece: "q",player: {color:"b"}};
squares[4]={piece: "x",player: {color:"b"}};
squares[5]={piece: "b",player: {color:"b"}};
squares[6]={piece: "k",player: {color:"b"}};
squares[7]={piece: "r",player: {color:"b"}};
squares[8]={piece: "p",player: {color:"b"}};
squares[9]={piece: "p",player: {color:"b"}};
squares[10]={piece: "p",player: {color:"b"}};
squares[11]={piece: "p",player: {color:"b"}};
squares[12]={piece: "p",player: {color:"b"}};
squares[13]={piece: "p",player: {color:"b"}};
squares[14]={piece: "p",player: {color:"b"}};
squares[15]={piece: "p",player: {color:"b"}};
squares[48]={piece: "p",player: {color:"w"}};
squares[49]={piece: "p",player: {color:"w"}};
squares[50]={piece: "p",player: {color:"w"}};
squares[51]={piece: "p",player: {color:"w"}};
squares[52]={piece: "p",player: {color:"w"}};
squares[53]={piece: "p",player: {color:"w"}};
squares[54]={piece: "p",player: {color:"w"}};
squares[55]={piece: "p",player: {color:"w"}};
squares[56]={piece: "r",player: {color:"w"},type:"right",hasMoved:false};
squares[57]={piece: "k",player: {color:"w"}};
squares[58]={piece: "b",player: {color:"w"}};
squares[59]={piece: "q",player: {color:"w"}};
squares[60]={piece: "x",player: {color:"w"},hasMoved:false};
squares[61]={piece: "b",player: {color:"w"}};
squares[62]={piece: "k",player: {color:"w"}};
squares[63]={piece: "r",player: {color:"w"},type:"right",hasMoved:false};

let htmlString="";
htmlString=htmlString.concat(`<div class="board-row">`);
for(let i=0;i<64;i++){
    if(i%8===0&&i>0){
        htmlString=htmlString.concat("</div><div class=\"board-row\">");
    }
    if(i%2===0){
      if(Math.floor(i/8)%2===0){
        htmlString=htmlString.concat(`<button id="square${i}" class="square"></button>`);
      }else{
        htmlString=htmlString.concat(`<button id="square${i}" class="square" style="background:black"></button>`);
      }
    }else{
      if(Math.floor(i/8)%2===0){
        htmlString=htmlString.concat(`<button id="square${i}" class="square" style="background:black"></button>`);
      }else{
        htmlString=htmlString.concat(`<button id="square${i}" class="square"></button>`);
      }
    }
}
htmlString=htmlString.concat("</div>");
boardElement.innerHTML = htmlString;

let moves=null;
let castleMoves=null;
let selected=null;
let boardRows=8;
let boardCols=8;
let king_pos=new Map();
let can_castle_left=new Map();
let can_castle_right=new Map();
let turn="w";
let en_passant=null;
king_pos.set("b",4);
king_pos.set("w",60);
let whiteCheck=null;
let blackCheck=null;
let whiteCheckmate=null;
let blackCheckmate=null;
let lastMove=null;

for(let i=0;i<64;i++){
  document.getElementById(`square${i}`).onclick=(e => {
      handleClick(i);
  });
  document.getElementById(`square${i}`).addEventListener('contextmenu', e => {
    e.preventDefault();
    handleRightClick();
  });
  if(squares[i]!==null){
    document.getElementById(`square${i}`).innerHTML=`<img class="square-image" src="images/${squares[i].piece}_${squares[i].player.color}.png"></img>`
  }
}

function numToCoord(i){
  return [Math.floor(i/8),i%8];
}

function coordToNum(x,y){
  if(x>=0&&x<boardRows&&y>=0&&y<boardCols){
    return boardCols*x+y;
  }else{
    return undefined;
  }
}

function handleClick(i){
  if(selected===null&&squares[i]){
    if(turn!==squares[i].player.color){
      return;
    }
    selected=i;
    castleMoves=calculateCastleMoves(squares,i);
    moves=calculateMoves(squares,i,true).concat(castleMoves);
  }else if(squares[selected]){
    if(moves.includes(i)){
      lastMove=i;
      if(castleMoves.includes(i)){
        let kingPos,newKingPos,rookPos,newRookPos;
        if(i===58){
          //White left castle
          kingPos=60
          newKingPos=58
          rookPos=56
          newRookPos=59
        }else if(i===62){
          //White right castle
          kingPos=60
          newKingPos=62
          rookPos=63;
          newRookPos=61;
        }else if(i===2){
          //Black right castle
          kingPos=4
          newKingPos=2;
          rookPos=0;
          newRookPos=3;
        }else if(i===6){
          kingPos=4;
          newKingPos=6;
          rookPos=7;
          newRookPos=5;
        }
        selected=null;
        squares[newKingPos]=squares[kingPos]
        squares[newKingPos].hasMoved=true;
        squares[kingPos]=null;
        document.getElementById(`square${newKingPos}`).innerHTML=document.getElementById(`square${kingPos}`).innerHTML;
        document.getElementById(`square${kingPos}`).innerHTML="";
        squares[newRookPos]=squares[rookPos];
        squares[newRookPos].hasMoved=true;
        squares[rookPos]=null
        document.getElementById(`square${newRookPos}`).innerHTML=document.getElementById(`square${rookPos}`).innerHTML;
        document.getElementById(`square${rookPos}`).innerHTML="";
        handleTurnChange()
        return;
      }
      if(en_passant===i+(turn==="b"?-1*boardCols:boardCols)){
        squares[en_passant]=null;
        document.getElementById(`square${en_passant}`).innerHTML="";
      }
      if(squares[selected].piece==="p" && i===selected+(turn==="w"?-2*boardCols:2*boardCols)){
        en_passant=i;
      }else{
        en_passant=null;
      }
      squares[i]=squares[selected];
      squares[i].hasMoved=true;
      squares[selected]=null;
      if(squares[i].piece==="x"){
        king_pos.set(squares[i].player.color,i);
      }
      document.getElementById(`square${i}`).innerHTML=document.getElementById(`square${selected}`).innerHTML;
      document.getElementById(`square${selected}`).innerHTML="";
      selected=null;
      //promotion logic
      if(squares[i].piece==="p"&&(i<8||i>=56)){
        //Prevent new selections
        let temp=turn;
        turn="n";
        let htmlString="";
        htmlString=htmlString.concat(`<img id="promote-q" class="promotion-image" style="top:0;left:0" src="images/q_${temp}.png"></img>`);
        htmlString=htmlString.concat(`<img id="promote-r" class="promotion-image" style="top:0;right:0" src="images/r_${temp}.png"></img>`);
        htmlString=htmlString.concat(`<img id="promote-k" class="promotion-image" style="bottom:0;left:0" src="images/k_${temp}.png"></img>`);
        htmlString=htmlString.concat(`<img id="promote-b" class="promotion-image" style="bottom:0;right:0" src="images/b_${temp}.png"></img>`);

        document.getElementById(`square${i}`).innerHTML=htmlString
        document.getElementById("promote-q").onclick=(e => {
          handlePromotion(i,"q",temp);
        });
        document.getElementById("promote-r").onclick=(e => {
          handlePromotion(i,"r",temp);
        });
        document.getElementById("promote-k").onclick=(e => {
          handlePromotion(i,"k",temp);
        });
        document.getElementById("promote-b").onclick=(e => {
          handlePromotion(i,"b",temp);
        });
      }else{
        handleTurnChange();
      }
    }
  }
}

function handleTurnChange(){
  turn=turn==="w"?"b":"w";
  blackCheck=null;
  whiteCheck=null;
  if(isAttacked(squares,king_pos.get(turn))){
    let canMove=false;
    for(let i=0;i<boardRows*boardCols;i++){
      if(squares[i]&&squares[i].player.color===turn&&calculateMoves(squares,i,true).length!==0){
        canMove=true;
      }
    }
    if(!canMove){
      console.log(`${turn==="w"?"Black":"White"} checkmates ${turn==="b"?"Black":"White"}`)
      if(turn==="b"){
        blackCheckmate=king_pos.get(turn);
      }else{
        whiteCheckmate=king_pos.get(turn);
      }
    }else{
      if(turn==="b"){
        blackCheck=king_pos.get(turn);
      }else{
        whiteCheck=king_pos.get(turn);
      }
      console.log(`Check: ${turn==="b"?"black":"white"} to move`);
    }
  }
  //Computer control for black
  /*
  if(turn==="b"){
    for(let i=0;i<squares.length;i++){
      if(squares[i]?.player.color==="b"){
        handleClick(i)
        if(moves.length>0){
          handleClick(moves[0])
          break
        }else{
          handleRightClick();
        }
      }
    }
  }
  */
  if(turn==="b"){
    let movesArr=[]
    for(let i=0;i<squares.length;i++){
      if(squares[i]?.player.color==="b"){
        handleClick(i)
        if(moves.length>0){
          movesArr.push({square:i,to:moves.slice()})
        }
        handleRightClick();
      }
    }
    let randSquare=movesArr[Math.floor(Math.random()*movesArr.length)]
    let randTo=randSquare.to[Math.floor(Math.random()*randSquare.to.length)]
    handleClick(randSquare.square)
    handleClick(randTo)
  }
}

function handlePromotion(index,piece,newTurn){
  squares[index].piece=piece;
  squares[index].player.color=newTurn;
  document.getElementById(`square${index}`).innerHTML=`<img class="square-image" src="images/${squares[index].piece}_${squares[index].player.color}.png"></img>`;
  turn=newTurn;
  handleTurnChange();
}

function handleRightClick(){
  selected=null;
  moves=null;
}
function calculateCastleMoves(squares,index){
  let castleMoves=[]
  if(squares[index].piece!=="x"){
  }else{
    if(turn==="w"){
      //Left castle
      let rookIndex=index-4;
      if(!squares[index].hasMoved&&squares[rookIndex]?.piece==="r"&&!squares[rookIndex].hasMoved){
        let canCastle=true
        for(let i=rookIndex+1;i<index;i++){
          if(squares[i]!==null||isAttacked(squares,i,turn)){
            canCastle=false;
            break;
          }
        }
        if(canCastle){
          castleMoves.push(index-2)
        }
      }
      //Right castle
      rookIndex=index+3;
      if(!squares[index].hasMoved&&squares[rookIndex]?.piece==="r"&&!squares[rookIndex].hasMoved){
        let canCastle=true
        for(let i=index+1;i<rookIndex;i++){
          if(squares[i]!==null||isAttacked(squares,i,turn)){
            canCastle=false;
            break;
          }
        }
        if(canCastle){
          castleMoves.push(index+2)
        }
      }
      }else{
        //Black Right Castle
        let rookIndex=index-4;
        if(!squares[index].hasMoved&&squares[rookIndex]?.piece==="r"&&!squares[rookIndex].hasMoved){
          let canCastle=true
          for(let i=rookIndex+1;i<index;i++){
            if(squares[i]!==null||isAttacked(squares,i,turn)){
              canCastle=false;
              break;
            }
          }
          if(canCastle){
            castleMoves.push(index-2)
          }
        }
        //Black Left castle
        rookIndex=index+3;
        if(!squares[index].hasMoved&&squares[rookIndex]?.piece==="r"&&!squares[rookIndex].hasMoved){
          let canCastle=true
          for(let i=index+1;i<rookIndex;i++){
            if(squares[i]!==null||isAttacked(squares,i,turn)){
              canCastle=false;
              break;
            }
          }
          if(canCastle){
            castleMoves.push(index+2)
          }
        }
      }
    }
    return castleMoves;
  }

function calculateMoves(squares,index,checkRules){
  let [x,y]=numToCoord(index);
  let myMoves=[];
  let possibleMoves;
  if(squares[index].piece==="k"){
    possibleMoves=new Array(8);
    possibleMoves[0]=coordToNum(x+1,y+2);
    possibleMoves[1]=coordToNum(x+2,y+1);
    possibleMoves[2]=coordToNum(x+2,y-1);
    possibleMoves[3]=coordToNum(x+1,y-2);
    possibleMoves[4]=coordToNum(x-1,y-2);
    possibleMoves[5]=coordToNum(x-2,y-1);
    possibleMoves[6]=coordToNum(x-2,y+1);
    possibleMoves[7]=coordToNum(x-1,y+2);
  }else if(squares[index].piece==="r"){
    possibleMoves=[]
    for(let dir of [-1,1]){
      for(let upDown of [1,0]){
        for(let offset=1;offset<boardRows;offset++){
          let pos=coordToNum(x+offset*dir*upDown,y+offset*dir*(upDown-1));
          if(squares[pos]===null){
            possibleMoves.push(pos);
          }else{
            possibleMoves.push(pos);
            break;
          }
        }
      }
    }
  }else if(squares[index].piece==="b"){
    possibleMoves=[];
    for(let xDir of [-1,1]){
      for(let yDir of [-1,1]){
        for(let offset=1;offset<boardRows;offset++){
          let pos=coordToNum(x+offset*xDir,y+offset*yDir);
          if(squares[pos]===null){
            possibleMoves.push(pos);
          }else{
            possibleMoves.push(pos);
            break;
          }
        }
      }
    }
  }else if(squares[index].piece==="q"){
    possibleMoves=[];
    for(let xDir of [-1,1]){
      for(let yDir of [-1,1]){
        for(let offset=1;offset<boardRows;offset++){
          let pos=coordToNum(x+offset*xDir,y+offset*yDir);
          if(squares[pos]===null){
            possibleMoves.push(pos);
          }else{
            possibleMoves.push(pos);
            break;
          }
        }
      }
    }
    for(let dir of [-1,1]){
      for(let upDown of [1,0]){
        for(let offset=1;offset<boardRows;offset++){
          let pos=coordToNum(x+offset*dir*upDown,y+offset*dir*(upDown-1));
          if(squares[pos]===null){
            possibleMoves.push(pos);
          }else{
            possibleMoves.push(pos);
            break;
          }
        }
      }
    }
  }else if(squares[index].piece==="x"){
    possibleMoves=[];
    for(xOffset of [-1,0,1]){
      for(yOffset of [-1,0,1]){
        if(xOffset!==0||yOffset!==0){
          let pos=coordToNum(x+xOffset,y+yOffset);
          possibleMoves.push(pos);
        }
      }
    }
  }else if(squares[index].piece==="p"){
    possibleMoves=[];
    if(squares[index].player.color==="b"){
      if(squares[coordToNum(x+1,y)]===null){
        possibleMoves.push(coordToNum(x+1,y));
        if(x===1){
          let pos = coordToNum(x+2,y);
          if(squares[pos]===null){
            possibleMoves.push(pos);
          }
        }
      }
      for(let yOffset of [-1,1]){
        let pos=coordToNum(x+1,y+yOffset);
        if(squares[pos]!==null||pos===en_passant+boardCols){
          possibleMoves.push(pos);
        }
      }
    }else{
      if(squares[coordToNum(x-1,y)]===null){
        possibleMoves.push(coordToNum(x-1,y));
        if(x===6&&squares[coordToNum(x-2,y)]===null){
          possibleMoves.push(coordToNum(x-2,y));
        }
      }
      for(let yOffset of [-1,1]){
        let pos=coordToNum(x-1,y+yOffset);
        if(squares[pos]!==null||pos===en_passant-boardCols){
          possibleMoves.push(pos);
        }
      }
    }
  }
  if(checkRules){
    for(let move of possibleMoves){
      if(move>=0&&move<64){
        if(squares[index].player.color!==squares[move]?.player?.color){
          let newSquares=squares.slice();
          newSquares[move]=newSquares[index];
          newSquares[index]=null;
          if(en_passant===move+turn==="w"?boardCols:-1*boardCols){
            newSquares[en_passant]=null;
          }
          if(squares[index].player.color!==squares[move]?.player?.color&&!isAttacked(newSquares,squares[index].piece==="x"?move:king_pos.get(turn))){
            myMoves.push(move);
          }
        }
      }
    }
  }else{
    for(let move of possibleMoves){
      if(move>=0&&move<64){
        if(squares[index].player.color!==squares[move]?.player?.color){
          myMoves.push(move);
        }
      }
    }
  }
  return myMoves;
}
function isAttacked(squares,index,turn){
  for(let i=0;i<boardRows*boardCols;i++){
    if(i!==index){
      if(squares[i]&&((turn&&squares[i].player.color!==turn)||(squares[index]&&squares[i].player.color!==squares[index].player.color))&&calculateMoves(squares,i,false).includes(index)){
        return true;
      }
    }
  }
  return false;
}

window.setInterval(function(){
  for(let i=0;i<squares.length;i++){
    if(i%2===0){
      if(Math.floor(i/8)%2===0){
        document.getElementById(`square${i}`).style.background="white";
      }else{
        document.getElementById(`square${i}`).style.background="black";
      }
    }else{
      if(Math.floor(i/8)%2===0){
        document.getElementById(`square${i}`).style.background="black";
      }else{
        document.getElementById(`square${i}`).style.background="white";
      }
    }
  }
  if(selected!==null){
    document.getElementById(`square${selected}`).style.background="blue";
    for(const i of moves){
      document.getElementById(`square${i}`).style.background="gold";
    }
  }
  if(whiteCheck){
    document.getElementById(`square${whiteCheck}`).style.background="red";
  }
  if(blackCheck){
    document.getElementById(`square${blackCheck}`).style.background="red";
  }
  if(whiteCheckmate){
    document.getElementById(`square${whiteCheckmate}`).style.background="red";
    document.getElementById(`square${whiteCheckmate}`).style.transform="rotate(90deg)"
  }
  if(blackCheckmate){
    document.getElementById(`square${blackCheckmate}`).style.background="red";
    document.getElementById(`square${blackCheckmate}`).style.transform="rotate(90deg)"
  }
  if(lastMove){
    document.getElementById(`square${lastMove}`).style.background="orange";
  }
},10);

