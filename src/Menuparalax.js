import Layer from "./Layer.js"
import Mushroom_Cave_L1 from './assets/paralax_Menu/Mushroom_Cave_L1.png'
import Mushroom_Cave_L2 from './assets/paralax_Menu/Mushroom_Cave_L2.png'
import Mushroom_Cave_L3 from './assets/paralax_Menu/Mushroom_Cave_L3.png'
import Mushroom_Cave_L4 from './assets/paralax_Menu/Mushroom_Cave_L4.png'
// import nearMountains from './assets/paralax_Menu/mountains.png'
// import foregroundTrees from './assets/paralax_Menu/trees.png'

export default class{
    constructor(game){
        this.game = game
        
        // layer(game, image, width, height, speedModifier)
        const layer1 = new Image()
        layer1.src = Mushroom_Cave_L1
        this.mushroom_l1 = new Layer(this.game, layer1, this.game.width, this.game.height, 0.15)

        const layer2 = new Image()
        layer2.src = Mushroom_Cave_L2
        this.mushroom_l2 = new Layer(this.game, layer2, this.game.width, this.game.height, 0.25)

        const layer3 = new Image()
        layer3.src = Mushroom_Cave_L3
        this.mushroom_l3 = new Layer(this.game, layer3, this.game.width, this.game.height, 0.20)

        const layer4 = new Image()
        layer4.src = Mushroom_Cave_L4
        this.mushroom_l4 = new Layer(this.game, layer4, this.game.width, this.game.height, 0.3)
        
        this.layers = [
            this.mushroom_l1,
            this.mushroom_l2,
            this.mushroom_l3,
            this.mushroom_l4,
        ]
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