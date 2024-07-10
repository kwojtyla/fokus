const html = document.querySelector('html');
const btnFoco = document.querySelector('.app__card-button--foco');
const btnCurto = document.querySelector('.app__card-button--curto');
const btnLongo = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const txtTitulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('app__card-button');
const btnMusica = document.querySelector('#alternar-musica');
const btnTemporizador = document.querySelector('#start-pause');
const btnTemporizadorPlayPause = document.querySelector('#start-pause span');
const btnTemporizadorIcon = document.querySelector('.app__card-primary-button-icon');
const timer = document.querySelector('#timer');

const musica = new Audio('song/luna-rise-part-one.mp3');
const somPlay = new Audio('song/play.wav');
const somPause = new Audio('song/pause.mp3');
const somFim = new Audio('song/beep.mp3');

let tempo = 1500;
let intervaloId = null;

musica.loop = true;

btnFoco.addEventListener('click', () => {
    tempo = 1500;
    changeContext('foco');
    btnFoco.classList.add('active');
    btnCurto.classList.remove('active');
    btnLongo.classList.remove('active');
});
btnCurto.addEventListener('click', () => {
    tempo = 300;
    changeContext('descanso-curto');
    btnFoco.classList.remove('active');
    btnCurto.classList.add('active');
    btnLongo.classList.remove('active');
});
btnLongo.addEventListener('click', () => {
    tempo = 900;
    changeContext('descanso-longo');
    btnFoco.classList.remove('active');
    btnCurto.classList.remove('active');
    btnLongo.classList.add('active');
});
btnMusica.addEventListener('change', () => {
    if(musica.paused){
        musica.play();
    } else {
        musica.pause();
    }
})

function changeContext(contexto){
    mostrarTempo();
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `img/${contexto}.png`);

    botoes.forEach((contexto) => {
        contexto.classList.add('active');
    });

    switch (contexto) {
        case 'foco':
            txtTitulo.innerHTML = 
                `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case 'descanso-curto':
            txtTitulo.innerHTML = `Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
                break;
        case 'descanso-longo':
            txtTitulo.innerHTML = `Hora de voltar à superfície<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
                break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempo <= 0){
        somFim.play(); 
        alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }

        zerar();
        return;
    }
    tempo -= 1;
    mostrarTempo();
}

btnTemporizador.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if(intervaloId){
        somPause.play();
        zerar();
        return;
    } 
    somPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    btnTemporizadorPlayPause.textContent = "Pausar";
    btnTemporizadorIcon.setAttribute('src', 'img/pause.png');
}

function zerar() {
    clearInterval(intervaloId);
    btnTemporizadorPlayPause.textContent = "Começar";
    btnTemporizadorIcon.setAttribute('src', 'img/play_arrow.png');
    intervaloId = null;
}

function mostrarTempo() {
    const tempoTimer = new Date(tempo * 1000);
    const tempoFormatado = tempoTimer.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});

    timer.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
