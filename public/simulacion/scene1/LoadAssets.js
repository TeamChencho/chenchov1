class LoadAssets{
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
		this.scene.load.atlas("blue_robot","./../../simulacion/images/blue_robot.png","./../../simulacion/images/blue_robot.json")
        this.scene.load.atlas("black_car","./../../simulacion/images/black_car.png","./../../simulacion/images/black_car.json")
        this.scene.load.atlas("factory","./../../simulacion/images/factory_tileset.png","./../../simulacion/images/factory_tileset.json")
        this.scene.load.atlas("door_factory","./../../simulacion/images/door_factory.png","./../../simulacion/images/door_factory.json")
	}

	loadImages(){
		this.scene.load.image("road","./../../simulacion/images/backgroundforeground_road.png")
        this.scene.load.image("loader","./../../simulacion/images/loader_complete.png")
        this.scene.load.image("factory_window","./../../simulacion/images/window_background.png")
        this.scene.load.image("factory_power_plant","./../../simulacion/images/machine_01.png")
        this.scene.load.image("sky_color","./../../simulacion/images/sky_color_top.png")
        this.scene.load.image("farground_mountains","./../../simulacion/images/farground_mountains.png")
        this.scene.load.image("midground_mountains","./../../simulacion/images/midground_mountains.png")
        this.scene.load.image("foreground_mountains","./../../simulacion/images/foreground_mountains.png")
        this.scene.load.image("farground_cloud_1","./../../simulacion/images/farground_cloud_1.png")
        this.scene.load.image("farground_cloud_2","./../../simulacion/images/farground_cloud_2.png")
        this.scene.load.image("mid_ground_cloud_1","./../../simulacion/images/mid_ground_cloud_1.png")
        this.scene.load.image("mid_ground_cloud_2","./../../simulacion/images/mid_ground_cloud_2.png")
	}
}