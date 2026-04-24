require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// 1. Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado ao MongoDB Atlas!"))
    .catch(err => console.error("❌ Erro ao conectar:", err));

// 2. Definição do Modelo (Sua Entidade do CRUD)
const Exercicio = mongoose.model('Exercicio', {
    nome: String,
    grupoMuscular: String,
    series: Number,
    repeticoes: Number,
    carga: Number,
    dataCriacao: { type: Date, default: Date.now }
});

// 3. Rotas do CRUD

// CREATE - Criar novo exercício
app.post('/exercicios', async (req, res) => {
    try {
        const novoExercicio = new Exercicio(req.body);
        await novoExercicio.save();
        res.status(201).json(novoExercicio);
    } catch (error) {
        res.status(400).json({ message: "Erro ao criar exercício", error });
    }
});

// READ - Listar todos
app.get('/exercicios', async (req, res) => {
    const lista = await Exercicio.find();
    res.json(lista);
});

// UPDATE - Atualizar carga ou repetições
app.put('/exercicios/:id', async (req, res) => {
    const atualizado = await Exercicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
});

// DELETE - Remover exercício
app.delete('/exercicios/:id', async (req, res) => {
    await Exercicio.findByIdAndDelete(req.params.id);
    res.json({ message: "Excluído com sucesso!" });
});

// Start do Servidor Localmente
/*const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});*/


// Altere de: app.listen(3000...
// Para isso:
const PORT = process.env.PORT || 10000; // O Render usa portas variadas
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
