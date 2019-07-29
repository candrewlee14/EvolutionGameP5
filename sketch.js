
let fr = 60;
let bug; // Declare object
let foodAmount = 10;
let foodArray = [];
let bugAmount = 10;
let bugArray = [];
let drawLine = true;
let scribble = new Scribble();
let defaultMutationFactor = .2;
let foodRespawnRate = 60;
let foodNumForBaby = 3;
let lifespan = 25 * fr;
let foodLifespanFactor = 120;
let blindTimer = 200;
let defaultGiveFoodToKidOnBirthProb = 1;
let mutateMutationFactor = true;
let totalBugs = 0;
let simWidth;
let simHeight;

let globalsTable = new p5.Table();



let bugTable = new p5.Table();



function boolFromProb(p){
  if (random(0,1) <= p)
    return true;
  else
    return false;
}

function setup() {
  frameRate(fr);
  noStroke();

globalsTable.addColumn('startingFoodAmount');
globalsTable.addColumn('startingBugAmount');
globalsTable.addColumn('framerate');
globalsTable.addColumn('lifespan');
globalsTable.addColumn('foodRespawnRate');
globalsTable.addColumn('foodNumForBaby');
globalsTable.addColumn('defaultGiveFoodToKidOnBirthProb');
globalsTable.addColumn('mutationFactor');
globalsTable.addColumn('mutateMutationFactor');
globalsTable.addColumn('blindTimer');
globalsTable.addColumn('simWidth');
globalsTable.addColumn('simHeight');
let newGRow = globalsTable.addRow();
newGRow.setNum('startingFoodAmount',foodAmount);
newGRow.setNum('startingBugAmount',bugAmount);
newGRow.setNum('framerate',fr);
newGRow.setNum('lifespan',lifespan);
newGRow.setNum('foodRespawnRate',foodRespawnRate);
newGRow.setNum('foodNumForBaby',foodNumForBaby);
newGRow.setNum('defaultGiveFoodToKidOnBirthProb',defaultGiveFoodToKidOnBirthProb);
newGRow.setNum('mutateMutationFactor',mutateMutationFactor);
newGRow.setNum('blindTimer',blindTimer);
newGRow.setNum('simWidth',simWidth);
newGRow.setNum('simHeight',simHeight);

bugTable.addColumn('id');
bugTable.addColumn('sightDiameter');
bugTable.addColumn('smellDiameter');
bugTable.addColumn('maxAngleChange');
bugTable.addColumn('diameter');
bugTable.addColumn('speed');
bugTable.addColumn('giveFoodToKidOnBirthProb');
bugTable.addColumn('mutationFactor');
bugTable.addColumn('parentId');
bugTable.addColumn('birthFrame');
bugTable.addColumn('deathFrame');
bugTable.addColumn('foodEaten');
bugTable.addColumn('childrenCount');
  simWidth = window.windowWidth;
  simHeight = window.windowHeight;
  createCanvas(simWidth, simHeight);
  // Create object
  for (let i = 0; i < foodAmount; i++){
      foodArray.push(new Food(i));
    }
  for (let i = 0; i < bugAmount; i++){
      bugArray.push(new Jitter(i, i));
    }
  console.log(foodArray.length);
}

class Food{
 constructor(i) {
   this.index = i; 
    this.x = random(simWidth/2-simWidth/3,simWidth/2+simWidth/3);
   this.y = random(simHeight/2-simHeight/3,simHeight/2+simHeight/3); 
   this.size = random(10,20);
   this.color = [random(100,255),random(100,255),random(100,255),];
   this.timer = 0;
   this.nutritionalValue = this.size/10;
 }
  display() {
    fill(this.color[0],this.color[1],this.color[2]);
    this.timer++;
    if (this.timer<this.size)
      ellipse(this.x,this.y,this.timer,this.timer);
    else
      ellipse(this.x, this.y, this.size, this.size);
  }
}

