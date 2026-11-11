const express = require('express');
const router = express.Router();
const conn = require('../db/connection');

//read 
router.get('/estoque', (req, res) => {
    const queryItens = `
    SELECT c.id_componente, c.nome, c.preco, c.qtd_estoque, 
           (c.preco * c.qtd_estoque) AS valor_total_item,
           cat.nome AS categoria
    FROM componente c
    LEFT JOIN categoria cat ON c.id_categoria = cat.id_categoria
  `;

    const queryTotal = `
    SELECT SUM(preco * qtd_estoque) AS valor_total_geral, SUM(qtd_estoque) AS total_itens
    FROM componente
  `;

    conn.query(queryItens, (err, itens) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao listar componentes para o relatório.' });
        }

        conn.query(queryTotal, (errTotal, resumo) => {
            if (errTotal) {
                return res.status(500).json({ erro: 'Erro ao calcular o valor total em estoque.' });
            }

            return res.status(200).json({
                resumo: {
                    total_itens: resumo[0].total_itens || 0,
                    valor_total_estoque: resumo[0].valor_total_geral || 0
                },
                componentes: itens
            });
        });
    });
});

module.exports = router;