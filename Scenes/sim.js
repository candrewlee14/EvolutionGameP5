function Sim() {


    this.fr = 60;
    this.bug; // Declare object
    this.foodAmount = 10;
    this.foodArray = [];
    this.bugAmount = 10;
    this.bugArray = [];
    this.drawLine = true;
    this.defaultMutationFactor = .2;
    this.foodRespawnRate = 60;
    this.foodNumForBaby = 3;
    this.lifespan = 25 * this.fr;
    this.foodLifespanFactor = 120;
    this.blindTimer = 200;
    this.defaultGiveFoodToKidOnBirthProb = 1;
    this.mutateMutationFactor = true;
    this.totalBugs = 0;
    this.simWidth;
    this.simHeight;
    this.customLoop = true;
    this.playing = true;

    this.globalsTable = new p5.Table();



    this.bugTable = new p5.Table();

    let self = this;

    this.globalsTable.addColumn('startingFoodAmount');
    this.globalsTable.addColumn('startingBugAmount');
    this.globalsTable.addColumn('framerate');
    this.globalsTable.addColumn('lifespan');
    this.globalsTable.addColumn('foodRespawnRate');
    this.globalsTable.addColumn('foodNumForBaby');
    this.globalsTable.addColumn('defaultGiveFoodToKidOnBirthProb');
    this.globalsTable.addColumn('mutationFactor');
    this.globalsTable.addColumn('mutateMutationFactor');
    this.globalsTable.addColumn('blindTimer');
    this.globalsTable.addColumn('simWidth');
    this.globalsTable.addColumn('simHeight');
    let newGRow = this.globalsTable.addRow();
    newGRow.setNum('startingFoodAmount', this.foodAmount);
    newGRow.setNum('startingBugAmount', this.bugAmount);
    newGRow.setNum('framerate', this.fr);
    newGRow.setNum('lifespan', this.lifespan);
    newGRow.setNum('foodRespawnRate', this.foodRespawnRate);
    newGRow.setNum('foodNumForBaby', this.foodNumForBaby);
    newGRow.setNum('defaultGiveFoodToKidOnBirthProb', this.defaultGiveFoodToKidOnBirthProb);
    newGRow.setNum('mutateMutationFactor', this.mutateMutationFactor);
    newGRow.setNum('blindTimer', this.blindTimer);
    newGRow.setNum('simWidth', this.simWidth);
    newGRow.setNum('simHeight', this.simHeight);

    this.bugTable.addColumn('id');
    this.bugTable.addColumn('sightDiameter');
    this.bugTable.addColumn('smellDiameter');
    this.bugTable.addColumn('maxAngleChange');
    this.bugTable.addColumn('diameter');
    this.bugTable.addColumn('speed');
    this.bugTable.addColumn('giveFoodToKidOnBirthProb');
    this.bugTable.addColumn('mutationFactor');
    this.bugTable.addColumn('parentId');
    this.bugTable.addColumn('birthFrame');
    this.bugTable.addColumn('deathFrame');
    this.bugTable.addColumn('foodEaten');
    this.bugTable.addColumn('childrenCount');


    let defaultGraphButton;

    this.setup = function () {
        noStroke();

        this.simHeight = window.windowHeight;
        this.simWidth = window.windowWidth;

        // Create object
        for (let i = 0; i < this.foodAmount; i++) {
            this.foodArray.push(new Food(i));
        }
        for (let i = 0; i < this.bugAmount; i++) {
            this.bugArray.push(new Jitter(i, self));
        }
        console.log(this.foodArray.length);
        defaultGraphButton = new Button("GRAPH DATA", 10, 10, 80, 20, color(240, 240, 240), color(200, 200, 200), color(0, 0, 0, ), () => self.sceneManager.showScene(DefaultGraph));
    }

    this.draw = function () {
        background(50, 89, 100);
        for (let i = 0; i < this.bugAmount; i++) {
            this.bugArray[i].displaySmell();

        }
        for (let i = 0; i < this.bugAmount; i++) {
            this.bugArray[i].displaySight();

        }
        for (let i = 0; i < this.bugAmount; i++) {
            this.bugArray[i].display();
            this.bugArray[i].smellAndSeeAndTouch();
            this.bugArray[i].move();

        }
        if (this.bugAmount == 0) {
            if (this.playing) {
                alert("All bugs are dead. View and/or export data now.")
                this.playing = false;
            }
            //save(this.globalsTable, 'globalsTable.csv');
            //save(this.bugTable, 'bugTable.csv');
        }
        for (let i = 0; i < this.foodArray.length; i++) {
            this.foodArray[i].display();
        }
        if (frameCount % this.foodRespawnRate == 0) {
            this.foodAmount++;
            this.foodArray.push(new Food(this.foodArray.length - 1));
            for (let i = 0; i < this.foodAmount; i++) {
                this.foodArray[i].index = i;
            }
        }

        textSize(10);
        defaultGraphButton.handleAndDraw();
    }
}