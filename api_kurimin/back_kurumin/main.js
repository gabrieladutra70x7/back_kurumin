const express = require('express');
const authRouter = require('./routes/auth.route');
const componenteRouter = require('./routes/componente.route');
const relatorioRouter = require('./routes/relatorio.route');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/componentes', componenteRouter);
app.use('/relatorios', relatorioRouter);


app.get('/', (req, res) => {
    res.send('API de Controle de Estoque da Eletro Kurumin em execução.');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});