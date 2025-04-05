// Initialize Kaboom with enhanced settings
kaboom({
	background: [45, 30, 80],
	width: 800,
	height: 600,
	scale: 1,
	debug: false,
	crisp: true
  })
  
  // Load sounds and sprites
  loadSound("pop", "https://kaboomjs.com/sounds/score.mp3")
  loadSound("music", "https://kaboomjs.com/sounds/powerup.mp3")
  
  // Define game colors - vibrant palette
  const COLORS = [
	[255, 87, 87],   // Red
	[255, 190, 61],  // Yellow
	[80, 220, 100],  // Green
	[66, 176, 245],  // Blue
	[255, 102, 196], // Pink
	[155, 89, 255]   // Purple
  ]
  
  // Particle effects
  function spawnParticles(p, color) {
	for (let i = 0; i < 15; i++) {
	  add([
		pos(p),
		rect(rand(3, 7), rand(3, 7)),
		color,
		lifespan(rand(0.3, 0.6)),
		move(rand(0, 360), rand(60, 180)),
		scale(1, 0.1),
		rotate(rand(0, 360)),
		area(),
		"particle"
	  ])
	}
  }
  
  // Add beautiful background with animated gradients
  function createBackground() {
	// Create multiple background elements for depth
	const bg = add([
	  rect(width(), height()),
	  color(45, 30, 80),
	  z(-10),
	  fixed()
	])
	
	// Add floating gradient blobs in background
	for (let i = 0; i < 8; i++) {
	  const size = rand(100, 300)
	  const speed = rand(20, 60)
	  const hue = rand(0, 360)
	  
	  add([
		pos(rand(0, width()), rand(0, height())),
		circle(size),
		color(hue, 80, 70),
		opacity(0.2),
		z(-5),
		fixed(),
		{
		  dir: vec2(rand(-1, 1), rand(-1, 1)).unit(),
		  update() {
			this.pos.x += this.dir.x * speed * dt()
			this.pos.y += this.dir.y * speed * dt()
			
			// Bounce on edges
			if (this.pos.x < 0 || this.pos.x > width()) this.dir.x *= -1
			if (this.pos.y < 0 || this.pos.y > height()) this.dir.y *= -1
		  }
		}
	  ])
	}
	
	// Add subtle sparkles
	action("sparkle", (s) => {
	  s.timer -= dt()
	  if (s.timer <= 0) {
		destroy(s)
	  }
	})
	
	// Continuously add new sparkles
	loop(0.2, () => {
	  add([
		pos(rand(0, width()), rand(0, height())),
		rect(rand(1, 3), rand(1, 3)),
		color(255, 255, 255),
		opacity(rand(0.3, 0.7)),
		lifespan(rand(0.3, 1.0)),
		z(-2),
		fixed(),
		"sparkle",
		{ timer: rand(0.3, 1.0) }
	  ])
	})
  }
  
  // Game scene
  scene("game", () => {
	let score = 0
	let timeLeft = 60
	let isGameOver = false
	
	createBackground()
	
	// Music (looped)
	const music = play("music", {
	  volume: 0.3,
	  loop: true
	})
	
	// Score display with a beautiful container
	const scoreContainer = add([
	  rect(150, 60, { radius: 12 }),
	  pos(20, 20),
	  color(0, 0, 0),
	  opacity(0.7),
	  fixed(),
	  z(100)
	])
	
	const scoreLabel = add([
	  text("Score: 0", { size: 24 }),
	  pos(30, 35),
	  fixed(),
	  z(101)
	])
	
	// Timer with animated bar
	const timerContainer = add([
	  rect(150, 60, { radius: 12 }),
	  pos(width() - 170, 20),
	  color(0, 0, 0),
	  opacity(0.7),
	  fixed(),
	  z(100)
	])
	
	const timerLabel = add([
	  text("Time: 60", { size: 24 }),
	  pos(width() - 160, 35),
	  fixed(),
	  z(101)
	])
	
	// Animated timer bar
	const timerBar = add([
	  rect(120, 10, { radius: 4 }),
	  pos(width() - 155, 60),
	  color(255, 255, 255),
	  fixed(),
	  z(101)
	])
  
	// Spawn bubbles
	function spawnBubble() {
	  if (isGameOver) return
	  
	  const colorIndex = Math.floor(rand(0, COLORS.length))
	  const size = rand(30, 60)
	  const speed = map(size, 30, 60, 380, 200) // Smaller bubbles move faster
	  
	  const bubble = add([
		pos(rand(50, width() - 50), height() + size),
		circle(size),
		area(),
		color(COLORS[colorIndex]),
		outline(2, rgba(255, 255, 255, 0.8)),
		move(270, speed),
		scale(1),
		rotate(0),
		opacity(0.9),
		z(10),
		// Custom properties
		{
		  value: Math.floor(map(size, 30, 60, 10, 5)),
		  growing: false,
		  colorVal: COLORS[colorIndex]
		},
		"bubble"
	  ])
	  
	  // Slight wobble effect
	  bubble.onUpdate(() => {
		bubble.pos.x += Math.sin(time() * 2 + bubble.pos.y * 0.05) * 0.7
		
		// Remove if past top
		if (bubble.pos.y < -size) {
		  destroy(bubble)
		}
		
		// Growing animation on hover
		if (bubble.growing) {
		  bubble.radius = wave(size, size * 1.1, time() * 6)
		}
	  })
	  
	  // Hover effect
	  bubble.onHover(() => {
		bubble.growing = true
	  })
	  
	  bubble.onHoverEnd(() => {
		bubble.growing = false
	  })
	  
	  // Pop on click
	  bubble.onClick(() => {
		// Sound effect
		play("pop", {
		  volume: 0.3,
		  detune: rand(-300, 300)
		})
		
		// Update score
		score += bubble.value
		scoreLabel.text = "Score: " + score
		
		// Particles in bubble's color
		spawnParticles(bubble.pos, bubble.colorVal)
		
		// Remove bubble
		destroy(bubble)
	  })
	}
	
	// Countdown timer
	action(() => {
	  if (isGameOver) return
	  
	  timeLeft -= dt()
	  timerLabel.text = "Time: " + Math.ceil(timeLeft)
	  
	  // Update timer bar
	  timerBar.width = 120 * (timeLeft / 60)
	  
	  // Change timer bar color based on time left
	  if (timeLeft < 10) {
		timerBar.color = rgb(255, 50, 50)
	  } else if (timeLeft < 30) {
		timerBar.color = rgb(255, 165, 0)
	  }
	  
	  if (timeLeft <= 0) {
		isGameOver = true
		go("gameOver", score)
	  }
	})
	
	// Spawn bubbles at random intervals
	loop(0.5, () => {
	  if (!isGameOver) spawnBubble()
	})
  })
  
  // Game over scene
  scene("gameOver", (score) => {
	createBackground()
	
	add([ 
	  rect(400, 300, { radius: 16 }),
	  pos(center()),
	  color(0, 0, 0),
	  opacity(0.8),
	  origin("center"),
	  z(90)
	])
	
	add([
	  text("Game Over!", { size: 48 }),
	  pos(center().x, center().y - 80),
	  color(255, 255, 255),
	  origin("center"),
	  z(100)
	])
	
	add([
	  text("Final Score: " + score, { size: 36 }),
	  pos(center().x, center().y),
	  color(255, 190, 61),
	  origin("center"),
	  z(100)
	])
	
	const playBtn = add([ 
	  rect(200, 60, { radius: 8 }), 
	  pos(center().x, center().y + 80),
	  color(80, 220, 100), 
	  outline(4, rgba(255, 255, 255, 0.5)), 
	  origin("center"),
	  area(), 
	  scale(1),
	  z(100),
	  "button" 
	])
	
	add([
	  text("Play Again", { size: 24 }),
	  pos(center().x, center().y + 80),
	  origin("center"),
	  color(0, 0, 0),
	  z(101)
	])
	
	// Button hover effect
	playBtn.onHover(() => {
	  playBtn.scale = vec2(1.05)
	  playBtn.color = rgb(100, 240, 120)
	})
	
	playBtn.onHoverEnd(() => {
	  playBtn.scale = vec2(1)
	  playBtn.color = rgb(80, 220, 100)
	})
	
	playBtn.onClick(() => {
	  go("game")
	})
	
	// Continuous particle effects in the background
	loop(0.2, () => {
	  const pos = vec2(rand(0, width()), rand(0, height()))
	  const colorIndex = Math.floor(rand(0, COLORS.length))
	  
	  add([ 
		pos(pos), 
		circle(rand(5, 15)), 
		color(COLORS[colorIndex]),
		lifespan(rand(0.5, 2)), 
		move(rand(0, 360), rand(20, 60)), 
		scale(1, 0.1), 
		opacity(0.5), 
		z(50) 
	  ])
	})
  })
  
  // Start screen
  scene("start", () => {
	createBackground()
	
	add([ 
	  rect(500, 400, { radius: 16 }), 
	  pos(center()), 
	  color(0, 0, 0), 
	  opacity(0.8), 
	  origin("center"), 
	  z(90) 
	])
	
	add([ 
	  text("Bubble Pop", { size: 64 }), 
	  pos(center().x, center().y - 120), 
	  color(255, 102, 196), 
	  origin("center"), 
	  z(100) 
	])
	
	add([ 
	  text("A Colorful Adventure", { size: 24 }), 
	  pos(center().x, center().y - 60), 
	  color(155, 89, 255), 
	  origin("center"), 
	  z(100) 
	])
	
	add([ 
	  text("Click bubbles to pop them\nGet as many points as you can\nbefore time runs out!", 
	  { size: 24, align: "center" }), 
	  pos(center().x, center().y), 
	  color(255, 255, 255), 
	  origin("center"), 
	  z(100) 
	])
	
	const startBtn = add([ 
	  rect(200, 60, { radius: 8 }), 
	  pos(center().x, center().y + 100), 
	  color(66, 176, 245), 
	  outline(4, rgba(255, 255, 255, 0.5)), 
	  origin("center"), 
	  area(), 
	  scale(1),
	  z(100), 
	  "button" 
	])
	
	add([ 
	  text("Start Game", { size: 24 }), 
	  pos(center().x, center().y + 100), 
	  origin("center"), 
	  color(0, 0, 0), 
	  z(101) 
	])
	
	// Button hover effect
	startBtn.onHover(() => {
	  startBtn.scale = vec2(1.05)
	  startBtn.color = rgb(86, 196, 255)
	})
	
	startBtn.onHoverEnd(() => {
	  startBtn.scale = vec2(1)
	  startBtn.color = rgb(66, 176, 245)
	})
	
	startBtn.onClick(() => {
	  go("game")
	})
  })
  
  // Start with the start screen
  go("start")
  