function preload(){}
function setup(){
    simWidth = window.windowWidth;
    simHeight = window.windowHeight;
    createCanvas(simWidth, simHeight);

    var mgr = new SceneManager();
    mgr.wire();
    mgr.showScene(Sim);
    
}