let bug; // Declare object
let foodAmount = 10;
let foodArray = [];
let bugAmount = 10;
let bugArray = [];
let scribble = new Scribble();


function setup() {
  
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
    this.x = random(355-100,355+100);
   this.y = random(200-100,200+100); 
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
    bugArray[i].move();
    bugArray[i].display();
    bugArray[i].smellAndSee();
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
    this.x = random(width);
    this.y = random(height);
    this.angle = random(0,364);
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

    return degrees(inRads);
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
      this.angle = 270;
      this.x = 0;
    }
    if (this.x > 710){
      this.angle = 90;
      this.x = 710;
    }
    if (this.y < 0){
      this.angle = 0;
      this.y = 0;
    }
    if (this.y > 400){
      this.angle = 180;
      this.y = 400;
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
    
  }
         

  display() {
    fill(120,120,120, 100);    
    ellipse(this.x,this.y, this.SmellDiameter, this.SmellDiameter);
    fill(160,160,160, 100);
    ellipse(this.x,this.y, this.SightDiameter, this.SightDiameter);
    
    fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);

    
  }
}