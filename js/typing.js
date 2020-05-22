var i = 0;
var head = 'Hi, I am Luyolo Paliso'
var speed = 95;

function typeWriting() {
    if (i < head.length) {
      document.getElementById("typer").innerHTML += head.charAt(i);
      i++;
      setTimeout(typeWriting, speed);
    }
  }