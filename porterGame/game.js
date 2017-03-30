var game = new Phaser.Game(608, 384, Phaser.AUTO, 'game');

var audio = new Audio("assets/Shelter.WAV");
audio.loop = true;
audio.play();

game.state.add('home', bedroom);
game.state.add('bamboo1', bamboo1);
game.state.add('bamboo2', bamboo2);
game.state.add('bamboo3', bamboo3);
game.state.add('grass1', grass1);
game.state.add('grass2', grass2);
game.state.add('grass3', grass3);
game.state.add('glacier1', glacier1);
game.state.add('glacier2', glacier2);
game.state.add('blackwhite', blackwhite);

game.state.start("bamboo3");
