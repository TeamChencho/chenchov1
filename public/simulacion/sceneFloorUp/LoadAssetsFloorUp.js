class LoadAssetsFloorUp{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene=config.scene;
	}

	load(){
		this.loadAtlas()
		this.loadImages()
	}

	loadAtlas(){
		this.scene.load.atlas("blue_robot","images/blue_robot.png","images/blue_robot.json")
        this.scene.load.atlas("black_car","images/black_car.png","images/black_car.json")
        this.scene.load.atlas("factory","images/factory_tileset.png","images/factory_tileset.json")
        this.scene.load.atlas("door_factory","images/door_factory.png","images/door_factory.json")
	}

	loadImages(){
		this.scene.load.image("road","images/backgroundforeground_road.png")
        this.scene.load.image("loader","images/loader_complete.png")
        this.scene.load.image("factory_window","images/window_background.png")
        this.scene.load.image("factory_power_plant","images/machine_01.png")
        this.scene.load.image("sky_color","images/sky_color_top.png")
        this.scene.load.image("farground_mountains","images/farground_mountains.png")
        this.scene.load.image("midground_mountains","images/midground_mountains.png")
        this.scene.load.image("foreground_mountains","images/foreground_mountains.png")
        this.scene.load.image("farground_cloud_1","images/farground_cloud_1.png")
        this.scene.load.image("farground_cloud_2","images/farground_cloud_2.png")
        this.scene.load.image("mid_ground_cloud_1","images/mid_ground_cloud_1.png")
        this.scene.load.image("mid_ground_cloud_2","images/mid_ground_cloud_2.png")
	}
}