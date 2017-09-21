

var prota = null;
var muros = [];
var puntos = 0;
var sonidoChoque = null;
var sonidoFondo = null;
var imagenFondo = null;
var aplausos = null;
var gong = null;
var risas1 = null;
var risas2 = null;
var marcador = null;
var cartel = null;
var cerebritos = [];
cerebritos.esperar = 1;
function iniciarJuego() {
    prota = new Bloque(30,30,"rgba(255, 255, 255, 0.5)", 10,120);
    marcador = new Marcador("30px", "Consolas", "yellow", 150, 40);
    cartel = new Marcador("30px", "Consolas", "yellow", 300, 140);
    sonidoChoque = new Sonido("musica/impacto2.mp3");
    risas1 = new Sonido("musica/risas1.mp3");
    risas2 = new Sonido("musica/risas2.mp3");
    sonidoFondo = new Sonido("musica/fondo1.mp3");
    aplausos = new Sonido("musica/aplausos.mp3");
    gong = new Sonido("musica/gong.mp3");
    imagenFondo = new Fondo(1000, 300,"imagenes/fondo2.jpg",0,0);
    cerebritos.push( new Cerebrito(227,222,"imagenes/einstein.jpeg",450,50));
    cerebritos[0].activar();
    cerebritos.push( new Cerebrito(267,189,"imagenes/chiquito.jpeg",450,50));
    cerebritos.push( new Cerebrito(180,200,"imagenes/pantojo.jpeg",450,50));
    
    sonidoFondo.play();
    
    pantalla.Encender();
}
function Imagen(ancho, alto, src, x, y) {
  
  this.imagen = new Image();
  this.imagen.src = src;
  
  this.ancho = ancho;
  this.alto = alto;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.dibujar = function() {    
  	
      pantalla.ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
  } ;
}
function Cerebrito(ancho, alto, src, x, y) {
  this.activo = false;
  this.imagen = new Image();
  this.imagen.src = src;
  this.opacidad = .8; 
  this.ancho = ancho;
  this.alto = alto;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.intervaldesvanecer;
  this.intervalavanzar;
  
  this.dibujar = function() {    
  	pantalla.ctx.save();
	pantalla.ctx.globalAlpha = this.opacidad;
	this.opacidad -= .005;
	pantalla.ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
	pantalla.ctx.restore();  	
  };
  
  this.desvanecer = function(){
  	this.opacidad -= .1;
  	this.y += 1;
  	if(this.opacidad > 0)
  		this.intervaldesvanecer = setTimeout(this.desvanecer,150);
  	else{
  		this.activo = false;
  	}
  };
  this.activar = function(){
   	this.activo = true;
   	this.intervaldesvanecer = setTimeout(this.desvanecer,150);
   	this.intervalavanzar = setTimeout(this.avanzar,200);
   };
   this.avanzar = function(){
    	cerebritos[0].y += 1;
    	cerebritos[0].intervalavanzar = setTimeout(cerebritos[0].avanzar,30);
    };
    this.eliminar = function(){
  	
  	clearInterval(this.intervaldesvanecer);
  	clearInterval(this.intervalavanzar);
  	cerebritos.shift();  	
  	//setTimeout((function(){if (cerebritos.length > 0) cerebritos[0].activar();}),10000);
  };
}
function Fondo(ancho, alto, src, x, y) {
  
  this.imagen = new Image();
  this.imagen.src = src;
  
  this.ancho = ancho;
  this.alto = alto;
  this.x = x;
  this.y = y;
  this.dibujar = function() {    
      pantalla.ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
      pantalla.ctx.drawImage(this.imagen, this.x + this.ancho, this.y, this.ancho, this.alto);
  } 
  this.avanzar = function(){
    	this.x-= 1;
    	if(this.x <= -this.ancho) this.x = 0;
    };
}
function Sonido(src) {
    this.sonido = document.createElement("audio");
    this.sonido.src = src;
    this.sonido.setAttribute("preload", "auto");
    this.sonido.setAttribute("controls", "none");
    this.sonido.style.display = "none";
    document.body.appendChild(this.sonido);
    this.play = function(){
        this.sonido.play();
    }
    this.stop = function(){
        this.sonido.pause();
    }
}
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;
    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);
    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    return {x:canvasX, y:canvasY};
}

