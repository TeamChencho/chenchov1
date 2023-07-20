class PortalGate{
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
      key: 'on_portal',
      frames: this.scene.anims.generateFrameNames('portal_gate', {start: 0, end: 15, zeroPad: 3, prefix: '__laboratory_portal_turquoise_portal_on_', suffix: '.png'}),
      frameRate: 15,
      repeat: -1
    })
    this.scene.anims.create({
      key: 'off_portal',
      frames: this.scene.anims.generateFrameNames('portal_gate', {frames:[0], zeroPad: 3, prefix: '__laboratory_portal_turquoise_portal_off_', suffix: '.png'}),
      frameRate: 15,
      repeat: -1
    })
  }

	loadSprites(){
		/*Metal Group*/
    this.scene.gameConfig.actual = this.scene.physics.add.sprite(0,0,'portal_gate')
    this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionPortal,this.scene.gameConfig.actual)
    Align.scaleToGameW(this.scene.gameConfig.actual,.28)
    this.scene.gameConfig.actual.setGravityY(200)
    this.scene.gameConfig.actual.y += 30
    this.scene.gameConfig.previous = this.scene.gameConfig.actual
    this.scene.gameConfig.actual.setSize(this.scene.gameConfig.actual.width*.5,this.scene.gameConfig.actual.height*.1,25,0)
    this.scene.gameConfig.actual.play("on_portal")
    portalGroup.add(this.scene.gameConfig.actual)

    /*Assemble Group*/
    this.scene.gameConfig.actual = this.scene.physics.add.sprite(0,0,'portal_gate')
    this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionPortalAssemble,this.scene.gameConfig.actual)
    Align.scaleToGameW(this.scene.gameConfig.actual,.28)
    this.scene.gameConfig.actual.setGravityY(200)
    this.scene.gameConfig.actual.y += 30
    this.scene.gameConfig.previous = this.scene.gameConfig.actual
    this.scene.gameConfig.actual.setSize(this.scene.gameConfig.actual.width*.5,this.scene.gameConfig.actual.height*.1,25,0)
    this.scene.gameConfig.actual.play("on_portal")
    portalGroup.add(this.scene.gameConfig.actual)

    /*Construction Group*/
    this.scene.gameConfig.actual = this.scene.physics.add.sprite(0,0,'portal_gate')
    this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionPortalConstruction,this.scene.gameConfig.actual)
    Align.scaleToGameW(this.scene.gameConfig.actual,.28)
    this.scene.gameConfig.actual.setGravityY(200)
    this.scene.gameConfig.actual.y += 30
    this.scene.gameConfig.previous = this.scene.gameConfig.actual
    this.scene.gameConfig.actual.setSize(this.scene.gameConfig.actual.width*.5,this.scene.gameConfig.actual.height*.1,25,0)
    this.scene.gameConfig.actual.play("on_portal")
    portalGroup.add(this.scene.gameConfig.actual) 
	}
	
}