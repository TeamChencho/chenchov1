class ConstructionGroup{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene

        this.cordStatusConstruction               = this.scene.constants.METAL_GRABBER_DOWN
        this.grabberConstructionStatus            = this.scene.constants.METAL_GRABBER_IDLE
        this.grabStatusConstruction               = this.scene.constants.METAL_GRABBER_EMPTY
        this.movingAssembledCarConstructionStatus = this.scene.constants.METAL_GRABBER_IDLE
        this.movingCarConstructionStatus          = this.scene.constants.METAL_GRABBER_IDLE
        this.movingCarEndConstructionStatus       = this.scene.constants.METAL_GRABBER_IDLE
	}

    makeAnims(){
        this.scene.anims.create({
          key: 'idle_red_car',
          frames: this.scene.anims.generateFrameNames('red_car', {frames:[1], zeroPad: 3, prefix: 'car_red_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'drive_backward_red_car',
          frames: this.scene.anims.generateFrameNames('red_car', {frames:[5,4,3,2,1], zeroPad: 3, prefix: 'car_red_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'drive_forward_red_car',
          frames: this.scene.anims.generateFrameNames('red_car', {frames:[1,2,3,4,5], zeroPad: 3, prefix: 'car_red_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })

        this.scene.anims.create({
            key: 'round_droid_activated_idle',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 19, zeroPad: 3, prefix: '__round_droid_activated_idle_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'round_droid_activated_shoot',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__round_droid_activated_shoot_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'round_droid_activated_dead',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__round_droid_dead_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'square_droid_activated_idle',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 19, zeroPad: 3, prefix: '__square_droid_activated_idle_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'square_droid_activated_shoot',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__square_droid_activated_shoot_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'square_droid_activated_dead',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__square_droid_dead_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'small_droid_activated_idle',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 19, zeroPad: 3, prefix: '__small_droid_activated_idle_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'small_droid_activated_shoot',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__small_droid_activated_shoot_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'small_droid_activated_dead',
            frames: this.scene.anims.generateFrameNames('enemy_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__small_droid_dead_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'sparks_forward',
            frames: this.scene.anims.generateFrameNames('sparks', {start: 9, end: 2, zeroPad: 3, prefix: '__mine_explode_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })

        this.scene.anims.create({
          key: 'idle_door_factory',
          frames: this.scene.anims.generateFrameNames('door_factory', {frames:[1], zeroPad: 2, prefix: 'door_idle_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'open_door_factory',
          frames: this.scene.anims.generateFrameNames('door_factory', {frames:[1,2,3,4,5,6,7,8], zeroPad: 2, prefix: 'door_open_', suffix: '.png'}),
          frameRate: 6,
          repeat: 0
        })
        this.scene.anims.create({
          key: 'close_door_factory',
          frames: this.scene.anims.generateFrameNames('door_factory', {frames:[8,7,6,5,4,3,2,1], zeroPad: 2, prefix: 'door_open_', suffix: '.png'}),
          frameRate: 15,
          repeat: 0
        })

    }

	loadSprites(){
        this.loadComputer()
        this.loadRail()
        this.loadConstructionCar()
        this.loadParkedConstructionCar()
        this.loadGrabberConstruction()
        this.loadChainGrabberConstruction()
        this.loadGrabberEndConstruction()
        this.loadExtraFloorConstruction()
        this.loadSpritesEndDoor()
        this.loadFullCarMoving()
        this.loadFullCarParked()
        this.loadRobotsConstruction()
        this.loadSparksConstruction()
        this.loadSpritesSemaphoreOff()

	}

    loadComputer(){
        this.scene.gameConfig.constructionComputer = this.scene.physics.add.sprite(
            0,
            0,
            "computer_01"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionComputerConstruction,this.scene.gameConfig.constructionComputer)
        Align.scaleToGameW(this.scene.gameConfig.constructionComputer,.2)
        this.scene.gameConfig.constructionComputer.y += 40 
    }

    
    loadRail(){
        //Poles
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'rail',
            'rail_vertical.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y -= 40
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railConstructionMetalGroup.add(this.scene.gameConfig.actual)

        //log(this.scene.gameConfig.previous.displayHeight)
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + (this.scene.gameConfig.previous.displayWidth * this.scene.constants.railMetalConstructionWidth),
            this.scene.gameConfig.previous.y, 
            'rail',
            'rail_vertical.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railConstructionMetalGroup.add(this.scene.gameConfig.actual)
        for(var i = 1; i <= this.scene.constants.railMetalConstructionWidth + 1; i++){
            if(i == 1 ){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0,
                    0,
                    'rail',
                    'rail_inner_bottom_left.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railConstructionMetalGroup.add(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.railMetalConstructionWidth + 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_inner_bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railConstructionMetalGroup.add(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_horizontal.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railConstructionMetalGroup.add(this.scene.gameConfig.actual)
            }
        }
    }

    loadConstructionCar(){
        this.scene.gameConfig.movingConstructionCar = this.scene.physics.add.sprite(
            6550.27272727,
            316,
            "backbone_color_car"
        )
        Align.scaleToGameW(this.scene.gameConfig.movingConstructionCar,.4)
    }

    loadParkedConstructionCar(){
        //7284.27272727 366

        this.scene.gameConfig.parkedConstructionCar = this.scene.physics.add.sprite(
            7284.27272727,
            366,
            "backbone_color_car"
        )
        Align.scaleToGameW(this.scene.gameConfig.parkedConstructionCar,.4)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        7284.27272727,
        366, 
        'tire'
        )
        Align.scaleToGameW(this.scene.gameConfig.actual,.2)
        this.scene.gameConfig.actual.x -=105
        this.scene.gameConfig.actual.y +=35
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.tiresConstructionParked.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        this.scene.gameConfig.previous.x,
        this.scene.gameConfig.previous.y, 
        'tire'
        )
        Align.scaleToGameW(this.scene.gameConfig.actual,.2)
        this.scene.gameConfig.actual.x +=25
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.tiresConstructionParked.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        this.scene.gameConfig.previous.x,
        this.scene.gameConfig.previous.y, 
        'tire'
        )
        Align.scaleToGameW(this.scene.gameConfig.actual,.2)
        this.scene.gameConfig.actual.x +=25
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.tiresConstructionParked.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        this.scene.gameConfig.previous.x,
        this.scene.gameConfig.previous.y, 
        'tire'
        )
        Align.scaleToGameW(this.scene.gameConfig.actual,.2)
        this.scene.gameConfig.actual.x +=25
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.tiresConstructionParked.push(this.scene.gameConfig.actual)
    }

    loadGrabberConstruction(){
        this.scene.gameConfig.grabberConstruction1 = this.scene.physics.add.sprite(
            0,
            0,
            'runner_piece'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction,this.scene.gameConfig.grabberConstruction1)
        Align.scaleToGameW(this.scene.gameConfig.grabberConstruction1,.1)

        this.scene.gameConfig.grabberConstruction2 = this.scene.physics.add.sprite(
            0,
            0,
            'runner_piece'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction+2,this.scene.gameConfig.grabberConstruction2)
        Align.scaleToGameW(this.scene.gameConfig.grabberConstruction2,.1)
    }

    loadChainGrabberConstruction(){
        this.scene.gameConfig.cordConstruction1_1 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction,this.scene.gameConfig.cordConstruction1_1)
        this.scene.gameConfig.cordConstruction1_1.x += 1
        this.scene.gameConfig.cordConstruction1_1.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordConstruction1_1,.008)

        //Difference between

        this.scene.gameConfig.cordConstruction1_2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction,this.scene.gameConfig.cordConstruction1_2)
        this.scene.gameConfig.cordConstruction1_2.x += 1
        this.scene.gameConfig.cordConstruction1_2.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordConstruction1_2,.008)

        this.scene.gameConfig.cordConstruction1_3 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction,this.scene.gameConfig.cordConstruction1_3)
        this.scene.gameConfig.cordConstruction1_3.x += 1
        this.scene.gameConfig.cordConstruction1_3.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordConstruction1_3,.008)


        /*Second*/
        this.scene.gameConfig.cordConstruction2_1 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction+2,this.scene.gameConfig.cordConstruction2_1)
        this.scene.gameConfig.cordConstruction2_1.x += 1
        this.scene.gameConfig.cordConstruction2_1.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordConstruction2_1,.008)

        //Difference between

        this.scene.gameConfig.cordConstruction2_2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction+2,this.scene.gameConfig.cordConstruction2_2)
        this.scene.gameConfig.cordConstruction2_2.x += 1
        this.scene.gameConfig.cordConstruction2_2.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordConstruction2_2,.008)

        this.scene.gameConfig.cordConstruction2_3 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailConstruction+2,this.scene.gameConfig.cordConstruction2_3)
        this.scene.gameConfig.cordConstruction2_3.x += 1
        this.scene.gameConfig.cordConstruction2_3.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordConstruction2_3,.008)
    }

    loadGrabberEndConstruction(){
        this.scene.gameConfig.grabberEndConstruction1 = this.scene.physics.add.sprite(
                    0,
                    0,
                    'grabber')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberConstruction,this.scene.gameConfig.grabberEndConstruction1)
        this.scene.gameConfig.grabberEndConstruction1.x += 1.5
        this.scene.gameConfig.grabberEndConstruction1.y += 12
        Align.scaleToGameW(this.scene.gameConfig.grabberEndConstruction1,.1)
        this.scene.gameConfig.grabberEndConstruction1.play("grabber_idle_close")

        this.scene.gameConfig.grabberEndConstruction2 = this.scene.physics.add.sprite(
                    0,
                    0,
                    'grabber')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberConstruction+2,this.scene.gameConfig.grabberEndConstruction2)
        this.scene.gameConfig.grabberEndConstruction2.x += 1.5
        this.scene.gameConfig.grabberEndConstruction2.y += 12
        Align.scaleToGameW(this.scene.gameConfig.grabberEndConstruction2,.1)
        this.scene.gameConfig.grabberEndConstruction2.play("grabber_idle_close")
    }

    moveGrabberStateMachineConstruction(){
        switch(this.grabberConstructionStatus){
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.grabberConstruction1.x += 1
                this.scene.gameConfig.cordConstruction1_1.x += 1
                this.scene.gameConfig.cordConstruction1_2.x += 1
                this.scene.gameConfig.cordConstruction1_3.x += 1
                this.scene.gameConfig.grabberEndConstruction1.x += 1

                this.scene.gameConfig.grabberConstruction2.x += 1
                this.scene.gameConfig.cordConstruction2_1.x += 1
                this.scene.gameConfig.cordConstruction2_2.x += 1
                this.scene.gameConfig.cordConstruction2_3.x += 1
                this.scene.gameConfig.grabberEndConstruction2.x += 1
                this.movingGrabberRightBreakConstruction()
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.grabberConstruction1.x   -= 1
                this.scene.gameConfig.cordConstruction1_1.x     -= 1
                this.scene.gameConfig.cordConstruction1_2.x     -= 1
                this.scene.gameConfig.cordConstruction1_3.x     -= 1
                this.scene.gameConfig.grabberEndConstruction1.x -= 1

                this.scene.gameConfig.grabberConstruction2.x   -= 1
                this.scene.gameConfig.cordConstruction2_1.x     -= 1
                this.scene.gameConfig.cordConstruction2_2.x     -= 1
                this.scene.gameConfig.cordConstruction2_3.x     -= 1
                this.scene.gameConfig.grabberEndConstruction2.x -= 1
                this.movingGrabberLeftBreakConstruction()
            break
            case this.scene.constants.METAL_GRABBER_IDLE:
                switch(this.cordStatusConstruction){
                    case this.scene.constants.METAL_GRABBER_UP:

                        if(this.scene.gameConfig.cordConstruction1_3.y > this.scene.constants.maxLengthCord2Y){
                            this.scene.gameConfig.cordConstruction1_3.y     -= 1
                            this.scene.gameConfig.cordConstruction2_3.y     -= 1

                            this.scene.gameConfig.grabberEndConstruction1.y -= 1
                            this.scene.gameConfig.grabberEndConstruction2.y -= 1
                        }else if(this.scene.gameConfig.cordConstruction1_3.y > this.scene.constants.maxLengthCord1Y){
                            this.scene.gameConfig.cordConstruction1_3.y     -= 1
                            this.scene.gameConfig.cordConstruction2_3.y     -= 1
                            
                            this.scene.gameConfig.cordConstruction1_2.y     -= 1
                            this.scene.gameConfig.cordConstruction2_2.y     -= 1

                            this.scene.gameConfig.grabberEndConstruction1.y -= 1
                            this.scene.gameConfig.grabberEndConstruction2.y -= 1
                        }else{
                            //log(this.grabStatusConstruction)
                            if(this.grabStatusConstruction == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabberConstructionStatus = this.scene.constants.METAL_GRABBER_LEFT
                            }else if(this.grabStatusConstruction == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabberConstructionStatus = this.scene.constants.METAL_GRABBER_RIGHT
                                this.movingCarConstructionStatus = this.scene.constants.METAL_GRABBER_RIGHT
                            }
                        }
                    break
                    case this.scene.constants.METAL_GRABBER_DOWN:
                        if(this.scene.gameConfig.cordConstruction1_2.y < this.scene.constants.maxLengthCord2Y){
                            this.scene.gameConfig.cordConstruction1_2.y     += 1
                            this.scene.gameConfig.cordConstruction2_2.y     += 1

                            this.scene.gameConfig.cordConstruction1_3.y     += 1
                            this.scene.gameConfig.cordConstruction2_3.y     += 1

                            this.scene.gameConfig.grabberEndConstruction1.y += 1
                            this.scene.gameConfig.grabberEndConstruction2.y += 1
                        }else if(this.scene.gameConfig.cordConstruction1_3.y < this.scene.constants.maxLengthCord3Y){
                            this.scene.gameConfig.cordConstruction1_3.y     += 1
                            this.scene.gameConfig.cordConstruction2_3.y     += 1

                            this.scene.gameConfig.grabberEndConstruction1.y += 1
                            this.scene.gameConfig.grabberEndConstruction2.y += 1
                        }else{
                            if(this.grabStatusConstruction == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabStatusConstruction = this.scene.constants.METAL_GRABBER_GRAB
                                this.scene.gameConfig.grabberEndConstruction1.play("grabber_open")
                                this.scene.gameConfig.grabberEndConstruction2.play("grabber_open")
                                this.cordStatusConstruction = this.scene.constants.METAL_GRABBER_UP

                                /*this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionBackboneCar,this.scene.gameConfig.movingAssembledCar)
                                this.scene.gameConfig.movingAssembledCar.x -= 20
                                this.scene.gameConfig.movingAssembledCar.y -= 94

                                */
                                this.movingCarConstructionStatus = this.scene.constants.METAL_GRABBER_UP
                                
                            }else if(this.grabStatusConstruction == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabStatusConstruction = this.scene.constants.METAL_GRABBER_EMPTY
                                this.scene.gameConfig.grabberEndConstruction1.play("grabber_open")
                                this.scene.gameConfig.grabberEndConstruction2.play("grabber_open")
                                this.cordStatusConstruction = this.scene.constants.METAL_GRABBER_UP

                            }
                        }
                    break
                    case this.scene.constants.METAL_GRABBER_IDLE:
                        
                    break
                }
            break
        }
    }

    movingGrabberRightBreakConstruction(){
        if(this.scene.gameConfig.grabberEndConstruction2.x < this.scene.railConstructionMetalGroup.children.entries[this.scene.railConstructionMetalGroup.children.entries.length-1].x){
            this.grabberConstructionStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.grabberConstructionStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatusConstruction    = this.scene.constants.METAL_GRABBER_DOWN
            if(this.grabStatusConstruction == this.scene.constants.METAL_GRABBER_GRAB){
                this.movingCarConstructionStatus = this.scene.constants.METAL_GRABBER_DOWN
            }
        }
    }

    movingGrabberLeftBreakConstruction(){
        if(this.scene.gameConfig.grabberEndConstruction1.x > this.scene.railConstructionMetalGroup.children.entries[0].x){
            this.grabberConstructionStatus = this.scene.constants.METAL_GRABBER_LEFT
        }else{
            this.grabberConstructionStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatusConstruction    = this.scene.constants.METAL_GRABBER_DOWN
        }
    }

    moveMovingConstructionCarStateMachine(){
        //log(this.movingCarConstructionStatus)
        //log(this.scene.gameConfig.movingConstructionCar.x + " " + this.scene.gameConfig.movingConstructionCar.y)
        switch(this.movingCarConstructionStatus){
            case this.scene.constants.METAL_GRABBER_DOWN:
                this.scene.gameConfig.movingConstructionCar.y += 1
                this.movingDownBreakConstruction()
            break
            case this.scene.constants.METAL_GRABBER_UP:
                this.scene.gameConfig.movingConstructionCar.y -= 1
            break
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.movingConstructionCar.x += 1
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.movingConstructionCar.x -= 1
            break
        }
    }

    movingDownBreakConstruction(){
        if(this.scene.gameConfig.movingConstructionCar.y < 366){
            this.movingCarConstructionStatus = this.scene.constants.METAL_GRABBER_DOWN
        }else{
            this.movingCarConstructionStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.scene.gameConfig.movingConstructionCar.x = 6550.27272727
            this.scene.gameConfig.movingConstructionCar.y = 316
        }
    }

    loadExtraFloorConstruction(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.floorMetalWidthConstruction; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorMetalConstruction,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y +=44
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidthConstruction){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'right_edge.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'fill.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
            }
        }

        let index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidthConstruction+1; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetalConstruction[index].x,
                    this.scene.floorMetalConstruction[index].y + this.scene.floorMetalConstruction[index].displayHeight,
                    'factory',
                    'bottom_left.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidthConstruction+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
                index+= (12)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'factory',
                    'bottom.png'
                )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
            }
        }

        index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidthConstruction+1; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetalConstruction[index].x,
                    this.scene.floorMetalConstruction[index].y + this.scene.floorMetalConstruction[index].displayHeight,
                    'factory',
                    'top_left.png'
                    )
                this.scene.gameConfig.actual.y -= 40
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidthConstruction+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
                index+= (12)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'factory',
                    'top.png'
                )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalConstruction.push(this.scene.gameConfig.actual)
            }
        }
    }

    loadFullCarParked(){
        this.scene.gameConfig.carParked = this.scene.physics.add.sprite(0,0,"red_car")
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionCarParked,this.scene.gameConfig.carParked)
        this.scene.gameConfig.carParked.y -= 70
        //this.scene.carParked.setGravityY(200)
        Align.scaleToGameW(this.scene.gameConfig.carParked,.4)
        window.carParked = this.scene.gameConfig.carParked
        //this.scene.physics.add.collider(this.scene.carParked,this.scene.brickGroup)
        this.scene.gameConfig.carParked.play("idle_red_car")
    }

    loadFullCarMoving(){
        this.scene.gameConfig.carEnded = this.scene.physics.add.sprite(0,0,"red_car")
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionCarParked,this.scene.gameConfig.carEnded)
        this.scene.gameConfig.carEnded.y -= 70
        //this.scene.carParked.setGravityY(200)
        Align.scaleToGameW(this.scene.gameConfig.carEnded,.4)
        window.carEnded = this.scene.gameConfig.carEnded
        //this.scene.physics.add.collider(this.scene.carParked,this.scene.brickGroup)
        this.scene.gameConfig.carEnded.play("idle_red_car")

        this.scene.time.addEvent({ delay: 30000, callback: function(){
            //log("Repitiendo carro")
            this.movingCarEndConstructionStatus = this.scene.constants.METAL_GRABBER_RIGHT
            this.scene.gameConfig.carEnded.play("drive_forward_red_car")
        }, callbackScope: this, loop: true });
        
    }

    loadRobotsConstruction(){
        this.scene.gameConfig.constructionRobot1 = this.scene.physics.add.sprite(
            0,
            0,
            'enemy_robot'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobotConstruction1,this.scene.gameConfig.constructionRobot1)
        Align.scaleToGameW(this.scene.gameConfig.constructionRobot1,.2)
        this.scene.gameConfig.constructionRobot1.flipX = true
        this.scene.gameConfig.constructionRobot1.y -= 40
        this.scene.gameConfig.constructionRobot1.x -= 80
        this.scene.gameConfig.constructionRobot1.play("round_droid_activated_shoot")

        this.scene.gameConfig.constructionRobot2 = this.scene.physics.add.sprite(
            0,
            0,
            'enemy_robot'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobotConstruction2,this.scene.gameConfig.constructionRobot2)
        this.scene.gameConfig.constructionRobot2.x -= 40
        this.scene.gameConfig.constructionRobot2.y -= 40
        Align.scaleToGameW(this.scene.gameConfig.constructionRobot2,.2)
        this.scene.gameConfig.constructionRobot2.play("round_droid_activated_shoot")
    }

    loadSparksConstruction(){
        this.scene.gameConfig.constructionRobotSparks1 = this.scene.physics.add.sprite(
            0,
            0,
            'sparks'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobotConstruction1,this.scene.gameConfig.constructionRobotSparks1)
        this.scene.gameConfig.constructionRobotSparks1.flipX = true
        this.scene.gameConfig.constructionRobotSparks1.x -= 20
        this.scene.gameConfig.constructionRobotSparks1.y -= 30
        Align.scaleToGameW(this.scene.gameConfig.constructionRobotSparks1,.1)
        this.scene.gameConfig.constructionRobotSparks1.play("sparks_forward")

        this.scene.gameConfig.constructionRobotSparks2 = this.scene.physics.add.sprite(
            0,
            0,
            'sparks'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobotConstruction2,this.scene.gameConfig.constructionRobotSparks2)
        this.scene.gameConfig.constructionRobotSparks2.flipX = true
        this.scene.gameConfig.constructionRobotSparks2.x -= 100
        this.scene.gameConfig.constructionRobotSparks2.y -= 30
        Align.scaleToGameW(this.scene.gameConfig.constructionRobotSparks2,.1)
        this.scene.gameConfig.constructionRobotSparks2.play("sparks_forward")

    }


    moveMovingConstructionCarEndStateMachine(){
        //log(this.scene.gameConfig.carEnded.x)
        //log(this.movingCarEndConstructionStatus)
        //log(this.scene.gameConfig.movingConstructionCar.x + " " + this.scene.gameConfig.movingConstructionCar.y)
        switch(this.movingCarEndConstructionStatus){
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.carEnded.x += 1
                this.movingRightBreakConstruction()
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.carEnded.x += 1
                this.movingLeftBreakConstruction()
            break
        }
    }

    movingRightBreakConstruction(){
        if(this.scene.gameConfig.carEnded.x < 8200){
            this.movingCarEndConstructionStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.movingCarEndConstructionStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.scene.gameConfig.carEnded.play("idle_red_car")
            this.scene.time.addEvent({ delay: 3000, callback: function(){
                this.scene.gameConfig.constructionDoor.play("open_door_factory")
                this.loadSpritesSemaphoreOn()
                this.movingCarEndConstructionStatus = this.scene.constants.METAL_GRABBER_LEFT
                this.scene.gameConfig.carEnded.play("drive_forward_red_car")
            }, callbackScope: this, loop: false });
        }
    }

    movingLeftBreakConstruction(){
        if(this.scene.gameConfig.carEnded.x < 9038){
            this.movingCarEndConstructionStatus = this.scene.constants.METAL_GRABBER_LEFT
        }else{
            this.movingCarEndConstructionStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.scene.gameConfig.carEnded.play("idle_red_car")
            this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionCarParked,this.scene.gameConfig.carEnded)
            this.scene.gameConfig.carEnded.y -= 70

            this.loadSpritesSemaphoreOff()
            this.scene.gameConfig.constructionDoor.play("close_door_factory")
        }
    }

    loadSpritesEndDoor(){
        this.scene.gameConfig.constructionDoor = this.scene.physics.add.sprite(
            0,
            0,
            'door_factory'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionEndDoor,this.scene.gameConfig.constructionDoor)
        this.scene.gameConfig.constructionDoor.y += 10
        Align.scaleToGameW(this.scene.gameConfig.constructionDoor,.4)
        this.scene.gameConfig.constructionDoor.play("idle_door_factory")
    }

    loadSpritesSemaphoreOff(){
        if(this.scene.gameConfig.constructionSemaphore != null){
            this.scene.gameConfig.constructionSemaphore.destroy()
            this.scene.gameConfig.constructionSemaphore = null
        }
        this.scene.gameConfig.constructionSemaphore = this.scene.physics.add.sprite(
            0,
            0,
            'semaphore_off'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionSemaphore,this.scene.gameConfig.constructionSemaphore)
        this.scene.gameConfig.constructionSemaphore.y += 60
        Align.scaleToGameW(this.scene.gameConfig.constructionSemaphore,.025)
    }

    loadSpritesSemaphoreOn(){
        if(this.scene.gameConfig.constructionSemaphore != null){
            this.scene.gameConfig.constructionSemaphore.destroy()
            this.scene.gameConfig.constructionSemaphore = null
        }
        this.scene.gameConfig.constructionSemaphore = this.scene.physics.add.sprite(
            0,
            0,
            'semaphore_on_green'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionSemaphore,this.scene.gameConfig.constructionSemaphore)
        this.scene.gameConfig.constructionSemaphore.y += 60
        Align.scaleToGameW(this.scene.gameConfig.constructionSemaphore,.025)
    }
}