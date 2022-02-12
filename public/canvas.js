
let canvas=document.querySelector("canvas");
let pencilColorsArr=document.querySelectorAll(".pencil-color");
let pencilWidthEle=document.querySelector(".pencil-width");
let eraserWidthEle=document.querySelector(".eraser-width");
let downloadBtn=document.querySelector(".download");
let undoBtn=document.querySelector(".undo");
let redoBtn=document.querySelector(".redo");


let pencilColor="red";
let eraserColor="white";
let pencilWidth=pencilWidthEle.value;
let eraserWidth=eraserWidthEle.value;
let undoRedoArr=[];
let tracker=0;



canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let mouseDown=false;


let tool=canvas.getContext("2d");

tool.strokeStyle=pencilColor;
tool.lineWidth=pencilWidth;


canvas.addEventListener("mousedown",(e)=>{
    mouseDown=true;
    //beginPath({x:e.clientX,y:e.clientY})

    let data={
        x:e.clientX,
        y:e.clientY
    };
    //send data to server
    socket.emit("beginPath",data);
});
canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown===true)
    {
        let data={
            x:e.clientX,
            y:e.clientY,
            color:eraserToolFlag?eraserColor:pencilColor,
            width:eraserToolFlag?eraserWidth:pencilWidth
        };

        //send data to server
        socket.emit("drawStroke",data);

        // drawStroke({x:e.clientX,
        //     y:e.clientY,
        //     color:eraserToolFlag?eraserColor:pencilColor,
        //     width:eraserToolFlag?eraserWidth:pencilWidth
        // });
    }
});

canvas.addEventListener("mouseup",(e)=>{
    mouseDown=false;

    let url=canvas.toDataURL();
    undoRedoArr.push(url);
    tracker=undoRedoArr.length-1;
});

pencilWidthEle.addEventListener("change",(e)=>{
    pencilWidth=pencilWidthEle.value;
    tool.lineWidth=pencilWidth;
    
});

eraserWidthEle.addEventListener("change",(e)=>{
    eraserWidth=eraserWidthEle.value;
    
    tool.lineWidth=eraserWidth;
    
});
eraserBtn.addEventListener("click",(e)=>{
    if(eraserToolFlag==true)
    {
        tool.strokeStyle=eraserColor;
        tool.lineWidth=eraserWidth;
    }
    else
    {
        tool.strokeStyle=pencilColor;
        tool.lineWidth=pencilWidth;
    }
})

downloadBtn.addEventListener("click",(e)=>{

    let url=canvas.toDataURL();

    let a=document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
});

undoBtn.addEventListener("click",(e)=>{
    if(tracker > 0) tracker--;

    //Track Action
    let data={
        trackerIdx:tracker,
        undoRedoArr
    };
    //send data to server
    socket.emit("redoUndo",data);


    //displayCanvasAfterUndoRedo(undoRedoObj);
});

redoBtn.addEventListener("click",(e)=>{
    if(tracker < undoRedoArr.length-1) tracker++;
    
    // Track Action
    let data={
        trackerIdx:tracker,
        undoRedoArr
    };

    socket.emit("redoUndo",data);
    //displayCanvasAfterUndoRedo(undoRedoObj);
});



function beginPath(strokeObj)
{
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
    
}

function drawStroke(strokeObj)
{
    tool.strokeStyle=strokeObj.color;
    tool.lineWidth=strokeObj.widht;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColorsArr.forEach((colorEle)=>{
    colorEle.addEventListener("click",(e)=>{
        let color=colorEle.classList[0];
        pencilColor=color;
        tool.strokeStyle=pencilColor;
    })
})

function displayCanvasAfterUndoRedo(undoRedoObj)
{
    tracker=undoRedoObj.trackerIdx;
    undoRedoArr=undoRedoObj.undoRedoArr;

    let url=undoRedoArr[tracker];
    let img=new Image();
    img.src=url;
    img.onload= (e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    };
}



socket.on("beginPath",(data)=>{
    //data= data comes from server
    beginPath(data);
});

socket.on("drawStroke",(data)=>{
    //data= data comes from server
    drawStroke(data);
});

socket.on("redoUndo",(data)=>{
    //data= data comes from server
    displayCanvasAfterUndoRedo(data);
});