const play = document.getElementById("btn-one");
const online = document.getElementById("btn-two");
const create = document.getElementById("create-btn");
const enter = document.getElementById("enter-btn");
const buton = document.getElementById("buton");
const gameDiv = document.querySelector(".game-div");
const grid = document.querySelector(".grid");
const smallcell = document.querySelectorAll(".smallcell");
const bigcell = document.querySelectorAll(".bigcell");
let matter = document.getElementById("text");
let onlineplay=false;
let roomname="";


const socket = io();
let currentPlayer = "X";
let myself="X";
let opponentself="O";
let isGameOver = false;

let Aray = [true, true, true, true, true, true, true, true, true];

// create the Tic-Tac-Toe grid
function createTicTacToeGrid() {
  matter.innerHTML = currentPlayer + "'s  Turn";
  Aray = [true, true, true, true, true, true, true, true, true];
  play.style.display = "none";
  grid.style.display = "grid";
  for (let i = 0; i < 9; i++) {
    const bigcel = document.createElement("div");
    bigcel.classList.add("bigcell");
    bigcel.id = "";
    bigcel.textContent = "";
    grid.appendChild(bigcel);
  }

  let cels = document.getElementsByClassName("bigcell");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const smallcel = document.createElement("div");
      smallcel.id = 9 * i + j;
      smallcel.classList.add("smallcell");
      smallcel.textContent = "";
      cels[i].appendChild(smallcel);
    }
  }
}

function choosebigcell(sbnum) {
  console.log("choosebigcell is runnign wiht ",sbnum);
  const sbd = document.querySelectorAll(".bigcell");
  const smcel = sbd[sbnum].querySelectorAll(".smallcell");
for(let i=0;i<9;i++){
  sbd[i].classList.remove("disable-click");
}

  for (let i = 0; i < 9; i++) {
    if (sbd[sbnum].id !== "") {
      Aray = [true, true, true, true, true, true, true, true, true];
      return;
    } else {
      Aray = [false, false, false, false, false, false, false, false, false];
      for (let i = 0; i < 9; i++) {
        if (sbd[i].id !== "" || i === sbnum) {
          Aray[i] = true;
        }
        else{
            Aray[i]=false;
        }
      }
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!Aray[i]) {
      sbd[i].classList.add("disable-click");
    }
  }
}


function checksbgameover(bbnum) {
  const sbd = document.querySelectorAll(".bigcell");
  const cels = sbd[bbnum].querySelectorAll(".smallcell");

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      (cels[a].textContent === "X" || cels[a].textContent === "O") &&
      cels[a].textContent === cels[b].textContent &&
      cels[a].textContent === cels[c].textContent
    ) {
      console.log("smallgameover");
      sbd[bbnum].style.display = "flex";
      Aray[bbnum] = false;
      sbd[bbnum].textContent = cels[a].textContent;
      sbd[bbnum].id = cels[a].textContent;
      checkbbgameover();

      return;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (cels[i].textContent === "") {
      return;
    }
  }
  sbd[bbnum].style.display = "flex";
  Aray[bbnum] = false;
  sbd[bbnum].textContent = " ";
  return;
}

function checkbbgameover() {
  const cels = document.querySelectorAll(".bigcell");

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      (cels[a].id === "X" || cels[a].id === "O") &&
      cels[a].id === cels[b].id &&
      cels[a].id === cels[c].id
    ) {
      console.log("biggameover");
      isGameOver = true;
      matter.innerHTML = cels[a].id + " Won";

      animategrid(a, b, c, cels);

      return;
    }
  }
  console.log("this is being started ");
  let xcount = 0;
  let ocount = 0;
  for (let i = 0; i < 9; i++) {
    if (cels[i].id === "") {
      return;
    }
    if (cels[i].id === "X") {
      xcount++;
    }
    if (cels[i].id === "O") {
      ocount++;
    }
  }
  if (xcount > ocount) {
    isGameOver = true;
    matter.innerHTML = "X Won";
  }
  if (xcount < ocount) {
    isGameOver = true;
    matter.innerHTML = "O Won";
  } else if (xcount === ocount) {
    isGameOver = true;
    matter.innerHTML = " DRAW  ";
  }
  drawanimate(cels);
  console.log("done");
  //   setTimeout(() => {
  //     for (let i = 0; i < 9; i++) {
  //       grid.removeChild(cels[i]);

  //     }
  //     isGameOver = false;
  //     createTicTacToeGrid();
  //   }, 2000);
  return;
}
function drawanimate(cels) {
  setTimeout(() => {
    for (let i = 0; i < 9; i++) {
      grid.removeChild(cels[i]);
    }
    isGameOver = false;
    createTicTacToeGrid();
  }, 2000);
}
function animategrid(a, b, c, cels) {
  cels[a].classList.add("winning-cell");
  cels[b].classList.add("winning-cell");
  cels[c].classList.add("winning-cell");
  setTimeout(() => {
    for (let i = 0; i < 9; i++) {
      grid.removeChild(cels[i]);
    }
    isGameOver = false;
    createTicTacToeGrid();
  }, 2000);
}

















