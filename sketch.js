let bug; // Declare object
let foodAmount = 10;
let foodArray = [];
let bugAmount = 1;
let bugArray = [];
let drawLine = true;
let scribble = new Scribble();
let fr = 100;


function setup() {
  frameRate(fr);
  noStroke();
  createCanvas(window.windowWidth, window.windowHeight);
  // Create object
  for (let i = 0; i < foodAmount; i++){
      foodArray.push(new Food(i));
    }
  for (let i = 0; i < bugAmount; i++){
      bugArray.push(new Jitter());
    }
  console.log(foodArray.length);
}

class Food{
 constructor(i) {
   this.index = i; 
    this.x = random(window.windowWidth/2-100,window.windowWidth/2+100);
   this.y = random(window.windowHeight/2-100,window.windowHeight/2+100); 
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
  fill(255,255,255);
  text(mouseX + ", " + mouseY, 100,100,200,200)
  for (let i = 0; i < bugArray.length; i++){
    bugArray[i].move();
    bugArray[i].display();
    bugArray[i].smellAndSeeAndTouch();
  }
  for (let i = 0; i < foodArray.length; i++){
    foodArray[i].display();
  }
}

function compareNumbers(a, b) {
  return a.distance - b.distance;
}

// Jitter class
class Jitter {
  constructor() {
    this.SightDiameter = random(40,90);
    this.SmellDiameter = random(100,200);
    this.x = random(0,window.windowWidth);
    this.y = random(0,window.windowHeight);
    this.angle = random(0, 2 * PI);
    this.maxAngleChange = 0.3;
    this.distance = 0;
    this.diameter = random(20,40);
    this.speed = 1;
    this.i = 0;
    this.iEnd = 4;
    this.color = color(255,255,255);
    this.closestFood = new Array(1);
    this.distanceFromClosestFood = 0;
    this.foodDistArray= new Array(foodAmount);
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
  
  move() {
    
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
  smellAndSee() {
    for (let i = 0; i < foodArray.length; i++)
    {
      let dist = sqrt(sq(this.x - foodArray[i].x ) + sq(this.y - foodArray[i].y));
      this.foodDistArray[i] = {distance: dist, obj: foodArray[i]};
    }
    this.foodDistArray.sort(compareNumbers);
    if (this.foodDistArray.length > 0){
    //if inside smell
    if (this.foodDistArray[0].distance < (this.SmellDiameter/2)+5)
    {
      //if touching edge of smell
      if (this.foodDistArray[0].distance > (this.SmellDiameter/2)-5)
         {this.color = color(0,255,0); 
          this.angle = this.getAngle(this.foodDistArray[0].obj);
         }
      else
      { //if inside sight
        if (this.foodDistArray[0].distance < (this.SightDiameter/2)+5){
          if (this.foodDistArray[0].distance > (this.SightDiameter/2)-5){
            //this.angle = this.getAngle();
            this.color = color(255,0,255); //if touching edge of sight
            this.angle = this.getAngle(this.foodDistArray[0].obj);
          }
          else{
            if (this.foodDistArray[0].distance < (this.diameter)/2){
              this.color = color(0,0,0); // if touching/inside bug
              foodAmount--;
              foodArray.splice(this.foodDistArray[0].obj.index,1);
              this.foodDistArray.splice(0,1);
              for (let i = 0; i < foodAmount; i++){
                 foodArray[i].index = i; 
              }
            }
            else{
            this.color = color(0,70,150); //if inside sight
            }
          }
        }
        else {
          this.color = color(255,255,0); //if inside smell
          }
        }
      }
    else{
       this.color = color(255,255,255); 
    }
    }
    else {
      this.color = color(255,255,255)
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
          let smelledEdge = collidePointCircle(foodX,foodY, this.x, this.y, this.SmellDiameter - 5);
          if (!smelledEdge){
              this.angle = this.getAngle(this.foodDistArray[0].obj);
          }
          this.color = color(255,255,0);
        }
      }
      else{
        //if none of those
        this.color = color(255,255,255);
      }
    }
    else {
      //if there is no more food
      this.color = color(255,255,255);
    }


  }

  display() {
    fill(120,120,120, 100);    
    ellipse(this.x,this.y, this.SmellDiameter, this.SmellDiameter);
    fill(160,160,160, 100);
    ellipse(this.x,this.y, this.SightDiameter, this.SightDiameter);
    if (drawLine){
      this.linex = this.x + cos(this.angle) * (this.diameter+20);
      this.liney = this.y + sin(this.angle) * (this.diameter+20);
      strokeWeight(1);
      stroke(0,0,0);
      line(this.x,this.y,this.linex,this.liney)
      noStroke();
    }
    text(this.angle,100,130);
    fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);

    
  }
}