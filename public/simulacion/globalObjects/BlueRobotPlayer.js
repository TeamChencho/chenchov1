class BlueRobotPlayer{
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
          frames: this.scene.anims.generateFrameNames('blue_robot', {frames:[0,1,2,3,6,7,8,9], zeroPad: 3, prefix: '__blue_robot_shoot_', suffix: '.png'}),
          frameRate: 25,
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
        robot = this.scene.physics.add.sprite(0,0,"blue_robot")
        this.scene.aGrid.placeAtIndex(this.scene.constants.startPositionPlayer,robot)
        Align.scaleToGameW(robot,.2)
        robot.y += 55
        var frameNames= this.scene.textures.get('blue_robot').getFrameNames();
        //log(frameNames)
        window.robot = robot
        robot.setGravityY(200)
        this.scene.physics.add.collider(robot,this.scene.floorGroup)
        this.scene.physics.add.collider(robot,this.scene.boundariesGroup)
        this.scene.physics.add.overlap(robot,portalGroup,this.overlappingPortals,null,this)
        this.scene.physics.add.overlap(robot,metalComputer,this.overlappingMetalComputer,null,this)
        this.scene.physics.add.overlap(robot,assemblyComputer,this.overlappingAssemblyComputer,null,this)
        this.scene.physics.add.overlap(robot,constructionComputer,this.overlappingConstructionComputer,null,this)
        robot.play("idle")
	}

  afterSceneConfigurationDetails(){
    this.scene.time.addEvent({ delay: 50, callback: function(){
        //log("After 1 second")
        robot.setSize(robot.width*.4,robot.height*.7,true)
    }, callbackScope: this, loop: false });
  }

  overlappingPortals(){
    this.scene.gameConfig.portalOverlapping = this.checkOverLappingGroup(robot,portalGroup)
    //log(this.scene.portalOverlapping)
  }

  overlappingMetalComputer(){
    this.scene.gameConfig.metalComputerOverlapping = this.checkOverLappingSprites(robot,metalComputer)
    //log(this.checkOverLappingSprites(robot,metalComputer))
  }

  overlappingAssemblyComputer(){
    this.scene.gameConfig.assemblyComputerOverlapping = this.checkOverLappingSprites(robot,assemblyComputer)
  }

  overlappingConstructionComputer(){
    this.scene.gameConfig.constructionComputerOverlapping = this.checkOverLappingSprites(robot,constructionComputer)
  }

  checkOverLappingSprites(spriteA,spriteB){
    var boundsA = spriteA.getBounds()
    var boundsB = spriteB.getBounds()

    if(Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)){
        return true
    }else{
      return false
    }
  }

  checkOverLappingGroup(spriteA,spriteBGroup){
    var boundsA = spriteA.getBounds()
    //log(boundsRobot)
    var arrayPortals = spriteBGroup.children.entries
    for(var i = 0; i < arrayPortals.length; i++){
      var boundsB = arrayPortals[i].getBounds()
      if(Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)){
        return true
      }
    }
    return false
  }
}