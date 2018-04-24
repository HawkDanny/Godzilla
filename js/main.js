
var bornRegular; //serif font used

//The length of the timeline, which is dependent on the width of the page
var timelineLength;
var timelineStrokeWeight = 2;
var timeLineStrikesStrokeWeight = 4;
var timeLineStrikesStrokeHeight = 20;
var timelinePadding = 50;
var spaceBetweenTimelines = 50;
var timelineTextPadding = 20;

//Timeline colors
var unactiveColor;
var hoverColor;
var activeColor;

//The video dom elements
var gojiraVid;
var godzillaVid;
var currentGojiraClipID = "#";
var currentGodzillaClipID = "#";

var gojiraLength = 0;
var godzillaLength = 0;

var gojiraClipData = new Array();
var godzillaClipData = new Array();

//The paragraph dom element
var quote;

function setup() {
  //Create the canvas and add it to the dom
  var cnv = createCanvas(min(windowWidth, 1200), 100);
  cnv.parent("sketch");

  //Get relevant timeline info
  timelineLength = max(0, width - timelinePadding * 2);

  unactiveColor = unhex("EE");
  hoverColor = unhex(["FF", "9B", "4F"]);
  activeColor = unhex(["FF", "49", "12"]);

  calcClipData();

  //Get the quote element from the page
  quote = document.querySelector("#quoteP");

  //Start the page on the titles so people know the difference between the films
  showClips("#gojira1", "#godzilla1");
  gojiraClipData[0].active = true;
  godzillaClipData[0].active = true;
}

function draw() {
  clear();
  background(unhex("11"));

  //Update and draw the timeline information each frame
  drawTimelines();

  checkMousePosition();
  
  restartIfComplete();
}

//Finds the specified video tags and plays their videos 
function showClips(gojiraClipID, godzillaClipID) {
  //Check if we're already playing the current clip. If not, then set the current clips
  if (currentGojiraClipID === gojiraClipID && currentGodzillaClipID === godzillaClipID)
    return;

  //Hide the previous clips (doesn't run on the first call of showClips)
  if (currentGojiraClipID !== "#" || currentGodzillaClipID !== "#") {
    if (currentGojiraClipID !== "#") //I am too tired to understand how to make this second check better. Feels really inefficient
      document.querySelector(currentGojiraClipID).style.display = "none";
    if (currentGodzillaClipID !== "#")
      document.querySelector(currentGodzillaClipID).style.display = "none";
  }

  //Pause and reset the previous videos
  /* TODO: Figure out how to use pause without destroying the play call
  if (currentGojiraClipID !== "#") {
    var pauseVid = document.querySelector(currentGojiraClipID);
    pauseVid.pause();
    pauseVid.currentTime = 0;
  }
  if (currentGodzillaClipID !== "#") {
    var pauseVid = document.querySelector(currentGodzillaClipID);
    pauseVid.pause();
    pauseVid.currentTime = 0;
  }*/

  currentGojiraClipID = gojiraClipID;
  currentGodzillaClipID = godzillaClipID;

  //Display the proper paragraph info
  if (currentGojiraClipID !== "#") {
    quote.innerHTML = gojiraClipData[parseInt(currentGojiraClipID.slice(7)) - 1].quote;
  } else {
    quote.innerHTML = godzillaClipData[parseInt(currentGodzillaClipID.slice(9)) - 1].quote;
  }


  //Play the videos
  if (gojiraClipID !== "#") {
    gojiraVid = document.querySelector(gojiraClipID);
    gojiraVid.style.display = "block";
    gojiraVid.currentTime = 0;
    gojiraVid.play();
  } else {
    gojiraVid = null;
  }
  if (godzillaClipID !== "#") {
    godzillaVid = document.querySelector(godzillaClipID);
    godzillaVid.style.display = "block";
    godzillaVid.currentTime = 0;
    godzillaVid.play();
  } else {
    godzillaVid = null;
  }
}

//If both videos have stopped, restart them
function restartIfComplete() {

  if (gojiraVid !== null && godzillaVid !== null) {
    if (gojiraVid.ended && godzillaVid.ended) {
      gojiraVid.play();
      godzillaVid.play();
    }
  } else if (gojiraVid === null) {
    if (godzillaVid.ended)
      godzillaVid.play();
  } else if (godzillaVid === null) {
    if (gojiraVid.ended)
      gojiraVid.play();
  }
}

