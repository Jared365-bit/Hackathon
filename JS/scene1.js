class Scene1 extends Phaser.Scene
// constructar() 
// super("scene_1"): 
// }
preload() {
    this.load.image('bg', 'assets/background.png');
    this.load.image('pikachu', 'assets/pikachu.png');
    this.load.image('dragon', 'assets/gyarados.png');
    this.load.image('red_dragon', 'assets/red_gyarados.png');
    this.load.audio('aog', 'assets/aog.mp3');
    }
create(); {
let bg = this.add.sprite(0 ,0, 'b');
bg.setPosition(640/2, 360/2);
this.pikachu = this.add.sprite(60, 180, 'pikachu'); 
this.pikachu.setScale(1); 

this.dragon1 = this.add.sprite (80, 80, 'dragon');
this.dragon2 = this.add.sprite (240, 200, 'dragon');
this.dragon3 = this.add.sprite (80, 300, 'dragon');
this.dragon4 = this.add.sprite(160, 140, 'red_dragon');
this.dragon5 = this.add.sprite (160, 240, 'red_dragon');
this.sound.add('aog').play()
this.cursors = this.input.keyboard.createCursorKeys();
};

update(); {
    if (this.cursors.right.isDown) {this.pikachu.flipX = false; this.pikachu.x += 2; }
    else if (this.cursors.left.isDown) {this.pikachu.flipX = true; this.pikachu.x -= 2;}
    else if (this.cursors.up.isDown) {this.pikachu.y -=2;}
    else if (this.cursors.down.isDown) {this.pikachu.y += 2;}
    this.dragon1.x -= 0.1;
    this.dragon2.x -= 0.1;
    this.dragon3.x -= 0.1; 
    this.dragon4.x -= 0.1; 
    this.dragon5.x -= 0.1; 
}
