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
		this.scene.load.atlas("blue_robot","images/blue_robot.png","images/blue_robot.json")
        this.scene.load.atlas("factory","images/factory_tileset.png","images/factory_tileset.json")
        this.scene.load.atlas("portal_gate","images/portal_gate.png","images/portal_gate.json")
        this.scene.load.atlas("conveyor_belt_style_2","images/conveyor_belt_style_2.png","images/conveyor_belt_style_2.json")
        this.scene.load.atlas("rail","images/rail.png","images/rail.json")
        this.scene.load.atlas("grabber","images/grabber.png","images/grabber.json")
        this.scene.load.atlas("smash","images/smash.png","images/smash.json")
        this.scene.load.atlas("enemy_robot","images/enemy_robot.png","images/enemy_robot.json")
        this.scene.load.atlas("sparks","images/flash.png","images/flash.json")
        this.scene.load.atlas("spray_blue","images/spray_blue.png","images/spray_blue.json")
        this.scene.load.atlas("spray_red","images/spray_red.png","images/spray_red.json")
        this.scene.load.atlas("spray_yellow","images/spray_yellow.png","images/spray_yellow.json")
        this.scene.load.atlas("red_car","images/red_car.png","images/red_car.json")
        this.scene.load.atlas("door_factory","images/door_factory.png","images/door_factory.json")
	}

	loadImages(){
		this.scene.load.image("background","images/factory_background.png")
		this.scene.load.image("metal","images/metal.png")
		this.scene.load.image("shelving","images/platform/shelving.png")
		this.scene.load.image("computer_01","images/computer_01.png")
		this.scene.load.image("runner_piece","images/runner_piece.png")
		this.scene.load.image("cord","images/cord.png")
		this.scene.load.image("stomper_machine","images/stomper_machine.png")
		this.scene.load.image("down_press","images/down_press.png")
		this.scene.load.image("stomper_base_fixed","images/stomper_base_fixed.png")
		this.scene.load.image("stomper_uppusher_for_behind","images/stomper_uppusher_for_behind.png")
		this.scene.load.image("machine_quality_assurance","images/machine_02.png")
		this.scene.load.image("door_car","images/door.png")

		this.scene.load.image("computer_02","images/computer_02.png")
		this.scene.load.image("car_backbone","images/car_backbone.png")
		this.scene.load.image("toxic_water_repeating","images/toxic_water_repeating.png")
		this.scene.load.image("vent","images/vent.png")
		this.scene.load.image("loader","images/loader_complete.png")
		this.scene.load.image("reactor_off","images/reactor_off.png")
		this.scene.load.image("reactor_on","images/reactor_on.png")
		this.scene.load.image("green_bendy","images/green_bendy.png")
		this.scene.load.image("connector_blue","images/connector_blue.png")
		this.scene.load.image("connector_green","images/connector_green.png")
		this.scene.load.image("connector_red","images/connector_red.png")
		this.scene.load.image("connector_yellow","images/connector_yellow.png")
		this.scene.load.image("backbone_color_car","images/backbone_color_car.png")
		this.scene.load.image("tire","images/tire.png")
		this.scene.load.image("semaphore_off","images/semaphore_off.png")
		this.scene.load.image("semaphore_on_green","images/semaphore_on_green.png")
		
	}
}