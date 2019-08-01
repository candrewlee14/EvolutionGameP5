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