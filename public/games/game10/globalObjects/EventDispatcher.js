let instance = null

class EventDispatcher extends Phaser.Events.EventEmitter{
	constructor(){
		super()
		//log("Dispatcher")
		if(instance == null){
			instance = this
		}
	}

	static getInstance(){
		if(instance == null){
			instance = new EventDispatcher()
		}
		return instance
	}
}