//Updates the timelien information and then draws it
function drawTimelines() {
  var verticalAdjustment = (spaceBetweenTimelines / 2) - (timelineStrokeWeight / 2); //Math to separate the lines

  //Handle the film titles
  var gojiraTextWidth = textWidth("Godzilla (1954)");
  var godzillaTextWidth = textWidth("Godzilla (1956)");
  fill(unhex("EE"));
  textSize(18);
  textAlign(LEFT, CENTER);
  textFont("Born");
  text("Gojira (1954)", timelinePadding, height / 2 - verticalAdjustment);
  text("Godzilla (1956)", timelinePadding, height / 2 + verticalAdjustment);

  //Handle the lines
  noStroke();

  //GOJIRA
  var gojiraTimelineLength = timelineLength - gojiraTextWidth - timelinePadding - timelineTextPadding;
  var gojiraLengthOfSecond = gojiraTimelineLength / gojiraLength; //The length of one second in pixels for gojira
  var pixelsAlreadyCovered = 0;
  var deltaPixels = 0;
  var pixelBuffer = 0; //Used to buffer any pixels that weren't being accounted for when making sure no lines overlap
  rectMode(CORNER);
  fill(unhex("66"));
  rect(timelinePadding + gojiraTextWidth + timelineTextPadding, height / 2 - verticalAdjustment, gojiraTimelineLength, timelineStrokeWeight);
  rectMode(CENTER);
  for (var i = 0; i < gojiraClipData.length; i++) {
    //Set the rectData of the clip
    gojiraClipData[i].rectData = {
      x: timelinePadding + timelineTextPadding + gojiraTextWidth + pixelsAlreadyCovered,
      y: height / 2 - verticalAdjustment,
      width: timeLineStrikesStrokeWeight,
      height: timeLineStrikesStrokeHeight
    };

    fill(unactiveColor);
    //Change the color if necessary
    if (gojiraClipData[i].hovered)
      fill(hoverColor);
    if (gojiraClipData[i].active)
      fill(activeColor);
    
    //Draw the rectangle and update pixel information
    rect(gojiraClipData[i].rectData.x, gojiraClipData[i].rectData.y, gojiraClipData[i].rectData.width, gojiraClipData[i].rectData.height);

    deltaPixels = (gojiraLengthOfSecond * gojiraClipData[i].length) - pixelBuffer;
    if (deltaPixels < timelineStrokeWeight + 2) {
      pixelBuffer += deltaPixels;
      deltaPixels = timelineStrokeWeight + 3;
    } else {
      pixelBuffer = 0;
    }
    pixelsAlreadyCovered += deltaPixels;
  }

  //GODZILLA
  var godzillaTimelineLength = timelineLength - godzillaTextWidth - timelinePadding - timelineTextPadding;
  var godzillaLengthOfSecond = godzillaTimelineLength / godzillaLength; //The length of one second in pixels for godzilla
  pixelsAlreadyCovered = 0;
  deltaPixels = 0;
  pixelBuffer = 0; //Used to buffer any pixels that weren't being accounted for when making sure no lines overlap
  rectMode(CORNER);
  fill(unhex("66"));
  rect(timelinePadding + godzillaTextWidth + timelineTextPadding, height / 2 + verticalAdjustment, godzillaTimelineLength, timelineStrokeWeight);
  rectMode(CENTER);
  for (var i = 0; i < godzillaClipData.length; i++) {
    //Set the rectData of the clip
    godzillaClipData[i].rectData = {
      x: timelinePadding + timelineTextPadding + godzillaTextWidth + pixelsAlreadyCovered,
      y: height / 2 + verticalAdjustment,
      width: timeLineStrikesStrokeWeight,
      height: timeLineStrikesStrokeHeight
    };

    fill(unactiveColor);
    //Change the color if necessary
    if (godzillaClipData[i].hovered)
      fill(hoverColor);
    if (godzillaClipData[i].active)
      fill(activeColor);
    
    //Draw the rectangle and update pixel information
    rect(godzillaClipData[i].rectData.x, godzillaClipData[i].rectData.y, godzillaClipData[i].rectData.width, godzillaClipData[i].rectData.height);

    deltaPixels = (godzillaLengthOfSecond * godzillaClipData[i].length) - pixelBuffer;
    if (deltaPixels < timelineStrokeWeight + 2) {
      pixelBuffer += deltaPixels;
      deltaPixels = timelineStrokeWeight + 3;
    } else {
      pixelBuffer = 0;
    }
    pixelsAlreadyCovered += deltaPixels;
  }
}

