///////////////////////////////////////////////////////////////////////////////////////////
	// Variable de taille a regler par / pour le développeur frontend du projet
	var widthCanvaP5 = 200;
	var heightCanvaP5 = 200;

	// Variable de race pour proposer des armes adequates, s'actualise au clic de l'utilisateur
	var breed = "elf"

	// Selection des deux (voire plus) div container des armes en 3D
	var containerWeapon1 = document.getElementById("containerCanvaP5Weapon1");
	//containerWeapon1.style.width = widthCanvaP5 + "px";
	//containerWeapon1.style.height = heightCanvaP5 + "px";

	var containerWeapon2 = document.getElementById("containerCanvaP5Weapon2");
	//containerWeapon2.style.width = widthCanvaP5 + "px";
	//containerWeapon2.style.height = heightCanvaP5 + "px";

///////////////////////////////////////////////////////////////////////////////////////////
	var swordP5 = function (p) {
		p.setup = function() {
			p.createCanvas(widthCanvaP5, heightCanvaP5, 'webgl');
		};

		p.draw = function () {
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
		}
	}

	var cleaverP5 = function (p) {
		p.setup = function() {
			p.createCanvas(widthCanvaP5, heightCanvaP5, 'webgl');
		};
		p.draw = function () {
			// p.rotateY(p.frameCount * .05)
			// p.rotateZ(p.frameCount * .08)
			// p.background(150);
			// p.fill('blue')
			// p.box(50)

			p.background(150);
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
		}
	}

	var daggerP5 = function (p) {
		p.setup = function() {
			p.createCanvas(widthCanvaP5, heightCanvaP5, 'webgl');
		};
		p.draw = function () {
			p.background(150)
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
		}
	}

	var staffP5 = function (p) {
		p.setup = function () {
			p.createCanvas(widthCanvaP5, heightCanvaP5, 'webgl');
		}
		p.draw = function () {
			p.rotateY(p.frameCount * .05)
			p.rotateZ(p.frameCount * .08)
			p.background(150);
			p.fill('red')
			p.box(50)
		}
	}

	// Voir pour un switch case : envisager plus de deux armes, plus de deux classes !
	function displayWeapon3d(breed, id1, id2){
		let container1 = document.getElementById(id1)
		let container2 = document.getElementById(id2)
		if(breed === "human"){
			var weapon1_3D =  new p5(swordP5, container1);
			var weapon2_3D =  new p5(cleaverP5, container2);
		}else if(breed === "elf"){
			var weapon1_3D =  new p5(daggerP5, 'containerCanvaP5Weapon1');
			var weapon2_3D =  new p5(staffP5, 'containerCanvaP5Weapon2'); 
		}
	}
	

