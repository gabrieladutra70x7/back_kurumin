const express = require('express');
const router = express.Router();
const conn = require('../db/connection');

//autenticacao
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
    }

    const query = 'SELECT id_usuarios, nome, email FROM usuarios WHERE email = ? AND senha = ?';
    conn.query(query, [email, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro no servidor ao autenticar.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
        }

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso.',
            usuario: results[0]
        });
    });
});

module.exports = router;
