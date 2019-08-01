// Jitter class
class Jitter {
    constructor(i, scene) {
        this.scene = scene;
        this.parentId = 0;
        this.id = this.scene.totalBugs + 1;
        this.scene.totalBugs++;
        this.childrenCount = 0;
        this.mutationFactor = this.scene.defaultMutationFactor;
        this.giveFoodToKidOnBirthProb = this.scene.defaultGiveFoodToKidOnBirthProb;
        this.index = i;
        this.lifespan = this.scene.lifespan;
        this.SightDiameter = random(40, 90);
        this.SmellDiameter = random(100, 200);
        this.foodParticlesEaten = 0;
        this.x = random(0, this.scene.simWidth);
        this.y = random(0, this.scene.simHeight);
        this.angle = random(0, 2 * PI);
        this.maxAngleChange = 0.3;
        this.distance = 0;
        this.diameter = random(20, 40);
        this.speed = random(1, 3);
        this.timer = 0;
        this.turnEnd = 4;
        this.color = color(255, 255, 255);
        this.closestFood = new Array(1);
        this.distanceFromClosestFood = 0;
        this.foodDistArray = new Array(this.scene.foodAmount);
        this.foodStorage = 0;
        this.strokeColor = color(0, 0, 0);
        this.naturalColor = color(255, 255, 255);
        this.hatDiameter = this.diameter * 2 / 3;
        this.hatColor = color(0, 0, 0);
        this.alive = true;
        //table stuff
        addBugToTable(this, false, this.scene);
    }

    mutate(bug) {
        bug.SightDiameter += random(-bug.SightDiameter * this.mutationFactor, bug.SightDiameter * this.mutationFactor);
        bug.SmellDiameter += random(-bug.SmellDiameter * this.mutationFactor, bug.SmellDiameter * this.mutationFactor);
        bug.maxAngleChange += random(-bug.maxAngleChange * this.mutationFactor, bug.maxAngleChange * this.mutationFactor);
        bug.diameter += random(-bug.diameter * this.mutationFactor, bug.diameter * this.mutationFactor);
        bug.speed += random(-bug.speed * this.mutationFactor, bug.speed * this.mutationFactor);
        bug.giveFoodToKidOnBirthProb += random(-bug.giveFoodToKidOnBirthProb * this.mutationFactor, bug.giveFoodToKidOnBirthProb * this.mutationFactor)
        if (bug.giveFoodToKidOnBirthProb < 0)
            bug.giveFoodToKidOnBirthProb = 0;
        if (bug.giveFoodToKidOnBirthProb > 1)
            bug.giveFoodToKidOnBirthProb = 1;
        if (this.scene.mutateMutationFactor) {
            bug.mutationFactor += random(-bug.mutationFactor * this.mutationFactor, bug.mutationFactor * this.mutationFactor);
        }
        addBugToTable(bug, true, this.scene);
        return bug;
    }

    reproduce() {
        if (this.foodStorage >= this.scene.foodNumForBaby) {
            this.foodStorage -= this.scene.foodNumForBaby;
            this.childrenCount++;
            let row = this.scene.bugTable.getRow(this.id - 1);
            row.setNum('childrenCount', this.childrenCount);
            this.scene.bugAmount++;
            this.scene.bugArray.push(this.clone());
            //console.log(bugArray.length);
        }
    }

    decay() {
        this.lifespan -= this.energySpent();
        if (this.lifespan <= 0 && this.lifespan > -60) {
            this.speed = 0;
            this.lifespan -= 1;
            this.SightDiameter /= 1.1;
            this.SmellDiameter /= 1.1;
            this.hatDiameter /= 1.1;
            this.diameter /= 1.1;
            this.alive = false;
        }
        if (this.lifespan <= -60) {
            this.scene.bugAmount--;
            this.scene.bugArray.splice(this.index, 1);
            for (let i = 0; i < this.scene.bugAmount; i++) {
                this.scene.bugArray[i].index = i;
            }
            let row = this.scene.bugTable.getRow(this.id - 1);
            row.setNum('deathFrame', frameCount);
        }
    }

    getBodyColorByTraits() {
        let speed = this.speed * (255 / 5);
        return color(255, 255 - speed, 255 - speed);
    }
    getHatColorByTraits() {
        let foodStorage = this.foodStorage * (255 / 3);
        return color(255 - foodStorage, 255, 255 - foodStorage);
    }
    getAngle(food) {
        let dx = (food.x - this.x);
        // Minus to correct for coord re-mapping
        let dy = -(food.y - this.y);

        let inRads = atan2(dy, dx);
        if (inRads < 0)
            inRads = abs(inRads);
        else
            inRads = 2 * PI - inRads;

        return inRads;
    }

