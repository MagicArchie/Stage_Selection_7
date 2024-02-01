let Bg_Img;
let nodeImages = [];
let nodeHoverImages = [];
let nodeGraphics = [];
let currentHoveredNode = -1;
const stageCount = 7; // Change the number of stages
const stages = [];
const nodeRadius = 65;
let marginX;
let score = 300;

let returnButtonImage;
let returnButtonSize = 80;
let returnButtonX = 20;
let returnButtonY = 20;

let firstNodeSound;
let lockedNodeSound;
let homeButtonSound;

let backgroundMusic;
let ProgressL = 777;

// Array to store links for each node
const nodeLinks = [
  'https://magicarchie.github.io/Stage_1F/',
  'https://magicarchie.github.io/Stage_2F/',
  'https://magicarchie.github.io/Stage_3F/',
  'https://magicarchie.github.io/Stage_4F/',
  'https://magicarchie.github.io/Stage_5F/',
  'https://magicarchie.github.io/Stage_6F/',
  'https://magicarchie.github.io/Stage_7F/'
];

let LocationS = parseInt(localStorage.getItem('PageL'), 10);

function preload() {
  //loadFont('Granesta.otf');
  
  firstNodeSound = loadSound('materials/sounds/notification.mp3');
  lockedNodeSound = loadSound('materials/sounds/chain.mp3');
  homeButtonSound = loadSound('materials/sounds/interface.mp3');
  backgroundMusic = loadSound('materials/sounds/Mid-Page 1.2.mp3');
  clickedRs = loadSound('materials/sounds/light-switch-156813.mp3');

  for (let i = 0; i < stageCount; i++) {
    const imagePath = `materials/images/Stg_${i + 1}G.png`;
    try {
      nodeImages.push(loadImage(imagePath));
      nodeHoverImages.push(loadImage(imagePath));
      console.log(`Image loaded successfully: ${imagePath}`);
    } catch (error) {
      console.error(`Error loading image: ${imagePath}`);
      console.error(error);
    }
  }

  try {
    returnButtonImage = loadImage('materials/images/Rt_Button.png');
    console.log('Return button image loaded successfully');
  } catch (error) {
    console.error('Error loading return button image');
    console.error(error);
  }

  try {
    Bg_Img = loadImage('materials/images/Background_Md.jpg');
    console.log('Background image loaded successfully');
  } catch (error) {
    console.error('Error loading background image');
    console.error(error);
  }
}

function setup() {
  createCanvas(1400, 800);
  textSize(24);
  textAlign(CENTER, CENTER);
  marginX = width / (stageCount + 1);
  
  Restart = createImg("materials/images/RstBt.png", "resetButton");
  Restart.size(70, 70);
  Restart.position(25, 110);
  Restart.mousePressed(progressR);
  
  Return = createImg("materials/images/Rt_Button.png", "resetButton");
  Return.size(80, 80);
  Return.position(20, 20);
  
  backgroundMusic.loop();
  backgroundMusic.setVolume(0.7);

  // Initialize stages with adjusted random heights
  for (let i = 0; i < stageCount; i++) {
    let nodeGraphic = createGraphics(nodeRadius * 2, nodeRadius * 2);
    nodeGraphic.image(nodeImages[i], 0, 0, nodeRadius * 2, nodeRadius * 2);
    nodeGraphics.push(nodeGraphic);

    stages.push({
      label: i + 1, // Display only the stage number
      link: nodeLinks[i], // Update the link for each stage
      y: random(height * 0.4, height * 0.8), // Adjusted random height between 50% and 80% of canvas height
      x: marginX * (i + 1), // Distribute nodes evenly from left to right
      interactive: true // Set interactivity to true for all nodes
    });
  }

  noLoop();
}

function progressR() {
  clickedRs.setVolume(0.1);
  clickedRs.play();
  localStorage.clear();
  setTimeout(function () {
    window.location.href = 'https://magicarchie.github.io/Art-Puzzles/';
  }, 400);
}

