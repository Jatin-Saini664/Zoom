let canvas = document.getElementById("canvas");
let svg = document.querySelector("svg");
let video_container = document.querySelector(".video-container");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let ctx = canvas.getContext("2d");
ctx.lineCap = "round";
// ctx.strokeStyle="#ff0000";

let canvasDB=[];
let video;

function showMedia() {
    // assume db is open !!
    let txn = db.transaction("Media", "readonly");
    let mediaStore = txn.objectStore("Media");
    let cursorObject = mediaStore.openCursor();
  
    cursorObject.onsuccess = function (e) {
      let cursor = cursorObject.result;
      if (cursor) {
          
        let media = cursor.value;
        canvasDB = media.database;
        video = media.video;
        showDatabase();
        // cursor.continue();
      }
    };
}
// showMedia();



let iv = setInterval(function () {
    if (db) {
      showMedia();
      clearInterval(iv);
    }
}, 100);

function showDatabase(){
    let d = new Date();
    let startTime = d.getTime();
    let i=0, j=0;
    let line = canvasDB[i];
    if(line.length==0){
        i++;
        line = canvasDB[i];
    }
    console.log(line);
    let pointObject = line[j];
    let lastPointObject={};
    let Time=0;
    
    // console.log(svgele);

    // setTimeout(function(){
        let videoele = document.createElement("video");
        // let blob = new Blob([video], { type: "video/mp4" });
        let videoUrl = URL.createObjectURL(video);
        videoele.src = videoUrl;
        videoele.autoplay = "true";
        // videoele.loop = "false";
        // videoele.controls = "false";

        video_container.append(videoele);

        let v = setInterval(function(){
            let svgele = svg.getBoundingClientRect();
            if(pointObject.type=="md"){
                if(pointObject.pencil){
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = pointObject.color;
                }else{
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.strokeStyle = 'rgb(217, 248, 171)';
                }
                svg.style.left = svgele.x+(pointObject.x-svgele.x);
                svg.style.top = svgele.y+(pointObject.y-svgele.y);
                ctx.lineWidth = pointObject.width;
                ctx.beginPath();
                ctx.moveTo(pointObject.x , pointObject.y);
            }
            else if(pointObject.type=="mv"){
                svg.style.left = svgele.x+(pointObject.x-svgele.x);
                svg.style.top = svgele.y+(pointObject.y-svgele.y);
                ctx.lineTo(pointObject.x , pointObject.y);
                ctx.stroke();
            }else if(pointObject.type=="mv1"){
                svg.style.left = svgele.x+(pointObject.x-svgele.x);
                svg.style.top = svgele.y+(pointObject.y-svgele.y);
            }
            j+=1;
            if(j==line.length){
                i++;j=0;
                if(i==canvasDB.length)
                    clearInterval(v);
                line = canvasDB[i];
            }
            lastPointObject = pointObject;
            pointObject=line[j];
            console.log(line[j]);
        }, 25);
    // },);


    
}



