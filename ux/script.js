
let topNav = null;

function init(){
    topNav = document.getElementById('topNav');

    document.getElementById('menuButton').addEventListener('click',toggleMenu);
    document.querySelector('main').addEventListener('click',hideMenu);
}

function toggleMenu() {
  if (topNav.style.display === "block") {
    topNav.style.display = "none";
  } else {
    topNav.style.display = "block";
  }
}

function hideMenu() {
  if (topNav.style.display === "block") {
    topNav.style.display = "none";
  }
}

window.addEventListener("load", init);
