class SceneText{
	constructor(config){
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}

		this.scene = config.scene

	}

	loadText(){
		//https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle
		var textConfigNormal={
			fontFamily:"Arial",
			fontSize:"70px",
			color:"#000000"
		}

		var textUtil = new TextUtil(this.scene)
		this.scene.text = textUtil.getBasicText("- Iniciar -",textUtil.TITLE_TEXT)
		this.scene.aGrid.placeAtIndex(16,this.scene.text)

		this.scene.text.setInteractive()
		
	}
	
}