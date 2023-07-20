class FactoryBackground{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene
		
	}

	loadSprites(){
		/*this.scene.background = this.scene.add.image(0,0,"background").setOrigin(0,0)
        Align.scaleToGameW(this.scene.background,2)*/

        for(var i = 0; i < ( this.scene.constants.EXTENDED_TIMES / 2 ); i++){
        	//log("Backgrounds")
        	if(i == 0){
        		this.scene.gameConfig.actual = this.scene.physics.add.sprite(0,0,'background').setOrigin(0,0)
        	}else{
				this.scene.gameConfig.actual = this.scene.physics.add.sprite(this.scene.gameConfig.previous.x+this.scene.gameConfig.previous.displayWidth,this.scene.gameConfig.previous.y,'background').setOrigin(0,0)
        	}
	        Align.scaleToGameW(this.scene.background,2)
	        this.scene.gameConfig.previous = this.scene.gameConfig.actual
	        this.scene.backgroundFactoryGroup.push(this.scene.gameConfig.actual)
        }

	}
}