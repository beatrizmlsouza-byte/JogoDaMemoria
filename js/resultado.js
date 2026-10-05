var score = localStorage.getItem("score") || 0;
var tentativas = localStorage.getItem("attempts") || 0;
var tempo = localStorage.getItem("time") || "00:00";

 document.getElementById("resultScore").textContent = score;
document.getElementById("resultAttempts").textContent = tentativas;
document.getElementById("resultTime").textContent = tempo;

var respostas = document.querySelectorAll(".answer");
var feedback = document.getElementById("quizFeedback");

for (var i = 0; i < respostas.length; i++) {
  respostas[i].addEventListener("click", function () {
    if (this.getAttribute("data-answer") === "DNA") {
      this.classList.add("selected", "correct");
      feedback.textContent = "Correto! +50 pontos.";
      score = Number(score) + 50;
      document.getElementById("resultScore").textContent = score;
      localStorage.setItem("score", score);
    } else {
      this.classList.add("wrong");
      feedback.textContent = "Não foi dessa vez. A resposta é DNA.";
    }
  });
}

document.getElementById("playAgain").addEventListener("click", function () {
  window.location.href = "jogo.html";
});
