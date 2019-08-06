function Button(label,x,y,width,height,color,hoverColor,textColor,clickFunction){
    this.label = label;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.hoverColor = hoverColor;
    this.textColor = textColor;
    this.clickFunction = clickFunction;
    this.handleAndDraw = function(){
        let overButton = collidePointRect(mouseX, mouseY, this.x, this.y, this.width, this.height);
        if (overButton){
            fill(hoverColor);
            if (mouseIsPressed){
                clickFunction();
            }
        }else{
        fill(color);
        }
        rect(this.x, this.y, this.width, this.height,this.width/20,this.width/20,this.width/20,this.width/20);
        fill(textColor);
        textAlign(CENTER,CENTER);
        text(this.label, this.x + this.width/2, this.y + this.height/2);
        
        
    }

}