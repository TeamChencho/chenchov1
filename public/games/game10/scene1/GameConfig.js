class GameConfig{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}
		if (!config.game)
		{
			console.log("missing game");
			return;
		}

		this.scene = config.scene
		this.game  = config.game

		this.gameWidth  = game.config.width
        this.gameHeight = game.config.height

        this.scene.aGrid = new AlignGrid({scene:this.scene,row:5,cols:11})

        this.actual   = null
        this.previous = null
        this.first    = null

        /*Characters*/
        this.scene.sky = []
        this.scene.mid_ground_cloud_1 = null
        this.scene.mid_ground_cloud_1_2 = null
        this.scene.farground_cloud_1 = null
        this.scene.farground_cloud_1_2 = null
        this.scene.farground_cloud_2 = null
        this.scene.farground_cloud_2_2 = null
        this.mid_ground_cloud_2 = null
        this.mid_ground_cloud_2_2 = null
        this.farground_mountains = null
        this.farground_mountains2 = null
        this.midground_mountains = null
        this.midground_mountains2 = null
        this.foreground_mountains = null
        this.foreground_mountains2 = null
        this.scene.brickGroup = this.scene.physics.add.group() //Floor
        this.scene.loader = null
        this.scene.factoryBuilding = []
        this.scene.doors = []
        this.scene.windows = []
        this.scene.blue_robot = null
        this.scene.car = null
        this.text = null
        this.textReflext = null
	}

	afterSceneConfigurationDetails(){
		this.scene.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: false });
        //this.scene.aGrid.showNumbers()
	}
	delayDone(){
        this.scene.blue_robot.setSize(this.scene.blue_robot.width*.4,this.scene.blue_robot.height*.7,true)
        this.scene.car.setSize(this.scene.car.width,this.scene.car.height*.7,true)
    }
}