class TankGame extends Phaser.Scene {
    constructor() {
        super('TankGame');
    }

    preload() {
        this.load.image('sky', './src/assets/sky.png');
        this.load.image('ground', './src/assets/platform.png');
        this.load.image('star', './src/assets/star.png');
        this.load.image('bomb', './src/assets/bomb.png');
        this.load.spritesheet('dude', 
            './src/assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );    
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 300, 'star');    
    }

    update() {
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [TankGame]
};

const game = new Phaser.Game(config);