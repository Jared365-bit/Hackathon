// Create a config file for the game
const config = {
type: Phaser.AUTO,
height: 360,
width: 640,
scene: [Scene1]
};
// Create a game
const game = new Phaser.Game(config);