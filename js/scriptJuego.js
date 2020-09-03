//Desarrollo Multimedial - Taller 1
//Por: Monica Alejandra Alvarez Carrillo
const SVG_NS = "http://www.w3.org/2000/svg";
const hexa = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
var game_area; //svg que será el area de juego
var levelNumber; //nivel de dificultad
var startGame; // bandera de inicio de juego (click en el circulo gris)
var touch; // bandera de perder (mouse sobre algún circulo) 

//Codigo base
function gameOver() {
    var playerPromise = document.getElementById('player').play()
    playerPromise.then(gameOverAction).catch(gameNotStartedAction);
}

function gameOverAction() {
    touch = true;
    console.log('Sonido Exitoso!');
    alert("Juego Terminado");
}

function gameNotStartedAction(error) {
    alert('El usuario debe hacer click en el punto gris para iniciar!');
    console.log(error);
    console.log(error.name);
    console.log(error.message);
}
//Fin codigo base

window.onload = function() {
    //Crear svg
    game_area = document.createElementNS(SVG_NS, 'svg');
    game_area.setAttribute("width", "900");
    game_area.setAttribute("height", "600");
    game_area.addEventListener("mouseleave", gameOver);
    var animation = setInterval("animate()", 40);
    startGame = false;
    levelNumber = 1;
    startLevel(levelNumber);
}

function startLevel(level) {
    touch = false;
    clear();
    //Circulo de inicio
    let circulo_start = document.createElementNS(SVG_NS, 'circle');
    circulo_start.setAttributeNS(null, "cx", 20);
    circulo_start.setAttributeNS(null, "cy", 20);
    circulo_start.setAttributeNS(null, "r", 10);
    circulo_start.setAttributeNS(null, "fill", "gray");
    circulo_start.setAttribute("stroke", "black");
    circulo_start.setAttribute("stroke-width", "2");
    circulo_start.setAttribute("onclick", function() {
        startGame = true;
        touch = false;
    })
    game_area.appendChild(circulo_start);

    //Circulo final
    let circulo_end = document.createElementNS(SVG_NS, 'circle');
    circulo_end.setAttributeNS(null, "cx", 850);
    circulo_end.setAttributeNS(null, "cy", 585);
    circulo_end.setAttributeNS(null, "r", 10);
    circulo_end.setAttributeNS(null, "fill", "green");
    circulo_end.setAttribute("stroke", "black");
    circulo_end.setAttribute("stroke-width", "2");
    circulo_end.setAttribute("onclick", "manageLevel()");
    game_area.appendChild(circulo_end);

    //Crear circulos de acuerdo con el nivel
    createCircles(level * 4);
    document.body.appendChild(game_area);
}

//Generar los circulos que serán obstaculos
function createCircles(level) {

    for (var i = 0; i < level; i++) {
        var circle_aux = document.createElementNS(SVG_NS, 'circle');
        circle_aux.setAttributeNS(null, "cx", getRandom(80, 800));
        circle_aux.setAttributeNS(null, "cy", getRandom(80, 500));
        circle_aux.setAttributeNS(null, "r", getRandom(30, 80));

        circle_aux.setAttributeNS(null, "fill", generateColor());
        circle_aux.classList.add("movable");
        circle_aux.id = "c" + i;
        circle_aux.setAttribute("onmouseover", "gameOver()");
        game_area.appendChild(circle_aux);
    }
}

//Animaciones de los circulos
function animate() {
    var circles = document.getElementsByClassName("movable");
    console.log(circles.length);
    var i;
    //Circulos que se mueven en x
    for (i = 0; i <= (circles.length / 2) - 1; i++) {
        var cx, r;
        cx = parseInt(circles[i].getAttribute("cx"), 10) + 20;
        r = parseInt(circles[i].getAttribute("r"), 10);
        //900 es el límite sel svg en x
        if (cx - r >= 900) {
            cx = r;
        }
        circles[i].setAttribute("cx", cx.toString(10));
    }

    //Circulos que se mueven en y
    for (i; i < circles.length; i++) {
        var cy, r;
        cy = parseInt(circles[i].getAttribute("cy"), 10) + 20;
        r = parseInt(circles[i].getAttribute("r"), 10);
        //600 es el límite del svg en y
        if (cy - r >= 600) {
            cy = r;
        }
        circles[i].setAttribute("cy", cx.toString(10));
    }
}

function manageLevel() {
    if (startGame == false) {
        gameOverAction(null);
    }
    alert("Nivel " + levelNumber + " superado!");
    clear();
    startGame = false;
    touch = false;
    levelNumber++;
    startLevel(levelNumber);
    if (levelNumber > 3) {
        alert("FELICIDADES! Ha superado todos los nieles.");
        var sound = document.getElementById('win').play()
        clear();
    }

}

//Generar un color RGB en hexadecimal aleatoriamente
function generateColor() {
    color = "#";
    for (var i = 0; i < 6; i++) {
        color += hexa[getRandom(0, 15)];
    }
    return color;
}

//Obtener un numero aleatorio en un intervalo
function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min;
}

//Borrar el svg
function clear() {
    while (game_area.firstChild) {
        game_area.removeChild(game_area.firstChild);
    }
}