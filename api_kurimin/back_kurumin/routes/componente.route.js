const express = require('express');
const router = express.Router();
const conn = require('../db/connection');

// cadatro de componente/item
router.post('/', (req, res) => {
    const { id_categoria, nome, descricao, preco, qtd_estoque, id_usuarios } = req.body;

    if (!nome || preco === undefined || qtd_estoque === undefined || !id_categoria || !id_usuarios) {
        return res.status(400).json({ mensagem: 'Preencha os campos obrigatórios.' });
    }

    const query = `
    INSERT INTO componente (id_categoria, nome, descricao, preco, qtd_estoque, id_usuarios)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    conn.query(query, [id_categoria, nome, descricao, preco, qtd_estoque, id_usuarios], (err, result) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao cadastrar componente.' });
        }
        return res.status(201).json({
            mensagem: 'Componente cadastrado com sucesso!',
            id_componente: result.insertId
        });
    });
});

// listar/read 
router.get('/', (req, res) => {
    const query = `
    SELECT c.id_componente, c.nome, c.descricao, c.preco, c.qtd_estoque, 
           cat.nome AS categoria, u.nome AS usuario_responsavel
    FROM componente c
    LEFT JOIN categoria cat ON c.id_categoria = cat.id_categoria
    LEFT JOIN usuarios u ON c.id_usuarios = u.id_usuarios
  `;

    conn.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao buscar componentes.' });
        }
        return res.status(200).json(results);
    });
});

// update/atualização
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { id_categoria, nome, descricao, preco, qtd_estoque, id_usuarios } = req.body;

    const query = `
    UPDATE componente 
    SET id_categoria = ?, nome = ?, descricao = ?, preco = ?, qtd_estoque = ?, id_usuarios = ?
    WHERE id_componente = ?
  `;

    conn.query(query, [id_categoria, nome, descricao, preco, qtd_estoque, id_usuarios, id], (err, result) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar componente.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Componente não encontrado.' });
        }
        return res.status(200).json({ mensagem: 'Componente atualizado com sucesso!' });
    });
});

// delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM componente WHERE id_componente = ?';

    conn.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao deletar componente.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Componente não encontrado.' });
        }
        return res.status(200).json({ mensagem: 'Componente removido do estoque com sucesso.' });
    });
});

module.exports = router;