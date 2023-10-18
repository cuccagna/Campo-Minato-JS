const root = document.documentElement;
const IMG_PATH = "./assets/img/";
const imgTag = document.querySelector(".game-board-background");
const gameBoard = document.querySelector(".game-board");
const gameOver = document.querySelector(".end-game-screen");
const treasureEl = document.querySelector(".treasure");

temi = [
  {
    nome: "willy il coyote",
    "--game-panel-color": "#5545bf",
    "--win-color": "rgb(78, 241, 187,0.65)",
    "--cell-color": "#f2e5a2",
    "--cell-dark-color": "#f2de79",
    "--cell-clicked-color": "#c3b324",
    "--cell-bomb-game-over-color": "rgb(241, 117, 78,0.5)",
    "--main-font": '"VT323", "handwriting", "serif"',
    "--end-game-font": "'Bungee Spice', sans-serif",
    img: "coyote_bip_bip2.jpg",
    imgTreasure: "coyoteCatturaEditato3.png",
  },
  {
    nome: "default",
    "--game-panel-color": "rgb(0, 23, 50)",
    "--win-color": "rgb(78, 241, 187,0.65)",
    "--cell-color": "rgb(216, 238, 232)",
    "--cell-dark-color": "rgb(203, 223, 221)",
    "--cell-clicked-color": "rgb(157, 197, 199)",
    "--cell-bomb-game-over-color": "rgb(241, 117, 78,0.5)",
    "--main-font": '"Darker Grotesque", "sans-serif"',
    "--end-game-font": '"Press Start 2P", cursive',
    img: "none",
    imgTreasure: "vittoriaPeterPNGFinale.png",
  },
];

var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /*when an item is clicked, update the original select box,
        and the selected item:*/
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x,
    y,
    i,
    xl,
    yl,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

const customItemsSelectContainer = document.querySelector(".select-items");
customItemsSelectContainer.addEventListener("click", function (e) {
  const clickedEl = e.target;
  const theme = clickedEl.textContent;

  let selectedTheme = temi.find((el) => el.nome === theme);

  if (!selectedTheme) {
    //Disegna qualcosa in pagina o fai un redirect a una pagina d'errore
    throw new Error("Tema inesistente");
  }

  for (let propCol in selectedTheme) {
    switch (propCol) {
      case "img":
        let pathImage =
          selectedTheme.img === "none" ? "" : IMG_PATH + selectedTheme[propCol];
        imgTag.setAttribute("src", pathImage);
        break;
      case "nome":
        break;
      case "imgTreasure":
        setBackground(selectedTheme[propCol]);
        break;

      default:
        root.style.setProperty(propCol, selectedTheme[propCol]);
    }
  }
});

function setBackground(imgName) {
  let docs = document.styleSheets;
  let fileNameReg = /index.css/;
  let myStyleSheet;

  for (let doc of docs) {
    if (fileNameReg.test(doc.href)) {
      myStyleSheet = doc;
      break;
    }
  }

  let rules = myStyleSheet.cssRules;
  for (let rule of rules) {
    if (rule.selectorText == ".treasure-win.treasure-meme") {
      rule.style.backgroundImage = `url("${IMG_PATH}${imgName}")`;
    }
  }
}

/*QUesto commentato era il codice che serviva per switchare dalla schermata di game-over 
a quella normale prima di aggiungere la logica javascript 

gameBoard.addEventListener("click", toggleCopertinaGameOver);

function toggleCopertinaGameOver() {
  console.log("Ciao");
  gameOver.classList.toggle("hidden");
} */

/* FASE DI PREPARAZIONE */

//Recuperare dalla pagina tutti gli elemnti
const scoreCounter = document.querySelector(".score-counter");
const grid = document.querySelector(".grid");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainButton = document.querySelector(".play-again");
let scoreYou = document.querySelector(".score-storico__you");
let scoreCpu = document.querySelector(".score-storico__cpu");

const gameBoardBackground = document.querySelector(".game-board-background");

/* EVENTI */

// Gestiamo il click della cella usando event-delegation. Ottimo perchè così non ho 100 gestori di evento
grid.addEventListener("click", handleClickCell);
grid.addEventListener("contextmenu", handleRightClick);
playAgainButton.addEventListener("click", giocaAgain);

//Preparo delle informazioni utili alla logica di gioco
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs;
let bombsList = [];
let tesoro;

let score = 0;

generaBombe();
generaGriglia();

//Generare TOT bombe casuali
function generaBombe() {
  bombsList = [];
  while (bombsList.length < totalBombs) {
    let randNumber = Math.floor(Math.random() * totalCells) + 1;
    if (!bombsList.includes(randNumber)) {
      bombsList.push(randNumber);
      //Codice commentato se vuoi visualizzare le bombe
      // let cellBombEl = document.querySelector(
      //   `div.cell:nth-of-type(${randNumber})`
      // );
      //  cellBombEl.classList.add("cell-bomb");
    }
  }

  generaTesoro();
}

function generaTesoro() {
  let randNumber = Math.floor(Math.random() * totalBombs);
  tesoro = bombsList[randNumber];
  console.log("🚀 ~ file: index.js:208 ~ generaTesoro ~ tesoro:", tesoro);
}

