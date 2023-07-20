class MetalGroup{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene

        this.grabberStatus = this.scene.constants.METAL_GRABBER_IDLE
        this.cordStatus    = this.scene.constants.METAL_GRABBER_DOWN
        this.grabStatus    = this.scene.constants.METAL_GRABBER_EMPTY

        this.stomperStatus = this.scene.constants.METAL_GRABBER_UP
        this.rollMetalStatus= this.scene.constants.METAL_GRABBER_IDLE	
        this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_IDLE	
	}

    makeAnims(){
        this.scene.anims.create({
            key: 'conveyor_belt_backward_center',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[1,2], zeroPad: 3, prefix: 'conveyor_belt_style_2_center_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_backward_left',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[1,2], zeroPad: 3, prefix: 'conveyor_belt_style_2_left_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_backward_right',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[1,2], zeroPad: 3, prefix: 'conveyor_belt_style_2_right_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_forward_center',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[2,1], zeroPad: 3, prefix: 'conveyor_belt_style_2_center_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_forward_left',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[2,1], zeroPad: 3, prefix: 'conveyor_belt_style_2_left_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_forward_right',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[2,1], zeroPad: 3, prefix: 'conveyor_belt_style_2_right_', suffix: '.png'}),
            frameRate: 15,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_idle_center',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[2,1], zeroPad: 3, prefix: 'conveyor_belt_style_2_center_', suffix: '.png'}),
            frameRate: 0,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_idle_left',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[2,1], zeroPad: 3, prefix: 'conveyor_belt_style_2_left_', suffix: '.png'}),
            frameRate: 0,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'conveyor_belt_idle_right',
            frames: this.scene.anims.generateFrameNames('conveyor_belt_style_2', {frames:[2,1], zeroPad: 3, prefix: 'conveyor_belt_style_2_right_', suffix: '.png'}),
            frameRate: 0,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'grabber_open',
            frames: this.scene.anims.generateFrameNames('grabber', {frames:[4,3,2], zeroPad: 2, prefix: 'grabber_', suffix: '.png'}),
            frameRate: 2,
            repeat: 0
        })
        this.scene.anims.create({
            key: 'grabber_close',
            frames: this.scene.anims.generateFrameNames('grabber', {frames:[1,2,3,4], zeroPad: 2, prefix: 'grabber_', suffix: '.png'}),
            frameRate: 2,
            repeat: 0
        })
        this.scene.anims.create({
            key: 'grabber_idle_close',
            frames: this.scene.anims.generateFrameNames('grabber', {frames:[4], zeroPad: 2, prefix: 'grabber_', suffix: '.png'}),
            frameRate: 2,
            repeat: 0
        })
        this.scene.anims.create({
            key: 'grabber_idle_open',
            frames: this.scene.anims.generateFrameNames('grabber', {frames:[2], zeroPad: 2, prefix: 'grabber_', suffix: '.png'}),
            frameRate: 2,
            repeat: 0
        })
        this.scene.anims.create({
            key: 'bomb_blast',
            frames: this.scene.anims.generateFrameNames('smash', {frames:[1,2,3,4,5,6,7], zeroPad: 2, prefix: 'bomb_blast_', suffix: '.png'}),
            frameRate: 10,
            repeat: -1
        })
    }

	loadSprites(){
        this.loadRail()
        this.loadStomper()
        this.loadExtraFloor()
        this.loadConveyorBelt()
        this.loadExtraCeiling()
        this.loadRollMetal()
        this.loadChainGrabber()
        this.loadGrabber()
        this.loadGrabberEnd()
        this.loadMetal()
        this.loadShelving()
        this.loadComputer()
        this.loadExtraFloorQualityAssurance()
        this.loadConveyorBeltQualityAssurance()
        this.loadMachineQualityAssurance()
        this.loadShelvingDoors()
        this.loadDoorsCars()
	}

    loadMetal(){
        /*Factory*/
        var metalRounds = this.scene.constants.METAL_ROUNDS

        var firstOne = null
        for(var j = 1; j <= this.scene.constants.METAL_LEVELS; j++){
            var initialX = 0
            var initialY = 0
            if(j != 1){
                //log(this.scene.gameConfig.previous.y + " " + this.scene.gameConfig.previous.displayHeight)
                //initialX = this.scene.gameConfig.previous.x + (this.scene.gameConfig.previous.displayWidth / 0.5)                
                initialX = firstOne.x + (firstOne.displayWidth / 2)
                initialY = this.scene.gameConfig.previous.y - this.scene.gameConfig.previous.displayHeight + 55
                //log(initialY)
            }
            //log(initialX + " " + initialY)
            for(var i = 1; i <= metalRounds; i++){       
                if(i == 1){
                    this.scene.gameConfig.actual = this.scene.physics.add.sprite(initialX,initialY,'metal')
                    if(j == 1){
                        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionMetalRounds,this.scene.gameConfig.actual)
                    }
                    this.scene.gameConfig.actual.y -=43
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    Align.scaleToGameW(this.scene.gameConfig.actual,.08)
                    this.scene.metalGroup.add(this.scene.gameConfig.actual)
                    this.scene.gameConfig.actual.setImmovable()
                    firstOne = this.scene.gameConfig.actual
                }else{
                    this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                        this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                        this.scene.gameConfig.previous.y,
                        'metal')
                    this.scene.gameConfig.actual.x -= 12
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    Align.scaleToGameW(this.scene.gameConfig.actual,.08)
                    this.scene.metalGroup.add(this.scene.gameConfig.actual)
                    this.scene.gameConfig.actual.setImmovable()
                }
            }
            metalRounds--
            
        }
            
    }

    loadShelving(){
        var firstOne = null

        var initialX = 0
        var initialY = 0
        for(var j = 1; j <= this.scene.constants.METAL_LEVELS; j++){
            for(var i = 1; i <= this.scene.constants.METAL_SHELVING; i++){       
                if(i == 1){
                    this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                        initialX,
                        initialY,
                        'shelving')
                    this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionShelving,this.scene.gameConfig.actual)
                    this.scene.gameConfig.actual.x +=8
                    this.scene.gameConfig.actual.y +=5
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    Align.scaleToGameW(this.scene.gameConfig.actual,.16)
                    this.scene.metalGroup.add(this.scene.gameConfig.actual)
                    this.scene.gameConfig.actual.setImmovable()
                    firstOne = this.scene.gameConfig.actual
                }else{
                    this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                        this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                        this.scene.gameConfig.previous.y,
                        'shelving')
                    this.scene.gameConfig.actual.x -= 12
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    Align.scaleToGameW(this.scene.gameConfig.actual,.16)
                    this.scene.metalGroup.add(this.scene.gameConfig.actual)
                    this.scene.gameConfig.actual.setImmovable()
                }
            }
        }
            
    }

    loadComputer(){
        metalComputer = this.scene.physics.add.sprite(
            0,
            0,
            "computer_01"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionComputer,metalComputer)
        Align.scaleToGameW(metalComputer,.2)
        metalComputer.y += 40 
        //window.metalComputer = this.scene.gameConfig.metalComputer
    }

    loadExtraFloor(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.floorMetalWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorMetal,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y +=44
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidth){
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

        let index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidth+1; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetal[index].x,
                    this.scene.floorMetal[index].y + this.scene.floorMetal[index].displayHeight,
                    'factory',
                    'bottom_left.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidth+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
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
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }
        }

        index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidth+1; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetal[index].x,
                    this.scene.floorMetal[index].y + this.scene.floorMetal[index].displayHeight,
                    'factory',
                    'top_left.png'
                    )
                this.scene.gameConfig.actual.y -= 40
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidth+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
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
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }
        }
    }

    loadConveyorBelt(){
        /*Portal*/
        for(var i = 1; i <= this.scene.constants.conveyorBeltMetal; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0,
                    0,
                    'conveyor_belt_style_2')
                this.scene.aGrid.placeAtIndex(this.scene.constants.startConveyorBelt,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_left")
                this.scene.conveyorBeltMetalGroup.add(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.conveyorBeltMetal){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'conveyor_belt_style_2')
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_right")
                this.scene.conveyorBeltMetalGroup.add(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'conveyor_belt_style_2')
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_center")
                this.scene.conveyorBeltMetalGroup.add(this.scene.gameConfig.actual)
            }
            
        }

        this.playConveyorBeltIdle()
    }

    playConveyorBeltIdle(){
        for(var i = 0; i < this.scene.constants.conveyorBeltMetal; i++){
            if(i == 0){
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_idle_left")
            }else if(i == this.scene.constants.conveyorBeltMetal - 1){
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_idle_right")
            }else{
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_idle_center")
            }
        }
    }

    playConveyorBeltForward(){
        for(var i = 0; i < this.scene.constants.conveyorBeltMetal; i++){
            if(i == 0){
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_forward_left")
            }else if(i == this.scene.constants.conveyorBeltMetal - 1){
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_forward_right")
            }else{
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_forward_center")
            }
        }
    }
    
    playConveyorBeltBackward(){
        for(var i = 0; i < this.scene.constants.conveyorBeltMetal; i++){
            if(i == 0){
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_backward_left")
            }else if(i == this.scene.constants.conveyorBeltMetal - 1){
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_backward_right")
            }else{
                this.scene.conveyorBeltMetalGroup.children.entries[i].play("conveyor_belt_backward_center")
            }
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
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRail,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y -= 40
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railMetalGroup.add(this.scene.gameConfig.actual)

        //log(this.scene.gameConfig.previous.displayHeight)
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            this.scene.gameConfig.previous.x + (this.scene.gameConfig.previous.displayWidth * this.scene.constants.railMetalWidth),
            this.scene.gameConfig.previous.y, 
            'rail',
            'rail_vertical.png'
            )
        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.railMetalGroup.add(this.scene.gameConfig.actual)
        for(var i = 1; i <= 15; i++){
            if(i == 1 ){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0,
                    0,
                    'rail',
                    'rail_inner_bottom_left.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRail,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railMetalGroup.add(this.scene.gameConfig.actual)
            }else if(i == 15){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_inner_bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railMetalGroup.add(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'rail',
                    'rail_horizontal.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.railMetalGroup.add(this.scene.gameConfig.actual)
            }
        }
    }

    loadGrabber(){
        this.scene.grabber = this.scene.physics.add.sprite(
            0,
            0,
            'runner_piece'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionRail,this.scene.grabber)
        Align.scaleToGameW(this.scene.grabber,.1)
    }

    loadChainGrabber(){
        this.scene.cord1 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabber,this.scene.cord1)
        this.scene.cord1.x += 1
        this.scene.cord1.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.cord1,.008)

        //Difference between

        this.scene.cord2 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabber,this.scene.cord2)
        this.scene.cord2.x += 1
        this.scene.cord2.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.cord2,.008)

        this.scene.cord3 = this.scene.physics.add.sprite(
            0, 
            0, 
            'cord'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabber,this.scene.cord3)
        this.scene.cord3.x += 1
        this.scene.cord3.y += this.scene.constants.maxLengthCord1Grabber
        Align.scaleToGameW(this.scene.cord3,.008)
    }

    loadGrabberEnd(){
        this.scene.grabberEnd = this.scene.physics.add.sprite(
                    0,
                    0,
                    'grabber')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPoistionGrabber,this.scene.grabberEnd)
        this.scene.grabberEnd.x += 1.5
        this.scene.grabberEnd.y += 12
        Align.scaleToGameW(this.scene.grabberEnd,.1)
        this.scene.grabberEnd.play("grabber_idle_close")
    }

    moveGrabberStateMachine(){
        switch(this.grabberStatus){
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.grabber.x += 1
                this.scene.cord1.x += 1
                this.scene.cord2.x += 1
                this.scene.cord3.x += 1
                this.scene.grabberEnd.x += 1
                this.movingGrabberRightBreak()
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.grabber.x -= 1
                this.scene.cord1.x -= 1
                this.scene.cord2.x -= 1
                this.scene.cord3.x -= 1
                this.scene.grabberEnd.x -= 1
                this.movingGrabberLeftBreak()
            break
            case this.scene.constants.METAL_GRABBER_IDLE:
                switch(this.cordStatus){
                    case this.scene.constants.METAL_GRABBER_UP:
                        if(this.scene.cord3.y > this.scene.constants.maxLengthCord2Y){
                            this.scene.cord3.y -= 1
                            this.scene.grabberEnd.y -= 1
                        }else if(this.scene.cord3.y > this.scene.constants.maxLengthCord1Y){
                            this.scene.cord3.y -= 1
                            this.scene.cord2.y -= 1
                            this.scene.grabberEnd.y -= 1
                        }else{
                            if(this.grabStatus == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabberStatus = this.scene.constants.METAL_GRABBER_LEFT
                            }else if(this.grabStatus == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabberStatus = this.scene.constants.METAL_GRABBER_RIGHT
                                this.rollMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
                            }
                        }
                    break
                    case this.scene.constants.METAL_GRABBER_DOWN:
                        if(this.scene.cord2.y < this.scene.constants.maxLengthCord2Y){
                            this.scene.cord2.y += 1
                            this.scene.cord3.y += 1
                            this.scene.grabberEnd.y += 1
                        }else if(this.scene.cord3.y < this.scene.constants.maxLengthCord3Y){
                            this.scene.cord3.y += 1
                            this.scene.grabberEnd.y += 1
                        }else{
                            if(this.grabStatus == this.scene.constants.METAL_GRABBER_EMPTY){
                                this.grabStatus = this.scene.constants.METAL_GRABBER_GRAB
                                this.scene.grabberEnd.play("grabber_open")
                                this.cordStatus = this.scene.constants.METAL_GRABBER_UP
                                this.rollMetalStatus = this.scene.constants.METAL_GRABBER_UP
                            }else if(this.grabStatus == this.scene.constants.METAL_GRABBER_GRAB){
                                this.grabStatus = this.scene.constants.METAL_GRABBER_EMPTY
                                this.scene.grabberEnd.play("grabber_close")
                                this.cordStatus = this.scene.constants.METAL_GRABBER_UP
                                this.playConveyorBeltForward()
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
        if(this.scene.grabber.x < this.scene.railMetalGroup.children.entries[this.scene.railMetalGroup.children.entries.length-1].x){
            //log(this.scene.grabber.x + " " + this.scene.railMetalGroup.children.entries[this.scene.railMetalGroup.children.entries.length-1].x)
            this.grabberStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.grabberStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatus    = this.scene.constants.METAL_GRABBER_DOWN
            if(this.grabStatus == this.scene.constants.METAL_GRABBER_GRAB){
                this.rollMetalStatus = this.scene.constants.METAL_GRABBER_DOWN
            }
        }
    }

    movingGrabberLeftBreak(){
        if(this.scene.grabber.x > this.scene.railMetalGroup.children.entries[0].x){
            //log(this.scene.grabber.x + " " + this.scene.railMetalGroup.children.entries[0].x)
            this.grabberStatus = this.scene.constants.METAL_GRABBER_LEFT
        }else{
            this.grabberStatus = this.scene.constants.METAL_GRABBER_IDLE
            this.cordStatus    = this.scene.constants.METAL_GRABBER_DOWN
        }
    }

    loadExtraCeiling(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.ceilMetalWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilMetal,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y -=40
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilMetalWidth){
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

        for(var i = 1; i <= this.scene.constants.ceilMetalWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilMetal,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y =40
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilMetalWidth){
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

        for(var i = 1; i <= this.scene.constants.ceilMetalWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilMetal,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y =80
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilMetalWidth){
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

        for(var i = 1; i <= this.scene.constants.ceilMetalWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'bottom_left.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startCeilMetal,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y =120
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetal.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.ceilMetalWidth){
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

    loadStomper(){
        this.scene.gameConfig.stomper = this.scene.physics.add.sprite(
            0, 
            0, 
            'down_press'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionDownPress,this.scene.gameConfig.stomper)
        this.scene.gameConfig.stomper.y += 45
        //this.scene.stomper.y -= 5
        this.scene.gameConfig.stomper.x += 20
        Align.scaleToGameW(this.scene.gameConfig.stomper,.1)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'stomper_machine'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionStompCeil,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 40
        Align.scaleToGameW(this.scene.gameConfig.actual,.2)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.stomperMetalGroup.add(this.scene.gameConfig.actual)

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0, 
            0, 
            'stomper_base_fixed'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionStompBase,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y += 40
        this.scene.gameConfig.actual.x += 20
        Align.scaleToGameW(this.scene.gameConfig.actual,.2)
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        this.scene.stomperMetalGroup.add(this.scene.gameConfig.actual)
    }

    moveStomperStateMachine(){
        this.stomperStatus
        switch(this.stomperStatus){
            case this.scene.constants.METAL_GRABBER_DOWN:
                this.scene.gameConfig.stomper.y += 1
                this.movingStomperDownBreak()
            break
            case this.scene.constants.METAL_GRABBER_UP:
                this.scene.gameConfig.stomper.y -= 1
                this.movingStomperUpBreak()
            break
        }
    }

    movingStomperDownBreak(){
        //log(this.scene.stomper.y + " " + 345)
        if(this.scene.gameConfig.stomper.y <= 345){
            this.stomperStatus = this.scene.constants.METAL_GRABBER_DOWN
        }else{
            //log(2)
            this.stomperStatus = this.scene.constants.METAL_GRABBER_UP
        }
    }

    movingStomperUpBreak(){
        //log(this.scene.stomper.y + " " + 295)
        if(this.scene.gameConfig.stomper.y >= 285){
            this.stomperStatus = this.scene.constants.METAL_GRABBER_UP
        }else{
            this.stomperStatus = this.scene.constants.METAL_GRABBER_DOWN
        }
    }

    loadRollMetal(){
        this.scene.gameConfig.rollMetal = this.scene.physics.add.sprite(
            0, 
            0, 
            'metal'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionRollMetal,this.scene.gameConfig.rollMetal)
        this.scene.gameConfig.rollMetal.y += 45
        Align.scaleToGameW(this.scene.gameConfig.rollMetal,.08)
        this.scene.physics.add.overlap(this.scene.gameConfig.rollMetal,this.scene.gameConfig.stomper,this.stompMetal,null,this)
    }

    stompMetal(rollMetal,stomper){
        //this.loadRollMetal()
        this.loadStompedMetal()
        this.scene.gameConfig.rollMetal.x = 472.72727272727275
        this.scene.gameConfig.rollMetal.y = 345
        this.rollMetalStatus = this.scene.constants.METAL_GRABBER_IDLE
        this.playConveyorBeltIdle()
    }

    loadStompedMetal(){
        if(this.scene.gameConfig.stompedMetal != null){
            this.scene.gameConfig.stompedMetal.destroy()
        }

        this.scene.gameConfig.stompedMetal = this.scene.physics.add.sprite(
            0, 
            0, 
            'smash'
            )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionStompedMetal,this.scene.gameConfig.stompedMetal)
        this.scene.gameConfig.stompedMetal.x += 20
        this.scene.gameConfig.stompedMetal.y -= 25
        this.scene.gameConfig.stompedMetal.play("bomb_blast")
        Align.scaleToGameW(this.scene.gameConfig.stompedMetal,.1)

        this.scene.time.addEvent({ delay: 1000, callback: function(){
            if(this.scene.gameConfig.stompedMetal != null){
                this.scene.gameConfig.stompedMetal.destroy()
            }
            this.scene.gameConfig.stompedMetal = this.scene.physics.add.sprite(
                0, 
                0, 
                'stomper_uppusher_for_behind'
                )
            this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionStompedMetal,this.scene.gameConfig.stompedMetal)
            this.scene.gameConfig.stompedMetal.x += 20
            this.scene.gameConfig.stompedMetal.y -= 25
            Align.scaleToGameW(this.scene.gameConfig.stompedMetal,.08)
            this.playConveyorBeltForwardQualityAssurance()

            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }, callbackScope: this, loop: false });
    }

    moveRollMetalStateMachine(){
        switch(this.rollMetalStatus){
            case this.scene.constants.METAL_GRABBER_DOWN:
                this.scene.gameConfig.rollMetal.y += 1
                this.movingDownBreak()
            break
            case this.scene.constants.METAL_GRABBER_UP:
                this.scene.gameConfig.rollMetal.y -= 1
            break
            case this.scene.constants.METAL_GRABBER_RIGHT:
                this.scene.gameConfig.rollMetal.x += 1
                this.movingIdleBreak()
            break
            case this.scene.constants.METAL_GRABBER_LEFT:
                this.scene.gameConfig.rollMetal.x -= 1
            break
        }
    }

    movingDownBreak(){
        if(this.scene.gameConfig.rollMetal.y < 375){
            this.rollMetalStatus = this.scene.constants.METAL_GRABBER_DOWN
        }else{
            this.rollMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }
    }

    movingIdleBreak(){
        if(this.scene.gameConfig.rollMetal.x < 1430){
            this.rollMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.rollMetalStatus = this.scene.constants.METAL_GRABBER_IDLE
        }
    }

    moveStompedMetalStateMachine(){
        switch(this.stompedMetalStatus){
            case this.scene.constants.METAL_GRABBER_RIGHT:
                //log(this.scene.gameConfig.stompedMetal.x)
                this.scene.gameConfig.stompedMetal.x += 1
                this.movingIdleBreakStompedMetal()
            break
        }
    }

    movingIdleBreakStompedMetal(){
        if(this.scene.gameConfig.stompedMetal.x >= 2300){
            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_IDLE
        }else if(this.scene.gameConfig.stompedMetal.x < 2300 && this.scene.gameConfig.stompedMetal.x >= 2200){
            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else if(this.scene.gameConfig.stompedMetal.x < 2200 && this.scene.gameConfig.stompedMetal.x >= 2160){
            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT

            var x = this.scene.gameConfig.stompedMetal.x
            var y = this.scene.gameConfig.stompedMetal.y
            if(this.scene.gameConfig.stompedMetal != null){
                this.scene.gameConfig.stompedMetal.destroy()
            }
            this.scene.gameConfig.stompedMetal = this.scene.physics.add.sprite(
                x, 
                y, 
                'stomper_uppusher_for_behind'
                )
            Align.scaleToGameW(this.scene.gameConfig.stompedMetal,.08)
        }else if(this.scene.gameConfig.stompedMetal.x < 2160 && this.scene.gameConfig.stompedMetal.x >= 2020){
            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else if(this.scene.gameConfig.stompedMetal.x < 2020 && this.scene.gameConfig.stompedMetal.x >= 2000){
            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT

            var x = this.scene.gameConfig.stompedMetal.x
            var y = this.scene.gameConfig.stompedMetal.y
            if(this.scene.gameConfig.stompedMetal != null){
                this.scene.gameConfig.stompedMetal.destroy()
            }
            this.scene.gameConfig.stompedMetal = this.scene.physics.add.sprite(
            x, 
            y, 
            'smash'
            )
            this.scene.gameConfig.stompedMetal.y -= 0.5
            this.scene.gameConfig.stompedMetal.play("bomb_blast")
            Align.scaleToGameW(this.scene.gameConfig.stompedMetal,.1)
        }else if(this.scene.gameConfig.stompedMetal.x < 2000 && this.scene.gameConfig.stompedMetal.x >= 1900){
            this.playConveyorBeltIdleQualityAssurance()
            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }else{
            this.stompedMetalStatus = this.scene.constants.METAL_GRABBER_RIGHT
        }
    }


    loadExtraFloorQualityAssurance(){
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.floorMetalWidth; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'left_edge.png'
                    )
                this.scene.aGrid.placeAtIndex(this.scene.constants.startFloorMetalQualityAssurance,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y +=44
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidth){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'right_edge.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'fill.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
            }
        }

        let index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidth+11; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetalQualityAssurance[index].x,
                    this.scene.floorMetalQualityAssurance[index].y + this.scene.floorMetalQualityAssurance[index].displayHeight,
                    'factory',
                    'bottom_left.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidth+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
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
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
            }
        }

        index = 0
        for(var i = 1; i <= this.scene.constants.floorMetalWidth+1; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorMetalQualityAssurance[index].x,
                    this.scene.floorMetalQualityAssurance[index].y + this.scene.floorMetalQualityAssurance[index].displayHeight,
                    'factory',
                    'top_left.png'
                    )
                this.scene.gameConfig.actual.y -= 40
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.floorMetalWidth+1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
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
                this.scene.floorMetalQualityAssurance.push(this.scene.gameConfig.actual)
            }
        }
    }

    loadConveyorBeltQualityAssurance(){
        /*Portal*/
        for(var i = 1; i <= this.scene.constants.conveyorBeltMetal; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0,
                    0,
                    'conveyor_belt_style_2')
                this.scene.aGrid.placeAtIndex(this.scene.constants.startConveyorBeltQualityAssurance,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_left")
                this.scene.conveyorBeltMetalGroupQualityAssurance.add(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.conveyorBeltMetal){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'conveyor_belt_style_2')
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_right")
                this.scene.conveyorBeltMetalGroupQualityAssurance.add(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'conveyor_belt_style_2')
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.setGravityY(200)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.gameConfig.actual.play("conveyor_belt_idle_center")
                this.scene.conveyorBeltMetalGroupQualityAssurance.add(this.scene.gameConfig.actual)
            }
            
        }

        this.playConveyorBeltIdleQualityAssurance()
    }

    playConveyorBeltIdleQualityAssurance(){
        for(var i = 0; i < this.scene.constants.conveyorBeltMetal; i++){
            if(i == 0){
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_idle_left")
            }else if(i == this.scene.constants.conveyorBeltMetal - 1){
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_idle_right")
            }else{
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_idle_center")
            }
        }
    }

    playConveyorBeltForwardQualityAssurance(){
        for(var i = 0; i < this.scene.constants.conveyorBeltMetal; i++){
            if(i == 0){
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_forward_left")
            }else if(i == this.scene.constants.conveyorBeltMetal - 1){
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_forward_right")
            }else{
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_forward_center")
            }
        }
    }
    
    playConveyorBeltBackwardQualityAssurance(){
        for(var i = 0; i < this.scene.constants.conveyorBeltMetal; i++){
            if(i == 0){
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_backward_left")
            }else if(i == this.scene.constants.conveyorBeltMetal - 1){
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_backward_right")
            }else{
                this.scene.conveyorBeltMetalGroupQualityAssurance.children.entries[i].play("conveyor_belt_backward_center")
            }
        }
    }

    loadMachineQualityAssurance(){
        this.scene.gameConfig.machineQualityAssurance = this.scene.physics.add.sprite(
            0,
            0,
            "machine_quality_assurance"
        )
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionComputerQualityAssurance,this.scene.gameConfig.machineQualityAssurance)
        Align.scaleToGameW(this.scene.gameConfig.machineQualityAssurance,.5)
        this.scene.gameConfig.machineQualityAssurance.y -= 33
        this.scene.gameConfig.machineQualityAssurance.x += 40 
    }

    loadShelvingDoors(){
        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0,
            0,
            'shelving')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionShelvingDoor,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.y -=50
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        Align.scaleToGameW(this.scene.gameConfig.actual,.25)
        this.scene.metalShelvingDoor.add(this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.setImmovable()

        this.scene.gameConfig.actual = this.scene.physics.add.sprite(
            0,0,
            'shelving')
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionShelvingDoor,this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.x += this.scene.gameConfig.previous.displayWidth
        this.scene.gameConfig.actual.y = this.scene.gameConfig.previous.y
        this.scene.gameConfig.previous = this.scene.gameConfig.actual
        Align.scaleToGameW(this.scene.gameConfig.actual,.25)
        this.scene.metalShelvingDoor.add(this.scene.gameConfig.actual)
        this.scene.gameConfig.actual.setImmovable()
            
    }

    loadDoorsCars(){
        for(var i = 1; i <= this.scene.constants.DOORS_SHELVING; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                0,
                0,
                'door_car')
                this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionShelvingDoor,this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.x -= 45
                this.scene.gameConfig.actual.y -= 100
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.gameConfig.previous.x + 15,
                this.scene.gameConfig.previous.y,
                'door_car')
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }
               
        }

        for(var i = 1; i <= this.scene.constants.DOORS_SHELVING; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                0,
                0,
                'door_car')
                this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionShelvingDoor,this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.x -= 45
                this.scene.gameConfig.actual.y += 35
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.gameConfig.previous.x + 15,
                this.scene.gameConfig.previous.y,
                'door_car')
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }
               
        }

        for(var i = 1; i <= this.scene.constants.DOORS_SHELVING; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.metalShelvingDoor.children.entries[1].x,
                this.scene.metalShelvingDoor.children.entries[1].y,
                'door_car')
                this.scene.gameConfig.actual.x -= 45
                this.scene.gameConfig.actual.y -= 50
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.gameConfig.previous.x + 15,
                this.scene.gameConfig.previous.y,
                'door_car')
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }
               
        } 

        for(var i = 1; i <= this.scene.constants.DOORS_SHELVING; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.metalShelvingDoor.children.entries[1].x,
                this.scene.metalShelvingDoor.children.entries[1].y,
                'door_car')
                this.scene.gameConfig.actual.x -= 45
                this.scene.gameConfig.actual.y += 85
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.gameConfig.previous.x + 15,
                this.scene.gameConfig.previous.y,
                'door_car')
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.metalCarDoors.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }
               
        }
    }

}
