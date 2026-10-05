var dificuldade = "facil";

var botoes = document.querySelectorAll(".difficulty-btn");
var jogar = document.getElementById("playBtn");
var comoJogar = document.getElementById("howBtn");
var modal = document.getElementById("howModal");

for (var i = 0; i < botoes.length; i++) {
  botoes[i].addEventListener("click", function () {
    for (var j = 0; j < botoes.length; j++) {
      botoes[j].classList.remove("active");
    }
    this.classList.add("active");
    dificuldade = this.getAttribute("data-difficulty");
  });
}

jogar.addEventListener("click", function () {
  window.location.href = "jogo.html?dificuldade=" + dificuldade;
});

comoJogar.addEventListener("click", function () {
  modal.classList.add("open");
});

document.getElementById("closeModal").addEventListener("click", function () {
  modal.classList.remove("open");
});

document.getElementById("modalOk").addEventListener("click", function () {
  modal.classList.remove("open");
});
