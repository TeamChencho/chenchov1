var game;
window.onload = function() {
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile == -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }
    var w = 800;
    var h = 600;
    if (isMobile != -1) {
        w = window.innerWidth;
        h = window.innerHeight;
    }
    var config = {
        type: Phaser.AUTO,
        width: w,
        height: h,
        parent: 'game-container',
        scene: [SceneMain,SceneFloorMain,SceneFloorUp],
        physics:{
            default: 'arcade',
            arcade:{
                //debug:true
                debug:false
            }
        }
    };
    game = new Phaser.Game(config);
}