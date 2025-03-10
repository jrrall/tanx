
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