class GamePad extends UIBlock{
	constructor(config){
		super()
		this.emitter = EventDispatcher.getInstance()

		this.scene = config.scene
		this.grid = config.grid

		this.scene.input.keyboard.on('keydown-' + 'UP',this.goUp.bind(this))
		this.scene.input.keyboard.on('keydown-' + 'DOWN',this.goDown.bind(this))
		this.scene.input.keyboard.on('keydown-' + 'LEFT',this.goLeft.bind(this))
		this.scene.input.keyboard.on('keydown-' + 'RIGHT',this.goRight.bind(this))
		this.scene.input.keyboard.on('keydown-' + 'SPACE',this.btn1Pressed.bind(this))
		this.scene.input.keyboard.on('keydown-' + 'X',this.btn2Pressed.bind(this))

		/*this.children.forEach(function(child){
			child.setScrollFactor(0)
		})*/
	}

	goUp(){
		//log("go Up")
		//this.emitter.emit("CONTROL_PRESSED","GO_UP")
	}
	goDown(){
		//log("go Down")
		//this.emitter.emit("CONTROL_PRESSED","GO_DOWN")
	}
	goLeft(){
		//log("go Left ")
		if(!portalOpened && !windowOpened){
			this.emitter.emit(this.scene.constants.CONTROL_PRESSED,this.scene.constants.GO_LEFT)
		}
	}
	goRight(){
		//log("go Right")
		if(!portalOpened && !windowOpened){
			this.emitter.emit(this.scene.constants.CONTROL_PRESSED,this.scene.constants.GO_RIGHT)
		}
	}
	btn1Pressed(){
		//log("button 1 space")
		if(!portalOpened && !windowOpened){
        	this.emitter.emit(this.scene.constants.CONTROL_PRESSED,this.scene.constants.BTN1)    
        }
		
	}
	btn2Pressed(){
		//log("button 2 x")
		if(!portalOpened && !windowOpened){
			this.emitter.emit(this.scene.constants.CONTROL_PRESSED,this.scene.constants.BTN2)
		}
	}
}