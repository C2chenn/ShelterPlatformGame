var bamboo3 = {

    preload: function() {

        game.load.spritesheet('girl', 'assets/girl2.png', 32, 32);
        game.load.tilemap('tilemap1', 'assets/bamboo3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('bamboo', 'assets/bamboo.png');
        game.load.image('platform', 'assets/bamboo_plat.png');
        game.load.image('heart', 'assets/memory_heart.png');
        game.load.image('tablet', 'assets/tablets/tablet00.png');
    },

    create: function() {

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.map = game.add.tilemap('tilemap1');
        
        this.map.addTilesetImage('bamboo', 'bamboo');

        this.backgroundlayer = this.map.createLayer('Background');
        this.groundLayer = this.map.createLayer('Ground');
        this.platformLayer = this.map.createLayer('Platforms');
        this.leavesLayer = this.map.createLayer('Leaves');

        this.map.setCollisionBetween(1, 1000, true, 'Ground');
        this.map.setCollisionBetween(1, 1000, true, 'Platforms');
        this.map.forEach(function (t) { if (t) { t.collideDown = false;} }, game, 0, 0, this.map.width, this.map.height, this.platformLayer);
        this.backgroundlayer.resizeWorld();
        this.groundLayer.resizeWorld();
        this.platformLayer.resizeWorld();
        this.leavesLayer.resizeWorld();
        

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

        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player);

        this.platforms = game.add.physicsGroup();
        this.userPlatforms = game.add.physicsGroup();
        
        this.platforms.setAll('body.allowGravity', false);
        this.platforms.setAll('body.immovable', true);

        this.hearts = game.add.group();
        this.hearts.enableBody = true;

        for (var i = 0; i < 10; i++)
        {
            var heart = this.hearts.create(i * 60, 300, 'heart');

            //  Let gravity do its thing
            heart.body.gravity.y = 75;
        }

        this.scoreText = game.add.text(16, 16, '0/10', { fontSize: '16px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
        this.score = 0;
        this.passed = false;
    },

    update: function() {

        game.physics.arcade.collide(this.player, this.groundLayer);
         game.physics.arcade.collide(this.player, this.platformLayer);
        game.physics.arcade.collide(this.hearts, this.platformLayer);
        game.physics.arcade.collide(this.hearts, this.groundLayer);

        this.platforms.forEach(this.wrapPlatform, this);
        game.physics.arcade.collide(this.player, this.userPlatforms);

        game.physics.arcade.overlap(this.player, this.hearts, this.collectHeart, null, this);


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

        if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            console.log("preesss");
            console.log(this.player.y);
            var userPlatform = this.userPlatforms.create(this.player.x + 20, this.player.y - 20,'platform', this.userPlatforms);
            userPlatform.body.immovable = true;
            userPlatform.body.allowGravity = false;
            this.wrapUserPlatform(userPlatform);
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            console.log("preesss");
            console.log(this.player.y);
            var userPlatform = this.userPlatforms.create(this.player.x - 20, this.player.y - 20,'platform', this.userPlatforms);
            userPlatform.body.immovable = true;
            userPlatform.body.allowGravity = false;
            this.wrapUserPlatform(userPlatform);
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
       
            this.userPlatforms.forEach(this.platformsKill, this)
            
        }

        if (this.score == 1){
            if (this.passed == false) {
                this.tablet = game.add.sprite(20, 20, 'tablet');
                game.physics.arcade.enable(this.tablet);
                this.passed = true;
            }
            game.physics.arcade.overlap(this.player, this.tablet, this.changeState, null, this);
        }

    },

    
    wrapPlatform: function(platform) {
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.left = false;
        if (platform.x < 160)
        {
            platform.body.velocity.x = -1 * platform.body.velocity.x;
            platform.x = 170;
        }
        else if (platform.x > 500)
        {
            platform.body.velocity.x = -1 * platform.body.velocity.x;
            platform.x = 490;
        }
    },

    wrapUserPlatform: function(platform) {
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.left = false;
    },

    collectHeart: function(player, heart) {
        
        heart.kill();
        this.score += 1;
        this.scoreText.text = this.score +'/10';
    },

    platformsKill: function(platform) {
        
        platform.kill();
        
    },


    changeState: function() {
        
        game.state.start('level2');
    },
};