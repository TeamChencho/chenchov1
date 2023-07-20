class Floor{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene
		
	}

	loadSprites(){
		/*Road*/
		this.makeFloor(44,54,"road")
	}
	makeFloor(fromPos,toPos,key){
        for(var i = fromPos; i < toPos+1; i+=3){
            this.placeBlock(i,key)
        }
    }
    placeBlock(pos,key){
        let block = this.scene.physics.add.sprite(0,0,key)
        this.scene.aGrid.placeAtIndex(pos,block)
        this.scene.brickGroup.add(block)
        block.setImmovable()
        block.setSize(block.width,block.height*.1,25,0)
        Align.scaleToGameW(block,.5)
    }
}