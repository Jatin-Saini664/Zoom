let canvas = document.getElementById("canvas");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencil_size = document.querySelector(".pencil-card>.card1");
let pencil_color = document.querySelector(".pencil-card>.card2");
let eraser_size = document.querySelector(".eraser-card");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let startVideo = document.querySelector("#start-video");
let stopVideo = document.querySelector("#stop-video");
let gallery = document.querySelector("#gallery");
let videoPlayer = document.querySelector("video");


let recordingState = false;
let constraints = { "audio":{
    "mandatory": {
        "googEchoCancellation": "false",
        "googAutoGainControl": "false",
        "googNoiseSuppression": "false",
        "googHighpassFilter": "false"
    }, "optional": []}, video: true };
let recordedData;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let ctx = canvas.getContext("2d");
ctx.lineCap = "round";
ctx.strokeStyle="#ff0000";


let isMouseDown = false;
let isPencilClicked = false;
let isEraserClicked = false;

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
}


(async function(){
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints,
        gotStream
    );
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
  // so next we have attached functions to these events
    mediaRecorder.onstart = function (e) {
        console.log("Inside on start !!");
        // console.log(e);
    };

    mediaRecorder.ondataavailable = function (e) {
        console.log("Inside on data available !!");
        // console.log(e.data);
        // let blob = new Blob( e.data , {"type":"video/mp4"});
        recordedData = e.data;
        saveVideo();
    };

    mediaRecorder.onstop = function (e) {
        console.log("Inside on stop !!");
        // console.log(e);
    };
})();


//$ Pencil

pencil.addEventListener("mouseover", function(e){
    if(isPencilClicked){
        document.querySelector(".pencil-card").style.display="block";
    }else
        document.querySelector(".pencil-card").style.display="none";
})

let allPencilSizes = pencil_size.querySelectorAll(".size");
for(let i=0;i<allPencilSizes.length;i++)
    allPencilSizes[i].addEventListener("click", function(e){
        if(isPencilClicked){
            if(e.target.classList.length == 2){
                pencil_size.querySelector(".border").classList.remove("border");
                e.target.classList.add("border");
                if(e.target.classList[1][4]=='1'){
                    ctx.lineWidth=1;
                }else if(e.target.classList[1][4]=='2'){
                    ctx.lineWidth=10;
                }else{
                    ctx.lineWidth=20;
                }
            }
        }
    });

let allPencilColors = pencil_color.querySelectorAll(".color");
for(let i=0;i<allPencilColors.length;i++)
    allPencilColors[i].addEventListener("click", function(e){
        if(isPencilClicked){
            if(e.target.classList.length == 2){
                pencil_color.querySelector(".border").classList.remove("border");
                e.target.classList.add("border");
                if(e.target.classList[1]=='red'){
                    ctx.strokeStyle="#ff0000";
                }else if(e.target.classList[1]=='blue'){
                    ctx.strokeStyle="#0000ff";
                }else{
                    ctx.strokeStyle="#ffff00";
                }
            }
        }
    });

pencil.addEventListener("mouseout", function(e){
    document.querySelector(".pencil-card").style.display="none";
})

document.querySelector(".pencil-card").addEventListener("mouseover", function(e){
    if(isPencilClicked){
        document.querySelector(".pencil-card").style.display="block";
    }else
        document.querySelector(".pencil-card").style.display="none";
})

document.querySelector(".pencil-card").addEventListener("mouseout", function(e){
    document.querySelector(".pencil-card").style.display="none";
})

pencil.addEventListener("click", function(e){
    if(!isPencilClicked){
    isPencilClicked=true;
    isEraserClicked=false;
    eraser.classList.remove("select");
    pencil.classList.add("select");
    document.querySelector(".eraser-card").style.display="none";
    document.querySelector(".pencil-card").style.display="block";
    }
    else{
        pencil.classList.remove("select");
        isPencilClicked=false;
    }
})


//$ Eraser

eraser.addEventListener("mouseover", function(e){
    if(isEraserClicked){
        document.querySelector(".eraser-card").style.display="flex";
    }else
        document.querySelector(".eraser-card").style.display="none";
})

eraser.addEventListener("mouseout", function(e){
    document.querySelector(".eraser-card").style.display="none";
})

document.querySelector(".eraser-card").addEventListener("mouseover", function(e){
    if(isEraserClicked){
        document.querySelector(".eraser-card").style.display="flex";
    }else
        document.querySelector(".eraser-card").style.display="none";
})

document.querySelector(".eraser-card").addEventListener("mouseout", function(e){
    document.querySelector(".eraser-card").style.display="none";
})

let allEraserSizes = eraser_size.querySelectorAll(".size");
for(let i=0;i<allEraserSizes.length;i++){
    allEraserSizes[i].addEventListener("click", function(e){
        if(isEraserClicked){
            if(e.target.classList.length==2){
                eraser_size.querySelector(".border").classList.remove("border");
                e.target.classList.add("border");
                ctx.globalCompositeOperation = "destination-out";
                if(e.target.classList[1][4]=='1'){
                    ctx.lineWidth=10;
                }else if(e.target.classList[1][4]=='2'){
                    ctx.lineWidth=25;
                }else{
                    ctx.lineWidth=50;
                }
            }
        }
    })
}

