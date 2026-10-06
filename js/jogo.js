var cartas = [];
var primeira = null;
var segunda = null;
var travado = false;
var tentativas = 0;
var pontos = 0;
var pares = 0;
var tempo = 0;
var relogio;
var respondeu = false;

var niveis = {
  facil: {
    nome: "Fácil",
    espera: 1500,
    inicio: 0,
    acerto: 40,
    erro: 5,
    bonus: 25
  },

  medio: {
    nome: "Médio",
    espera: 800,
    inicio: 0,
    acerto: 30,
    erro: 10,
    bonus: 20
  },

  dificil: {
    nome: "Difícil",
    espera: 300,
    inicio: 0,
    acerto: 20,
    erro: 20,
    bonus: 15
  }
};

var url = new URLSearchParams(window.location.search);
var nivel = url.get("dificuldade") || "facil";
var regra = niveis[nivel] || niveis.facil;

var tabuleiro = document.getElementById("board");
var placar = document.getElementById("score");
var tentativasTexto = document.getElementById("attempts");
var tempoTexto = document.getElementById("timer");
var paresTexto = document.getElementById("pairsFound");
var modal = document.getElementById("pairModal");

if (document.getElementById("difficultyBadge")) {
  document.getElementById("difficultyBadge").textContent = regra.nome;
}

function embaralhar(lista) {
  return lista.sort(function () {
    return Math.random() - 0.5;
  });
}

function mostrarTempo() {
  var minutos = Math.floor(tempo / 60);
  var segundos = tempo % 60;

  minutos = String(minutos).padStart(2, "0");
  segundos = String(segundos).padStart(2, "0");

  tempoTexto.textContent = minutos + ":" + segundos;
}

function iniciarRelogio() {
  clearInterval(relogio);

  relogio = setInterval(function () {
    tempo++;
    mostrarTempo();
  }, 1000);
}

function criarCartas() {
  var baralho = embaralhar(cartas.concat(cartas));

  tabuleiro.innerHTML = "";

  for (var i = 0; i < baralho.length; i++) {
    var carta = baralho[i];
    var botao = document.createElement("button");

    botao.className = "memory-card";

    botao.innerHTML =
      '<div class="card-inner">' +
      '<div class="card-face card-back">⚛</div>' +
      '<div class="card-face card-front">' +
      '<div class="icon">' + carta.icone + '</div>' +
      '<div class="name">' + carta.nome + '</div>' +
      '</div></div>';

    botao.addEventListener("click", (function (botao, carta) {
      return function () {
        virarCarta(botao, carta);
      };
    })(botao, carta));

    tabuleiro.appendChild(botao);
  }
}

function virarCarta(botao, carta) {

  if (
    travado ||
    botao.classList.contains("matched") ||
    (primeira && botao === primeira.botao)
  ) {
    return;
  }

  botao.classList.add("flipped");

  if (primeira == null) {
    primeira = {
      botao: botao,
      carta: carta
    };

    return;
  }

  segunda = {
    botao: botao,
    carta: carta
  };

  tentativas++;
  tentativasTexto.textContent = tentativas;

  travado = true;

  if (primeira.carta.id === segunda.carta.id) {
    acertouPar();
  } else {
    pontos = Math.max(0, pontos - regra.erro);
    placar.textContent = pontos;

    setTimeout(fecharCartas, regra.espera);
  }
}

function acertouPar() {
  primeira.botao.classList.add("matched");
  segunda.botao.classList.add("matched");

  pares++;
  pontos += regra.acerto;

  placar.textContent = pontos;
  paresTexto.textContent = pares + " / " + cartas.length;

  abrirPergunta(primeira.carta);
}

function fecharCartas() {

  primeira.botao.classList.remove("flipped");
  segunda.botao.classList.remove("flipped");

  limparJogada();
}

function limparJogada() {

  primeira = null;
  segunda = null;
  travado = false;
}
function abrirPergunta(carta) {
  respondeu = false;

  document.getElementById("pairIcon").textContent = carta.icone;
  document.getElementById("pairName").textContent = carta.nome;
  document.getElementById("pairDescription").textContent = carta.descricao;
  document.getElementById("pairQuestion").textContent = carta.pergunta;
  document.getElementById("pairCuriosity").textContent = carta.curiosidade;
  document.getElementById("questionFeedback").textContent = "";

  var continuar = document.getElementById("continueBtn");

  continuar.disabled = true;
  continuar.textContent = "Responda para continuar";

  var opcoes = document.getElementById("questionOptions");
  opcoes.innerHTML = "";

  for (var i = 0; i < carta.opcoes.length; i++) {
    var botao = document.createElement("button");

    botao.className = "question-option";
    botao.textContent = carta.opcoes[i];

    botao.addEventListener("click", (function (resposta) {
      return function () {
        responder(this, resposta, carta);
      };
    })(carta.opcoes[i]));

    opcoes.appendChild(botao);
  }

  modal.classList.add("open");
}

function responder(botao, resposta, carta) {

  if (respondeu) {
    return;
  }

  if (resposta === carta.resposta) {

    respondeu = true;

    botao.classList.add("correct");

    pontos += regra.bonus;

    placar.textContent = pontos;

    document.getElementById("questionFeedback").textContent =
      "Correto! +" + regra.bonus + " pontos.";

    var botoes = document.querySelectorAll(".question-option");

    for (var i = 0; i < botoes.length; i++) {
      botoes[i].disabled = true;
    }

    var continuarBotao = document.getElementById("continueBtn");

    continuarBotao.disabled = false;

    if (pares === cartas.length) {
      continuarBotao.textContent = "Ver resultado";
    } else {
      continuarBotao.textContent = "Continuar";
    }

  } else {

    botao.classList.add("wrong");
    botao.disabled = true;

    pontos = Math.max(0, pontos - 5);

    placar.textContent = pontos;

    document.getElementById("questionFeedback").textContent =
      "Errado. Tente novamente.";
  }
}

function continuar() {
  if (!respondeu) {
    return;
  }

  modal.classList.remove("open");

  primeira = null;
  segunda = null;
  travado = false;

  if (pares === cartas.length) {
    clearInterval(relogio);

    localStorage.setItem("score", pontos);
    localStorage.setItem("attempts", tentativas);
    localStorage.setItem("time", tempoTexto.textContent);

    window.location.href = "resultado.html";
  }
}

function reiniciar() {

  clearInterval(relogio);

  tentativas = 0;
  pontos = regra.inicio;
  pares = 0;
  tempo = 0;

  primeira = null;
  segunda = null;
  travado = false;

  placar.textContent = pontos;
  tentativasTexto.textContent = 0;
  tempoTexto.textContent = "00:00";
  paresTexto.textContent = "0 / " + cartas.length;

  modal.classList.remove("open");

  criarCartas();

  iniciarRelogio();
}

document.getElementById("continueBtn").addEventListener("click", continuar);

document.getElementById("closePair").addEventListener("click", continuar);

document.getElementById("restartBtn").addEventListener("click", reiniciar);

fetch("../data/cards.json")
  .then(function (resposta) {
    return resposta.json();
  })
  .then(function (dados) {

    cartas = dados;

    reiniciar();
  })
  .catch(function () {

    tabuleiro.innerHTML =
      "<p>Erro ao carregar as cartas. Abra pelo Live Server.</p>";
  });