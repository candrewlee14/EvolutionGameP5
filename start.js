var mgr;
let container = this;
function preload(){}
function setup(){
    textFont('Montserrat');
    simWidth = window.windowWidth;
    simHeight = window.windowHeight;
    createCanvas(simWidth, simHeight);

    mgr = new SceneManager(container);
    mgr.wire();
    mgr.showScene(Intro);
    
}
