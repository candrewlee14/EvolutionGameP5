function CustomGraphSetup() {
    let checkBoxArray = new Array();
    this.setup = function(){
        fill(200,200,250);
        rect(simWidth/4,simHeight/4,simWidth/2,simHeight/2, 10,10,10,10);
        checkBoxTest = new Checkbox("Yeet",simWidth/4 + 20,simHeight/4 + 20, 10,true);
        checkBoxArray.push(checkBoxTest);
    }
    this.draw = function(){
        checkBoxTest.handleAndDraw();

    }
    function markAllUnchecked(){
        
    }
}