//If the mouse is hovering over a rectangle, change its color
function checkMousePosition() {
  //GOJIRA
  var situationHandled = false; //If two scenes are overlapping, only show the leftmost scene
  var inGojira = false;
  for (var i = 0; i < gojiraClipData.length; i++) {
    if (gojiraClipData[i].contains(mouseX, mouseY)) {
      inGojira = true;
      if (!situationHandled)
        situationHandled = true;
      else
        return;

      gojiraClipData[i].hovered = true;
      if (gojiraClipData[i].relatedClipIndex !== -1)
        godzillaClipData[gojiraClipData[i].relatedClipIndex].hovered = true;
    }
    else {
      gojiraClipData[i].hovered = false;
      if (gojiraClipData[i].relatedClipIndex !== -1)
        godzillaClipData[gojiraClipData[i].relatedClipIndex].hovered = false;
    }
  }

  //If it's already being handled in Gojira, we don't need to check Godzilla
  if (inGojira === true)
    return;
  
  //GODZILLA
  situationHandled = false; //If two scenes are overlapping, only show the leftmost scene
  for (var i = 0; i < godzillaClipData.length; i++) {
    if (godzillaClipData[i].contains(mouseX, mouseY)) {
      if (!situationHandled)
        situationHandled = true;
      else
        return;

      godzillaClipData[i].hovered = true;
      if (godzillaClipData[i].relatedClipIndex !== -1)
        gojiraClipData[godzillaClipData[i].relatedClipIndex].hovered = true;
    }
    else {
      godzillaClipData[i].hovered = false;
      if (godzillaClipData[i].relatedClipIndex !== -1)
        gojiraClipData[godzillaClipData[i].relatedClipIndex].hovered = false;
    }
  }
}

