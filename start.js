var mgr;
function preload(){}
function setup(){
    simWidth = window.windowWidth;
    simHeight = window.windowHeight;
    createCanvas(simWidth, simHeight);

    mgr = new SceneManager();
    mgr.wire();
    mgr.showScene(Intro);
    
}
function mousePressed()
{
    mgr.handleEvent("mousePressed");
}
