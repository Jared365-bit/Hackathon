mkdir phaser-game
cd phaser-game
code . 

node -v
npm -v  
npm - v 
ext install npm script runner.

npminit -y 
npm install phaser 
 ,l

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
      preload,
      create,
      update
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
  }
  
  function create() {
    this.add.image(400, 300, 'sky');
  }
  
  function update() {}