function draw() {
  background(50, 89, 100);
  for (let i = 0; i < bugAmount; i++){
    bugArray[i].display();
    bugArray[i].smellAndSeeAndTouch();
    bugArray[i].move();
    
  }
  if (bugAmount==0){
    save(globalsTable,'globalsTable.csv');
    save(bugTable,'bugTable.csv');
    noLoop();
  }
  for (let i = 0; i < foodArray.length; i++){
    foodArray[i].display();
  }
  if (frameCount%foodRespawnRate==0){
    foodAmount++;
    foodArray.push(new Food(foodArray.length-1));
    for (let i = 0; i < foodAmount; i++){
      foodArray[i].index = i; 
    }
  }

}

function compareNumbers(a, b) {
  return a.distance - b.distance;
}

function addBugToTable(bug,mutated){
  let newRow;
  if (!mutated)
    newRow = bugTable.addRow();
  else
    newRow = bugTable.getRow(bug.id-1);
  newRow.setNum('id',bug.id);
  newRow.setNum('sightDiameter',bug.SightDiameter);
  newRow.setNum('smellDiameter',bug.SmellDiameter);
  newRow.setNum('maxAngleChange',bug.maxAngleChange);
  newRow.setNum('diameter',bug.diameter);
  newRow.setNum('speed',bug.speed);
  newRow.setNum('giveFoodToKidOnBirthProb',bug.giveFoodToKidOnBirthProb);
  newRow.setNum('mutationFactor',bug.mutationFactor);
  newRow.setNum('parentId',bug.parentId);
  newRow.setNum('birthFrame',frameCount);
  newRow.setString('deathFrame','living');
  newRow.setNum('foodEaten', bug.foodParticlesEaten);
  newRow.setNum('childrenCount',bug.childrenCount);
}

// Jitter class
class Jitter {
  constructor(i) {
    this.parentId=0;
    this.id = totalBugs+1;
    totalBugs++;
    this.childrenCount = 0;
    this.mutationFactor = defaultMutationFactor;
    this.giveFoodToKidOnBirthProb = defaultGiveFoodToKidOnBirthProb;
    this.index = i;
    this.lifespan = lifespan;
    this.SightDiameter = random(40,90);
    this.SmellDiameter = random(100,200);
    this.foodParticlesEaten = 0;
    this.x = random(0,simWidth);
    this.y = random(0,simHeight);
    this.angle = random(0, 2 * PI);
    this.maxAngleChange = 0.3;
    this.distance = 0;
    this.diameter = random(20,40);
    this.speed = random(1,3);
    this.timer = 0;
    this.turnEnd = 4;
    this.color = color(255,255,255);
    this.closestFood = new Array(1);
    this.distanceFromClosestFood = 0;
    this.foodDistArray= new Array(foodAmount);
    this.foodStorage = 0;
    this.strokeColor = color(0,0,0);
    this.naturalColor = color(255,255,255);
    this.hatDiameter = this.diameter*2/3;
    this.hatColor = color(0,0,0);
    this.alive = true;
    //table stuff
    addBugToTable(this, false);
  }

  mutate(bug){
    bug.SightDiameter += random(-bug.SightDiameter*this.mutationFactor, bug.SightDiameter*this.mutationFactor);
    bug.SmellDiameter += random(-bug.SmellDiameter*this.mutationFactor, bug.SmellDiameter*this.mutationFactor);
    bug.maxAngleChange += random(-bug.maxAngleChange*this.mutationFactor, bug.maxAngleChange*this.mutationFactor);
    bug.diameter += random(-bug.diameter*this.mutationFactor, bug.diameter*this.mutationFactor);
    bug.speed += random(-bug.speed*this.mutationFactor, bug.speed*this.mutationFactor);
    bug.giveFoodToKidOnBirthProb += random(-bug.giveFoodToKidOnBirthProb*this.mutationFactor, bug.giveFoodToKidOnBirthProb*this.mutationFactor)
    if (bug.giveFoodToKidOnBirthProb <0)
      bug.giveFoodToKidOnBirthProb = 0;
      if (bug.giveFoodToKidOnBirthProb >1)
      bug.giveFoodToKidOnBirthProb = 1;
    if (mutateMutationFactor){
      bug.mutationFactor += random(-bug.mutationFactor* this.mutationFactor, bug.mutationFactor* this.mutationFactor);}
    addBugToTable(bug,true);
    return bug;
  }

