let nbWeapon = 3
	function swapWeapon(){
		weapon = (weapon + 1 ) % nbWeapon
		console.log(weapon)
	}

	var widthCanvaP5 = 200;
	var heightCanvaP5 = 200;

	var containerCanvaP5Weapon = document.getElementById("containerCanvaP5Weapon");
	containerCanvaP5Weapon.style.width = widthCanvaP5 + "px";
	containerCanvaP5Weapon.style.height = heightCanvaP5 + "px";

	var weapon = 2;

	var pots = function( p ) { 
		var x = 100.0; 
		var y = 100; 
		var speed = 2.5; 
		p.setup = function() {
			p.createCanvas(widthCanvaP5, heightCanvaP5, 'webgl');
		};

		p.draw = function() {

			switch(weapon){
				// Potion absolument degueulasse mais ça passe
				case 0:
				p.rotateY(p.frameCount * .05)		

				p.push();
				p.background(200);
				p.pop();

				p.push();
				p.fill("red");
				p.noStroke();
				p.directionalLight(250, 250, 250, 50, -20, -80);
				p.sphere(50);
				p.pop();

				p.push();
				p.translate(0, -25, 50);
				p.fill("#aa6320")
				p.noStroke();
				p.box(16);
				p.pop();
				break;

				// Epee sympathique
				case 1 :
				p.translate(-35,120,-300)
				p.rotateX(Math.PI/3)
				p.rotateY(Math.PI/8)
				p.noStroke()

				p.rotateZ(p.frameCount * .01)
				p.background(200)

				p.push()
				p.fill('#9b5a0a')
				p.torus(40, 20);
				p.translate(0,0,100)
				p.torus(30, 20);
				p.pop()

				p.push();
				p.fill('#a36f30')
				p.rotateX(Math.PI/2)
				p.translate(0,60,0)
				p.cylinder(30, 100);
				p.pop();

				p.push();
				p.translate(0,0,200)
				p.fill("grey")
				p.box(6,70,200)
				p.pop();

				p.push();
				p.translate(0,0,300)
				p.rotateX(Math.PI/4)
				p.box(6, 50,50)
				p.pop();

				p.push();
				p.translate(0,0,200)
				p.fill("#666563")
				p.box(7,2,200)
				p.pop();
				break;

				// dague verte
				case 2 :
				p.background(200)
				p.translate(0,0,-200)

				p.rotateY(p.frameCount * 0.01)  
				p.rotateZ(p.frameCount * 0.01)

				p.push()
				p.rotateZ(Math.PI/2)
				p.noStroke()
				p.fill("green")
				for(var i = 1; i < 8; i++){
					p.box(i*10, i*10, i)
					p.translate(i*5, i*5, 0)
				}

				p.translate(-10,-10,0)
				p.rotateX(Math.PI/2)
				p.rotateY(3 * Math.PI/4)
				p.fill("black")
				p.torus(35,15, 5, 5)
				p.box(40,40,18)
				p.rotateX(Math.PI / 2)
				p.translate(0,15,0)
				p.cylinder(15,50)
				break;
			}
			
		};
	};

	var myp5 = new p5(pots, 'containerCanvaP5Weapon');