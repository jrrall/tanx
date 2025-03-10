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
