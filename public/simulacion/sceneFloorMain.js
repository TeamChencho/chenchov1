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
                }else
                if(this.gameConfig.metalComputerOverlapping && !windowOpened){
                    this.launchWindowMetalComputer()
                }else
                if(this.gameConfig.assemblyComputerOverlapping && !windowOpened){
                    this.launchWindowAssemblyComputer()
                }else
                if(this.gameConfig.constructionComputerOverlapping && !windowOpened){
                    this.launchWindowConstructionComputer()
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
        /*windowOpened = true

        $('#rawMaterialModal').modal('show')
        $('#rawMaterialModalTitle').html("Raw Material")
        ajaxRawMaterial()

        $('#rawMaterialModal').on('hidden.bs.modal', function (e) {
          //log("Cerrando")
          windowOpened = false
        })*/

        windowOpened = true

        $('#metalComputerOptionsModal').modal('show')
        $('#metalComputerOptionsModal').on('hidden.bs.modal', function (e) {
          //log("Cerrando")
          windowOpened = false
        })

        $( "#btnOptionRawMaterialInventory" ).click(function() {
            $('#rawMaterialModal').modal('show')
            $('#rawMaterialModalTitle').html("Raw Material")
            ajaxRawMaterial()
        })

        $( "#btnOptionBOM" ).click(function() {
            $("#component_BOM").hide()
            $("#bomModal").modal("show")
            $("#messageLoading").show()
            messageLoadingFunction()
            crearComponentesModal()
        })

        $( "#btnOptionPurchasing" ).click(function() {
            $('#pills-tab li:first-child a').tab('show')
            $("#pills-tab").hide()
            $("#btn_submit_purchasing").hide()
            $("#text_message").hide()
            $("#text_message_puchasing").hide()
            $("#purchasingModal").modal("show")
            messageSave()
            getComponentsPurchasing()
        })

        $( "#btnOptionOrders" ).click(function() {
            $('#clientOrdersModal').modal('show')
            $('#clientOrdersTitle').html("Client Orders")

            $('#clientOrdersModal').on('shown.bs.modal  ', function (e) {
                ajaxClientOrders()
                ajaxClientOrdersTeam()
            })
        })
    }

    launchWindowAssemblyComputer(){
        portalOpened = true
        //log("Abriendo modal portales")
        $('#assemblyComputerOptionsModal').modal('show')
        $('#assemblyComputerOptionsModal').on('hidden.bs.modal', function (e) {
          //log("Cerrando")
          portalOpened = false
        })

        $( "#btnOptionEmployees" ).click(function() {
            $("#employeesModal").modal("show")
            getSMEmployees()
            getAllEmployeesNoShift()
        })
    }

    launchWindowConstructionComputer(){
        portalOpened = true
        //log("Abriendo modal portales")
        $('#constructionComputerOptionsModal').modal('show')
        $('#constructionComputerOptionsModal').on('hidden.bs.modal', function (e) {
          //log("Cerrando")
          portalOpened = false
        })

        $( "#btnOptionFinance" ).click(function() {
            $("#text_message_fixed_Asset").hide()
            $("#financeModal").modal("show")

            cleanComponents()
            getFixedAssetInvetory()
            getFixedAsset()
        })
    }
}