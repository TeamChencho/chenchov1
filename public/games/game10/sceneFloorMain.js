class SceneFloorMain extends Phaser.Scene {
    constructor() {
        super('SceneFloorMain');
    }
    preload()
    {
        this.loadAssets = new LoadAssetsFloorMain({scene:this})
        this.loadAssets.load()

    }
    create() {
        //log("Ready!");
        
        this.emitter = EventDispatcher.getInstance()

        this.constants  = new ConstantsFloorMain({})
        this.gameConfig = new GameConfigFloorMain({scene:this,game:game})        

        window.scene = this

        /*Characters*/
        this.background  = new FactoryBackground({scene:this})
        this.floor       = new FloorFactoryFloorMain({scene:this})
        this.portal      = new PortalGate({scene:this})
        this.metal       = new MetalGroup({scene:this})
        this.assemble    = new AssembleGroup({scene:this})
        this.construction= new ConstructionGroup({scene:this})
        this.player      = new BlueRobotPlayer({scene:this})

        this.portal.makeAnims()
        this.metal.makeAnims()
        this.assemble.makeAnims()
        this.construction.makeAnims()
        this.player.makeAnims()


        this.background.loadSprites()
        this.floor.loadSprites()
        this.portal.loadSprites()
        this.metal.loadSprites()
        this.assemble.loadSprites()
        this.construction.loadSprites()
        this.player.loadSprites()
        
        this.player.afterSceneConfigurationDetails()

        this.gamePad = new GamePad({scene:this,grid:this.aGrid})
        this.setListeners()
        this.cameras.main.setBounds(0,0,this.constants.totalSceneWidth,this.constants.totalSceneHeigth)
        this.cameras.main.startFollow(robot)

        //this.aGrid.showNumbers()
    
    }

    setListeners(){
        this.emitter.on('CONTROL_PRESSED',this.controlPressed.bind(this))
        this.input.keyboard.on('keyup', this.stopPlayer.bind(this));
    }
    stopPlayer(){
        robot.setVelocityX(0)
        robot.anims.play("idle")
        this.scene.pressedKey = ""
    }
    controlPressed(param){
        //log(this.gameConfig.playerShooting)
        switch(param){
            /*case "GO_UP":
                this.checkLadder()
                if(this.onLadder == true){
                  robot.setVelocityY(-250)
                }
            break;
            case "GO_DOWN":
            break;*/
            case this.constants.GO_LEFT:
                robot.setVelocityX(-200)
                robot.anims.play("walk",true)
                robot.flipX = true
            break;
            case this.constants.GO_RIGHT:
                robot.setVelocityX(200)
                robot.anims.play("walk",true)
                robot.flipX = false
            break;
            case this.constants.BTN1:
                //robot.setVelocityY(-200)
                robot.anims.play("shoot",true)
                //log(this.gameConfig.portalOverlapping)
                if(this.gameConfig.portalOverlapping && !portalOpened){
                    this.launchWindowPortals()
                }
                if(this.gameConfig.metalComputerOverlapping && !windowOpened){
                    this.launchWindowMetalComputer()
                }
                if(this.gameConfig.assemblyComputerOverlapping && !windowOpened){
                    this.launchWindowAssemblyComputer()
                }
            break;
            case this.constants.BTN2:
            break;
        }
    }
       
    update() {
        this.metal.moveGrabberStateMachine()
        this.metal.moveStomperStateMachine()
        this.metal.moveRollMetalStateMachine()
        this.metal.moveStompedMetalStateMachine()
        this.assemble.moveAssembleRobot3StateMachine()
        this.assemble.moveGrabberStateMachine()
        this.assemble.moveGrabberStateMachineColor()
        this.assemble.moveMovingAssembledCarStateMachine()
        this.assemble.moveMovingAssembledCar2StateMachine()
        this.assemble.moveMovingAssembledCar3StateMachine()
        this.construction.moveGrabberStateMachineConstruction()
        this.construction.moveMovingConstructionCarStateMachine()
        this.construction.moveMovingConstructionCarEndStateMachine()

        this.player.overlappingPortals()
        this.player.overlappingMetalComputer()
        this.player.overlappingAssemblyComputer()
    }

    launchWindowPortals(){
        portalOpened = true
        //log("Abriendo modal portales")
        $('#portalsModal').modal('show')
        $('#portalsModal').on('hidden.bs.modal', function (e) {
          //log("Cerrando")
          portalOpened = false
        })

        $( "#btnPortalRawMaterialArea" ).click(function() {
            robot.x = portalGroup.children.entries[0].x
            robot.y = portalGroup.children.entries[0].y
            $("#portalsModal").modal("hide")
        });

        $( "#btnPortalAssemblyArea" ).click(function() {
            robot.x = portalGroup.children.entries[1].x
            robot.y = portalGroup.children.entries[1].y
            $("#portalsModal").modal("hide")
        });

        $( "#btnPortalConstructionArea" ).click(function() {
            robot.x = portalGroup.children.entries[2].x
            robot.y = portalGroup.children.entries[2].y
            $("#portalsModal").modal("hide")
        });
    }

    launchWindowMetalComputer(){
        windowOpened = true

        $('#windowModal').modal('show')
        $('#titleWindowModal').html("Metal Computer")

        $('#windowModal').on('hidden.bs.modal', function (e) {
          //log("Cerrando")
          windowOpened = false
        })
    }

    launchWindowAssemblyComputer(){
        windowOpened = true

        $('#windowModal').modal('show')
        $('#titleWindowModal').html("Assembly Computer")

        $('#windowModal').on('hidden.bs.modal', function (e) {
          //log("Cerrando")
          windowOpened = false
        })
    }
}