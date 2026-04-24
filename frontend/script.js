const URL_API = "https://weightlifting-app-4sfo.onrender.com/exercicios";

const form = document.getElementById('exercicio-form');
const listaContainer = document.getElementById('lista-exercicios');

// Variável para controlar se estamos a editar (guarda o ID)
let idEdicao = null;

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

// 2. FUNÇÃO PARA RENDERIZAR NA TELA (Agora com botão Editar)
function renderizarLista(exercicios) {
    listaContainer.innerHTML = ""; 

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
            <div class="card-acoes">
                <button class="btn-edit" onclick="prepararEdicao('${ex._id}', '${ex.nome}', '${ex.grupoMuscular}', ${ex.series}, ${ex.repeticoes}, ${ex.carga})">✏️</button>
                <button class="btn-delete" onclick="deletarExercicio('${ex._id}')">X</button>
            </div>
        `;
        listaContainer.appendChild(div);
    });
}

// FUNÇÃO PARA CARREGAR OS DADOS NO FORMULÁRIO (Prepara o Update)
function prepararEdicao(id, nome, grupo, series, repeticoes, carga) {
    idEdicao = id; // Guardamos o ID para saber que estamos a editar
    
    document.getElementById('nome').value = nome;
    document.getElementById('grupoMuscular').value = grupo;
    document.getElementById('series').value = series;
    document.getElementById('repeticoes').value = repeticoes;
    document.getElementById('carga').value = carga;

    // Altera o texto do botão para dar feedback visual
    form.querySelector('button').innerText = "Atualizar Treino";
    window.scrollTo(0, 0); // Sobe para o formulário
}

// 3. FUNÇÃO PARA SALVAR (CREATE OU UPDATE)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dadosExercicio = {
        nome: document.getElementById('nome').value,
        grupoMuscular: document.getElementById('grupoMuscular').value,
        series: Number(document.getElementById('series').value),
        repeticoes: Number(document.getElementById('repeticoes').value),
        carga: Number(document.getElementById('carga').value)
    };

    try {
        let response;
        
        if (idEdicao) {
            // Se houver ID, fazemos o UPDATE (PUT)
            response = await fetch(`${URL_API}/${idEdicao}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosExercicio)
            });
            idEdicao = null; // Limpa o estado de edição
            form.querySelector('button').innerText = "Salvar Treino";
        } else {
            // Se não houver ID, fazemos o CREATE (POST)
            response = await fetch(URL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosExercicio)
            });
        }

        if (response.ok) {
            form.reset(); 
            buscarExercicios(); 
        }
    } catch (error) {
        alert("Erro ao processar requisição.");
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

buscarExercicios();

// Registro do Service Worker (Mantendo a tua lógica atual)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    });
  });
}
