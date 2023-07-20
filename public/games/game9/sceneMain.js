var log = console.log
class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload()
  {
    this.load.atlas("ninja","images/ninja.png","images/ninja.json")    	
    this.load.image("brown","images/tiles/brickBrown.png")
    this.load.image("gray","images/tiles/brickGrey.png")

    this.load.image("cross","images/controls/cross.png")
    this.load.image("redButton","images/controls/redButton.png")
    this.load.image("hidden","images/controls/hidden.png")
    this.load.image("controlBack","images/controls/controlBack.png")
    this.load.image("background","images/background.png")
    this.load.image("ladder","images/objects/ladder.png")
  }
  create() {
    console.log("Ready!");
    let bg = this.add.image(0,0,"background").setOrigin(0,0)
    Align.scaleToGameW(bg,2)
    //
    //
    //
    this.emitter = EventDispatcher.getInstance()
    this.brickGroup = this.physics.add.group()
    this.ladderGroup = this.physics.add.group()
    this.ninja = this.physics.add.sprite(200,-100,"ninja")
    Align.scaleToGameW(this.ninja,.2)
    //
    //
    //
    var frameNames = this.textures.get('ninja').getFrameNames();
    //log(frameNames)

    this.makeAnims()
    this.ninja.play("idle")
    window.ninja = this.ninja

    this.aGrid = new AlignGrid({scene:this,rows:11,cols:11})
    //this.aGrid.showNumbers()

    this.blockGrid = new AlignGrid({scene:this,rows:22,cols:22,height:bg.displayHeight,width:bg.displayWidth})
    this.blockGrid.showNumbers()

    this.makeFloor(396,417,"brown")

    this.ninja.setGravityY(200);

    this.gamePad = new GamePad({scene:this,grid:this.aGrid})
    this.aGrid.placeAtIndex(88,this.gamePad)
    this.setListeners()

    this.cameras.main.setBounds(0,0,bg.displayWidth,bg.displayHeight)
    this.cameras.main.startFollow(this.ninja)
    //window.scene = this

    this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: false });

    this.makePlats()
    this.makeObjs()

    this.ninja.setDepth(10000)
    this.makeColliders()
  }
  makeColliders(){
    this.physics.add.collider(this.ninja, this.brickGroup,null, this.checkUp.bind(this));
    this.physics.add.overlap(this.ninja, this.ladderGroup);
  }
  checkUp(){
    if(this.onLadder == true && this.ninja.body.velocity.y < 0){
      return false
    }
    return true
  }
  checkLadder(){
    this.onLadder = false
    this.ladderGroup.children.iterate(function(child){
      if(!child.body.touching.none){
        log("On ladder")
        this.onLadder = true
      }
    }.bind(this))
  }
  makePlats(){
    this.makeFloor(396,417,"brown")
    this.makeFloor(334,338,"gray")
  }
  makeObjs(){
    this.makeObj(378,"ladder","ladder")
  }
  makeObj(pos,key,type){
    let obj = this.physics.add.image(0,0,key)
    Align.scaleToGameW(obj,.1)
    this.blockGrid.placeAtIndex(pos,obj)
    if(type == "ladder"){
      this.ladderGroup.add(obj)
    }
  }
  delayDone(){
    this.ninja.body.setSize(this.ninja.width,this.ninja.height,true)
  }
  setListeners(){
    this.emitter.on('CONTROL_PRESSED',this.controlPressed.bind(this))
    this.input.on('pointerup',this.stopNinja.bind(this))
    this.input.keyboard.on('keyup', this.stopNinja.bind(this));
  }
  stopNinja(){
    this.ninja.setVelocityX(0)
    this.ninja.anims.play("idle")
  }
  controlPressed(param){
    switch(param){
      case "GO_UP":
        this.checkLadder()
        if(this.onLadder == true){
          this.ninja.setVelocityY(-250)
        }
      break;
      case "GO_DOWN":
      break;
      case "GO_LEFT":
        this.ninja.setVelocityX(-200)
        this.ninja.anims.play("run")
        this.ninja.flipX = true
      break;
      case "GO_RIGHT":
        this.ninja.setVelocityX(200)
        this.ninja.anims.play("run")
        this.ninja.flipX = false
      break;
      case "BTN1":
        this.ninja.setVelocityY(-200)
        this.ninja.anims.play("jump")
      break;
      case "BTN2":
      break;
    }
    
  }

  placeBlock(pos,key){
    let block = this.physics.add.sprite(0,0,key)
    this.blockGrid.placeAtIndex(pos,block)
    this.brickGroup.add(block)
    block.setImmovable();
    Align.scaleToGameW(block,.1)
  }

  makeFloor(fromPos,toPos,key){
    for(var i = fromPos; i < toPos+1; i++){
      this.placeBlock(i,key)
    }
  }

  makeAnims(){
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Attack__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Dead__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Idle__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Jump__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'jump_attack',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Jump_Attack__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'jump_throw',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Jump_Throw__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Run__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'slide',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Slide__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'throw',
      frames: this.anims.generateFrameNames('ninja', {start: 0, end: 8, zeroPad: 3, prefix: 'Throw__', suffix: '.png'}),
      frameRate: 8,
      repeat: -1
    })
      
  }
  update() {}
}