  reproduce(){
    if (this.foodStorage >= foodNumForBaby){
      this.foodStorage -= foodNumForBaby;
      this.childrenCount++;
      let row = bugTable.getRow(this.id-1);
      row.setNum('childrenCount',this.childrenCount);
      bugAmount++;
      bugArray.push(this.clone());
      //console.log(bugArray.length);
    }
  }

  decay(){
    this.lifespan-= this.energySpent();
    if (this.lifespan <=0 && this.lifespan > -60){
      this.speed = 0;
      this.lifespan -= 1;
      this.SightDiameter/=1.1;
      this.SmellDiameter/=1.1;
      this.hatDiameter/=1.1;
      this.diameter/=1.1;
      this.alive = false;
    }
    if (this.lifespan<=-60){
      bugAmount--;
      bugArray.splice(this.index,1);
      for (let i = 0; i < bugAmount; i++){
        bugArray[i].index = i;
      }
      let row = bugTable.getRow(this.id-1);
      row.setNum('deathFrame',frameCount);
    }
  }

  getBodyColorByTraits(){
    let speed = this.speed * (255/5);
    return color(255, 255-speed,255-speed);
  }
  getHatColorByTraits(){
    let foodStorage = this.foodStorage * (255/3);
    return color(255-foodStorage, 255,255-foodStorage);
  }
  getAngle(food) {
    let dx = (food.x - this.x);
    // Minus to correct for coord re-mapping
    let dy = -(food.y - this.y);

    let inRads = atan2(dy, dx);
    if (inRads < 0)
        inRads = abs(inRads);
    else
        inRads = 2 * PI - inRads;

    return inRads;
}
  
  convertPolarToXCoordinate() {
    return cos(this.angle) * this.distance;
  }
  convertPolarToYCoordinate() {
    return sin(this.angle) * this.distance;
  }
  clone() {
    let newBug = new Jitter();
    newBug.parentId = this.id;
    newBug.giveFoodToKidOnBirthProb = this.giveFoodToKidOnBirthProb;
    newBug.mutationFactor = this.mutationFactor;
    newBug.SightDiameter = this.SightDiameter;
    newBug.SmellDiameter = this.SmellDiameter;
    newBug.x = this.x;
    newBug.y = this.y;
    newBug.maxAngleChange = this.maxAngleChange;
    newBug.diameter = this.diameter;
    newBug.speed = this.speed
    newBug.hatDiameter = newBug.diameter*2/3;
    if (boolFromProb(this.giveFoodToKidOnBirthProb)){
      newBug.foodStorage = this.foodStorage;
      this.foodStorage = 0;
    }
    return this.mutate(newBug);
  }
  energySpent(){
    let energy = sqrt(sqrt(this.speed) + sqrt((this.SightDiameter+this.SmellDiameter)/2) + sqrt(this.diameter)/2)/2; 
    return energy;
  }
  move() {
    this.decay();
    this.reproduce();
    this.distance+=this.speed;
    this.x += this.convertPolarToXCoordinate();
    this.y += this.convertPolarToYCoordinate();
    this.distance = 0;
    this.timer++;
    
    if (this.timer % this.turnEnd == 0){
      this.angle += random(-this.maxAngleChange,this.maxAngleChange);
    }

    if (this.x < 0){
      this.angle = 0;
      this.x = 0;
    }
    if (this.x > simWidth){
      this.angle = PI;
      this.x = simWidth;
    }
    if (this.y < 0){
      this.angle = 1/2 * PI;
      this.y = 0;
    }
    if (this.y > simHeight){
      this.angle = 3/2 * PI;
      this.y = simHeight;
    }
    
  }
   