function calcClipData() {

  //Loop through the gojira clips
  for (var i = 0; i < 35; i++) {
    var clip = document.querySelector("#gojira" + (i + 1));

    clip.onmouseenter = function() {
      this.muted = false;
    }
    clip.onmouseleave = function() {
      this.muted = true;
    }

    gojiraClipData[i] = {
      id: "#gojira" + (i + 1),
      length: clip.duration,
      quote: "", //Will be populated by hand later
      hovered: false, //if the clip is being hovered over
      active: false, //if the clip is active, then the color is changed
      rectData: null, //will contain the draw information for the clips rectangle
      contains: function(x, y) {
        var halfWidth = this.rectData.width / 2;
        var halfheight = this.rectData.height / 2;
        if ((x > this.rectData.x - halfWidth && x < this.rectData.x + halfWidth) && (y > this.rectData.y - halfheight && y < this.rectData.y + halfheight)) {
          return true;
        } else {
          return false;
        }
      }
    };

    gojiraLength += clip.duration;
  }

  //Loop through the godzilla clips
  for (var i = 0; i < 36; i++) {
    var clip = document.querySelector("#godzilla" + (i + 1));

    clip.onmouseenter = function() {
      this.muted = false;
    }
    clip.onmouseleave = function() {
      this.muted = true;
    }

    godzillaClipData[i] = {
      id: "#godzilla" + (i + 1),
      length: clip.duration,
      quote: "", //Will be populated by hand later
      hovered: false, //if the clip is being hovered over
      active: false, //if the clip is active, then the color is changed
      rectData: null, //will contain the draw information for the clips rectangle
      contains: function(x, y) {
        var halfWidth = this.rectData.width / 2;
        var halfheight = this.rectData.height / 2;
        if ((x > this.rectData.x - halfWidth && x < this.rectData.x + halfWidth) && (y > this.rectData.y - halfheight && y < this.rectData.y + halfheight)) {
          return true;
        } else {
          return false;
        }
      }
    };

    godzillaLength += clip.duration;
  }

  //Put in the links between clips by hand
  gojiraClipData[0].relatedClipIndex = 0;
  gojiraClipData[1].relatedClipIndex = 3;
  gojiraClipData[2].relatedClipIndex = -1;
  gojiraClipData[3].relatedClipIndex = 5;
  gojiraClipData[4].relatedClipIndex = 7;
  gojiraClipData[5].relatedClipIndex = 8;
  gojiraClipData[6].relatedClipIndex = -1;
  gojiraClipData[7].relatedClipIndex = 10;
  gojiraClipData[8].relatedClipIndex = -1;
  gojiraClipData[9].relatedClipIndex = 11;
  gojiraClipData[10].relatedClipIndex = 12;
  gojiraClipData[11].relatedClipIndex = 13;
  gojiraClipData[12].relatedClipIndex = 14;
  gojiraClipData[13].relatedClipIndex = 15;
  gojiraClipData[14].relatedClipIndex = 16;
  gojiraClipData[15].relatedClipIndex = 17;
  gojiraClipData[16].relatedClipIndex = 18;
  gojiraClipData[17].relatedClipIndex = 23;
  gojiraClipData[18].relatedClipIndex = 24;
  gojiraClipData[19].relatedClipIndex = -1;
  gojiraClipData[20].relatedClipIndex = -1;
  gojiraClipData[21].relatedClipIndex = -1;
  gojiraClipData[22].relatedClipIndex = 21;
  gojiraClipData[23].relatedClipIndex = 26;
  gojiraClipData[24].relatedClipIndex = 27;
  gojiraClipData[25].relatedClipIndex = 28;
  gojiraClipData[26].relatedClipIndex = 30;
  gojiraClipData[27].relatedClipIndex = 25;
  gojiraClipData[28].relatedClipIndex = 29;
  gojiraClipData[29].relatedClipIndex = -1;
  gojiraClipData[30].relatedClipIndex = 31;
  gojiraClipData[31].relatedClipIndex = 32;
  gojiraClipData[32].relatedClipIndex = 33;
  gojiraClipData[33].relatedClipIndex = 34;
  gojiraClipData[34].relatedClipIndex = 35;

  godzillaClipData[0].relatedClipIndex = 0;
  godzillaClipData[1].relatedClipIndex = -1;
  godzillaClipData[2].relatedClipIndex = -1;
  godzillaClipData[3].relatedClipIndex = 1;
  godzillaClipData[4].relatedClipIndex = -1;
  godzillaClipData[5].relatedClipIndex = 3;
  godzillaClipData[6].relatedClipIndex = -1;
  godzillaClipData[7].relatedClipIndex = 4;
  godzillaClipData[8].relatedClipIndex = 5;
  godzillaClipData[9].relatedClipIndex = -1; //TODO: IT'S IN THE ORIGINAL
  godzillaClipData[10].relatedClipIndex = 7;
  godzillaClipData[11].relatedClipIndex = 9;
  godzillaClipData[12].relatedClipIndex = 10;
  godzillaClipData[13].relatedClipIndex = 11;
  godzillaClipData[14].relatedClipIndex = 12;
  godzillaClipData[15].relatedClipIndex = 13;
  godzillaClipData[16].relatedClipIndex = 14;
  godzillaClipData[17].relatedClipIndex = 15;
  godzillaClipData[18].relatedClipIndex = 16;
  godzillaClipData[19].relatedClipIndex = -1;
  godzillaClipData[20].relatedClipIndex = -1;
  godzillaClipData[21].relatedClipIndex = 22;
  godzillaClipData[22].relatedClipIndex = 23;
  godzillaClipData[23].relatedClipIndex = 17;
  godzillaClipData[24].relatedClipIndex = 18;
  godzillaClipData[25].relatedClipIndex = 27;
  godzillaClipData[26].relatedClipIndex = 23;
  godzillaClipData[27].relatedClipIndex = 24;
  godzillaClipData[28].relatedClipIndex = 25;
  godzillaClipData[29].relatedClipIndex = 28;
  godzillaClipData[30].relatedClipIndex = 26;
  godzillaClipData[31].relatedClipIndex = 30;
  godzillaClipData[32].relatedClipIndex = 31;
  godzillaClipData[33].relatedClipIndex = 32;
  godzillaClipData[34].relatedClipIndex = 33;
  godzillaClipData[35].relatedClipIndex = 34;

  gojiraClipData[0].quote = godzillaClipData[0].quote = "On November 3rd, 1954, the film <i>Gojira</i>, directed by Ishiro Honda, was released in Japan. On April 27th, 1956, <i>Godzilla, King of the Monsters</i> was released in America. The American release was a complete re-edit of the original work, with additional scenes, starring Raymond Burr, spliced into the film.";
  gojiraClipData[1].quote = godzillaClipData[3].quote = '"What captured national attention was the Lucky Dragon Incident which took place in March 1954. The crew of a tuna fishing boat called the Lucky Dragon Five (Dai go fukuryu-maru) was accidentally exposed to nuclear fallous from the US testing of a hydrogen bomb on the Bikini atoll."<br><br><span style="color: #666666">When the Tsunami Came to Shore : Culture and Disaster in Japan, edited by Roy Starrs, BRILL, 2014.</span>';
  gojiraClipData[3].quote = godzillaClipData[5].quote = '"An early draft of Kayama\'s story began with the Lucky Dragon No. 5 returning to Japan, directly linking Godzilla\'s birth to America\'s hyrdogen bomb. Honda saw this monster not as an indictment of America, but as a symbol of a global threat, so he rewrote the scene. The vessel destroyed in the opening scene is a fictional one, though a lifebuoy on deck is labeled \'No. 5\'"<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[11].quote = godzillaClipData[13].quote = '"Putting a real-life accident into a story with a fictional monster would not be appropriate. Instead it became a matter of...the feeling that I was trying to create as a director. Namely, and invisible fear...the creation of the atomic bomb had become a universal problem. I felt this atomic fear would hang around our necks for eternity." - Ishiro Honda<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[15].quote = godzillaClipData[17].quote = '"Monsters are tragic beings. They\'re not bad [willingly]. They\'re born too tall, too strong, too heavy; that\'s their tragedy. They don\'t attack [mankind] voluntarily, but because of their physical dimensions they cause danger and grief; therefore man defends himself against them. After several stories of this type, the public finds sympathy for the monsters." - Ishiro Honda<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[16].quote = godzillaClipData[18].quote = '"Yamane names the monster after an Odo Island legend, simultansouly linking Godzilla to modern science and old mythology, and to America\'s atomic bomb and indigenous Japanese folklore and culture."<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[17].quote = godzillaClipData[23].quote = '"Much of Honda\'s footage was trimmed or deleted, including a darkly humorous discussion between subway passengers directly referencing both the Luck Dragon Indicent and the bombing of Nagasaki. These changes, and the elimination of a native Japanese context, had the effect (intentional or not) of depoliticizing the film and muting any perceived anti-Americanisms."<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[18].quote = godzillaClipData[24].quote = '"<i>Gojira</i> was not about war; it was about fear. Fear that war could happen again, fear that mankind was not in control."<br><br><span style="color: #666666">Tsutsui, William M., and Michiko Ito. In Godzilla\'s Footsteps : Japanese Pop Culture Icons on the Global Stage, Palgrave Macmillan, 2006. </span>'; //maybe use for ending scene
  gojiraClipData[22].quote = godzillaClipData[21].quote = '"I wanted to express my views about scientists. They might invent something wonderful, but they also must be responsible for how it is used. A good example is Alfred Nobel, for whom the Nobel Peace Prize is named. He invented dynamite for mining purposes, but in the end it was also used to kill people. That\'s why he created the award. It was his wish that [science] benefit and bring peace to humanity. Similarly, I wanted to warn people about what happens if we put our faith in science without considering the consequences." - Ishiro Honda<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[24].quote = godzillaClipData[27].quote = '"This movie, [Honda] pledged, must depict the attack of a giant monster as if it were a real event, with the seriousness of a documentary. Never mind that the very idea was absurd. There would be no trace of humor. No self-conscious joking."<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[27].quote = godzillaClipData[25].quote = '"In 1954, the concerted attack that the film portrays would have been possible only with the help of American forces. Nevertheless, the [Self-Defense Forces]...are solely responsible for the attacks against Godzilla. If the [monster] indeed embodied American nuclear threats, it is only logical that the Japanese forces alone should attack."<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[30].quote = godzillaClipData[31].quote = '"Many scenes in the film reminded the audience of aerial bombing of Japanese cities by B-29 bombers in the final months of the Pacific War. For example, on March 10, 1945, about one hundred thousand people in the Tokyo metropolitan area were burned to death within a few hours by 237,000 firebombs dropped from 334 B-29 bombers. An estimated one million lost their homes and were driven from the city."<br><br><span style="color: #666666">Jacobs, Robert. Filling the Hole in the Nuclear Future : Art and Popular Culture Respond to the Bomb, Lexington Books, 2010.</span>';
  gojiraClipData[31].quote = godzillaClipData[32].quote = '"It must have been very difficult to watch serious films that directly portrayed the horrors of war, reminding Japanese of their own wartime agony nine years earlier. Yet <i>Godzilla</i> allowed Japanese to heal their pain through watching an entertaining film, which at the same time indirectly reflected tormenting wartime experiences."<br><br><span style="color: #666666">Jacobs, Robert. Filling the Hole in the Nuclear Future : Art and Popular Culture Respond to the Bomb, Lexington Books, 2010.</span>';
  gojiraClipData[33].quote = godzillaClipData[34].quote = '"The film is made from the viewpoint that Godzilla itself is the victim."<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  gojiraClipData[34].quote = godzillaClipData[35].quote = '"In <i>Gojira</i> the loss of life is very clearly experienced as wrenching trauma, as grief to be ritually recognized and mourned by the nation."<br><br><span style="color: #666666">Tsutsui, William M., and Michiko Ito. In Godzilla\'s Footsteps : Japanese Pop Culture Icons on the Global Stage, Palgrave Macmillan, 2006.</span>';
  godzillaClipData[4].quote = '"Honda was unaware that <i>Godzilla</i> had been reedited overseas until Toho, adding insult to injury, brought <i>Godzilla, King of Monsters!</i> to Japan in May 1957 and released it in cinemas as <i>Monster King Godzilla (Kaiju o Gojira)</i>. Advertisements said this version was \'100 times more interesting\' than the original."<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';
  godzillaClipData[19].quote = '"Most Western film critics and scholars had no access to or knowledge of Honda\'s original cut until 2004, when it received a fiftieth anniversary release in American art-house cinemas. As a result, Honda\'s achievement was obscured, and the film was thought to be a typical exploitation movie."<br><br><span style="color: #666666">Ryfle, Steve, and Ed Godziszewski. Ishiro Honda : A Life in Film, from Godzilla to Kurosawa, Wesleyan University Press, 2017.</span>';



}

