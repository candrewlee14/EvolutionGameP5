function Intro(){
    var me = this;
    let startButton;
    this.setup= function(){
        textAlign(CENTER,CENTER);
        noStroke();
        textSize(simHeight/10);
        console.log(simWidth + "x" + simHeight);
        startButton = new Button("START", simWidth/4,simHeight/3,simWidth/2,simHeight/3, color(240,240,240), color(200, 200, 200), color(0,0,0), () => {me.sceneManager.showScene(Sim)});

    }
    this.draw = function(){
        background(100,100,150);
        startButton.handleAndDraw();
    }

}