  smellAndSeeAndTouch(){
    for (let i = 0; i < foodArray.length; i++)
    {
      let dist = sqrt(sq(this.x - foodArray[i].x ) + sq(this.y - foodArray[i].y));
      this.foodDistArray[i] = {distance: dist, obj: foodArray[i]};
    }
    this.foodDistArray.sort(compareNumbers);
    if (foodAmount > 0){
      let foodX = this.foodDistArray[0].obj.x;
      let foodY = this.foodDistArray[0].obj.y;
      let smelled = collidePointCircle(foodX,foodY, this.x, this.y, this.SmellDiameter);
      if (smelled){
        let seen = collidePointCircle(foodX,foodY, this.x, this.y, this.SightDiameter);
        if (seen){
          let eaten = collidePointPoint(foodX, foodY, this.x, this.y, this.diameter/2);
          if (eaten){
            //if eaten
            this.color = color(0,0,0);   
            this.foodStorage+=this.foodDistArray[0].obj.nutritionalValue;  
            this.foodParticlesEaten++;
            this.lifespan+=this.foodDistArray[0].obj.nutritionalValue * foodLifespanFactor;          
            foodAmount--;
            foodArray.splice(this.foodDistArray[0].obj.index,1);
            console.log(foodAmount);
            this.foodDistArray.splice(0,1);
            for (let i = 0; i < foodAmount; i++){
              foodArray[i].index = i; 
            }
            let row = bugTable.getRow(this.id-1);
            row.setNum('foodEaten',this.foodParticlesEaten);
          }
          else {
            //if seen but not eaten
            this.angle = this.getAngle(this.foodDistArray[0].obj);
            if (sqrt(sq(this.x-this.foodDistArray[0].obj.x)+sq(this.y-this.foodDistArray[0].obj.y))<this.speed)
            {
              this.x = this.foodDistArray[0].obj.x;
              this.y = this.foodDistArray[0].obj.y;
            }

            this.color = color(0,70,150)
          }
        }
        else {
          //if smelled but not seen
          let smelledEdge = collidePointCircle(foodX,foodY, this.x, this.y, this.SmellDiameter - (this.speed*2))
          if (!smelledEdge||frameCount%40 == 0){
              this.angle = this.getAngle(this.foodDistArray[0].obj);
          }
          this.color = color(255,255,0);
        }
      }
      else{
        //if none of those
        this.naturalColor = this.getBodyColorByTraits();
        this.color = this.naturalColor;      
        if (this.timer%blindTimer == 0){
          this.angle = this.getAngle(this.foodDistArray[0].obj) + random(-HALF_PI/2,HALF_PI/2);
        }
      }
    }
    else {
      //if there is no more food
      this.naturalColor = this.getBodyColorByTraits();
      this.color = this.naturalColor;     
    }
  }

  display() {
    fill(120,120,120, 100);    
    ellipse(this.x,this.y, this.SmellDiameter, this.SmellDiameter);
    if (this.alive){
      fill(120,120,120,70);
      arc(this.x,this.y,this.SmellDiameter,this.SmellDiameter,0,(this.lifespan/lifespan)*TWO_PI, PIE);
    }
    fill(160,160,160, 100);
    ellipse(this.x,this.y, this.SightDiameter, this.SightDiameter);
    if (drawLine&&this.alive){
      this.linex = this.x + cos(this.angle) * (this.diameter+20);
      this.liney = this.y + sin(this.angle) * (this.diameter+20);
      strokeWeight(1);
      stroke(0,0,0);
      line(this.x,this.y,this.linex,this.liney);
      noStroke();
    }
    fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    this.hatColor = this.getHatColorByTraits();
    fill(this.hatColor);
    ellipse(this.x,this.y,this.hatDiameter, this.hatDiameter);
    
    
  }
}