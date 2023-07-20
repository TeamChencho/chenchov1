class Car{
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
          key: 'idle_car',
          frames: this.scene.anims.generateFrameNames('black_car', {frames:[1], zeroPad: 3, prefix: 'black_car_idle_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'drive_forward',
          frames: this.scene.anims.generateFrameNames('black_car', {frames:[4,3,2,1,0], zeroPad: 3, prefix: 'black_car_drive_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'drive_backward',
          frames: this.scene.anims.generateFrameNames('black_car', {frames:[0,1,2,3,4], zeroPad: 3, prefix: 'black_car_drive_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })

    }

	loadSprites(){
		/*Car*/
        this.scene.car = this.scene.physics.add.sprite(0,0,"black_car")
        this.scene.aGrid.placeAtIndex(34,this.scene.car)
        this.scene.car.y += 55
        this.scene.car.flipX = true
        this.scene.car.setGravityY(200)
        Align.scaleToGameW(this.scene.car,.2)
        window.car = this.scene.car
        this.scene.physics.add.collider(this.scene.car,this.scene.brickGroup)
        this.scene.car.play("idle_car")
	}
	
}