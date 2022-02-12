let pencilBtn = document.querySelector(".pencil");
let eraserBtn = document.querySelector(".eraser");
let notesBtn = document.querySelector(".notes");
let uploadBtn = document.querySelector(".upload");

let optionCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");

let pencilToolFlag = false; // False -> hide box ,true-> show box
let eraserToolFlag = false; // False -> hide box ,true-> show box
let optionFlag = true; // True -> show tools , false-> hide tools

optionCont.addEventListener("click", (e) => {
  optionFlag = !optionFlag;

  if (optionFlag === true) {
    openTools();
  } else {
    closeTools();
  }
});

pencilBtn.addEventListener("click", (e) => {
  pencilToolFlag = !pencilToolFlag;

  if (pencilToolFlag == true) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

eraserBtn.addEventListener("click", (e) => {
  eraserToolFlag = !eraserToolFlag;

  if (eraserToolFlag == true) {
    eraserToolCont.style.display = "block";
  } else {
    eraserToolCont.style.display = "none";
  }
});

notesBtn.addEventListener("click", (e) => {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="text-cont">
        <textarea ></textarea>
    </div>
    `;

  document.body.appendChild(stickyCont);

  let minimize = stickyCont.querySelector(".minimize");
  let remove = stickyCont.querySelector(".remove");

  noteActions(minimize, remove, stickyCont);

  //Drag and Drop functionality
  stickyCont.onmousedown = function (event) {
    dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
});

uploadBtn.addEventListener("click", (e) => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="text-cont">
        <img src="${url}" />
    </div>
    `;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");

    noteActions(minimize, remove, stickyCont);

    //Drag and Drop functionality
    stickyCont.onmousedown = function (event) {
      dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
      return false;
    };
  });
});




















function openTools() {
  let iconEle = optionCont.children[0];
  iconEle.classList.remove("fa-bars");
  iconEle.classList.add("fa-xmark");
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconEle = optionCont.children[0];
  iconEle.classList.remove("fa-xmark");
  iconEle.classList.add("fa-bars");
  toolsCont.style.display = "none";
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });

  minimize.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".text-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") noteCont.style.display = "block";
    else noteCont.style.display = "none";
  });
}

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
