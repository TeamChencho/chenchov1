class AssembleGroup{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene

        this.assembleRobot3Status = this.scene.constants.METAL_GRABBER_UP
        this.grabberStatus        = this.scene.constants.METAL_GRABBER_IDLE
        this.cordStatus           = this.scene.constants.METAL_GRABBER_DOWN
        this.grabStatus           = this.scene.constants.METAL_GRABBER_EMPTY
        this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_IDLE
        this.grabberColorStatus   = this.scene.constants.METAL_GRABBER_IDLE
        this.cordStatusColor      = this.scene.constants.METAL_GRABBER_DOWN
        this.grabStatusColor      = this.scene.constants.METAL_GRABBER_EMPTY
        this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_IDLE
        this.movingAssembledCarColor2Status = this.scene.constants.METAL_GRABBER_IDLE
        this.conveyorBeltColorStatus = this.scene.constants.METAL_GRABBER_IDLE
	}

    makeAnims(){
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
            key: 'spray_blue_on',
            frames: this.scene.anims.generateFrameNames('spray_blue', {start: 1, end: 6, zeroPad: 2, prefix: 'blue_beam_charge_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'spray_red_on',
            frames: this.scene.anims.generateFrameNames('spray_red', {start: 1, end: 6, zeroPad: 2, prefix: 'red_beam_charge_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'spray_yellow_on',
            frames: this.scene.anims.generateFrameNames('spray_yellow', {start: 1, end: 6, zeroPad: 2, prefix: 'yellow_beam_charge_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })

    }

	loadSprites(){
        this.loadComputer()
        this.loadExtraFloorBaseCar()
        this.loadRobotsAssembleBack()
        this.loadMovingAssembledCar()
        this.loadMovingAssembledCar2()
        this.loadAssemblyCar()
        this.loadRobotsAssembleFront()
        this.loadSparks()
        this.loadRail()
        this.loadGrabber()
        this.loadChainGrabber()
        this.loadGrabberEnd()
        this.loadRailColor()
        this.loadGrabberColor()
        this.loadChainGrabberColor()
        this.loadGrabberEndColor()
        this.loadSpritesLoader()
        this.loadPoolAcid()
        this.loadExtraFloorPool()
        this.loadPoolDecorations()
        this.loadComputer2()
        this.loadExtraFloorColor()
        this.loadConveyorBeltColor()
        this.loadExtraCeilingColor()
        this.loadColorCables()
        this.loadColorSprays()
        this.loadColorComputersOff()
        this.loadParkedCar()
	}

    loadComputer(){
        assemblyComputer = this.scene.physics.add.sprite(
            0,
            0,
            "computer_02"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionComputer2,assemblyComputer)
        Align.scaleToGameW(assemblyComputer,.1)
        assemblyComputer.y += 50 
        //window.metalComputer = this.scene.gameConfig.metalComputer
    }

    loadExtraFloorBaseCar(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.floorAssembleCarWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'top_left.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssembleFloorBase,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y +=44
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorAssembleCarWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
            }
        }
        
        let index = 0
        for(var i = 1; i <= this.scene.constants.floorAssembleCarWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorAssembleAssurance[index].x,
                    this.scene.floorAssembleAssurance[index].y + this.scene.floorAssembleAssurance[index].displayHeight,
                    'factory',
                    'bottom_left.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorAssembleCarWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
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
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
            }
        }

        for(var i = 1; i <= this.scene.constants.floorAssembleCarWidth-2; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorAssembleAssurance[index].x,
                    this.scene.floorAssembleAssurance[index].y + this.scene.floorAssembleAssurance[index].displayHeight,
                    'factory',
                    'top_left.png'
                    )
                this.scene.gameConfig.actual.y -=120
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorAssembleCarWidth-2){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
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
                this.scene.floorAssembleAssurance.push(this.scene.gameConfig.actual)
            }
        }
    }

    loadRobotsAssembleBack(){
        this.scene.gameConfig.assembleRobot3 = this.scene.physics.add.sprite(
            0,
            0,
            'enemy_robot'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobot3,this.scene.gameConfig.assembleRobot3)
        this.scene.gameConfig.assembleRobot3.flipX = true
        this.scene.gameConfig.assembleRobot3.y -= 120
        Align.scaleToGameW(this.scene.gameConfig.assembleRobot3,.2)
        this.scene.gameConfig.assembleRobot3.play("small_droid_activated_idle")

        this.scene.gameConfig.assembleRobot4 = this.scene.physics.add.sprite(
            0,
            0,
            'enemy_robot'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobot4,this.scene.gameConfig.assembleRobot4)
        Align.scaleToGameW(this.scene.gameConfig.assembleRobot4,.2)
        this.scene.gameConfig.assembleRobot4.x += 110
        this.scene.gameConfig.assembleRobot4.y -= 140
        this.scene.gameConfig.assembleRobot4.play("small_droid_activated_shoot")
    }

    loadAssemblyCar(){
        this.scene.gameConfig.backboneCar = this.scene.physics.add.sprite(
            0,
            0,
            "car_backbone"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionBackboneCar,this.scene.gameConfig.backboneCar)
        this.scene.gameConfig.backboneCar.x -= 20
        this.scene.gameConfig.backboneCar.y -= 94
        Align.scaleToGameW(this.scene.gameConfig.backboneCar,.4)
        //this.scene.gameConfig.backboneCar.y += 50 
        //window.metalComputer = this.scene.gameConfig.metalComputer
    }

    loadRobotsAssembleFront(){
        this.scene.gameConfig.assembleRobot1 = this.scene.physics.add.sprite(
            0,
            0,
            'enemy_robot'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobot1,this.scene.gameConfig.assembleRobot1)
        Align.scaleToGameW(this.scene.gameConfig.assembleRobot1,.2)
        this.scene.gameConfig.assembleRobot1.y -= 40
        this.scene.gameConfig.assembleRobot1.play("round_droid_activated_shoot")

        this.scene.gameConfig.assembleRobot2 = this.scene.physics.add.sprite(
            0,
            0,
            'enemy_robot'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobot2,this.scene.gameConfig.assembleRobot2)
        this.scene.gameConfig.assembleRobot2.flipX = true
        this.scene.gameConfig.assembleRobot2.x -= 40
        this.scene.gameConfig.assembleRobot2.y -= 40
        Align.scaleToGameW(this.scene.gameConfig.assembleRobot2,.2)
        this.scene.gameConfig.assembleRobot2.play("round_droid_activated_shoot")
    }

    loadSparks(){
        this.scene.gameConfig.assembleRobotSparks1 = this.scene.physics.add.sprite(
            0,
            0,
            'sparks'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobot1,this.scene.gameConfig.assembleRobotSparks1)
        this.scene.gameConfig.assembleRobotSparks1.flipX = true
        this.scene.gameConfig.assembleRobotSparks1.x -= 60
        this.scene.gameConfig.assembleRobotSparks1.y -= 30
        Align.scaleToGameW(this.scene.gameConfig.assembleRobotSparks1,.1)
        this.scene.gameConfig.assembleRobotSparks1.play("sparks_forward")

        this.scene.gameConfig.assembleRobotSparks2 = this.scene.physics.add.sprite(
            0,
            0,
            'sparks'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobot2,this.scene.gameConfig.assembleRobotSparks2)
        this.scene.gameConfig.assembleRobotSparks2.flipX = true
        this.scene.gameConfig.assembleRobotSparks2.x += 20
        this.scene.gameConfig.assembleRobotSparks2.y -= 30
        Align.scaleToGameW(this.scene.gameConfig.assembleRobotSparks2,.1)
        this.scene.gameConfig.assembleRobotSparks2.play("sparks_forward")

        this.scene.gameConfig.assembleRobotSparks3 = this.scene.physics.add.sprite(
            0,
            0,
            'sparks'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRobot4,this.scene.gameConfig.assembleRobotSparks3)
        this.scene.gameConfig.assembleRobotSparks3.flipX = true
        this.scene.gameConfig.assembleRobotSparks3.x += 50
        this.scene.gameConfig.assembleRobotSparks3.y -= 140
        Align.scaleToGameW(this.scene.gameConfig.assembleRobotSparks3,.1)
        this.scene.gameConfig.assembleRobotSparks3.play("sparks_forward")
    }

    moveAssembleRobot3StateMachine(){
        //log(this.scene.gameConfig.assembleRobot3.y)
        switch(this.assembleRobot3Status){
            case this.scene.constants.METAL_GRABBER_UP:
                this.scene.gameConfig.assembleRobot3.y -= 0.25
                this.movingAssembleRobot3UpBreak()
            break
            case this.scene.constants.METAL_GRABBER_DOWN:
                this.scene.gameConfig.assembleRobot3.y += 0.25
                this.movingAssembleRobot3DownBreak()
            break
        }
    }

    movingAssembleRobot3UpBreak(){
        if(this.scene.gameConfig.assembleRobot3.y > 270){
            this.assembleRobot3Status = this.scene.constants.METAL_GRABBER_UP
        }else{
            this.assembleRobot3Status = this.scene.constants.METAL_GRABBER_DOWN
        }
    }

    movingAssembleRobot3DownBreak(){
        if(this.scene.gameConfig.assembleRobot3.y < 310){
            this.assembleRobot3Status = this.scene.constants.METAL_GRABBER_DOWN
        }else{
            this.assembleRobot3Status = this.scene.constants.METAL_GRABBER_UP
        }
    }

    loadRail(){
        //Poles
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'rail',
            'rail_vertical.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailAssemble,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y -= 40
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railAssembleMetalGroup.add(this.scene.gameConfig.actual)

        //log(this.scene.gameConfig.previous.displayHeight)
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + (this.scene.gameConfig.previous.displayWidth * this.scene.constants.railMetalAssembleWidth),
            this.scene.gameConfig.previous.y, 
            'rail',
            'rail_vertical.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railAssembleMetalGroup.add(this.scene.gameConfig.actual)
        for(var i = 1; i <= this.scene.constants.railMetalAssembleWidth + 1; i++){
            if(i == 1 ){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0,
                    0,
                    'rail',
                    'rail_inner_bottom_left.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailAssemble,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railAssembleMetalGroup.add(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.railMetalAssembleWidth + 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_inner_bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railAssembleMetalGroup.add(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_horizontal.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railAssembleMetalGroup.add(this.scene.gameConfig.actual)
            }
        }
    }

    loadGrabber(){
        this.scene.gameConfig.grabberAssembler1 = this.scene.physics.add.sprite(
            0,
            0,
            'runner_piece'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailAssemble,this.scene.gameConfig.grabberAssembler1)
        Align.scaleToGameW(this.scene.gameConfig.grabberAssembler1,.1)

        this.scene.gameConfig.grabberAssembler2 = this.scene.physics.add.sprite(
            0,
            0,
            'runner_piece'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailAssemble+2,this.scene.gameConfig.grabberAssembler2)
        Align.scaleToGameW(this.scene.gameConfig.grabberAssembler2,.1)
    }

    loadChainGrabber(){
        this.scene.gameConfig.cordAssemble1_1 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble,this.scene.gameConfig.cordAssemble1_1)
        this.scene.gameConfig.cordAssemble1_1.x += 1
        this.scene.gameConfig.cordAssemble1_1.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.gameConfig.cordAssemble1_1,.008)

        //Difference between

        this.scene.gameConfig.cordAssemble1_2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble,this.scene.gameConfig.cordAssemble1_2)
        this.scene.gameConfig.cordAssemble1_2.x += 1
        this.scene.gameConfig.cordAssemble1_2.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.gameConfig.cordAssemble1_2,.008)

        this.scene.gameConfig.cordAssemble1_3 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble,this.scene.gameConfig.cordAssemble1_3)
        this.scene.gameConfig.cordAssemble1_3.x += 1
        this.scene.gameConfig.cordAssemble1_3.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.gameConfig.cordAssemble1_3,.008)


        /*Second*/
        this.scene.gameConfig.cordAssemble2_1 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble+2,this.scene.gameConfig.cordAssemble2_1)
        this.scene.gameConfig.cordAssemble2_1.x += 1
        this.scene.gameConfig.cordAssemble2_1.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.gameConfig.cordAssemble2_1,.008)

        //Difference between

        this.scene.gameConfig.cordAssemble2_2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble+2,this.scene.gameConfig.cordAssemble2_2)
        this.scene.gameConfig.cordAssemble2_2.x += 1
        this.scene.gameConfig.cordAssemble2_2.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.gameConfig.cordAssemble2_2,.008)

        this.scene.gameConfig.cordAssemble2_3 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble+2,this.scene.gameConfig.cordAssemble2_3)
        this.scene.gameConfig.cordAssemble2_3.x += 1
        this.scene.gameConfig.cordAssemble2_3.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.gameConfig.cordAssemble2_3,.008)
    }

    loadGrabberEnd(){
        this.scene.gameConfig.grabberEndAssemble1 = this.scene.physics.add.sprite(
                    0,
                    0,
                    'grabber')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble,this.scene.gameConfig.grabberEndAssemble1)
        this.scene.gameConfig.grabberEndAssemble1.x += 1.5
        this.scene.gameConfig.grabberEndAssemble1.y += 12
        Align.scaleToGameW(this.scene.gameConfig.grabberEndAssemble1,.1)
        this.scene.gameConfig.grabberEndAssemble1.play("grabber_idle_close")

        this.scene.gameConfig.grabberEndAssemble2 = this.scene.physics.add.sprite(
                    0,
                    0,
                    'grabber')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberAssemble+2,this.scene.gameConfig.grabberEndAssemble2)
        this.scene.gameConfig.grabberEndAssemble2.x += 1.5
        this.scene.gameConfig.grabberEndAssemble2.y += 12
        Align.scaleToGameW(this.scene.gameConfig.grabberEndAssemble2,.1)
        this.scene.gameConfig.grabberEndAssemble2.play("grabber_idle_close")
    }

    moveGrabberStateMachine(){
        switch(this.grabberStatus){
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.grabberAssembler1.x += 1
                this.scene.gameConfig.cordAssemble1_1.x += 1
                this.scene.gameConfig.cordAssemble1_2.x += 1
                this.scene.gameConfig.cordAssemble1_3.x += 1
                this.scene.gameConfig.grabberEndAssemble1.x += 1

                this.scene.gameConfig.grabberAssembler2.x += 1
                this.scene.gameConfig.cordAssemble2_1.x += 1
                this.scene.gameConfig.cordAssemble2_2.x += 1
                this.scene.gameConfig.cordAssemble2_3.x += 1
                this.scene.gameConfig.grabberEndAssemble2.x += 1
                this.movingGrabberRightBreak()
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.grabberAssembler1.x   -= 1
                this.scene.gameConfig.cordAssemble1_1.x     -= 1
                this.scene.gameConfig.cordAssemble1_2.x     -= 1
                this.scene.gameConfig.cordAssemble1_3.x     -= 1
                this.scene.gameConfig.grabberEndAssemble1.x -= 1

                this.scene.gameConfig.grabberAssembler2.x   -= 1
                this.scene.gameConfig.cordAssemble2_1.x     -= 1
                this.scene.gameConfig.cordAssemble2_2.x     -= 1
                this.scene.gameConfig.cordAssemble2_3.x     -= 1
                this.scene.gameConfig.grabberEndAssemble2.x -= 1
                this.movingGrabberLeftBreak()
            break
            case this.scene.constants.METAL_GRABBER_IDLE:
                switch(this.cordStatus){
                    case this.scene.constants.METAL_GRABBER_UP:
                        if(this.scene.gameConfig.cordAssemble1_3.y > this.scene.constants.maxLengthCord2Y){
                            this.scene.gameConfig.cordAssemble1_3.y     -= 1
                            this.scene.gameConfig.cordAssemble2_3.y     -= 1

                            this.scene.gameConfig.grabberEndAssemble1.y -= 1
                            this.scene.gameConfig.grabberEndAssemble2.y -= 1
                        }else if(this.scene.gameConfig.cordAssemble1_3.y > this.scene.constants.maxLengthCord1Y){
                            this.scene.gameConfig.cordAssemble1_3.y     -= 1
                            this.scene.gameConfig.cordAssemble2_3.y     -= 1
                            
                            this.scene.gameConfig.cordAssemble1_2.y     -= 1
                            this.scene.gameConfig.cordAssemble2_2.y     -= 1

                            this.scene.gameConfig.grabberEndAssemble1.y -= 1
                            this.scene.gameConfig.grabberEndAssemble2.y -= 1
                        }else{
                            if(this.grabStatus == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabberStatus = this.scene.constants.METAL_GRABBER_LEFT
                            }else if(this.grabStatus == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabberStatus = this.scene.constants.METAL_GRABBER_RIGHT
                                this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_RIGHT
                            }
                        }
                    break
                    case this.scene.constants.METAL_GRABBER_DOWN:
                        if(this.scene.gameConfig.cordAssemble1_2.y < this.scene.constants.maxLengthCord2Y){
                            this.scene.gameConfig.cordAssemble1_2.y     += 1
                            this.scene.gameConfig.cordAssemble2_2.y     += 1

                            this.scene.gameConfig.cordAssemble1_3.y     += 1
                            this.scene.gameConfig.cordAssemble2_3.y     += 1

                            this.scene.gameConfig.grabberEndAssemble1.y += 1
                            this.scene.gameConfig.grabberEndAssemble2.y += 1
                        }else if(this.scene.gameConfig.cordAssemble1_3.y < this.scene.constants.maxLengthCord3Y){
                            this.scene.gameConfig.cordAssemble1_3.y     += 1
                            this.scene.gameConfig.cordAssemble2_3.y     += 1

                            this.scene.gameConfig.grabberEndAssemble1.y += 1
                            this.scene.gameConfig.grabberEndAssemble2.y += 1
                        }else{
                            if(this.grabStatus == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabStatus = this.scene.constants.METAL_GRABBER_GRAB
                                this.scene.gameConfig.grabberEndAssemble1.play("grabber_open")
                                this.scene.gameConfig.grabberEndAssemble2.play("grabber_open")
                                this.cordStatus = this.scene.constants.METAL_GRABBER_UP

                                this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionBackboneCar,this.scene.gameConfig.movingAssembledCar)
                                this.scene.gameConfig.movingAssembledCar.x -= 20
                                this.scene.gameConfig.movingAssembledCar.y -= 94

                                this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_UP
                            }else if(this.grabStatus == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabStatus = this.scene.constants.METAL_GRABBER_EMPTY
                                this.scene.gameConfig.grabberEndAssemble1.play("grabber_open")
                                this.scene.gameConfig.grabberEndAssemble2.play("grabber_open")
                                this.cordStatus = this.scene.constants.METAL_GRABBER_UP

                            }
                        }
                    break
                    case this.scene.constants.METAL_GRABBER_IDLE:
                        
                    break
                }
            break
        }
    }

    movingGrabberRightBreak(){
        if(this.scene.gameConfig.grabberEndAssemble2.x < this.scene.railAssembleMetalGroup.children.entries[this.scene.railAssembleMetalGroup.children.entries.length-1].x){
            this.grabberStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.grabberStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatus    = this.scene.constants.METAL_GRABBER_DOWN
            if(this.grabStatus == this.scene.constants.METAL_GRABBER_GRAB){
                this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_DOWN
            }
        }
    }

    movingGrabberLeftBreak(){
        if(this.scene.gameConfig.grabberEndAssemble1.x > this.scene.railAssembleMetalGroup.children.entries[0].x){
            this.grabberStatus = this.scene.constants.METAL_GRABBER_LEFT
        }else{
            this.grabberStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatus    = this.scene.constants.METAL_GRABBER_DOWN
        }
    }

    loadMovingAssembledCar(){
        this.scene.gameConfig.movingAssembledCar = this.scene.physics.add.sprite(
            0, 
            0, 
            'car_backbone'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionBackboneCar,this.scene.gameConfig.movingAssembledCar)
        this.scene.gameConfig.movingAssembledCar.x -= 20
        this.scene.gameConfig.movingAssembledCar.y -= 94
        Align.scaleToGameW(this.scene.gameConfig.movingAssembledCar,.4)
        //this.scene.physics.add.overlap(this.scene.gameConfig.movingAssembledCar,this.scene.gameConfig.stomper,this.stompMetal,null,this)
    }

    moveMovingAssembledCarStateMachine(){
        
        switch(this.movingAsebledCarStatus){
            case this.scene.constants.METAL_GRABBER_DOWN:
                this.scene.gameConfig.movingAssembledCar.y += 1
                this.movingDownBreak()
            break
            case this.scene.constants.METAL_GRABBER_UP:
                this.scene.gameConfig.movingAssembledCar.y -= 1
            break
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.movingAssembledCar.x += 1
                //this.movingIdleBreak()
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.movingAssembledCar.x -= 1
            break
        }
    }

    movingDownBreak(){
        if(this.scene.gameConfig.movingAssembledCar.y < 386){
            this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_DOWN
        }else{
            this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_IDLE
        }
    }

    movingIdleBreak(){
        if(this.scene.gameConfig.rollMetal.x < 1430){
            this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.movingAsebledCarStatus = this.scene.constants.METAL_GRABBER_IDLE
        }
    }

    loadMovingAssembledCar2(){
        this.scene.gameConfig.movingAssembledCar2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'car_backbone'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionBackboneCar2,this.scene.gameConfig.movingAssembledCar2)
        this.scene.gameConfig.movingAssembledCar2.y = 386 //386
        Align.scaleToGameW(this.scene.gameConfig.movingAssembledCar2,.4)
    }

    moveMovingAssembledCar2StateMachine(){
        switch(this.movingAssembledCarColorStatus){
            case this.scene.constants.METAL_GRABBER_DOWN:
                this.scene.gameConfig.movingAssembledCar2.y += 1
                this.movingDownBreakColor()
            break
            case this.scene.constants.METAL_GRABBER_UP:
                this.scene.gameConfig.movingAssembledCar2.y -= 1
            break
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.movingAssembledCar2.x += 1
                //this.movingIdleBreak()
                //log(this.scene.gameConfig.movingAssembledCar2.x)
                //5900
                //6000
                if(this.scene.gameConfig.movingAssembledCar2.x <= 6000 && this.scene.gameConfig.movingAssembledCar2.x > 5800){
                    this.loadColorSprayRed()
                }

                if(this.scene.gameConfig.movingAssembledCar2.x > 5700){
                    this.disableColorSprayBlue()
                }else if(this.scene.gameConfig.movingAssembledCar2.x <= 5700 && this.scene.gameConfig.movingAssembledCar2.x > 5470){
                    this.loadColorSprayBlue()
                }
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.movingAssembledCar2.x -= 1
            break
        }
    }

    moveMovingAssembledCar3StateMachine(){
        /*if(this.scene.gameConfig.movingAssembledCar3 != null){
            log(this.scene.gameConfig.movingAssembledCar3.x + " " + this.scene.gameConfig.movingAssembledCar3.y)    
        }*/
        
        switch(this.movingAssembledCarColor2Status){
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.movingAssembledCar3.x += 1
                //this.movingIdleBreak()
                //log(this.scene.gameConfig.movingAssembledCar3.x)
                //5900
                //6000
                if(this.scene.gameConfig.movingAssembledCar3.x > 6550){
                    this.movingAssembledCarColor2Status = this.scene.constants.METAL_GRABBER_IDLE
                    this.playConveyorBeltIdleColor()
                    this.loadColorComputersOff()
                    this.restablishAssembledCar3()
                }

                if(this.scene.gameConfig.movingAssembledCar3 != null){
                    if(this.scene.gameConfig.movingAssembledCar3.x > 6410){
                        this.disableColorSprayYellow()
                    }else if(this.scene.gameConfig.movingAssembledCar3.x <= 6410 && this.scene.gameConfig.movingAssembledCar3.x > 6180){
                        this.loadColorSprayYellow()
                    }

                    if(this.scene.gameConfig.movingAssembledCar3.x > 6030){
                        this.disableColorSprayRed()
                    }
                }
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.movingAssembledCar3.x -= 1
            break
        }
    }

    movingDownBreakColor(){
        if(this.scene.gameConfig.movingAssembledCar2.y < 316){
            this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_DOWN
        }else{
            this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.conveyorBeltColorStatus = this.scene.constants.METAL_GRABBER_RIGHT
            this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_RIGHT
            this.playConveyorBeltForwardColor()
            this.loadColorComputersOn()
        }
    }

    movingIdleBreakColor(){
        if(this.scene.gameConfig.rollMetal.x < 1430){
            this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_IDLE
        }
    }

    loadColorSprayBlue(){
        if(this.scene.gameConfig.colorSpray1 == null){
            this.scene.gameConfig.colorSpray1 = this.scene.physics.add.sprite(
            0,
            0,
            'spray_blue')
            this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer1,this.scene.gameConfig.colorSpray1)
            this.scene.gameConfig.colorSpray1.x += 40
            this.scene.gameConfig.colorSpray1.y += 120
            //Align.scaleToGameW(this.scene.gameConfig.actual,.05)
            this.scene.gameConfig.colorSpray1.play("spray_blue_on")
        }
    }

    disableColorSprayBlue(){
        if(this.scene.gameConfig.colorSpray1 != null){
            this.scene.gameConfig.colorSpray1.destroy()
            this.scene.gameConfig.colorSpray1 = null
        }
    }

    loadColorSprayRed(){
        if(this.scene.gameConfig.colorSpray2 == null){
            this.scene.gameConfig.movingAssembledCar3 = this.scene.physics.add.sprite(
                0,
                0,
                'backbone_color_car')
            this.scene.gameConfig.movingAssembledCar3.x = this.scene.gameConfig.movingAssembledCar2.x
            this.scene.gameConfig.movingAssembledCar3.y = this.scene.gameConfig.movingAssembledCar2.y
            Align.scaleToGameW(this.scene.gameConfig.movingAssembledCar3,.4)
            this.movingAssembledCarColor2Status = this.scene.constants.METAL_GRABBER_RIGHT

            this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionBackboneCar2,this.scene.gameConfig.movingAssembledCar2)
            this.scene.gameConfig.movingAssembledCar2.y = 386 //386
            this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_IDLE

            this.conveyorBeltColorStatus = this.scene.constants.METAL_GRABBER_IDLE

            this.scene.gameConfig.colorSpray2 = this.scene.physics.add.sprite(
                0,
                0,
                'spray_red')
            this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer2,this.scene.gameConfig.colorSpray2)
            this.scene.gameConfig.colorSpray2.x += 40
            this.scene.gameConfig.colorSpray2.y += 120
            this.scene.gameConfig.colorSpray2.play("spray_red_on")


        }
            
    }

    disableColorSprayRed(){
        if(this.scene.gameConfig.colorSpray2 != null){
            this.scene.gameConfig.colorSpray2.destroy()
            this.scene.gameConfig.colorSpray2 = null
        }
    }

    loadColorSprayYellow(){
        if(this.scene.gameConfig.colorSpray3 == null){
            this.scene.gameConfig.colorSpray3 = this.scene.physics.add.sprite(
            0,
            0,
            'spray_yellow')
            this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer3,this.scene.gameConfig.colorSpray3)
            this.scene.gameConfig.colorSpray3.x += 40
            this.scene.gameConfig.colorSpray3.y += 120
            this.scene.gameConfig.colorSpray3.play("spray_yellow_on")
        }

    }

    disableColorSprayYellow(){
        if(this.scene.gameConfig.colorSpray3 != null){
            this.scene.gameConfig.colorSpray3.destroy()
            this.scene.gameConfig.colorSpray3 = null
        }
    }

    restablishAssembledCar3(){
        this.scene.gameConfig.movingAssembledCar3.destroy()
        this.scene.gameConfig.movingAssembledCar3 = null
    }

    loadExtraFloorPool(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.floorAssemblePoolWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolBase,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y +=44
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorAssemblePoolWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'right_edge.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'fill.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)
            }
        }
        
        let index = 0
        for(var i = 1; i <= this.scene.constants.floorAssemblePoolWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorAssemblePool[index].x,
                    this.scene.floorAssemblePool[index].y + this.scene.floorAssemblePool[index].displayHeight,
                    'factory',
                    'bottom_left.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorAssemblePoolWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)
                index+= (12)
                //log(this.scene.gameConfig.actual.x)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'factory',
                    'bottom.png'
                )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)
            }
        }

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'top_left.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel1Base,this.scene.gameConfig.actual)
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.actual.y += 10
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'top.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'top_right.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'left_edge.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel1Base,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 50
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'left_edge.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel1Base,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 90
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'left_edge.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel1Base,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 130
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)


        /*Right Post*/
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'top_left.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel2Base,this.scene.gameConfig.actual)
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.actual.y += 10
        this.scene.gameConfig.actual.x += 211
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'top.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'top_right.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'fill.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel2Base,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 50
        this.scene.gameConfig.actual.x += 211
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'right_edge.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'fill.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel2Base,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 90
        this.scene.gameConfig.actual.x += 211
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'right_edge.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'factory',
            'fill.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel2Base,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 130
        this.scene.gameConfig.actual.x += 211
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,  
            'factory',
            'fill.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y, 
            'factory',
            'right_edge.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.floorAssemblePool.push(this.scene.gameConfig.actual)
        
    }

    loadPoolAcid(){
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(0,0,'toxic_water_repeating').setOrigin(0,0)
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel1Base,this.scene.gameConfig.actual)
        Align.scaleToGameW(this.scene.gameConfig.actual,.5)
        this.scene.gameConfig.actual.x -= 15
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.pool.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
            this.scene.gameConfig.previous.y,
            'toxic_water_repeating').setOrigin(0,0)
        Align.scaleToGameW(this.scene.gameConfig.actual,.5)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.pool.push(this.scene.gameConfig.actual)
    }

    loadPoolDecorations(){
        /*this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0,0,  
            'vent'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorAssemblePoolLevel1Base,this.scene.gameConfig.pool)
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.decorationsPool.push(this.scene.gameConfig.actual)*/
    }

    loadSpritesLoader(){
        /*Loader*/
        this.scene.loader = this.scene.physics.add.sprite(0,0,"loader")
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionLoader,this.scene.loader)
        Align.scaleToGameW(this.scene.loader,.5)
        this.scene.loader.y -= 45
        this.scene.loader.x += 130
        this.scene.loader.flipX = true 
        window.loader = this.scene.loader
    }
        
    loadComputer2(){
        this.scene.gameConfig.metalComputer3 = this.scene.physics.add.sprite(
            0,
            0,
            "computer_02"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionComputer3,this.scene.gameConfig.metalComputer3)
        Align.scaleToGameW(this.scene.gameConfig.metalComputer3,.1)
        this.scene.gameConfig.metalComputer3.y += 50 
        //window.metalComputer = this.scene.gameConfig.metalComputer
    }

    loadRailColor(){
        //Poles
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'rail',
            'rail_vertical.png'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y -= 40
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railColorMetalGroup.add(this.scene.gameConfig.actual)

        //log(this.scene.gameConfig.previous.displayHeight)
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + (this.scene.gameConfig.previous.displayWidth * this.scene.constants.railMetalColorWidth),
            this.scene.gameConfig.previous.y, 
            'rail',
            'rail_vertical.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railColorMetalGroup.add(this.scene.gameConfig.actual)
        for(var i = 1; i <= this.scene.constants.railMetalColorWidth + 1; i++){
            if(i == 1 ){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0,
                    0,
                    'rail',
                    'rail_inner_bottom_left.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railColorMetalGroup.add(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.railMetalColorWidth + 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_inner_bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railColorMetalGroup.add(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_horizontal.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railColorMetalGroup.add(this.scene.gameConfig.actual)
            }
        }
    }

    loadGrabberColor(){
        this.scene.gameConfig.grabberColor1 = this.scene.physics.add.sprite(
            0,
            0,
            'runner_piece'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor,this.scene.gameConfig.grabberColor1)
        Align.scaleToGameW(this.scene.gameConfig.grabberColor1,.1)

        this.scene.gameConfig.grabberColor2 = this.scene.physics.add.sprite(
            0,
            0,
            'runner_piece'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor+2,this.scene.gameConfig.grabberColor2)
        Align.scaleToGameW(this.scene.gameConfig.grabberColor2,.1)
    }

    loadChainGrabberColor(){
        this.scene.gameConfig.cordColor1_1 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor,this.scene.gameConfig.cordColor1_1)
        this.scene.gameConfig.cordColor1_1.x += 1
        this.scene.gameConfig.cordColor1_1.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordColor1_1,.008)

        //Difference between

        this.scene.gameConfig.cordColor1_2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor,this.scene.gameConfig.cordColor1_2)
        this.scene.gameConfig.cordColor1_2.x += 1
        this.scene.gameConfig.cordColor1_2.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordColor1_2,.008)

        this.scene.gameConfig.cordColor1_3 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor,this.scene.gameConfig.cordColor1_3)
        this.scene.gameConfig.cordColor1_3.x += 1
        this.scene.gameConfig.cordColor1_3.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordColor1_3,.008)


        /*Second*/
        this.scene.gameConfig.cordColor2_1 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor+2,this.scene.gameConfig.cordColor2_1)
        this.scene.gameConfig.cordColor2_1.x += 1
        this.scene.gameConfig.cordColor2_1.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordColor2_1,.008)

        //Difference between

        this.scene.gameConfig.cordColor2_2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor+2,this.scene.gameConfig.cordColor2_2)
        this.scene.gameConfig.cordColor2_2.x += 1
        this.scene.gameConfig.cordColor2_2.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordColor2_2,.008)

        this.scene.gameConfig.cordColor2_3 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRailColor+2,this.scene.gameConfig.cordColor2_3)
        this.scene.gameConfig.cordColor2_3.x += 1
        this.scene.gameConfig.cordColor2_3.y += this.scene.constants.maxLengthCord1GrabberColor
        Align.scaleToGameW(this.scene.gameConfig.cordColor2_3,.008)
    }

    loadGrabberEndColor(){
        this.scene.gameConfig.grabberEndColor1 = this.scene.physics.add.sprite(
                    0,
                    0,
                    'grabber')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberColor,this.scene.gameConfig.grabberEndColor1)
        this.scene.gameConfig.grabberEndColor1.x += 1.5
        this.scene.gameConfig.grabberEndColor1.y += 12
        Align.scaleToGameW(this.scene.gameConfig.grabberEndColor1,.1)
        this.scene.gameConfig.grabberEndColor1.play("grabber_idle_close")

        this.scene.gameConfig.grabberEndColor2 = this.scene.physics.add.sprite(
                    0,
                    0,
                    'grabber')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabberColor+2,this.scene.gameConfig.grabberEndColor2)
        this.scene.gameConfig.grabberEndColor2.x += 1.5
        this.scene.gameConfig.grabberEndColor2.y += 12
        Align.scaleToGameW(this.scene.gameConfig.grabberEndColor2,.1)
        this.scene.gameConfig.grabberEndColor2.play("grabber_idle_close")
    }

    moveGrabberStateMachineColor(){
        switch(this.grabberColorStatus){
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.grabberColor1.x += 1
                this.scene.gameConfig.cordColor1_1.x += 1
                this.scene.gameConfig.cordColor1_2.x += 1
                this.scene.gameConfig.cordColor1_3.x += 1
                this.scene.gameConfig.grabberEndColor1.x += 1

                this.scene.gameConfig.grabberColor2.x += 1
                this.scene.gameConfig.cordColor2_1.x += 1
                this.scene.gameConfig.cordColor2_2.x += 1
                this.scene.gameConfig.cordColor2_3.x += 1
                this.scene.gameConfig.grabberEndColor2.x += 1
                this.movingGrabberRightBreakColor()
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.grabberColor1.x   -= 1
                this.scene.gameConfig.cordColor1_1.x     -= 1
                this.scene.gameConfig.cordColor1_2.x     -= 1
                this.scene.gameConfig.cordColor1_3.x     -= 1
                this.scene.gameConfig.grabberEndColor1.x -= 1

                this.scene.gameConfig.grabberColor2.x   -= 1
                this.scene.gameConfig.cordColor2_1.x     -= 1
                this.scene.gameConfig.cordColor2_2.x     -= 1
                this.scene.gameConfig.cordColor2_3.x     -= 1
                this.scene.gameConfig.grabberEndColor2.x -= 1
                this.movingGrabberLeftBreakColor()
            break
            case this.scene.constants.METAL_GRABBER_IDLE:
                switch(this.cordStatusColor){
                    case this.scene.constants.METAL_GRABBER_UP:

                        if(this.scene.gameConfig.cordColor1_3.y > this.scene.constants.maxLengthCord2Y){
                            this.scene.gameConfig.cordColor1_3.y     -= 1
                            this.scene.gameConfig.cordColor2_3.y     -= 1

                            this.scene.gameConfig.grabberEndColor1.y -= 1
                            this.scene.gameConfig.grabberEndColor2.y -= 1
                        }else if(this.scene.gameConfig.cordColor1_3.y > this.scene.constants.maxLengthCord1Y){
                            this.scene.gameConfig.cordColor1_3.y     -= 1
                            this.scene.gameConfig.cordColor2_3.y     -= 1
                            
                            this.scene.gameConfig.cordColor1_2.y     -= 1
                            this.scene.gameConfig.cordColor2_2.y     -= 1

                            this.scene.gameConfig.grabberEndColor1.y -= 1
                            this.scene.gameConfig.grabberEndColor2.y -= 1
                        }else{
                            //log(this.grabberColorStatus)
                            if(this.grabStatusColor == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabberColorStatus = this.scene.constants.METAL_GRABBER_LEFT
                            }else if(this.grabStatusColor == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabberColorStatus = this.scene.constants.METAL_GRABBER_RIGHT
                                this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_RIGHT
                            }
                        }
                    break
                    case this.scene.constants.METAL_GRABBER_DOWN:
                        if(this.scene.gameConfig.cordColor1_2.y < this.scene.constants.maxLengthCord2Y){
                            this.scene.gameConfig.cordColor1_2.y     += 1
                            this.scene.gameConfig.cordColor2_2.y     += 1

                            this.scene.gameConfig.cordColor1_3.y     += 1
                            this.scene.gameConfig.cordColor2_3.y     += 1

                            this.scene.gameConfig.grabberEndColor1.y += 1
                            this.scene.gameConfig.grabberEndColor2.y += 1
                        }else if(this.scene.gameConfig.cordColor1_3.y < this.scene.constants.maxLengthCord3Y){
                            this.scene.gameConfig.cordColor1_3.y     += 1
                            this.scene.gameConfig.cordColor2_3.y     += 1

                            this.scene.gameConfig.grabberEndColor1.y += 1
                            this.scene.gameConfig.grabberEndColor2.y += 1
                        }else{
                            if(this.grabStatusColor == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabStatusColor = this.scene.constants.METAL_GRABBER_GRAB
                                this.scene.gameConfig.grabberEndColor1.play("grabber_open")
                                this.scene.gameConfig.grabberEndColor2.play("grabber_open")
                                this.cordStatusColor = this.scene.constants.METAL_GRABBER_UP

                                /*this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionBackboneCar,this.scene.gameConfig.movingAssembledCar)
                                this.scene.gameConfig.movingAssembledCar.x -= 20
                                this.scene.gameConfig.movingAssembledCar.y -= 94

                                */
                                if(this.conveyorBeltColorStatus == this.scene.constants.METAL_GRABBER_IDLE){
                                    this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_UP
                                }
                                
                            }else if(this.grabStatusColor == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabStatusColor = this.scene.constants.METAL_GRABBER_EMPTY
                                this.scene.gameConfig.grabberEndColor1.play("grabber_open")
                                this.scene.gameConfig.grabberEndColor2.play("grabber_open")
                                this.cordStatusColor = this.scene.constants.METAL_GRABBER_UP

                            }
                        }
                    break
                    case this.scene.constants.METAL_GRABBER_IDLE:
                        
                    break
                }
            break
        }
    }

    movingGrabberRightBreakColor(){
        if(this.scene.gameConfig.grabberEndColor2.x < this.scene.railColorMetalGroup.children.entries[this.scene.railColorMetalGroup.children.entries.length-1].x){
            this.grabberColorStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.grabberColorStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatusColor    = this.scene.constants.METAL_GRABBER_DOWN
            if(this.grabStatusColor == this.scene.constants.METAL_GRABBER_GRAB){
                this.movingAssembledCarColorStatus = this.scene.constants.METAL_GRABBER_DOWN
            }
        }
    }

    movingGrabberLeftBreakColor(){
        if(this.scene.gameConfig.grabberEndColor1.x > this.scene.railColorMetalGroup.children.entries[0].x){
            this.grabberColorStatus = this.scene.constants.METAL_GRABBER_LEFT
        }else{
            this.grabberColorStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatusColor    = this.scene.constants.METAL_GRABBER_DOWN
        }
    }

    loadExtraFloorColor(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.floorMetalWidthColor; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorMetalColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y +=44
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidthColor){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'right_edge.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'fill.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
            }
        }

        let index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidthColor+1; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetalColor[index].x,
                    this.scene.floorMetalColor[index].y + this.scene.floorMetalColor[index].displayHeight,
                    'factory',
                    'bottom_left.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidthColor+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
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
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
            }
        }

        index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidthColor+1; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetalColor[index].x,
                    this.scene.floorMetalColor[index].y + this.scene.floorMetalColor[index].displayHeight,
                    'factory',
                    'top_left.png'
                    )
                this.scene.gameConfig.actual.y -= 40
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidthColor+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
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
                this.scene.floorMetalColor.push(this.scene.gameConfig.actual)
            }
        }
    }

    loadConveyorBeltColor(){
        /*Portal*/
        for(var i = 1; i <= this.scene.constants.conveyorBeltColor; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0,
                    0,
                    'conveyor_belt_style_2')
                this.scene.aGrid.placeAtIndex(this.scene.constants.startConveyorBeltColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_left")
                this.scene.conveyorBeltColorGroup.add(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.conveyorBeltColor){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'conveyor_belt_style_2')
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_right")
                this.scene.conveyorBeltColorGroup.add(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'conveyor_belt_style_2')
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_center")
                this.scene.conveyorBeltColorGroup.add(this.scene.gameConfig.actual)
            }
            
        }

        this.playConveyorBeltIdleColor()
    }

    playConveyorBeltIdleColor(){
        for(var i = 0; i < this.scene.constants.conveyorBeltColor; i++){
            if(i == 0){
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_idle_left")
            }else if(i == this.scene.constants.conveyorBeltColor - 1){
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_idle_right")
            }else{
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_idle_center")
            }
        }
    }

    playConveyorBeltForwardColor(){
        for(var i = 0; i < this.scene.constants.conveyorBeltColor; i++){
            if(i == 0){
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_forward_left")
            }else if(i == this.scene.constants.conveyorBeltColor - 1){
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_forward_right")
            }else{
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_forward_center")
            }
        }
    }
    
    playConveyorBeltBackwardColor(){
        for(var i = 0; i < this.scene.constants.conveyorBeltColor; i++){
            if(i == 0){
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_backward_left")
            }else if(i == this.scene.constants.conveyorBeltColor - 1){
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_backward_right")
            }else{
                this.scene.conveyorBeltColorGroup.children.entries[i].play("conveyor_belt_backward_center")
            }
        }
    }

    loadExtraCeilingColor(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.ceilColorWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y -=40
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilColorWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'right_edge.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'fill.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }
        }

        for(var i = 1; i <= this.scene.constants.ceilColorWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y =40
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilColorWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'right_edge.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'fill.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }
        }

        for(var i = 1; i <= this.scene.constants.ceilColorWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y =80
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilColorWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'right_edge.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'fill.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }
        }

        for(var i = 1; i <= this.scene.constants.ceilColorWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'bottom_left.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y =120
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilColorWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }
        }
    }

    loadColorCables(){
        for(var i = 1; i <= this.scene.constants.cableColorWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                0, 
                0, 
                'green_bendy'
                )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCableColor,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.25)
                this.scene.gameConfig.actual.x -=35
                this.scene.gameConfig.actual.y +=40
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.cableMetalColor.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth, 
                this.scene.gameConfig.previous.y, 
                'green_bendy'
                )
                Align.scaleToGameW(this.scene.gameConfig.actual,.25)
                //this.scene.gameConfig.actual.y -=40
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.cableMetalColor.push(this.scene.gameConfig.actual)
            }
            
        }
    }

    loadColorSprays(){
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        0, 
        0, 
        'connector_blue'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startCableColor,this.scene.gameConfig.actual)
        Align.scaleToGameW(this.scene.gameConfig.actual,.08)
        //this.scene.gameConfig.actual.x -=35
        this.scene.gameConfig.actual.y +=45
        this.scene.gameConfig.actual.rotation -= 0.40;
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.spraysMetalColor.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        0, 
        0, 
        'connector_red'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startCableColor,this.scene.gameConfig.actual)
        Align.scaleToGameW(this.scene.gameConfig.actual,.08)
        this.scene.gameConfig.actual.x +=120
        this.scene.gameConfig.actual.y +=45
        this.scene.gameConfig.actual.rotation += 0.60;
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.spraysMetalColor.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        0, 
        0, 
        'connector_yellow'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startCableColor,this.scene.gameConfig.actual)
        Align.scaleToGameW(this.scene.gameConfig.actual,.08)
        this.scene.gameConfig.actual.x +=320
        this.scene.gameConfig.actual.y +=45
        this.scene.gameConfig.actual.rotation += 0.60;
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.spraysMetalColor.push(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
        0, 
        0, 
        'connector_green'
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startCableColor,this.scene.gameConfig.actual)
        Align.scaleToGameW(this.scene.gameConfig.actual,.08)
        this.scene.gameConfig.actual.x +=490
        this.scene.gameConfig.actual.y +=30
        this.scene.gameConfig.actual.rotation += 0.40;
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.spraysMetalColor.push(this.scene.gameConfig.actual)
    }

    loadColorComputersOff(){
        if(this.scene.gameConfig.colorComputer1 != null){
            this.scene.gameConfig.colorComputer1.destroy()
        }
        this.scene.gameConfig.colorComputer1 = this.scene.physics.add.sprite(
            0,
            0,
            "reactor_off"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer1,this.scene.gameConfig.colorComputer1)
        this.scene.gameConfig.colorComputer1.flipY = true
        Align.scaleToGameW(this.scene.gameConfig.colorComputer1,.2)
        this.scene.gameConfig.colorComputer1.x += 40
        this.scene.gameConfig.colorComputer1.y += 35

        if(this.scene.gameConfig.colorComputer2 != null){
            this.scene.gameConfig.colorComputer2.destroy()
        }
        this.scene.gameConfig.colorComputer2 = this.scene.physics.add.sprite(
            0,
            0,
            "reactor_off"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer2,this.scene.gameConfig.colorComputer2)
        this.scene.gameConfig.colorComputer2.flipY = true
        Align.scaleToGameW(this.scene.gameConfig.colorComputer2,.2)
        this.scene.gameConfig.colorComputer2.x += 40
        this.scene.gameConfig.colorComputer2.y += 35

        if(this.scene.gameConfig.colorComputer3 != null){
            this.scene.gameConfig.colorComputer3.destroy()
        }
        this.scene.gameConfig.colorComputer3 = this.scene.physics.add.sprite(
            0,
            0,
            "reactor_off"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer3,this.scene.gameConfig.colorComputer3)
        this.scene.gameConfig.colorComputer3.flipY = true
        Align.scaleToGameW(this.scene.gameConfig.colorComputer3,.2)
        this.scene.gameConfig.colorComputer3.x += 40
        this.scene.gameConfig.colorComputer3.y += 35
    }

    loadColorComputersOn(){
        if(this.scene.gameConfig.colorComputer1 != null){
            this.scene.gameConfig.colorComputer1.destroy()
        }
        this.scene.gameConfig.colorComputer1 = this.scene.physics.add.sprite(
            0,
            0,
            "reactor_on"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer1,this.scene.gameConfig.colorComputer1)
        this.scene.gameConfig.colorComputer1.flipY = true
        Align.scaleToGameW(this.scene.gameConfig.colorComputer1,.2)
        this.scene.gameConfig.colorComputer1.x += 40
        this.scene.gameConfig.colorComputer1.y += 35
        
        if(this.scene.gameConfig.colorComputer2 != null){
            this.scene.gameConfig.colorComputer2.destroy()
        }
        this.scene.gameConfig.colorComputer2 = this.scene.physics.add.sprite(
            0,
            0,
            "reactor_on"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer2,this.scene.gameConfig.colorComputer2)
        this.scene.gameConfig.colorComputer2.flipY = true
        Align.scaleToGameW(this.scene.gameConfig.colorComputer2,.2)
        this.scene.gameConfig.colorComputer2.x += 40
        this.scene.gameConfig.colorComputer2.y += 35

        if(this.scene.gameConfig.colorComputer3 != null){
            this.scene.gameConfig.colorComputer3.destroy()
        }
        this.scene.gameConfig.colorComputer3 = this.scene.physics.add.sprite(
            0,
            0,
            "reactor_on"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionColorComputer3,this.scene.gameConfig.colorComputer3)
        this.scene.gameConfig.colorComputer3.flipY = true
        Align.scaleToGameW(this.scene.gameConfig.colorComputer3,.2)
        this.scene.gameConfig.colorComputer3.x += 40
        this.scene.gameConfig.colorComputer3.y += 35
    }

    loadParkedCar(){
        this.scene.gameConfig.movingAssembledCarParked = this.scene.physics.add.sprite(
            6550.27272727,
            316,
            "backbone_color_car"
        )
        Align.scaleToGameW(this.scene.gameConfig.movingAssembledCarParked,.4)
    }

}