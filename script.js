

var c = document.getElementById("canvas-club");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var particles = [];
var maxParticles = 100;
var size = 2;
var r = size/2;
var clearColor = "rgba(0, 0, 0, .2";
var mouse = {};
mouse.x = w/2;
mouse.y = h/2;

function random(min, max){
	return (Math.random() * (max - min)) + min;
}

function getDistance(x1, y1, x2, y2){
	return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}


function resize(){
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight
}

function moveMouse(e){
	mouse.x = e.touches ? e.touches[0].clientX : e.clientX;
	mouse.y = e.touches ? e.touches[0].clientY : e.clientY;
}

function P(){}

P.prototype = {
	
	init: function(){
		this.x = random(0, (w - size));
		this.y = h + random(0, 20);
		this.vx = 0;
		this.vy = random(-1, -2);
		this.alpha = 0;
		this.active = false;
	},
	
	draw: function(){
		var hue = (h - this.y) * .6;
		
		ctx.fillStyle = this.active ? "hsla("+(hue+180)+", 100%, 50%, 1)" : "hsla("+hue+", 100%, 50%, .8)";
		ctx.strokeStyle = this.active ? "hsla("+(hue+180)+", 100%, 50%, .5)" : "hsla("+hue+", 100%, 50%, "+this.alpha+")";
		ctx.lineWidth = r/2;
		ctx.globalCompositeOperation = this.active ? "lighter" : "source-over";
		
		ctx.beginPath();
		ctx.arc(this.x + r, this.y + r, r, 0, 2 * Math.PI, false);
		ctx.fill();
		
		for(var i in particles){
			var p = particles[i];
			if(getDistance(this.x, this.y, p.x, p.y) < w/7){
				ctx.beginPath();
				ctx.moveTo(this.x + r, this.y + r);
				ctx.lineTo(p.x + r, p.y + r);
				ctx.stroke();
			}
		}
		
		this.update();
	},
	
	update: function(){
		this.active = (getDistance(this.x, this.y, mouse.x, mouse.y) < 80) ? true : false;
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= 1.15;
		this.alpha += .0005;
		if(this.y < h *.8 && Math.random() > .5){
			this.vx = random(-1, 1);
			this.vy -= .05;
		}
		
		if(this.y + 50 < 0){
			this.init();
		}
	}
}



function setup(){
	
	for(var i=0; i<maxParticles; i++){
		(function(x){
			setTimeout(function(){
				var p = new P();
				p.init();
				particles.push(p);
			}, x * 100)
		})(i);
	}
	
	window.addEventListener("resize", resize);
	window.addEventListener("mousemove", moveMouse);
	window.addEventListener("touchstart", moveMouse);
	window.addEventListener("touchmove", moveMouse);
}


function anim(){
	ctx.fillStyle = clearColor;
	ctx.globalCompositeOperation = "source-over";
	ctx.fillRect(0,0,w,h);
	
	for(var i in particles){
		var p = particles[i];
		p.draw();
	}
	window.requestAnimationFrame(anim);
}

setup();

anim();