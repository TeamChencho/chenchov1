const phaserConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: 1280,
    height: 720,
    backgroundColor: "#5DACD8",
    scene: [ SceneOne, SceneTwo ]
};

const game = new Phaser.Game(phaserConfig);