var pantalla = {
    canvas : document.createElement("canvas"),
    Encender : function() {
        this.canvas.width = 1000;
        this.canvas.height = 300;
        this.frames = 0;
        this.canvas.style.border = "1px solid #d3d3d3";
        this.canvas.style.backgroundColor = "#f1f1f1";
        this.ctx = this.canvas.getContext("2d");
        this.canvas.constructor.prototype.relMouseCoords = relMouseCoords;
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.body.appendChild(this.canvas);
        
       
        this.interval = setTimeout(dibujarPantalla , 20);
        window.addEventListener('keydown', function (e) {
            pantalla.teclas = (pantalla.teclas || []);
            pantalla.teclas[e.keyCode] = true;
       
        });
        window.addEventListener('keyup', function (e) {
            pantalla.teclas[e.keyCode] = false;
            
        });/*
        this.canvas.addEventListener('mousemove', function (e) {
        	var coords = pantalla.canvas.relMouseCoords(e);
        	prota.x = coords.x - prota.width / 2;
        	prota.y = coords.y - prota.height / 2;
            //pantalla.ctx.fillRect(coords.x - 5, coords.y-5, 5 ,5);
        });*/
    },
    limpiar : function(){
    	this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    },
    congelar : function(){
    	clearInterval(this.interval);
    }
    
}
function cadaTantosFrames( n ){
	return pantalla.frames % n == 0;
}
function Bloque(ancho, alto, color, x, y) {
    this.ancho = ancho;
    this.alto = alto;
    this.x = x;
    this.y = y;   
    this.avanceX = 0;
    this.avanceY = 0; 
    this.dibujar = function(){
    	pantalla.ctx.fillStyle = color;
    	pantalla.ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
    this.avanzar = function(){
    	this.x += this.avanceX;
    	this.y += this.avanceY;
    };
    this.contacto = function( cuerpo ){
        if (	this.y + this.alto -1 < cuerpo.y  || this.y > cuerpo.y + cuerpo.alto -1 ||
        	this.x + this.ancho -1 < cuerpo.x  || this.x > cuerpo.x + cuerpo.ancho - 1 )
           		return false;      
        return true;
    };
}

function Marcador(ancho, alto, color, x, y) {
    this.ancho = ancho;
    this.alto = alto;
    this.x = x;
    this.y = y;   
    this.dibujar = function(){
    	pantalla.ctx.fillStyle = color;
    	pantalla.ctx.font = this.ancho + " " + this.alto;
      	pantalla.ctx.fillStyle = color;
      	pantalla.ctx.fillText(this.txt, this.x, this.y);    	
    }    
}

function dibujarPantalla() {
	var x,y;
    	for( i = 0; i < muros.length; i++ )    
    		if( prota.contacto(muros[i]) || prota.x < 0){
    			pantalla.congelar();
    			sonidoFondo.stop();
    			sonidoChoque.play();
    			risas1.play();
    			risas2.play();
    			cartel.txt="¡Aplaudamos todos al torpe!";
    			cartel.dibujar();
    			return;
    	}
    	if(prota.x >= pantalla.canvas.width - prota.ancho ){
    			pantalla.congelar();
    			sonidoFondo.stop();
    			gong.play();
    			aplausos.play();
    			cartel.txt="Y eso que naciste siendo un Zoquete ... ";
    			cartel.dibujar();
    			return;
    	}
    	 
	pantalla.limpiar();
	imagenFondo.avanzar();
	imagenFondo.dibujar();
	pantalla.frames++;
	if(pantalla.frames == 1 || cadaTantosFrames(120)){
		x = pantalla.canvas.width; // entra por el extremo derecho de la pantalla
		hueco = prota.alto + 2 * Math.floor(Math.random()*prota.alto+5) ;
		resto = pantalla.canvas.height - hueco;
		muroalto = 5 + Math.floor(Math.random()* (resto - 5));
		murobajo = resto - muroalto;
		var colores = ["rgba(0, 0, 255, 0.5)","rgba(0, 255, 255, 0.5)","rgba(255, 0, 255, 0.5)","rgba(255, 255, 255, 0.5)",
		"rgba(255, 0, 255, 0.7)","rgba(0, 255, 255, 0.3)","rgba(255, 0, 255, 0.7)","rgba(255, 255, 255, 0.5)",
		"rgba(100, 100, 255, 0.5)","rgba(0, 100, 255, 0.5)","rgba(100, 50, 50, 0.5)","rgba(200, 0, 255, 0.3)"];
		indice = Math.floor(Math.random()*10000) % colores.length;
		muros.push( new Bloque(10, muroalto, colores[indice], x, 0));
		indice = Math.floor(Math.random()*10000) % colores.length;
		muros.push( new Bloque(10, murobajo, colores[indice], x, pantalla.canvas.height - murobajo));
	}
	for( i = 0; i < muros.length; i++ ){
    		muros[i].x -= 1;
	    	muros[i].dibujar();
    	}  
	    
	prota.avanceX = 0;
	prota.avanceY = 0;
	if (pantalla.teclas && pantalla.teclas[37]) {prota.avanceX = -1; }
	if (pantalla.teclas && pantalla.teclas[39]) {prota.avanceX = 1; }
	if (pantalla.teclas && pantalla.teclas[38]) {prota.avanceY = -1; }
	if (pantalla.teclas && pantalla.teclas[40]) {prota.avanceY = 1; }
	var coeficiente;
	
	
	prota.avanzar();
	prota.dibujar();
	
	if(cerebritos.length > 0 && cerebritos[0].activo)
	{
		cerebritos[0].dibujar();
	}
	
	marcador.txt="RETRASO MENTAL: " + Math.floor(pantalla.frames / 100);
    	marcador.dibujar();
    	pantalla.interval = setTimeout(dibujarPantalla , 20);
}

addEventListener("load",iniciarJuego,false);

