class GameConfigFloorMain{
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

        this.scene.aGrid = new AlignGrid({
            scene:this.scene,
            rows:this.scene.constants.totalRowsGrid,
            cols:this.scene.constants.totalColumnsGrid,
            height:this.scene.constants.totalSceneHeigth,
            width:this.scene.constants.totalSceneWidth
        })

        this.actual   = null
        this.previous = null
        this.first    = null

        this.portalOverlapping = false
        this.metalComputerOverlapping = false
        this.assemblyComputerOverlapping = false

        /*Characters*/
        this.scene.backgroundFactoryGroup  = [] //Background
        this.scene.floorGroup  = this.scene.physics.add.group() //Floor
        this.scene.boundariesGroup  = [] //Boundaries
        portalGroup = this.scene.physics.add.group() //Portals
        this.scene.metalGroup  = this.scene.physics.add.group() //Metal
        this.scene.metalShelving = this.scene.physics.add.group() //Metal Shelving
        this.scene.floorMetal = [] //Metal Floor
        this.scene.conveyorBeltMetalGroup = this.scene.physics.add.group() //ConveyorBelt
        this.scene.railMetalGroup = this.scene.physics.add.group() //Rail
        this.scene.grabber    = null
        this.scene.cord1      = null
        this.scene.cord2      = null
        this.scene.cord3      = null
        this.scene.grabberEnd = null
        this.scene.stomperMetalGroup = this.scene.physics.add.group() //StomperBase
        this.scene.stomper    = null
        this.scene.rollMetal  = null
        this.scene.stompedMetal = null
        this.scene.floorMetalQualityAssurance = [] //Metal Floor
        this.scene.conveyorBeltMetalGroupQualityAssurance = this.scene.physics.add.group() //ConveyorBelt
        this.scene.machineQualityAssurance                = null
        this.scene.player                                 = null
        this.scene.metalShelvingDoor                      = this.scene.physics.add.group() //Metal Shelving
        this.scene.metalCarDoors                          = this.scene.physics.add.group() //Metal Shelving
        this.scene.metalComputer2                         = null
        this.scene.floorAssembleAssurance                 = [] //Assemble Base Floor
        this.scene.backboneCar                            = null
        this.scene.assembleRobot1                         = null
        this.scene.assembleRobot2                         = null
        this.scene.assembleRobot3                         = null
        this.scene.assembleRobot4                         = null
        this.scene.assembleRobotSparks1                   = null
        this.scene.assembleRobotSparks2                   = null
        this.scene.assembleRobotSparks3                   = null
        this.scene.railAssembleMetalGroup                 = this.scene.physics.add.group() //Rail Assemble
        this.scene.grabberAssembler1                      = null
        this.scene.grabberAssembler2                      = null
        this.scene.cordAssemble1_1                        = null
        this.scene.cordAssemble1_2                        = null
        this.scene.cordAssemble1_3                        = null
        this.scene.cordAssemble1_1                        = null
        this.scene.cordAssemble2_2                        = null
        this.scene.cordAssemble3_3                        = null
        this.scene.movingAssembledCar                     = null
        this.scene.movingAssembledCar2                    = null
        this.scene.movingAssembledCar3                    = null
        this.scene.movingAssembledCarParked               = null
        this.scene.floorAssemblePool                      = [] //Pool Base Floor
        this.scene.pool                                   = []
        this.scene.decorationsPool                        = [] //Pool Base Floor
        this.scene.loader                                 = null
        this.scene.metalComputer3                         = null
        this.scene.railColorMetalGroup                    = this.scene.physics.add.group() //Rail Color
        this.scene.grabberColor1                          = null
        this.scene.grabberColor2                          = null
        this.scene.cordColor1_1                           = null
        this.scene.cordColor1_2                           = null
        this.scene.cordColor1_3                           = null
        this.scene.cordColor2_1                           = null
        this.scene.cordColor2_2                           = null
        this.scene.cordColor2_3                           = null
        this.scene.floorMetalColor                        = [] //Metal Floor Color
        this.scene.conveyorBeltColorGroup                 = this.scene.physics.add.group() //ConveyorBeltColor
        this.scene.colorComputer1                         = null
        this.scene.colorComputer2                         = null
        this.scene.colorComputer3                         = null
        this.scene.cableMetalColor                        = [] //Metal Floor Cable
        this.scene.spraysMetalColor                       = [] //Metal Floor Sprays
        this.scene.colorSpray1                            = null
        this.scene.colorSpray2                            = null
        this.scene.colorSpray3                            = null
        this.scene.railConstructionMetalGroup             = this.scene.physics.add.group() //Rail Construction
        this.scene.constructionComputer                   = null
        this.scene.movingConstructionCarParked            = null
        this.scene.parkedConstructionCarParked            = null
        this.scene.grabberConstruction1                   = null
        this.scene.grabberConstruction2                   = null
        this.scene.cordConstruction1_1                    = null
        this.scene.cordConstruction1_2                    = null
        this.scene.cordConstruction1_3                    = null
        this.scene.cordConstruction2_1                    = null
        this.scene.cordConstruction2_2                    = null
        this.scene.cordConstruction2_3                    = null
        this.scene.movingAssembledCarConstructionStatus   = null
        this.scene.floorMetalConstruction                 = [] //Metal Floor Construction
        this.scene.tiresConstructionParked                = [] //Metal Floor Construction
        this.scene.carParked                              = null
        this.scene.carEnded                               = null
        this.scene.constructionRobot1                     = null
        this.scene.constructionRobot2                     = null
        this.scene.constructionRobotSparks1               = null
        this.scene.constructionRobotSparks2               = null
        this.scene.constructionDoor                       = null
        this.scene.constructionSemaphore                  = null
	}
}