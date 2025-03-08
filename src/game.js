class TankGame extends Phaser.Scene {
    constructor() {
        super('TankGame');
    }

    create() {
        // Create the tank parts at the center of the screen
        const centerX = 400;
        const centerY = 300;

        this.tankTop = new TankPart(this, centerX, centerY - 25);
        this.tankBottom = new TankPart(this, centerX, centerY + 25);

        // Initialize joysticks
        this.joystickMovement = this.input.keyboard.createCursorKeys();
        this.joystickAim = this.input.keyboard.createCursorKeys();

        // Create UI for joystick (optional)
        if (!this.joystickMovement.left) {
            this.joystickMovement = new Joystick(this, 100, 300);
        }
        if (!this.joystickAim.up) {
            this.joystickAim = new Joystick(this, 700, 300);
        }

        // Set up input for aiming
        this.input.on('pointermove', function(pointer) {
            let angle = Phaser.Math.Angle.BetweenPoints(this.tankTop, pointer);
            this.tankTop.setAngle(angle);
            this.tankBottom.setAngle(angle);
        }, this);

        // Move the tank parts based on joystickMovement
        this.updateDirection = () => {
            const speed = 5;

            let vxTop = 0;
            let vyTop = 0;
            let vxBottom = 0;
            let vyBottom = 0;

            if (this.joystickMovement.left.isDown) {
                vxTop -= speed;
                vxBottom -= speed;
            } else if (this.joystickMovement.right.isDown) {
                vxTop += speed;
                vxBottom += speed;
            }

            if (this.joystickMovement.up.isDown) {
                vyTop -= speed;
                vyBottom -= speed;
            } else if (this.joystickMovement.down.isDown) {
                vyTop += speed;
                vyBottom += speed;
            }

            this.tankTop.setVelocity(vxTop, vyTop);
            this.tankBottom.setVelocity(vxBottom, vyBottom);
        };
    }

    update() {
        this.updateDirection();
    }
}

class TankPart extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);

        // Create a graphics object
        const graphics = scene.add.graphics();

        // Set the fill color to white (or any other desired color)
        graphics.fillStyle(0xffffff);

        // Draw a rectangle (tank part)
        graphics.fillRect(-15, -15, 30, 10);

        // Create a texture from the graphics object
        const tankTexture = graphics.generateTexture('tankPart');

        // Use the texture to create a sprite
        this.setTexture(tankTexture);
        this.setOrigin(0.5);

        // Add the sprite to the scene
        scene.add.existing(this);

        // Initialize physics for movement
        scene.physics.world.enableBody(this, 1);
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

class Joystick extends Phaser.Group {
    constructor(scene, x, y) {
        super(scene);
        this.x = x;
        this.y = y;

        // Add joystick base and stick
        let base = scene.add.image(x, y, 'joystick');
        base.setOrigin(0.5);

        let stick = scene.add.circle(base.x, base.y, 30, 0x888888);
        stick.setFillStyle(0x222222);

        this.add(base);
        this.add(stick);

        // Input handling
        scene.input.on('pointerdown', function(pointer) {
            if (this.containsPoint(pointer.x, pointer.y)) {
                this.active = true;
                this.stick.setPosition(pointer.x, pointer.y);
            }
        }, this);

        scene.input.on('pointermove', function(pointer) {
            if (this.active && this.containsPoint(pointer.x, pointer.y)) {
                let dx = pointer.x - this.base.x;
                let dy = pointer.y - this.base.y;

                // Limit stick movement to a circle with radius 50
                if (Math.sqrt(dx * dx + dy * dy) > 50) {
                    dx *= 50 / Math.sqrt(dx * dx + dy * dy);
                    dy *= 50 / Math.sqrt(dx * dx + dy * dy);
                }

                this.stick.setPosition(this.base.x + dx, this.base.y + dy);

                // Update movement or aiming based on stick position
                // This is where you would add logic to map stick position to game controls
            }
        }, this);

        scene.input.on('pointerup', function() {
            if (this.active) {
                this.stick.setPosition(this.base.x, this.base.y);
                this.active = false;
            }
        }, this);
    }

    containsPoint(x, y) {
        return Phaser.Math.Distance.BetweenPoints({ x: x, y: y }, { x: this.base.x, y: this.base.y }) < 60;
    }
}