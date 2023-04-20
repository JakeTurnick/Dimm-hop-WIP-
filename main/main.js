var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 1000 },
		},
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
};

var game = new Phaser.Game(config);

function preload() {
	// Load assets
	this.load.image("Blobby", "../assets/blobby.png");
	this.load.image("sky", "../assets/sky.png");
	this.load.image("platform", "../assets/platform.png");
	// SpriteSheet is 1 sheet, divided into sprites to create animations
	this.load.spritesheet("dude", "../assets/dude.png", {
		frameWidth: 32,
		frameHeight: 48,
	});
	this.load.image("star", "../assets/star.png");
}
var platforms;
var player;
var cursors;
var stars;
var jumpCount = 0;

function create() {
	this.add.image(0, 0, "sky").setOrigin(0, 0);
	this.add.image(400, 500, "Blobby").setOrigin(0, 0);

	// Static groups don't move
	platforms = this.physics.add.staticGroup();

	platforms.create(400, 568, "platform").setScale(2).refreshBody();
	platforms.create(100, 250, "platform");
	platforms.create(700, 400, "platform");

	player = this.physics.add.sprite(100, 450, "dude");

	// bounce a little when colliding
	// Player can't exit screen/world bounds
	player.setBounce(0.1);
	player.setCollideWorldBounds(true);
	player.doubleJump = false;

	this.anims.create({
		key: "left",
		frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1,
	});

	this.anims.create({
		key: "turn",
		frames: [{ key: "dude", frame: 4 }],
		frameRate: 20,
	});

	this.anims.create({
		key: "right",
		frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1,
	});

	this.physics.add.collider(player, platforms);
	cursors = this.input.keyboard.createCursorKeys();

	stars = this.physics.add.group({
		key: "star",
		repeat: 11,
		setXY: { x: 12, y: 0, stepX: 70 },
	});
	stars.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});
	this.physics.add.collider(stars, platforms);
	this.physics.add.overlap(player, stars, collectStar, null, this);
}

function collectStar(player, star) {
	star.disableBody(true, true);
}

// var doubleJump = false;
// var groundJump = true;

function update() {
	// Basic movement
	if (cursors.left.isDown) {
		player.setVelocityX(-160);
		player.anims.play("left", true);
	} else if (cursors.right.isDown) {
		player.setVelocityX(160);
		player.anims.play("right", true);
	} else {
		player.setVelocityX(0);
		player.anims.play("turn", true);
	}
	// Jumps with limits
	if (cursors.up.isDown) {
		if (player.body.touching.down) {
			player.setVelocityY(-500);
			jumpCount++;
		} else if (
			jumpCount < 3 &&
			this.input.keyboard.checkDown(cursors.up, 200)
		) {
			player.setVelocityY(-500);
			jumpCount++;
		}
	}
	if (player.body.touching.down) {
		jumpCount = 0;
	}
}
