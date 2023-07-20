class Background{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene
		
	}

	loadSprites(){
		/*Background*/
        for(var currentHeight = 0; 
            currentHeight < this.scene.gameConfig.gameHeight + this.scene.constants.tileSizeBackgroundSky; 
            currentHeight += this.scene.gameConfig.previous.displayHeight
            ){
            for(var currentWidth = 0; 
                currentWidth < this.scene.gameConfig.gameWidth + this.scene.constants.tileSizeBackgroundSky; 
                currentWidth += this.scene.gameConfig.previous.displayWidth
                ){
                if(currentWidth == 0){
                    this.scene.gameConfig.actual = this.scene.add.sprite(
                        currentWidth,
                        currentHeight,
                        "sky_color"
                    )
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    this.scene.sky.push(this.scene.gameConfig.actual)
                }else{
                    this.scene.gameConfig.actual = this.scene.add.sprite(
                        currentWidth,
                        this.scene.gameConfig.previous.y,
                        'sky_color'
                    )
                    this.scene.gameConfig.previous = this.scene.gameConfig.actual
                    this.scene.sky.push(this.scene.gameConfig.actual)
                }
            }
            
        }

        /*Clouds*/
        this.scene.mid_ground_cloud_1 = this.scene.physics.add.sprite(0,0,"mid_ground_cloud_1")
        this.scene.aGrid.placeAtIndex(0,this.scene.mid_ground_cloud_1)
        this.scene.mid_ground_cloud_1.y += 165
        Align.scaleToGameW(this.scene.mid_ground_cloud_1,1)

        this.scene.mid_ground_cloud_1_2 = this.scene.physics.add.sprite(0,0,"mid_ground_cloud_1")
        this.scene.aGrid.placeAtIndex(10,this.scene.mid_ground_cloud_1_2)
        this.scene.mid_ground_cloud_1_2.y += 165
        this.scene.mid_ground_cloud_1_2.x += (this.scene.gameConfig.gameWidth / 11)
        Align.scaleToGameW(this.scene.mid_ground_cloud_1_2,1)

        this.scene.farground_cloud_1 = this.scene.physics.add.sprite(this.scene.mid_ground_cloud_1.x,this.scene.mid_ground_cloud_1.y,"farground_cloud_1")
        this.scene.farground_cloud_1.y -= 185
        Align.scaleToGameW(this.scene.farground_cloud_1,1)

        this.scene.farground_cloud_1_2 = this.scene.physics.add.sprite(this.scene.mid_ground_cloud_1_2.x,this.scene.mid_ground_cloud_1_2.y,"farground_cloud_1")
        this.scene.farground_cloud_1_2.y -= 185
        Align.scaleToGameW(this.scene.farground_cloud_1_2,1)

        this.scene.farground_cloud_2 = this.scene.physics.add.sprite(this.scene.farground_cloud_1.x,this.scene.farground_cloud_1.y,"farground_cloud_2")
        this.scene.farground_cloud_2.y += 85
        Align.scaleToGameW(this.scene.farground_cloud_2,1)

        this.scene.farground_cloud_2_2 = this.scene.physics.add.sprite(this.scene.farground_cloud_1_2.x,this.scene.farground_cloud_1_2.y,"farground_cloud_2")
        this.scene.farground_cloud_2_2.y += 85
        Align.scaleToGameW(this.scene.farground_cloud_2_2,1)

        this.scene.mid_ground_cloud_2 = this.scene.physics.add.sprite(this.scene.mid_ground_cloud_1.x,this.scene.mid_ground_cloud_1.y,"mid_ground_cloud_2")
        this.scene.mid_ground_cloud_2.y += 15
        Align.scaleToGameW(this.scene.mid_ground_cloud_2,1)

        this.scene.mid_ground_cloud_2_2 = this.scene.physics.add.sprite(this.scene.mid_ground_cloud_1_2.x,this.scene.mid_ground_cloud_1_2.y,"mid_ground_cloud_2")
        this.scene.mid_ground_cloud_2_2.y += 15
        Align.scaleToGameW(this.scene.mid_ground_cloud_2_2,1)

        /*Mountains*/
        this.scene.farground_mountains = this.scene.physics.add.sprite(0,0,"farground_mountains")
        this.scene.aGrid.placeAtIndex(33,this.scene.farground_mountains)
        this.scene.farground_mountains.y -= 48 
        Align.scaleToGameW(this.scene.farground_mountains,1)

        this.scene.farground_mountains2 = this.scene.physics.add.sprite(0,0,"farground_mountains")
        this.scene.aGrid.placeAtIndex(39,this.scene.farground_mountains2)
        this.scene.farground_mountains2.y -= 48 
        Align.scaleToGameW(this.scene.farground_mountains2,1)

        this.scene.midground_mountains = this.scene.physics.add.sprite(this.scene.farground_mountains.x,this.scene.farground_mountains.y,"midground_mountains")
        this.scene.midground_mountains.y += 65
        Align.scaleToGameW(this.scene.midground_mountains,1)

        this.scene.midground_mountains2 = this.scene.physics.add.sprite(this.scene.farground_mountains2.x,this.scene.farground_mountains2.y,"midground_mountains")
        this.scene.midground_mountains2.y += 65
        Align.scaleToGameW(this.scene.midground_mountains2,1)

        this.scene.foreground_mountains = this.scene.physics.add.sprite(this.scene.farground_mountains.x,this.scene.farground_mountains.y,"foreground_mountains")
        this.scene.foreground_mountains.y += 95 
        Align.scaleToGameW(this.scene.foreground_mountains,1)

        this.scene.foreground_mountains2 = this.scene.physics.add.sprite(this.scene.farground_mountains2.x,this.scene.farground_mountains2.y,"foreground_mountains")
        this.scene.foreground_mountains2.y += 95 
        Align.scaleToGameW(this.scene.foreground_mountains2,1)

	}
}