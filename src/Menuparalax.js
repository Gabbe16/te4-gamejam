import Layer from "./Layer.js"
import skyLayer from './assets/paralax_Menu/Mushroom_Cave_L1.png'
import farClouds from './assets/paralax_Menu/Mushroom_Cave_L2.png'
import nearClouds from './assets/paralax_Menu/Mushroom_Cave_L3.png'
import farMountains from './assets/paralax_Menu/Mushroom_Cave_L4.png'
// import nearMountains from './assets/paralax_Menu/mountains.png'
// import foregroundTrees from './assets/paralax_Menu/trees.png'

export default class{
    constructor(game){
        this.game = game
        
        // layer(game, image, width, height, speedModifier)
        const skyImage = new Image()
        skyImage.src = skyLayer
        this.skylayer = new Layer(this.game, skyImage, this.game.width, this.game.height, 0.15)

        const farCloudsImage = new Image()
        farCloudsImage.src = farClouds
        this.farclouds = new Layer(this.game, farCloudsImage, this.game.width, this.game.height, 0.25)

        const nearCloudsImage = new Image()
        nearCloudsImage.src = nearClouds
        this.nearclouds = new Layer(this.game, nearCloudsImage, this.game.width, this.game.height, 0.20)

        const farMountainsImage = new Image()
        farMountainsImage.src = farMountains
        this.farmountains = new Layer(this.game, farMountainsImage, this.game.width, this.game.height, 0.3)

        // const nearMountainsImage = new Image()
        // nearMountainsImage.src = nearMountains
        // this.nearmountains = new Layer(this.game, nearMountainsImage, this.game.width, this.game.height, 0.45)

        // const foregroundTreesImage = new Image()
        // foregroundTreesImage.src = foregroundTrees
        // this.foregroundtrees = new Layer(this.game, foregroundTreesImage, this.game.width, this.game.height, 0.4)
        
        this.layers = [
            this.skylayer,
            this.farclouds,
            this.nearclouds,
            this.farmountains,
            // this.nearmountains,
            // this.foregroundtrees
        ]
        console.log(this.layers)
    }

    update() {
        this.layers.forEach((layer) => {
            layer.update()
        })
    }

    draw(context) {
        this.layers.forEach((layer) => layer.draw(context))
    }
}