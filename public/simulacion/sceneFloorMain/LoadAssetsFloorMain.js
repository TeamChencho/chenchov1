class LoadAssetsFloorMain{
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
        this.scene.load.atlas("factory","./../../simulacion/images/factory_tileset.png","./../../simulacion/images/factory_tileset.json")
        this.scene.load.atlas("portal_gate","./../../simulacion/images/portal_gate.png","./../../simulacion/images/portal_gate.json")
        this.scene.load.atlas("conveyor_belt_style_2","./../../simulacion/images/conveyor_belt_style_2.png","./../../simulacion/images/conveyor_belt_style_2.json")
        this.scene.load.atlas("rail","./../../simulacion/images/rail.png","./../../simulacion/images/rail.json")
        this.scene.load.atlas("grabber","./../../simulacion/images/grabber.png","./../../simulacion/images/grabber.json")
        this.scene.load.atlas("smash","./../../simulacion/images/smash.png","./../../simulacion/images/smash.json")
        this.scene.load.atlas("enemy_robot","./../../simulacion/images/enemy_robot.png","./../../simulacion/images/enemy_robot.json")
        this.scene.load.atlas("sparks","./../../simulacion/images/flash.png","./../../simulacion/images/flash.json")
        this.scene.load.atlas("spray_blue","./../../simulacion/images/spray_blue.png","./../../simulacion/images/spray_blue.json")
        this.scene.load.atlas("spray_red","./../../simulacion/images/spray_red.png","./../../simulacion/images/spray_red.json")
        this.scene.load.atlas("spray_yellow","./../../simulacion/images/spray_yellow.png","./../../simulacion/images/spray_yellow.json")
        this.scene.load.atlas("red_car","./../../simulacion/images/red_car.png","./../../simulacion/images/red_car.json")
        this.scene.load.atlas("door_factory","./../../simulacion/images/door_factory.png","./../../simulacion/images/door_factory.json")
	}

	loadImages(){
		this.scene.load.image("background","./../../simulacion/images/factory_background.png")
		this.scene.load.image("metal","./../../simulacion/images/metal.png")
		this.scene.load.image("shelving","./../../simulacion/images/platform/shelving.png")
		this.scene.load.image("computer_01","./../../simulacion/images/computer_01.png")
		this.scene.load.image("runner_piece","./../../simulacion/images/runner_piece.png")
		this.scene.load.image("cord","./../../simulacion/images/cord.png")
		this.scene.load.image("stomper_machine","./../../simulacion/images/stomper_machine.png")
		this.scene.load.image("down_press","./../../simulacion/images/down_press.png")
		this.scene.load.image("stomper_base_fixed","./../../simulacion/images/stomper_base_fixed.png")
		this.scene.load.image("stomper_uppusher_for_behind","./../../simulacion/images/stomper_uppusher_for_behind.png")
		this.scene.load.image("machine_quality_assurance","./../../simulacion/images/machine_02.png")
		this.scene.load.image("door_car","./../../simulacion/images/door.png")

		this.scene.load.image("computer_02","./../../simulacion/images/computer_02.png")
		this.scene.load.image("car_backbone","./../../simulacion/images/car_backbone.png")
		this.scene.load.image("toxic_water_repeating","./../../simulacion/images/toxic_water_repeating.png")
		this.scene.load.image("vent","./../../simulacion/images/vent.png")
		this.scene.load.image("loader","./../../simulacion/images/loader_complete.png")
		this.scene.load.image("reactor_off","./../../simulacion/images/reactor_off.png")
		this.scene.load.image("reactor_on","./../../simulacion/images/reactor_on.png")
		this.scene.load.image("green_bendy","./../../simulacion/images/green_bendy.png")
		this.scene.load.image("connector_blue","./../../simulacion/images/connector_blue.png")
		this.scene.load.image("connector_green","./../../simulacion/images/connector_green.png")
		this.scene.load.image("connector_red","./../../simulacion/images/connector_red.png")
		this.scene.load.image("connector_yellow","./../../simulacion/images/connector_yellow.png")
		this.scene.load.image("backbone_color_car","./../../simulacion/images/backbone_color_car.png")
		this.scene.load.image("tire","./../../simulacion/images/tire.png")
		this.scene.load.image("semaphore_off","./../../simulacion/images/semaphore_off.png")
		this.scene.load.image("semaphore_on_green","./../../simulacion/images/semaphore_on_green.png")
		
	}
}