    convertPolarToXCoordinate() {
        return cos(this.angle) * this.distance;
    }
    convertPolarToYCoordinate() {
        return sin(this.angle) * this.distance;
    }
    clone() {
        let newBug = new Jitter(0,this.scene);
        newBug.parentId = this.id;
        newBug.giveFoodToKidOnBirthProb = this.giveFoodToKidOnBirthProb;
        newBug.mutationFactor = this.mutationFactor;
        newBug.SightDiameter = this.SightDiameter;
        newBug.SmellDiameter = this.SmellDiameter;
        newBug.x = this.x;
        newBug.y = this.y;
        newBug.maxAngleChange = this.maxAngleChange;
        newBug.diameter = this.diameter;
        newBug.speed = this.speed
        newBug.hatDiameter = newBug.diameter * 2 / 3;
        if (boolFromProb(this.giveFoodToKidOnBirthProb)) {
            newBug.foodStorage = this.foodStorage;
            this.foodStorage = 0;
        }
        return this.mutate(newBug);
    }
    energySpent() {
        let energy = sqrt(sqrt(this.speed) + sqrt((this.SightDiameter + this.SmellDiameter) / 2) + sqrt(this.diameter) / 2) / 2;
        return energy;
    }
    move() {
        this.decay();
        this.reproduce();
        this.distance += this.speed;
        this.x += this.convertPolarToXCoordinate();
        this.y += this.convertPolarToYCoordinate();
        this.distance = 0;
        this.timer++;

        if (this.timer % this.turnEnd == 0) {
            this.angle += random(-this.maxAngleChange, this.maxAngleChange);
        }

        if (this.x < 0) {
            this.angle = 0;
            this.x = 0;
        }
        if (this.x > simWidth) {
            this.angle = PI;
            this.x = simWidth;
        }
        if (this.y < 0) {
            this.angle = 1 / 2 * PI;
            this.y = 0;
        }
        if (this.y > simHeight) {
            this.angle = 3 / 2 * PI;
            this.y = simHeight;
        }

    }

    smellAndSeeAndTouch() {
        for (let i = 0; i < this.scene.foodArray.length; i++) {
            let dist = sqrt(sq(this.x - this.scene.foodArray[i].x) + sq(this.y - this.scene.foodArray[i].y));
            this.foodDistArray[i] = {
                distance: dist,
                obj: this.scene.foodArray[i]
            };
        }
        this.foodDistArray.sort(compareNumbers);
        if (this.scene.foodAmount > 0) {
            let foodX = this.foodDistArray[0].obj.x;
            let foodY = this.foodDistArray[0].obj.y;
            let smelled = collidePointCircle(foodX, foodY, this.x, this.y, this.SmellDiameter);
            if (smelled) {
                let seen = collidePointCircle(foodX, foodY, this.x, this.y, this.SightDiameter);
                if (seen) {
                    let eaten = collidePointPoint(foodX, foodY, this.x, this.y, this.diameter / 2);
                    if (eaten) {
                        //if eaten
                        this.color = color(0, 0, 0);
                        this.foodStorage += this.foodDistArray[0].obj.nutritionalValue;
                        this.foodParticlesEaten++;
                        this.lifespan += this.foodDistArray[0].obj.nutritionalValue * this.scene.foodLifespanFactor;
                        this.scene.foodAmount--;
                        this.scene.foodArray.splice(this.foodDistArray[0].obj.index, 1);
                        //console.log(this.scene.foodAmount);
                        this.foodDistArray.splice(0, 1);
                        for (let i = 0; i < this.scene.foodAmount; i++) {
                            this.scene.foodArray[i].index = i;
                        }
                        let row = this.scene.bugTable.getRow(this.id - 1);
                        row.setNum('foodEaten', this.foodParticlesEaten);
                    } else {
                        //if seen but not eaten
                        this.angle = this.getAngle(this.foodDistArray[0].obj);
                        if (sqrt(sq(this.x - this.foodDistArray[0].obj.x) + sq(this.y - this.foodDistArray[0].obj.y)) < this.speed) {
                            this.x = this.foodDistArray[0].obj.x;
                            this.y = this.foodDistArray[0].obj.y;
                        }

                        this.color = color(0, 70, 150)
                    }
                } else {
                    //if smelled but not seen
                    let smelledEdge = collidePointCircle(foodX, foodY, this.x, this.y, this.SmellDiameter - (this.speed * 2))
                    if (!smelledEdge || frameCount % 40 == 0) {
                        this.angle = this.getAngle(this.foodDistArray[0].obj);
                    }
                    this.color = color(255, 255, 0);
                }
            } else {
                //if none of those
                this.naturalColor = this.getBodyColorByTraits();
                this.color = this.naturalColor;
                if (this.timer % this.scene.blindTimer == 0) {
                    this.angle = this.getAngle(this.foodDistArray[0].obj) + random(-HALF_PI / 2, HALF_PI / 2);
                }
            }
        } else {
            //if there is no more food
            this.naturalColor = this.getBodyColorByTraits();
            this.color = this.naturalColor;
        }
    }

    display() {
        fill(120, 120, 120, 100);
        ellipse(this.x, this.y, this.SmellDiameter, this.SmellDiameter);
        if (this.alive) {
            fill(120, 120, 120, 70);
            arc(this.x, this.y, this.SmellDiameter, this.SmellDiameter, 0, (this.lifespan / this.scene.lifespan) * TWO_PI, PIE);
        }
        fill(160, 160, 160, 100);
        ellipse(this.x, this.y, this.SightDiameter, this.SightDiameter);
        if (this.scene.drawLine && this.alive) {
            this.linex = this.x + cos(this.angle) * (this.diameter + 20);
            this.liney = this.y + sin(this.angle) * (this.diameter + 20);
            strokeWeight(1);
            stroke(0, 0, 0);
            line(this.x, this.y, this.linex, this.liney);
            noStroke();
        }
        fill(this.color);
        ellipse(this.x, this.y, this.diameter, this.diameter);
        this.hatColor = this.getHatColorByTraits();
        fill(this.hatColor);
        ellipse(this.x, this.y, this.hatDiameter, this.hatDiameter);


    }
}