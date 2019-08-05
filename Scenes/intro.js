function Intro(){
    var me = this;
    this.setup= function(){
        textAlign(CENTER,CENTER);
        noStroke();
        textSize(simHeight/10);
        console.log(simWidth + "x" + simHeight);

    }
    this.draw = function(){
        background(100,100,150);
        fill(255,255,255);
        rect(simWidth/4,simHeight/3,simWidth/2,simHeight/3);
        fill(0,0,0);
        text("START",simWidth/2,simHeight/2);

        let touchButton = collidePointRect(mouseX,mouseY,simWidth/4,simHeight/3,simWidth/2,simHeight/3);
        if (mouseIsPressed && touchButton){
            me.sceneManager.showScene(Sim);
        }
    }

}