grid.addEventListener("click", (event) => {
 
  if (
    !isGameOver &&
    event.target.classList.contains("smallcell") &&
    !event.target.textContent &&
    myself===currentPlayer
  ) {
    const cels = document.getElementsByClassName("bigcell");
   
    const box = document.querySelectorAll(".smallcell");
    let clickedIndex = parseInt(event.target.id, 10);

    console.log(clickedIndex);
    event.target.textContent = currentPlayer;
    let bbnum = Math.floor(clickedIndex / 9);
    let sbnum = clickedIndex % 9;
    checksbgameover(bbnum);
    
    choosebigcell(sbnum);
    

    if (currentPlayer === "X") {
      currentPlayer = "O";
    } else {
      currentPlayer = "X";
    }
    matter.innerHTML = currentPlayer + "'s  Turn";
    if(onlineplay ){
     let  data=[roomname,myself,clickedIndex];
    socket.emit("numbersent", data);
    console.log(data);
  }
}
});
socket.on('numbergot', (data) => {
    console.log(data);
  if(data[1]===opponentself){
  let bestMove=data[2];
  document.getElementById(bestMove).textContent=opponentself;
  currentPlayer=myself;
  matter.innerHTML = currentPlayer + "'s  Turn";

  // console.log(data[2]);
  checksbgameover(Math.floor(bestMove/9));
  console.log("chosbigcell si goint to run");
  choosebigcell(bestMove%9);}
})





play.addEventListener("click", () => {
  online.style.display = "none";
  createTicTacToeGrid();
});

online.addEventListener("click", () => {
  play.style.display = "none";
  online.style.display = "none";
  create.style.display = "block";
  enter.style.display = "block";
});

create.addEventListener("click", () => {
  document.getElementById("buton").style.display = "none";
  const randomWord = generateRandomWord();

  socket.emit("store", { name: randomWord });

  let xyz = document.createElement("p");
  xyz.id="codename";

  let msg = document.createElement("p");
  msg.id="msgname";
  xyz.innerHTML = randomWord;
  roomname=randomWord;
  msg.innerHTML = "ask your friend to enter this code to play together";

  document.getElementsByClassName("start-div")[0].appendChild(xyz);
  document.getElementsByClassName("start-div")[0].appendChild(msg);
});



socket.on('exclusive-event', (data) => {
  // Handle the received data here
  console.log('Received exclusive-event:', data);
  if(data==="connected"){
    // buton.style.display="none";
    const dam=document.getElementById("myForm");
    if(dam!==null){
      dam.style.display="none";
    }
    const dam1=document.getElementById("codename");
    if(dam1!==null){
      dam1.style.display="none";
    }
    const dam2=document.getElementById("msgname");
    if(dam2!==null){
      dam2.style.display="none";
    }
     onlineplay=true;
    createTicTacToeGrid();
  }
});


enter.addEventListener("click", () => {
  document.getElementById("buton").style.display = "none";
  createFormAndAppendToDiv();
  const Submitbutton=document.getElementById("submitBtn");
  myself="O";
  opponentself="X";

  Submitbutton.addEventListener("click",()=>{
    Submitbutton.disabled = true;
    console.log("submitted");
    const plywrd=document.getElementById("alphabets").value;
    roomname=plywrd;
    socket.emit("find", { name: plywrd });
    // socket.emit('join-room', plywrd); 
    
  })
  document.getElementById("alphabets").addEventListener("keypress", function (e) {
      // Prevent further input beyond 4 characters
      if (this.value.length >= 4) {
        e.preventDefault();
      }
    });
});







let darkmode = localStorage.getItem("darkmode");
const darkmodetoggle = document.getElementById("toggle");

const enabledarkmode = () => {
  let imgElement = document.getElementById("toggle");
  imgElement.setAttribute("src", "files/toggle-on-solid.svg");
  document.body.classList.add("dark-mode");
  localStorage.setItem("darkmode", "enabled");
};
const disabledarkmode = () => {
  let imgElement = document.getElementById("toggle");
  imgElement.setAttribute("src", "files/toggle-off-solid.svg");
  document.body.classList.remove("dark-mode");
  localStorage.setItem("darkmode", null);
};

if (darkmode === "enabled") {
  enabledarkmode();
}
darkmodetoggle.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");
  console.log(darkmode);

  if (darkmode !== "enabled") {
    enabledarkmode();
  } else {
    disabledarkmode();
  }
});

function generateRandomWord() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let word = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    word += letters.charAt(randomIndex);
  }
  return word;
}

function createFormAndAppendToDiv() {
  // Create a form element
  const form = document.createElement("form");
  form.id = "myForm";

  // Create a label element
  const label = document.createElement("label");
  label.htmlFor = "alphabets";
  label.textContent = "Enter code:";

  // Create an input element
  const input = document.createElement("input");
  input.type = "text";
  input.id = "alphabets";
  input.setAttribute("autocomplete", "off");
  input.oninput = function () {
    convertToUppercase(this);
    checkInput(this, 4);
  };

  // Create a button element
  const button = document.createElement("button");
  button.type = "button";
  button.id = "submitBtn";
  button.textContent = "Submit";
  button.disabled = true;

  // Append the label, input, and button to the form
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(button);
 
  // Find the div with the class 'start-div'
  const startDiv = document.querySelector(".start-div");

  // Append the form to the 'start-div'
  startDiv.appendChild(form);
}
function convertToUppercase(element) {
  element.value = element.value.toUpperCase();
}

function checkInput(element, maxLength) {
  // Remove any non-alphabetic characters
  element.value = element.value.replace(/[^A-Z]/g, "");

  // Truncate to the maximum length
  if (element.value.length > maxLength) {
    element.value = element.value.slice(0, maxLength);
  }

  // Enable or disable the button based on the input length
  var submitBtn = document.getElementById("submitBtn");
  if (element.value.length === maxLength) {
    submitBtn.disabled = false;
    const plywrd=element.value;
    submitBtn.style.backgroundColor = "green";
  } else {
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = "gray";
  }
}







// Call the function to create the form and append it to the div
