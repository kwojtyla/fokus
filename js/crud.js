const btnAdicionar = document.querySelector('.app__button--add-task');
const formAdicionar = document.querySelector('.app__form-add-task');
const txtAreaTask = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const tarefaAtiva = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');
const btnDeletar = document.querySelector('.app__form-footer__button--delete');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

btnAdicionar.addEventListener('click', () => {
    formAdicionar.classList.toggle('hidden');
});

formAdicionar.addEventListener('submit', (event) => {
    event.preventDefault();
    const tarefa = {
        descricao: txtAreaTask.value
    };
    tarefas.push(tarefa);
    const liTarefa = criarTarefa(tarefa);
    ulTarefas.append(liTarefa);
    atualizarTarefa();
    txtAreaTask.value = '';
    formAdicionar.classList.add('hidden');
    callToast("A tarefa foi criada");
});

tarefas.forEach(tarefa => {
    const liTarefa = criarTarefa(tarefa);
    ulTarefas.append(liTarefa);
});

btnCancelar.addEventListener('click', () => {
    txtAreaTask.value = '';
    formAdicionar.classList.add('hidden');
});

btnDeletar.addEventListener('click', () => {
    txtAreaTask.value = '';
});

btnRemoverConcluidas.onclick = () => {removerTarefas(true)};
btnRemoverTodas.onclick = () => {removerTarefas(false)};

function atualizarTarefa(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarTarefa(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>`;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const novaDescricao = prompt("Qual a nova descrição da tarefa?");
        if(novaDescricao){
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefa();
            callToast("A tarefa foi atualizada");
        }
    };
    
    const imgBotao = document.createElement('img');
    imgBotao.setAttribute('src', 'img/assets/edit.png');
    botao.append(imgBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            tarefaAtiva.textContent = tarefa.descricao;
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });
            if(tarefaSelecionada == tarefa) {
                tarefaAtiva.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            li.classList.add('app__section-task-list-item-active');
        };
    }

    return li;
}

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefa();
    }
});

function removerTarefas(completas){
    const seletor = completas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
        document.querySelectorAll(seletor).forEach(elemento => {
            elemento.remove();
        });
        tarefas = completas ? tarefas.filter(tarefa => !tarefa.completa) : [];
        atualizarTarefa();
        callToast("Tarefas removidas");
}