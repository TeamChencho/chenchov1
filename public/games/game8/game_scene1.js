var SceneOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "SceneOne" });
    },
    init: function() {},
    preload: function() {},
    create: function() {
        var text = this.add.text(
            640, 
            360, 
            globalVariables.scene1, 
            {
                fontSize: 50,
                color: "#000000",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);
        this.time.addEvent({
            delay: 3000,
            loop: false,
            callback: () => {
                this.scene.start("SceneTwo", { 
                    "message": globalVariables.scene2
                });
            }
        })
    },
    update: function() {}
});