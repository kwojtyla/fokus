const toast = document.querySelector('.toast');
const btnClose = document.querySelector('.close');
const progresso = document.querySelector('.toast__progresso');
const toastText = document.querySelector('.toast__mensagem--descricao');

btnClose.addEventListener('click', () => {toast.classList.remove('active')});

function callToast(mensagem){
    toastText.textContent = mensagem;

    toast.classList.add('active');
    progresso.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 5000)

    setTimeout(() => {
        progresso.classList.remove('active');
    }, 5300)
}