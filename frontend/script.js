const URL_API = "https://weightlifting-app-4sfo.onrender.com/exercicios";

const form = document.getElementById('exercicio-form');
const listaContainer = document.getElementById('lista-exercicios');

// 1. FUNÇÃO PARA BUSCAR EXERCÍCIOS (READ)
async function buscarExercicios() {
    try {
        const response = await fetch(URL_API);
        const exercicios = await response.json();
        renderizarLista(exercicios);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        listaContainer.innerHTML = "<p>Erro ao carregar treinos.</p>";
    }
}

// 2. FUNÇÃO PARA RENDERIZAR NA TELA
function renderizarLista(exercicios) {
    listaContainer.innerHTML = ""; // Limpa a lista atual

    if (exercicios.length === 0) {
        listaContainer.innerHTML = "<p>Nenhum treino registrado ainda.</p>";
        return;
    }

    exercicios.forEach(ex => {
        const div = document.createElement('div');
        div.className = 'card-exercicio';
        div.innerHTML = `
            <div>
                <strong>${ex.nome}</strong> (${ex.grupoMuscular})<br>
                <small>${ex.series}x${ex.repeticoes} - ${ex.carga}kg</small>
            </div>
            <button class="btn-delete" onclick="deletarExercicio('${ex._id}')">X</button>
        `;
        listaContainer.appendChild(div);
    });
}

// 3. FUNÇÃO PARA CRIAR EXERCÍCIO (CREATE)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoExercicio = {
        nome: document.getElementById('nome').value,
        grupoMuscular: document.getElementById('grupoMuscular').value,
        series: Number(document.getElementById('series').value),
        repeticoes: Number(document.getElementById('repeticoes').value),
        carga: Number(document.getElementById('carga').value)
    };

    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoExercicio)
        });

        if (response.ok) {
            form.reset(); // Limpa os campos
            buscarExercicios(); // Atualiza a lista na tela
        }
    } catch (error) {
        alert("Erro ao salvar exercício.");
    }
});

// 4. FUNÇÃO PARA DELETAR (DELETE)
async function deletarExercicio(id) {
    if (confirm("Deseja excluir este exercício?")) {
        try {
            await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
            buscarExercicios();
        } catch (error) {
            alert("Erro ao excluir.");
        }
    }
}

// Inicializa a lista ao abrir o app
buscarExercicios();


//Registro do SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registrado!', reg))
      .catch(err => console.error('Erro ao registrar Service Worker:', err));
  });
}

// Banner de instalação PWA
(function () {
  const banner = document.getElementById('install-banner');
  const btnInstall = document.getElementById('btn-install');
  const btnClose = document.getElementById('btn-install-close');
  const installText = document.getElementById('install-text');

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    !!window.navigator.standalone;

  if (isStandalone()) return;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    installText.textContent = 'Para instalar: toque em  Compartilhar e depois "Adicionar à Tela de Início"';
    btnInstall.style.display = 'none';
    banner.style.display = 'flex';
  }

  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    banner.style.display = 'flex';
  });

  btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.style.display = 'none';
  });

  btnClose.addEventListener('click', () => {
    banner.style.display = 'none';
  });

  window.addEventListener('appinstalled', () => {
    banner.style.display = 'none';
    deferredPrompt = null;
  });
}());
