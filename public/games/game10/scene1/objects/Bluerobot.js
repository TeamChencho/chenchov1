class Bluerobot{
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
          key: 'die',
          frames: this.scene.anims.generateFrameNames('blue_robot', {start: 0, end: 4, zeroPad: 3, prefix: '__blue_robot_die_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'hurt',
          frames: this.scene.anims.generateFrameNames('blue_robot', {start: 0, end: 4, zeroPad: 3, prefix: '__blue_robot_hurt_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'idle',
          frames: this.scene.anims.generateFrameNames('blue_robot', {start: 0, end: 19, zeroPad: 3, prefix: '__blue_robot_idle_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'push',
          frames: this.scene.anims.generateFrameNames('blue_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__blue_robot_push_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'run',
          frames: this.scene.anims.generateFrameNames('blue_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__blue_robot_run_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'shoot',
          frames: this.scene.anims.generateFrameNames('blue_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__blue_robot_shoot_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
        this.scene.anims.create({
          key: 'walk',
          frames: this.scene.anims.generateFrameNames('blue_robot', {start: 0, end: 9, zeroPad: 3, prefix: '__blue_robot_walk_', suffix: '.png'}),
          frameRate: 15,
          repeat: -1
        })
    }

	loadSprites(){
		/*Bluerobot*/
        this.scene.blue_robot = this.scene.physics.add.sprite(0,0,"blue_robot")
        this.scene.aGrid.placeAtIndex(42,this.scene.blue_robot)
        Align.scaleToGameW(this.scene.blue_robot,.2)
        this.scene.blue_robot.y += 55
        this.scene.blue_robot.flipX = true
        var frameNames= this.scene.textures.get('blue_robot').getFrameNames();
        //log(frameNames)
        window.blue_robot = this.scene.blue_robot
        this.scene.blue_robot.setGravityY(200)
        this.scene.physics.add.collider(this.scene.blue_robot,this.scene.brickGroup)
        this.scene.blue_robot.play("idle")
	}
	
}