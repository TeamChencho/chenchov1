class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        this.loadAssets = new LoadAssets({scene:this})
        this.loadAssets.load()
    }
    create() {
        log("Ready!");
        this.gameConfig = new GameConfig({scene:this,game:game})
        this.constants = new Constants({})

        window.scene = this

        /*Characters*/
        this.backgrounds = new Background({scene:this})
        this.floor       = new Floor({scene:this})
        this.factory     = new Factory({scene:this})
        this.bluerobot   = new Bluerobot({scene:this})
        this.carObject   = new Car({scene:this})
        this.sceneText   = new SceneText({scene:this})

        this.bluerobot.makeAnims()
        this.carObject.makeAnims()
        this.factory.makeAnims()

        this.backgrounds.loadSprites()
        this.floor.loadSprites()
        this.factory.loadSprites()
        this.bluerobot.loadSprites()
        this.carObject.loadSprites()

        this.sceneText.loadText()

        

        this.gameConfig.afterSceneConfigurationDetails()

        this.input.on('gameobjectdown',function(pointer,gameObject){
            log("Clickeando")
            this.scene.start("SceneFloorMain", {})
        },this)
        
    }
       
    update() {}
}