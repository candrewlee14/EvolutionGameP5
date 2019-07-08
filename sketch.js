let fr = 60;
let bug; // Declare object
let foodAmount = 10;
let foodArray = [];
let bugAmount = 10;
let bugArray = [];
let drawLine = true;
let scribble = new Scribble();
let mutationFactor = .2;
let foodRespawnRate = 60;
let foodNumForBaby = 3;
let lifespan = 10 * fr;



function setup() {
  frameRate(fr);
  noStroke();
  createCanvas(window.windowWidth, window.windowHeight);
  // Create object
  for (let i = 0; i < foodAmount; i++){
      foodArray.push(new Food(i));
    }
  for (let i = 0; i < bugAmount; i++){
      bugArray.push(new Jitter(i));
    }
  console.log(foodArray.length);
}

class Food{
 constructor(i) {
   this.index = i; 
    this.x = random(window.windowWidth/2-window.windowWidth/3,window.windowWidth/2+window.windowWidth/3);
   this.y = random(window.windowHeight/2-window.windowHeight/3,window.windowHeight/2+window.windowHeight/3); 
   this.size = random(10,20);
   this.color = [random(100,255),random(100,255),random(100,255),];
 }
  display() {
    fill(this.color[0],this.color[1],this.color[2]);
    
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  
}

function draw() {
  background(50, 89, 100);
  for (let i = 0; i < bugArray.length; i++){
    bugArray[i].display();
    bugArray[i].smellAndSeeAndTouch();
    bugArray[i].move();
    
  }
  for (let i = 0; i < foodArray.length; i++){
    foodArray[i].display();
  }
  if (frameCount%foodRespawnRate==0){
    foodAmount++;
    foodArray.push(new Food(foodArray.length-1));
  }
}

function compareNumbers(a, b) {
  return a.distance - b.distance;
}

function mutate(bug){
  bug.SightDiameter += random(-bug.SightDiameter*mutationFactor, bug.SightDiameter*mutationFactor);
  bug.SmellDiameter += random(-bug.SmellDiameter*mutationFactor, bug.SmellDiameter*mutationFactor);
  bug.maxAngleChange += random(-bug.maxAngleChange*mutationFactor, bug.maxAngleChange*mutationFactor);
  bug.diameter += random(-bug.diameter*mutationFactor, bug.diameter*mutationFactor);
  bug.speed += random(-bug.speed*mutationFactor, bug.speed*mutationFactor);
  return bug;
}

// Jitter class
class Jitter {
  constructor(i) {
    this.index = i;
    this.lifespan = lifespan;
    this.SightDiameter = random(40,90);
    this.SmellDiameter = random(100,200);
    this.x = random(0,window.windowWidth);
    this.y = random(0,window.windowHeight);
    this.angle = random(0, 2 * PI);
    this.maxAngleChange = 0.3;
    this.distance = 0;
    this.diameter = random(20,40);
    this.speed = random(1,3);
    this.i = 0;
    this.iEnd = 4;
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
  }

  reproduce(){
    if (this.foodStorage == foodNumForBaby){
      this.foodStorage = 0;
      bugAmount++;
      bugArray.push(this.clone());
      console.log(bugArray.length);
    }
  }

  decay(){
    this.lifespan-= sqrt(this.speed);
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
    }
  }

  getBodyColorByTraits(){
    let speed = this.speed * (255/5)
    let foodStorage = this.foodStorage * (255/6);
    return color(255, 255-speed,255-speed);
  }
  getHatColorByTraits(){
    let speed = this.speed * (255/10)
    let foodStorage = this.foodStorage * (255/5);
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
    newBug.SightDiameter = this.SightDiameter;
    newBug.SmellDiameter = this.SmellDiameter;
    newBug.x = this.x;
    newBug.y = this.y;
    newBug.maxAngleChange = this.maxAngleChange;
    newBug.diameter = this.diameter;
    newBug.speed = this.speed
    newBug.hatDiameter = newBug.diameter*2/3;
    return mutate(newBug);
  }
  move() {
    this.decay();
    this.reproduce();
    this.distance+=this.speed;
    this.x += this.convertPolarToXCoordinate();
    this.y += this.convertPolarToYCoordinate();
    this.distance = 0;
    this.i++;
    
    if (this.i == this.iEnd){
      this.angle += random(-this.maxAngleChange,this.maxAngleChange);
      this.i = 0;
    }

    if (this.x < 0){
      this.angle = 0;
      this.x = 0;
    }
    if (this.x > window.windowWidth){
      this.angle = PI;
      this.x = window.windowWidth;
    }
    if (this.y < 0){
      this.angle = 1/2 * PI;
      this.y = 0;
    }
    if (this.y > window.windowHeight){
      this.angle = 3/2 * PI;
      this.y = window.windowHeight;
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
            this.foodStorage++;           
            foodAmount--;
            foodArray.splice(this.foodDistArray[0].obj.index,1);
            this.foodDistArray.splice(0,1);
            for (let i = 0; i < foodAmount; i++){
              foodArray[i].index = i; 
            }
          }
          else {
            //if seen but not eaten
            this.angle = this.getAngle(this.foodDistArray[0].obj);
            this.color = color(0,70,150)
          }
        }
        else {
          //if smelled but not seen
          let smelledEdge = collidePointCircle(foodX,foodY, this.x, this.y, this.SmellDiameter - (this.speed*2))
          if (!smelledEdge){
              this.angle = this.getAngle(this.foodDistArray[0].obj);
          }
          this.color = color(255,255,0);
        }
      }
      else{
        //if none of those
        this.naturalColor = this.getBodyColorByTraits();
        this.color = this.naturalColor;      }
    }
    else {
      //if there is no more food
      this.naturalColor = this.getBodyColorByTraits();
      this.color = this.naturalColor;    }


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