// GRIGLIA E LOGICA DI GIOCO
function generaGriglia() {
  let markup = "";
  let markup1 = "<div class='cell cell-dark'></div>";
  let markup2 = "<div class='cell'></div>";

  let isCelleEven = false;
  let isRowEven = true;

  for (let i = 1; i <= totalCells; i++) {
    isCelleEven = i % 2 == 0;
    if (i % 10 === 1) {
      isRowEven = !isRowEven; //Ogni nuova riga cioè per i=1 , 11 ,21 ecc. inverto il valore booleano
    }
    //prettier-ignore
    markup +=  ((isCelleEven && !isRowEven) || (!isCelleEven && isRowEven)) ? markup1 : markup2;
  }

  grid.innerHTML = markup;
}

function handleRightClick(e) {
  e.preventDefault();
  const cellClicked = e.target;
  if (cellClicked.innerHTML === "") {
    cellClicked.innerHTML = "&sext;";
  } else {
    cellClicked.innerHTML = "";
  }
}

function handleClickCell(e) {
  const cellClicked = e.target;

  //Controllo che la cella non sia stata già cliccata
  if (cellClicked.classList.contains("cell-clicked")) {
    return;
  }

  //Torna l'indice del figlio
  let indexCellClicked = Array.from(grid.children).indexOf(cellClicked) + 1;

  if (indexCellClicked === tesoro) {
    document
      .querySelector(`div.cell:nth-of-type(${tesoro})`)
      .classList.add("cell-treasure");
    endGame("treasure");
  } else if (bombsList.includes(indexCellClicked)) {
    cellClicked.classList.add("cell-bomb");
    endGame("lost");
  } else {
    cellClicked.classList.add("cell-clicked");
    /* cellClicked.innerHTML = "&sext;"; */
    let numMines = getMinesNumber(cellClicked, indexCellClicked);
    cellClicked.innerHTML = numMines;
    updateScore();
  }
}

function getMinesNumber(cellClicked, indexCellClicked) {
  const indexCellAboveCurrent = indexCellClicked - 10;
  const indexCellUnderCurrent = indexCellClicked + 10;
  let indexAdjacentPositions = [indexCellAboveCurrent, indexCellUnderCurrent];

  let unoASinistra = false;
  let unoADestra = false;
  switch (indexCellClicked % 10) {
    case 0: //ultima colonna
      unoASinistra = true;
      break;

    case 1: //prima colonna
      unoADestra = true;
      break;

    default:
      unoASinistra = true;
      unoADestra = true;
  }

  if (unoASinistra) {
    //prettier-ignore
    indexAdjacentPositions.push(indexCellAboveCurrent - 1,indexCellClicked - 1,indexCellUnderCurrent - 1);
  }
  if (unoADestra) {
    //prettier-ignore
    indexAdjacentPositions.push(indexCellAboveCurrent + 1,indexCellClicked + 1,indexCellUnderCurrent + 1);
  }

  //Delle posizione negative e che superano 100 me ne posso infischiare

  //true viene automaticamente convertito a 1 e false  azero
  //prettier-ignore
  const numMines = indexAdjacentPositions.reduce((acc,currVal)=>acc + bombsList.includes(currVal),0)
  return numMines;
}

//funzione per aggiornare il punteggio
function updateScore() {
  score++;
  scoreCounter.textContent = String(score).padStart(5, 0);
  //Controlla se l'utente ha vinto
  if (score === maxScore) {
    endGame("win");
  }
}

//funzione per decretare la fine del gioco
function endGame(result) {
  revealAllBombs();

  if (result === "lost") {
    endGameScreen.classList.remove("win");
    endGameText.innerHTML = "<div class='first-line'>GAME</div><div>OVER</div>";
    increaseScore("cpu");
  }
  //win or treasure
  else {
    endGameScreen.classList.add("win");
    endGameText.innerHTML = "<div class='first-line'>YOU</div><div>WIN</div>";
    increaseScore("you");
  }

  if (result === "treasure") {
    //alert("tesoro");
    //visualizza il box aggiuntivo per la vittoria tramite tesoro
    treasureEl.classList.add("treasure-win", "treasure-meme");
  }

  endGameScreen.classList.remove("hidden");
}

function increaseScore(player) {
  if (player === "you") {
    scoreYou.innerHTML++; //++ fa la conversione automatica da stringa a numero
  } else {
    scoreCpu.innerHTML++;
  }
}

function revealAllBombs() {
  gameBoardBackground.classList.add("opaque");
  for (let i = 0; i < bombsList.length; i++) {
    if (bombsList[i] != tesoro)
      document
        .querySelector(`div.cell:nth-of-type(${bombsList[i]})`)
        .classList.add("cell-bomb");
  }
}

function giocaAgain() {
  //nascondi il pannello di esito
  endGameScreen.classList.add("hidden");

  //nascondi le celle con le bombe e le altre celle cliccate
  for (let cell of grid.children) {
    cell.classList.remove("cell-bomb", "cell-clicked");
    cell.innerHTML = "";
  }

  //cancella il tesoro
  treasureEl.classList.remove("treasure-win", "treasure-meme");

  document
    .querySelector(`div.cell:nth-of-type(${tesoro})`)
    .classList.remove("cell-treasure");

  //Rigenera le bombe (altrimenti avrai le stesse bombe di prima)
  //Nota che l'ordine è importante. Prima cancella il tesoro e poi
  //genera kle bombe perchè la generazione delle bombe genera un nuovo tesoro
  generaBombe();

  //Azzera il contatore della precedente partita
  scoreCounter.textContent = "00000";
  score = 0;
  //location.reload();
}
