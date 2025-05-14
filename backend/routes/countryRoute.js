const express = require('express')
const countryRoute = express.Router()
const db = require('../db/db_config')


countryRoute.get('/', (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const sql = "SELECT tb_country.idCountry, flagCode, countryCode, countryName FROM tb_country INNER JOIN tb_menu ON tb_menu.idCountry = tb_country.idCountry GROUP BY `tb_menu`.`idCountry` DESC ORDER BY `tb_menu`.`idCountry` ASC;"
    db.getConnection((err, conn) => {
        conn.query(sql, async (err, result) => {
            const paginatedProducts = result.slice(startIndex, endIndex);
            const totalPages = Math.ceil(result.length / pageSize);
            await res.send({ country: paginatedProducts, totalPages })
        })
    })
})
countryRoute.get('/allCountry', (req, res) => {

    const sql = "SELECT * FROM tb_country"
    db.getConnection((err, conn) => {
        conn.query(sql, async (err, result) => {
            await res.send(result)
        })
    })
})

module.exports = countryRoute