eraser.addEventListener("click", function(e){
    if(!isEraserClicked){
        isPencilClicked= false;
        isEraserClicked=true;
        eraser.classList.add("select");
        pencil.classList.remove("select");
        document.querySelector(".eraser-card").style.display="flex";
        document.querySelector(".pencil-card").style.display="none";
    }else{
        eraser.classList.remove("select");
        isEraserClicked=false;
    }
})


//$ DataBase

let startTime=0;
let DB=[];
let redoDB = [];
let line = [];


//$ canvas

canvas.addEventListener("mousedown", function(e){
    if(isPencilClicked||isEraserClicked){
        isMouseDown=true;
        let x = e.clientX;
        let y = e.clientY;

        ctx.beginPath();
        ctx.moveTo(x, y);
        redoDB = [];
        let pointObject;
        let d = new Date();
        let Time = d.getTime();

        if(isEraserClicked){
            pointObject = {
                pencil: false,
                type:"md",
                x:x,
                y:y,
                color:"#d9f8ab",
                width:ctx.lineWidth,
                time:Time-startTime
            }
        }
        else if(isPencilClicked){
            pointObject = {
                pencil: true,
                type:"md",
                x:x,
                y:y,
                color:ctx.strokeStyle,
                width:ctx.lineWidth,
                time:Time-startTime
            }
        }
        line.push(pointObject);   
    }
})

canvas.addEventListener("mousemove", function(e){
    if(isMouseDown){
        let x = e.clientX;
        let y = e.clientY;
        ctx.lineTo(x, y);
        ctx.stroke();
        let d= new Date();
        let Time = d.getTime(); 
        let pointObject = {
            type:"mv",
            x:x,
            y:y,
            time:Time-startTime
        }
        line.push(pointObject);
    }else{
        let x = e.clientX;
        let y = e.clientY;
        let d= new Date();
        let Time = d.getTime(); 
        let pointObject = {
            type:"mv1",
            x:x,
            y:y,
            time:Time-startTime
        }
        line.push(pointObject);
    }
})

canvas.addEventListener("mouseup", function(e){
    isMouseDown=false;
    DB.push(line);
    line=[];
    console.log(DB);
})


//$ Undo

undo.addEventListener("click", function(e){
    if(document.querySelector(".select")!=undefined)
    document.querySelector(".select").classList.remove("select");
    // undo.classList.add("select");

    redoDB.push(DB.pop());
    
    ctx.clearRect(0,0 , canvas.width , canvas.height);

    redrawLine();
})


function redrawLine(){
    ctx.lineCap = 'round';
    for(let i=0 ; i<DB.length ; i++){
        let line = DB[i];

        for(let j=0 ; j<line.length ; j++){

            let pointObject = line[j];
            if(pointObject.type=="md"){
                if(pointObject.pencil){
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = pointObject.color;
                }else{
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.strokeStyle = 'rgb(217, 248, 171)';
                }
                ctx.lineWidth = pointObject.width;
                ctx.beginPath();
                ctx.moveTo(pointObject.x , pointObject.y);
            }
            else{
                ctx.lineTo(pointObject.x , pointObject.y);
                ctx.stroke();
            }

        }
    }
}

//$ Redo

redo.addEventListener("click", function(e){
    if(document.querySelector(".select")!=undefined)
    document.querySelector(".select").classList.remove("select");
    // redo.classList.add("select");

    redoLine();
});

function redoLine(){
    if(redoDB.length >= 1){
        let line = redoDB.pop();
        console.log(line.length);
        for(let j=0 ; j < line.length; j++){
            let pointObject = line[j];
            console.log(pointObject);
            if(pointObject.type=="md"){
                if(pointObject.pencil){
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = pointObject.color;
                }else{
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.strokeStyle = "rgb(217, 248, 171)";
                }
                ctx.lineWidth = pointObject.width;
                ctx.beginPath();
                ctx.moveTo(pointObject.x , pointObject.y);
            }
            else{
                ctx.lineTo(pointObject.x , pointObject.y);
                ctx.stroke();
            }
        }
        DB.push(line);
    }
}


//$ Download

download.addEventListener("click" , function(){
    let canvasUrl = canvas.toDataURL({type:"image/png"});
    let aTag = document.createElement("a");
    aTag.download = "canvas.png";
    aTag.href = canvasUrl;
    aTag.click();
})


//$ Start Video



startVideo.addEventListener("click", function(e){
    let d = new Date();
    startTime = d.getTime(); 
    stopVideo.style.display="inline";
    startVideo.style.display="none";
    mediaRecorder.start();
})

//$ Stop Video

stopVideo.addEventListener("click", function(e){
    startTime=0;
    startVideo.style.display = "inline";
    stopVideo.style.display = "none";
    
    mediaRecorder.stop();
})

function saveVideo(){
    let txn = db.transaction("Media" , "readwrite");
    let mediaStore = txn.objectStore("Media");
    let blob = new Blob( [recordedData] , {type:"video/mp4"} );
    console.log(blob);
    let mediaFile = {
        mid : Date.now(),
        database:DB,
        video:blob
    }
    mediaStore.add(mediaFile);
}

//$ Gallery

gallery.addEventListener("click", function(e){
    window.location.assign("video.html");
})








