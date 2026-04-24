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
            form.reset(); 
            buscarExercicios(); 
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

// Registro do Service Worker (Essencial para o PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado com sucesso!', reg))
            .catch(err => console.error('Erro ao registrar Service Worker:', err));
    });
}
