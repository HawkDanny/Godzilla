/**
 * loadVideos.js makes an xhr request for each video clip
 * in order to force the webpage to load the videos.
 * 
 * DOESN'T WORK.
 */

let numGojiraVideosLoaded = 0;

let gojiraSources = new Array(35);

//Gojira
for (let i = 0; i < 35; i++) {
    let req = new XMLHttpRequest();
    req.open("GET", "./media/video/gojira/" + (i + 1) + ".mp4", true);
    req.responseType = "blob"; //A blob responsetype is "a Blob object containing the binary data". Neat!
    req.i = i; //THIS FEELS DIRTY. JUST SLIPPING IN THE INDEX DATA INTO REQ, TO BE USED ON THE CALLBACK

    req.onload = function() {
        if (this.status === 200) {
            let videoBlob = this.response;
            let vid = URL.createObjectURL(videoBlob); // IE10+
            //Now the video is downloaded

            ++numGojiraVideosLoaded; //Check off another downlaoded video

            //gojiraSources[this.i] = vid;
        }
    }
    req.onerror = function() {
        console.log("There was an error");
    }
    req.send();
}

//Don't move on until the videos are loaded
while (true) {
    if (numGojiraVideosLoaded < 35) {
        console.log(numGojiraVideosLoaded);
        continue;
    }
    else
        break;
}