//The canvas is auto resized when the window is
function windowResized() {
  resizeCanvas(min(windowWidth, 1200), 100);

  timelineLength = max(0, width - timelinePadding * 2); //update this information
}

function mouseClicked() {
  var situationHandled = false; //If two scenes are overlapping, only show the leftmost scene
  var inGojira = false;
  for (var i = 0; i < gojiraClipData.length; i++) {
    if (gojiraClipData[i].contains(mouseX, mouseY)) {
      inGojira = true;
      if (!situationHandled)
        situationHandled = true;
      else
        return;

      gojiraClipData[i].active = true;
      if (gojiraClipData[i].relatedClipIndex !== -1) {
        showClips(gojiraClipData[i].id, godzillaClipData[gojiraClipData[i].relatedClipIndex].id);
        godzillaClipData[gojiraClipData[i].relatedClipIndex].active = true;
      } else {
        showClips(gojiraClipData[i].id, "#");
      }
    }
    else {
      gojiraClipData[i].active = false;
      if (gojiraClipData[i].relatedClipIndex !== -1)
        godzillaClipData[gojiraClipData[i].relatedClipIndex].active = false;
    }
  }

  //If it's already being handled in Gojira, we don't need to check Godzilla
  if (inGojira === true)
    return;

  //GODZILLA
  situationHandled = false; //If two scenes are overlapping, only show the leftmost scene
  for (var i = 0; i < godzillaClipData.length; i++) {
    if (godzillaClipData[i].contains(mouseX, mouseY)) {
      if (!situationHandled)
        situationHandled = true;
      else
        return;

      godzillaClipData[i].active = true;
      if (godzillaClipData[i].relatedClipIndex !== -1) {
        showClips(gojiraClipData[godzillaClipData[i].relatedClipIndex].id, godzillaClipData[i].id);
        gojiraClipData[godzillaClipData[i].relatedClipIndex].active = true;
      } else {
        showClips("#", godzillaClipData[i].id);
      }
    }
    else {
      godzillaClipData[i].active = false;
      if (godzillaClipData[i].relatedClipIndex !== -1)
        gojiraClipData[godzillaClipData[i].relatedClipIndex].active = false;
    }
  }
}