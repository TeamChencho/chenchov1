class FloorFactoryFloorMain{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene
		
	}

	loadSprites(){
        this.loadSpritesFloor()
        this.loadBoundaries()
	}

    loadSpritesFloor(){
        /*Factory*/
        this.scene.gameConfig.first = null

        for(var i = 1; i <= this.scene.constants.buildingWidthFloor; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                	0,
                	0,
                	'factory',
                    'top_left.png')
		        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionGridFloor,this.scene.gameConfig.actual)
		        this.scene.gameConfig.actual.x =18
                this.scene.gameConfig.actual.y +=2
		        this.scene.gameConfig.previous = this.scene.gameConfig.actual
		        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
		        this.scene.floorGroup.add(this.scene.gameConfig.actual)
		        this.scene.gameConfig.actual.setImmovable()
            }else if(i == this.scene.constants.buildingWidthFloor){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                	this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                	'factory',
                    'top_right.png')
		        this.scene.gameConfig.previous = this.scene.gameConfig.actual
		        Align.scaleToGameW(this.scene.gameConfig.actual,.05)
		        this.scene.floorGroup.add(this.scene.gameConfig.actual)
		        this.scene.gameConfig.actual.setImmovable()
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'top.png'
                    )
		        this.scene.gameConfig.previous = this.scene.gameConfig.actual
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.floorGroup.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }
        }

        //log(this.scene.floorGroup.children.entries[0])
        for(var i = 1; i <= this.scene.constants.buildingWidthFloor; i++){
            if(i == 1){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.floorGroup.children.entries[0].x,
                    this.scene.floorGroup.children.entries[0].y + this.scene.floorGroup.children.entries[0].displayHeight,
                    'factory',
                    'bottom_left.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorGroup.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }else if(i == this.scene.constants.buildingWidthFloor){
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y, 
                    'factory',
                    'bottom_right.png'
                    )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorGroup.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }else{
                this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                    this.scene.gameConfig.previous.x + this.scene.gameConfig.previous.displayWidth,
                    this.scene.gameConfig.previous.y,
                    'factory',
                    'bottom.png'
                )
                Align.scaleToGameW(this.scene.gameConfig.actual,.05)
                this.scene.gameConfig.previous = this.scene.gameConfig.actual
                this.scene.floorGroup.add(this.scene.gameConfig.actual)
                this.scene.gameConfig.actual.setImmovable()
            }
        }

    }

    loadBoundaries(){
        var currentHeigth = 0
        for(var i = 1; i <= this.scene.constants.numberSquareBoundaries; i++){
            this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                -40,
                currentHeigth,
                'factory',
                'fill.png'
                ).setOrigin(0,0)
            Align.scaleToGameW(this.scene.gameConfig.actual,.05)
            this.scene.gameConfig.previous = this.scene.gameConfig.actual
            this.scene.boundariesGroup.push(this.scene.gameConfig.actual)
            this.scene.gameConfig.actual.setImmovable()

            currentHeigth += 40
        }

        var currentHeigth = 0
        for(var i = 1; i <= this.scene.constants.numberSquareBoundaries; i++){
            this.scene.gameConfig.actual = this.scene.physics.add.sprite(
                this.scene.constants.totalSceneWidth,
                currentHeigth,
                'factory',
                'fill.png'
                ).setOrigin(0,0)
            Align.scaleToGameW(this.scene.gameConfig.actual,.05)
            this.scene.gameConfig.previous = this.scene.gameConfig.actual
            this.scene.boundariesGroup.push(this.scene.gameConfig.actual)
            this.scene.gameConfig.actual.setImmovable()

            currentHeigth += 40
        }
    }
}