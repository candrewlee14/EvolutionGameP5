function CustomGraphSetupY() {
    this.checkBoxArray1 = new Array();
    let graphButton;
    let me = this;
    let checkBox1;
    let checkBox2;
    let checkBox3;
    let checkBox4;
    let checkBox5;
    this.dataColumns = [['id', false],
    ['sightDiameter', false],
    ['smellDiameter', false],
    ['maxAngleChange', false],
    ['diameter', false],
    ['speed', false],
    ['giveFoodToKidOnBirthProb', false],
    ['mutationFactor', false],
    ['parentId', false],
    ['birthFrame', false],
    ['deathFrame', false],
    ['foodEaten', false],
    ['childrenCount', false],
    ['lifespan',false]];
    this.dataColumnChosen = "";
    this.timer = 0;

    this.markAllUnchecked = function() {
        for (let i = 0; i < this.dataColumns.length; i++){
            this.dataColumns[i][1] = false;
        }
        this.enter();
    }

    this.setup = function () {
        

        
        ////
        /* checkBox1 = new Checkbox("Smell Diameter", 100, 70, 10, me.graphSmell);
        checkBox1.textColor = color(0, 150, 0);
        checkBox1.clickFunction = () => {
            me.graphSmell = checkBox1.bool;
            me.enter();
        };
        checkBox1.checkedColor = color(0, 150, 0);
        this.checkBoxArray1.push(checkBox1);

        checkBox2 = new Checkbox("Sight Diameter", 200, 70, 10, me.graphSight);
        checkBox2.textColor = color(200, 100, 200);
        checkBox2.clickFunction = () => {
            me.graphSight = checkBox2.bool;
            me.enter();
        };
        checkBox2.checkedColor = color(200, 100, 200);
        this.checkBoxArray1.push(checkBox2);

        checkBox3 = new Checkbox("Diameter", 300, 70, 10, me.graphDiameter);
        checkBox3.textColor = color(0, 100, 200);
        checkBox3.clickFunction = () => {
            me.graphDiameter = checkBox3.bool;
            me.enter();
        };
        checkBox3.checkedColor = color(0, 100, 200);
        this.checkBoxArray1.push(checkBox3);

        checkBox4 = new Checkbox("Diameter", 300, 70, 10, me.graphDiameter);
        checkBox4.textColor = color(0, 100, 200);
        checkBox4.clickFunction = () => {
            me.graphDiameter = checkBox4.bool;
            me.enter();
        };
        checkBox4.checkedColor = color(0, 100, 200);
        this.checkBoxArray1.push(checkBox4);

        checkBox5 = new Checkbox("Speed", 400, 70, 10, me.graphSpeed);
        checkBox5.textColor = color(255, 0, 0);
        checkBox5.clickFunction = () => {
            me.graphSpeed = checkBox5.bool;
            me.enter();
        };
        checkBox5.checkedColor = color(255, 0, 0);
        this.checkBoxArray1.push(checkBox5);

        checkBox6 = new Checkbox("Parent Lines", 500, 70, 10, me.drawParentLines);
        checkBox6.textColor = color(150, 150, 150);
        checkBox6.clickFunction = () => {
            me.drawParentLines = checkBox6.bool;
            me.enter();
        };
        checkBox6.checkedColor = color(150, 150, 150);
        this.checkBoxArray1.push(checkBox6);

        checkbox2 = new Checkbox();
        this.checkBoxArray1.push(checkBox1);
        this.checkBoxArray1.push(checkBox2); */

        
    }
    this.enter = function() {
        background(10,10,10);
        this.timer = 0;
        fill(255,255,255);
        rect(simWidth/4, simHeight/4-simHeight/8, simWidth/2, simHeight/8, 10, 10, 0, 0);
        fill(0,0,0);
        textSize(30);
        textAlign(CENTER,CENTER);
        text("Y Axis",simWidth/2, simHeight/16 * 3);

        fill(230, 230, 255);
        rect(simWidth / 4, simHeight / 4, simWidth / 2, simHeight / 2, 0, 0, 10, 10);

        
        let oAnimX = this.sceneManager.findScene(CustomGraphSetupX);
        let columnNameX = oAnimX.oScene.dataColumnChosen;
        for (let i = 0; i < this.dataColumns.length; i++){
            if (columnNameX == this.dataColumns[i][0]){
                this.dataColumns.splice(i,1);
            }
        }

        this.checkBoxArray1 = new Array();
        for (let i = 0; i < this.dataColumns.length; i++){
            let checkBox = new Checkbox(this.dataColumns[i][0],simWidth/4 +20, simHeight/4 + 10 + 35 * i,30,this.dataColumns[i][1]);
            checkBox.clickFunction = () => {
                this.markAllUnchecked();
                this.dataColumns[i][1] = checkBox.bool;
                if (checkBox.bool)
                    this.dataColumnChosen = this.dataColumns[i][0];
                else
                    this.dataColumnChosen = "";
                this.enter();
                }
            this.checkBoxArray1.push(checkBox);
        }

        for (let i = 0; i < this.checkBoxArray1.length; i++) {
            this.checkBoxArray1[i].display();
        }

        graphButton = new Button("GRAPH", simWidth/2, simHeight/2+simHeight/8, simWidth/4-simWidth/8, 50, color(60, 0, 0), color(100, 20, 20), color(240, 240, 240), () => me.sceneManager.showScene(CustomGraph));

    }
    this.draw = function () {
        this.timer++;
        for (let i = 0; i < this.checkBoxArray1.length; i++) {
            this.checkBoxArray1[i].handle();
        }
        if (this.dataColumnChosen != "" && this.timer > 25)
            graphButton.handleAndDraw();

    }

}