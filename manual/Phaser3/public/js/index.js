const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    heigth: 600,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false,
        },
    }
};
const game = new Phaser.Game(config);
function preload() {
    console.log("preload");
    this.load.image('background', 'assets/images/background.png');
    this.load.atlas('player', 'assets/images/kenney_player.png','assets/images/kenney_player_atlas.json')
    this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/level2.json');

    this.load.image('spike', 'assets/images/spike.png');
    this.load.image('llave1', 'assets/images/llave1.png')
    this.load.image('llave2', 'assets/images/accesoAcordeon.png')
    this.load.image('llave3', 'assets/images/accesoDetalle.png')
    this.load.image('llave4', 'assets/images/accesoFormulario.png')
    this.load.image('llave5', 'assets/images/accesoTable.png')
    this.load.image('llave6', 'assets/images/accesoLG.png')
}

function create() { 
    console.log("create");


    const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
    backgroundImage.setScale(2, 0.8);

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');

    const platforms = map.createLayer('Platforms', tileset, 0, 200);
    platforms.setCollisionByExclusion(-1, true);// El jugador chocará con esta capa


    // establece los límites de nuestro mundo de juego
    this.physics.world.bounds.width = platforms.width
    this.physics.world.bounds.height = platforms.height


    //mostrar el player
    this.player = this.physics.add.sprite(50, 300, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    

    //agregar animacion player
    this.anims.create({
        key:'walk',
        frames:this.anims.generateFrameNames('player',{prefix: 'kenney_player_',start:2,end:3}),
        frameRate:10,
        repeat:-1
    });

    //animaciones para nuestro sprite inactivo
    this.anims.create({
        key:'idle',
        frames:[{key:'player',frame:'kenney_player_0'}],
        frameRate:10
    })

    //animacion cuando el jugador salte
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 'kenney_player_1' }],
        frameRate: 10,
    });

    //habilitar teclas para poder mover al jugador
    this.cursors = this.input.keyboard.createCursorKeys();
    //keyObj = this.input.keyboard.addKey('ENTER');

    this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    //SPIKER MOSTRAR
    this.spikes = this.physics.add.group({
        allowGravity:false,
        immovable:true
    })
    const spikeObjects = map.getObjectLayer('Spikes')['objects'];
    spikeObjects.forEach(spikeObject => {
        const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, 'spike').setOrigin(0, 0);
        spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
    });
    
    //colicionar el juego
    this.physics.add.collider(this.player,this.spikes,playerHit,null,this);


    //MOSTRAR LLAVE1*****
    this.key1s = this.physics.add.group({
        allowGravity:false,
        immovable:true
    })
    const key1Objects = map.getObjectLayer('AccesoGrafica')['objects'];
    key1Objects.forEach(key1Object => {
        const key1 = this.key1s.create(key1Object.x, key1Object.y + 200 - key1Object.height, 'llave1').setOrigin(0, 0);
        key1.body.setSize(key1.width, key1.height - 20).setOffset(0, 20);
    });
    this.physics.add.overlap(this.player,this.key1s,PlayerKey1,null,this)


    //MOSTRAR ACCESO ACORDEON, COLICIONAR
    this.key2s = this.physics.add.group({allowGravity:false,immovable:true})
    const acordeonObjects = map.getObjectLayer('AccesoAcordeon')['objects'];
    acordeonObjects.forEach(key2Object => {
        const key2 = this.key2s.create(key2Object.x, key2Object.y + 200 - key2Object.height, 'llave2').setOrigin(0, 0);
        key2.body.setSize(key2.width, key2.height - 20).setOffset(0, 20);
    });
    this.physics.add.overlap(this.player,this.key2s,PlayerKey2,null,this)

    //MOSTRAR ACCESO DETALLE, COLICIONAR
    this.key3s = this.physics.add.group({allowGravity:false,immovable:true})
    const detalleObjects = map.getObjectLayer('AccesoDetalle')['objects'];
    detalleObjects.forEach(key3Object => {
        const key3 = this.key3s.create(key3Object.x, key3Object.y + 200 - key3Object.height, 'llave3').setOrigin(0, 0);
        key3.body.setSize(key3.width, key3.height - 20).setOffset(0, 20);
    });
    this.physics.add.overlap(this.player,this.key3s,PlayerAccesoDetalle,null,this)

    //MOSTRAR ACCESO FORMULARIO, COLICIONAR
    this.key4s = this.physics.add.group({allowGravity:false,immovable:true})
    const formularioObjects = map.getObjectLayer('AccesoFormulario')['objects'];
    formularioObjects.forEach(key4Object => {
        const key4 = this.key4s.create(key4Object.x, key4Object.y + 200 - key4Object.height, 'llave4').setOrigin(0, 0);
        key4.body.setSize(key4.width, key4.height - 20).setOffset(0, 20);
    });
    this.physics.add.overlap(this.player,this.key4s,PlayerAccesoFormulario,null,this)

    //MOSTRAR ACCESO TABLA, COLICIONAR
    this.key5s = this.physics.add.group({allowGravity:false,immovable:true})
    const tablaObjects = map.getObjectLayer('AccesoTabla')['objects'];
    tablaObjects.forEach(key5Object => {
        const key5 = this.key5s.create(key5Object.x, key5Object.y + 200 - key5Object.height, 'llave5').setOrigin(0, 0);
        key5.body.setSize(key5.width, key5.height - 20).setOffset(0, 20);
    });
    this.physics.add.overlap(this.player,this.key5s,PlayerAccesoTabla,null,this)

    //MOSTRAR ACCESO MODAL LG, COLICIONAR
    this.key6s = this.physics.add.group({allowGravity:false,immovable:true})
    const modalLGObjects = map.getObjectLayer('AccesoLG')['objects'];
    modalLGObjects.forEach(key6Object => {
        const key6 = this.key6s.create(key6Object.x, key6Object.y + 200 - key6Object.height, 'llave6').setOrigin(0, 0);
        key6.body.setSize(key6.width, key6.height - 20).setOffset(0, 20);
    });
    this.physics.add.overlap(this.player,this.key6s,PlayerAccesoModalLG,null,this)
}

  
function update() {
    console.log("update");
    //hacer caminar al jugador
    //animacion
    if (this.cursors.left.isDown) {//si presiona la techa izquierda
        this.player.body.setVelocityX(-200);//mover a la izquierda
        this.player.anims.play('walk',true);//animacion de caminar
        this.player.flipX=true; //voltea el sprite

    }else if (this.cursors.right.isDown) {//si presiona la techa derecha
        this.player.body.setVelocityX(200);//mover a la derecha
        this.player.anims.play('walk',true);//animacion de caminar
        this.player.flipX=false; //voltea el sprite

    }else{
        this.player.body.setVelocityX(0);
        this.player.anims.play('idle',true);
    }
    if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {//si presiona la techa esplacio o felcha acia arriba
        this.player.body.setVelocityY(-400) //saltar
    }

}

