class TextUtil {
    constructor(parent) {
        this.parent = parent;
        //set style names
        this.TITLE_TEXT = "tileText";
        this.FROST = "frost";
        this.SCORE = "score";
        this.BLACK = "BLACK";
        this.WHITE = "WHITE";
    }
    /*
        get a centered text field
        if there is a style passed in
        apply it to the text field
    */
    getBasicText(text, style = null) {
        //log(style)
        var textConfig = this.getStyle(style)
        //log(textConfig)
        if (style == null) {
            var textObj = this.parent.add.text(0, 0, text);
        } else {
            var textObj = this.parent.add.text(0, 0, text, textConfig);
        }
        textObj.setOrigin(0.5, 0.5);
        //see if the style has a stroke
        this.setStroke(style, textObj);
        return textObj;
         
    }

    getStyle(style) {
        //get a config object
        //based on the style string
        //https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle
        //log("Style: " )
        var textConfig = null;
        switch (style) {
            case this.TITLE_TEXT:
                textConfig = {
                    fontFamily:"Arial",
                    fontSize: game.config.width / 10,
                    color:"#000000"
                };
                break;
            case this.FROST:
                textConfig = {
                    fontFamily: "Arial",
                    fontSize: game.config.width / 20,
                    color: "#1AF1D0"
                };
                break;
            case this.SCORE:
                textConfig = {
                    fontFamily: "Arial",
                    fontSize: game.config.width / 20,
                    color: "#0EBF23"
                };
                break;
            case this.BLACK:
                textConfig = {
                    fontFamily: "Arial",
                    fontSize: game.config.width / 20,
                    color: "#000000"
                };
                break;
            case this.WHITE:
                textConfig = {
                    fontFamily: "Arial",
                    fontSize: game.config.width / 20,
                    color: "#ffffff"
                };
                break;
        }
        return textConfig;
    }

    setStroke(style, textObj) {
        switch (style) {
            case this.TITLE_TEXT:
                textObj.setStroke('white', 3);
                break;
            case this.FROST:
                textObj.setStroke('#1669C6', 4);
                break;
        }
    }
}