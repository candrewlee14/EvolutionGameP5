function Checkbox(label,x,y,size, bool){
    this.label = label;
    this.x = x;
    this.y = y;
    this.size = size;
    this.checkedColor = color(0,0,255);
    this.uncheckedColor = color(255,255,255);
    this.textColor = color(0,0,0);
    this.clickTimer = 0;
    this.clickFunction = () => {};

    if (bool != null)
        this.bool = bool;
    else 
        this.bool = false
    this.toggleCheck = function(){
        this.bool=!this.bool;
    }
    this.unCheck = function(){
        this.bool = true;
    }
    this.handleAndDraw = function(){
        
        stroke(0,0,0);
        strokeWeight(.2);
        this.clickTimer++;
        let overButton = collidePointRect(mouseX, mouseY, this.x, this.y, this.size, this.size);
        if (overButton && mouseIsPressed && this.clickTimer > 25){ 
            this.toggleCheck();
            console.log("Yes");
            this.clickTimer = 0;
            this.clickFunction();
        }    
        fill(this.uncheckedColor);
        rect(this.x,this.y,this.size,this.size,this.size/20,this.size/20,this.size/20,this.size/20);
        if (this.bool){
            fill(this.checkedColor);
        }
        else {
            fill(this.uncheckedColor);
        }
        noStroke();
        ellipse(this.x+this.size/2,this.y+this.size/2,this.size-2,this.size-2)
        textAlign(LEFT,TOP);
        textSize(this.size);
        textFont('Montserrat');
        fill(this.textColor);
        text(this.label, this.x + this.size + 10, this.y); 
        
        
    }
}