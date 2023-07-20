class Factory{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene
		
	}

    makeAnims(){
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
        this.loadSpritesLoader()
        this.loadSpritesFactory()
        this.loadSpritesDoors()
        this.loadSpritesWindows()
        this.loadSpritesPowerPlant()
	}

    loadSpritesLoader(){
        /*Loader*/
        this.scene.loader = this.scene.physics.add.sprite(0,0,"loader")
        this.scene.aGrid.placeAtIndex(36,this.scene.loader)
        Align.scaleToGameW(this.scene.loader,.2)
        this.scene.loader.y += 15 
        window.loader = this.scene.loader
    }

    loadSpritesFactory(){
        /*Factory*/
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.buildingWidthFactory; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory',
                    'top_left.png'
                    )
                this.scene.aGrid.placeAtIndex(26,this.scene.gameConfig.actual)
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.actual.y +=40
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.factoryBuilding.push(this.scene.gameConfig.actual)
            }else if(i == this.scene.constants.buildingWidthFactory){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.factoryBuilding.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.factoryBuilding.push(this.scene.gameConfig.actual)
            }
        }

        let index = 0
        for(var j = 1; j <= this.scene.constants.buildingHeightFactory; j++){
            for(var i = 1; i <= this.scene.constants.buildingWidthFactory; i++){
                if(i == 1){
                    this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                        this.scene.factoryBuilding[index].x,
                        this.scene.factoryBuilding[index].y + this.scene.factoryBuilding[index].displayHeight,
                        'factory',
                        (j == this.scene.constants.buildingHeightFactory) ? 'bottom_left.png' : 'left_edge.png'
                        )
                    Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    this.scene.factoryBuilding.push(this.scene.gameConfig.actual)
                }else if(i == this.scene.constants.buildingWidthFactory){
                    this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                        this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                        this.scene.gameConfig.previous.y, 
                        'factory',
                        (j == this.scene.constants.buildingHeightFactory) ? 'bottom_right.png' : 'right_edge.png'
                        )
                    Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    this.scene.factoryBuilding.push(this.scene.gameConfig.actual)
                    index+= (12)
                }else{
                    this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                        this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                        this.scene.gameConfig.previous.y,
                        'factory',
                        (j == this.scene.constants.buildingHeightFactory) ? 'bottom.png' : 'fill.png'
                    )
                    Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    this.scene.factoryBuilding.push(this.scene.gameConfig.actual)
                }
            }
        }
    }

    loadSpritesDoors(){
        /*Doors Factory*/
        this.scene.gameConfig.actual = null
        this.scene.gameConfig.previous = null
        this.scene.gameConfig.first = null
        

        for(var i = 1; i <= this.scene.constants.numberOfDoors; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(0, 0, 'door_factory')
                this.scene.aGrid.placeAtIndex(38,this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.y += 45 
                Align.scaleToGameW(this.scene.gameConfig.actual,.15)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.doors.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth + 27,
                    this.scene.gameConfig.previous.y, 
                    'door_factory'
                ) 
                Align.scaleToGameW(this.scene.gameConfig.actual,.15)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.doors.push(this.scene.gameConfig.actual)
            }
        }

        this.scene.doors[0].play("open_door_factory")
        this.scene.doors[1].play("idle_door_factory")
        this.scene.doors[2].play("idle_door_factory")
    }

    loadSpritesWindows(){
        /*Windows*/
        this.scene.gameConfig.actual = null
        this.scene.gameConfig.previous = null
        this.scene.gameConfig.first = null
        

        for(var i = 1; i <= this.scene.constants.numberOfWindows; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    0, 
                    0, 
                    'factory_window'
                )
                this.scene.aGrid.placeAtIndex(27,this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.y += 70 
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.windows.push(this.scene.gameConfig.actual)
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth + 70,
                    this.scene.gameConfig.previous.y, 
                    'factory_window'
                ) 
                Align.scaleToGameW(this.scene.gameConfig.actual,.1)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.windows.push(this.scene.gameConfig.actual)
            }
        }
    }

    loadSpritesPowerPlant(){
        /*Power plant*/
        this.scene.power_plant = this.scene.physics.add.sprite(
            0,
            0,
            "factory_power_plant"
        )
        this.scene.aGrid.placeAtIndex(20,this.scene.power_plant)
        Align.scaleToGameW(this.scene.power_plant,.2)
        this.scene.power_plant.y += 110 
        window.power_plant = this.scene.power_plant
    }
}
