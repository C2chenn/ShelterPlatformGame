var blackwhite = {
	preload: function() {

        game.load.spritesheet('girl', 'assets/girl.png', 60, 60);
        game.load.image('ground', 'assets/blackwhite.png');
        game.load.image('background', 'assets/blackwhitebackground.png');
        game.load.image('boxwhite', 'assets/whitecube.png');
        game.load.image('boxred', 'assets/redcube.png');
        game.load.tilemap('tilemap1', 'assets/blackwhite.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tablet', 'assets/tablets/tablet00.png');
       
    },

    create: function() {

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 0, 'background');
        
        this.map = game.add.tilemap('tilemap1');
        
        this.map.addTilesetImage('blackwhite', 'ground');

        this.groundLayer = this.map.createLayer('Ground');

        this.groundLayer.resizeWorld();
        
        this.map.setCollisionBetween(1, 1000, true, 'Ground');

        this.boxes = game.add.group();

        var box = this.boxes.create( 20, 90, 'boxwhite');
        box = this.boxes.create( 100, 120, 'boxwhite');
        box = this.boxes.create( 300, 170, 'boxwhite');
        box = this.boxes.create( 470, 100, 'boxwhite');
        box = this.boxes.create( 610, 200, 'boxwhite');
        box = this.boxes.create( 770, 150, 'boxwhite');
        box = this.boxes.create( 975, 170, 'boxwhite');
        box = this.boxes.create( 1190, 100, 'boxwhite');
        



        // The player and its settings
        this.player = game.add.sprite(32, game.world.height - 300, 'girl');

        //  We need to enable physics on the player
        game.physics.arcade.enable(this.player);


        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 500;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [2, 3], 10, true);
        this.player.animations.add('right', [4, 5], 10, true);

        this.tablet = game.add.sprite(500, 250, 'tablet');
        game.physics.arcade.enable(this.tablet);
        

        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player);

    },

    update: function() {

        game.physics.arcade.collide(this.player, this.groundLayer);
        game.physics.arcade.collide(this.player, this.platformLayer);
        game.physics.arcade.overlap(this.player, this.tablet, this.changeState, null, this);
        this.boxes.forEach(this.wrapBoxes, this);
    

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else if (this.cursors.up.isDown && this.player.body.blocked.down || this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -300;
            this.player.frame = 1;
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            if (!this.player.body.blocked.down && !this.player.body.touching.down) {
                this.player.frame = 1;
            }
            else{
                this.player.frame = 0;
            }
        }

    },

    wrapBoxes: function(box) {
        if (this.player.x > box.x) {
            box.loadTexture('boxred');
        }
        
    },

    changeState: function() {
        
        game.state.start('level1');
    },

}