function playerHit(player, spike) {
    player.setVelocity(0, 0);
    player.setX(50);
    player.setY(300);
    player.play('idle', true);
    player.setAlpha(0);
    let tw = this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5,
    });
}

function PlayerKey1(player,key) {
   var keyObj = this.input.keyboard.addKey('ENTER');
   if (keyObj.isDown) {
        player.setX(player.x);
        player.setY(player.y); 
        $('#exampleModalGraficas').modal('show');    
   } 
}
function PlayerKey2(player,key) {
    var keyObj = this.input.keyboard.addKey('ENTER');
    if (keyObj.isDown) {
        player.setX(player.x);
        player.setY(player.y); 
         $('#exampleModalAcordeon').modal('show');    
    } 
}
function PlayerAccesoDetalle(player,key) {
    var keyObj = this.input.keyboard.addKey('ENTER');
    if (keyObj.isDown) {
        player.setX(player.x);
        player.setY(player.y); 
         $('#exampleModalDetalle').modal('show');    
    } 
}
function PlayerAccesoFormulario(player,key) {
    var keyObj = this.input.keyboard.addKey('ENTER');
    if (keyObj.isDown) {
        player.setX(player.x);
        player.setY(player.y); 
         $('#exampleModalFormulario').modal('show');    
    } 
}

function PlayerAccesoTabla(player,key) {
    var keyObj = this.input.keyboard.addKey('ENTER');
    if (keyObj.isDown) {
        player.setX(player.x);
        player.setY(player.y); 
         $('#exampleModalTabla').modal('show');    
    } 
}
function PlayerAccesoModalLG(player,key) {
    var keyObj = this.input.keyboard.addKey('ENTER');
    if (keyObj.isDown) {
        player.setX(player.x);
        player.setY(player.y); 
         $('#exampleModalLG').modal('show');    
    } 
}