function drawSkillTree() {
  for (let i = 0; i < stages.length - 1; i++) {
    const x = stages[i].x;
    const y = stages[i].y;

    const isMouseOver = dist(mouseX, mouseY, x, y) < nodeRadius;

    // Change the appearance based on mouse hover and interactivity
    if (isMouseOver && stages[i].interactive) {
      currentHoveredNode = i;
      image(nodeGraphics[i], x - nodeRadius, y - nodeRadius);
    } else {
      currentHoveredNode = -1;
      image(nodeGraphics[i], x - nodeRadius, y - nodeRadius);
    }

    const nextX = stages[i + 1].x;
    const nextY = stages[i + 1].y;

    if (i <= 5) {
      // Make the first line a different color
      stroke(255); // White color
    } else {
      stroke(0); // Black color for all other lines
    }

    const lineStartX = x + nodeRadius * cos(atan2(nextY - y, nextX - x));
    const lineStartY = y + nodeRadius * sin(atan2(nextY - y, nextX - x));
    const lineEndX = nextX - nodeRadius * cos(atan2(nextY - y, nextX - x));
    const lineEndY = nextY - nodeRadius * sin(atan2(nextY - y, nextX - x));

    strokeWeight(5);
    line(lineStartX, lineStartY, lineEndX, lineEndY);
    strokeWeight(1);
  }

  const lastNode = stages[stages.length - 1];
  const lastX = lastNode.x;
  const lastY = lastNode.y;
  image(nodeGraphics[stages.length - 1], lastX - nodeRadius, lastY - nodeRadius);
}

function draw() {
  background(Bg_Img);
  
  fill(290, 120);
  strokeWeight(2);
  rect(15, 10, 90, 190, 130);

  //textFont('Granesta', 100);
  if (ProgressL > LocationS) {
    LocationS = ProgressL;
    localStorage.setItem('PageL', LocationS); 
  }

  // Draw the return button
  image(returnButtonImage, returnButtonX, returnButtonY, returnButtonSize, returnButtonSize);

  // Draw a rectangle behind the score text
  fill(255, 150);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, 60, 300, 70, 130);

  // Draw score text
  fill(0);
  textSize(35);
  textStyle(BOLD);
  text(`Score: ${score}`, width / 2, 60);

  // Draw the skill tree
  drawSkillTree();
}

function mouseClicked() {
  if (
    mouseX > returnButtonX &&
    mouseX < returnButtonX + returnButtonSize &&
    mouseY > returnButtonY &&
    mouseY < returnButtonY + returnButtonSize
  ) {
    homeButtonSound.play();

    setTimeout(function () {
      window.location.href = 'https://magicarchie.github.io/Art-Puzzles/';
    }, 500);
  } else {
    for (let i = 0; i < stages.length; i++) {
      const x = stages[i].x;
      const y = stages[i].y;
      const distance = dist(mouseX, mouseY, x, y);

      if (distance < nodeRadius && stages[i].interactive) {
        console.log(`Clicked Node ${i + 1}: ${stages[i].link}`);

        if (i < 7) {
          firstNodeSound.setVolume(0.1);
          firstNodeSound.play();
        }

        setTimeout(function () {
          window.location.href = stages[i].link;
        }, 1100);
      }
    }
  }
}

// Function to toggle interactivity of nodes
function toggleNodeInteractivity(nodeIndex, interactive) {
  if (nodeIndex >= 0 && nodeIndex < stages.length) {
    stages[nodeIndex].interactive = interactive;
  }
}

// Activate all nodes
for (let i = 0; i < stages.length; i++) {
  toggleNodeInteractivity(i, true);
}

function keyPressed() {
  // Check for the "`" key
  if (key === '`') {
    console.log("Backtick key pressed!");

    // Ask the user for a code
    const userCode = prompt("Enter a code:");

    // Check the entered code and redirect the user
    if (userCode === "+Stg-1") {
      console.log("Code +Stg-1 entered. Redirecting to StageSelection 1");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_1/";
    } else if (userCode === "+Stg-2") {
      console.log("Code +Stg-2 entered. Redirecting to StageSelection 2");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_2/";
    } else if (userCode === "+Stg-3") {
      console.log("Code +Stg-3 entered. Redirecting to StageSelection 3");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_3/";
    } else if (userCode === "+Stg-4") {
      console.log("Code +Stg-4 entered. Redirecting to StageSelection 4");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_4/";
    } else if (userCode === "+Stg-5") {
      console.log("Code +Stg-5 entered. Redirecting to StageSelection 5");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_5/";
    } else if (userCode === "+Stg-6") {
      console.log("Code +Stg-6 entered. Redirecting to StageSelection 6");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_6/";
    } else if (userCode === "+Stg-7") {
      console.log("Code +Stg-7 entered. Redirecting to StageSelection 7");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_7/";
    } else if (userCode === "+Stg-S") {
      console.log("Code +Stg-S entered. Redirecting to StageSelection S");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_Secret/";
    } else if (userCode === "+Stg-F") {
      console.log("Code +Stg-F entered. Redirecting to StageSelection F");
      window.location.href = "https://magicarchie.github.io/Stage_Selection_Finale/";
    } else {
      console.log("Invalid code. No redirection.");
    }
  }
}
