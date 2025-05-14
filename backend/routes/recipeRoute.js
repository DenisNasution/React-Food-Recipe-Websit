const express = require('express')
const recipeRoute = express.Router()
const multer = require('multer')
const fs = require('fs');
const db = require('../db/db_config')
const { isAuth } = require('./utils');
const sharp = require('sharp');
const path = require('path');


recipeRoute.get('/', isAuth, (req, res) => {
    const sql = 'SELECT * FROM tb_menu'
    console.log(req.user)
    db.query(sql, async (err, result) => {
        if (result.length !== 0) {
            return res.status(200).send(result)
        } else {
            return res.status(400).send({ message: "Data Not Found" })
        }
    })
})
recipeRoute.get('/home', (req, res) => {
    const dataMenu = {
        country: [],
        appetizer: [],
        mainCorse: [],
        dessert: [],
        latest: []


    }
    db.getConnection((err, conn) => {
        conn.beginTransaction(function (err) {
            if (err) { throw err; }
            conn.query(`SELECT tb_menu.idMenu, tb_menu.menuPict, menuName, tb_country.countryName, tb_country.flagCode, tb_country.idCountry, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry ORDER BY RAND() LIMIT 6;`, function (err, result) {
                if (err) {
                    conn.rollback(function () {
                        throw err;
                    });
                }
                dataMenu.country = result;
                conn.query(`SELECT tb_menu.idMenu, tb_menu.menuPict, menuName, tb_country.countryName, tb_country.flagCode, tb_country.idCountry, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry WHERE idMeals = 1 ORDER BY RAND() LIMIT 3;`, function (err, result) {
                    if (err) {
                        conn.rollback(function () {
                            throw err;
                        });
                    }
                    dataMenu.appetizer = result;
                    conn.query(`SELECT tb_menu.idMenu, tb_menu.menuPict, menuName, tb_country.countryName, tb_country.flagCode, tb_country.idCountry, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry WHERE idMeals = 2 ORDER BY RAND() LIMIT 3;`, function (err, result) {
                        if (err) {
                            conn.rollback(function () {
                                throw err;
                            });
                        }
                        dataMenu.mainCorse = result;
                        conn.query(`SELECT tb_menu.idMenu, tb_menu.menuPict, menuName, tb_country.countryName, tb_country.flagCode, tb_country.idCountry, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry WHERE idMeals = 3 ORDER BY RAND() LIMIT 3;`, function (err, result) {
                            if (err) {
                                conn.rollback(function () {
                                    throw err;
                                });
                            }
                            dataMenu.dessert = result;
                            conn.query(`SELECT tb_menu.idMenu, tb_menu.menuPict, menuName, tb_country.countryName, tb_country.flagCode, tb_country.idCountry, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry INNER JOIN tb_meals ON tb_menu.idMeals = tb_meals.idMeals ORDER BY tb_menu.idMenu DESC LIMIT 3`, function (err, result) {
                                if (err) {
                                    conn.rollback(function () {
                                        throw err;
                                    });
                                }
                                dataMenu.latest = result;
                                conn.commit(function (err) {
                                    if (err) {
                                        conn.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    conn.release()
                                    return res.send(dataMenu)
                                    // db.end();
                                });
                            });
                        });
                    });
                });

            });
        });
    })
})
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/temp')
    },
    filename(req, file, cb) {
        cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Invalid IMAGE type'))
    }
})
function makeMulterUploadMiddleware(multerUploadFunction) {
    return (req, res, next) =>
        multerUploadFunction(req, res, err => {
            if (err && err.name && err.name === 'Error') {
                return res.status(500).send({
                    error: err.name,
                    message: `${err.message}`
                })
            }
            if (err) {
                return res.status(403).send({
                    error: 'FILE UPLOAD ERROR',
                    message: `Something wrong ocurred when trying to upload please refresh and try again`
                })
            }
            return next()
        })
}
const multerUploadMiddleware = makeMulterUploadMiddleware(upload.single('upload'))

// recipeRoute.get('/getupload', multerUploadMiddleware, async (req, res, next) => {
//     const sql = `SELECT test FROM test`
//     db.query(sql, async (err, result) => {
//         res.send(JSON.parse(result[0].test))
//     })
// })
// recipeRoute.get('/upload', multerUploadMiddleware, async (req, res, next) => {
//     const instructions = [
//         'Cook % beef bacon in a Dutch oven or a large oven-safe pot with a lid over medium heat, turning'

//     ]
//     const conv = JSON.stringify(instructions)
//     const str = mysql_real_escape_string(conv)
//     const sql = `INSERT INTO test (test) VALUES ('${str}')`
//     db.query(sql, async (err, result) => {
//         res.send('berhasil')
//     })
// })
recipeRoute.put('/:id', isAuth, multerUploadMiddleware, async (req, res) => {
    const menuName = req.body.menuName
    const menuDesc = req.body.menuDesc
    let menuPict = req.body.menuPict
    const idMeals = req.body.idMeals
    const cookTime = req.body.cookTime
    const idCountry = req.body.idCountry
    const ingredientsName = req.body.ingredient
    const instructionName = req.body.instruction

    if (req.file) {
        await sharp(req.file.path).resize(640, 480, {
            fit: sharp.fit.cover,
            withoutEnlargement: true
        }).toFile(path.resolve('public', 'images', req.file.filename))
            .then(async response => {
                fs.unlinkSync(`public/${req.body.menuPict}`)
                await sharp(req.file.path).resize(360, 202, {
                    fit: sharp.fit.cover,
                    withoutEnlargement: true
                }).toFile(path.resolve('public', 'thumbnail', 'images', req.file.filename))
                    .then(async (response) => {
                        fs.unlinkSync(`public/thumbnail/${req.body.menuPict}`)
                        fs.unlinkSync(req.file.path)
                        menuPict = "/images/" + req.file.filename
                        const sql = `UPDATE tb_menu, tb_ingredients, tb_instruction SET tb_menu.menuName = ?, tb_menu.menuDesc = ?, tb_menu.menuPict = ?, tb_menu.idMeals = ?, tb_menu.cookTime = ?, tb_menu.idCountry = ?, tb_ingredients.ingredientsName = ?, tb_instruction.instructionName = ? WHERE tb_menu.idMenu = tb_ingredients.idMenu AND tb_menu.idMenu = tb_instruction.idMenu AND tb_menu.idMenu = ?`
                        await db.getConnection(async (err, conn) => {
                            await conn.execute(sql, [menuName, menuDesc, menuPict, idMeals, cookTime, idCountry, ingredientsName, instructionName, req.params.id], async (err, result) => {
                                if (err) throw err;
                                conn.release()

                                if (result.length !== 0) {
                                    return res.status(200).send({ idMenu: req.params.id, message: "recipe updated successfully" })

                                } else {
                                    return res.status(400).send({ message: "Data Not Found" })

                                }
                            })
                        })
                    }).catch(err => {
                        return res.status(403).send("Something wrong ocurred when trying to upload please refresh and try again")
                    })
            }).catch(err => {
                return res.status(403).send("Something wrong ocurred when trying to upload please refresh and try again")
            })
    } else {
        const sql = `UPDATE tb_menu, tb_ingredients, tb_instruction SET tb_menu.menuName = ?, tb_menu.menuDesc = ?, tb_menu.menuPict = ?, tb_menu.idMeals = ?, tb_menu.cookTime = ?, tb_menu.idCountry = ?, tb_ingredients.ingredientsName = ?, tb_instruction.instructionName = ? WHERE tb_menu.idMenu = tb_ingredients.idMenu AND tb_menu.idMenu = tb_instruction.idMenu AND tb_menu.idMenu = ?`
        await db.getConnection(async (err, conn) => {
            await conn.execute(sql, [menuName, menuDesc, menuPict, idMeals, cookTime, idCountry, ingredientsName, instructionName, req.params.id], async (err, result) => {
                if (err) throw err;
                conn.release()

                if (result.length !== 0) {
                    return res.status(200).send({ idMenu: req.params.id, message: "recipe updated successfully" })
                } else {
                    return res.status(400).send({ message: "Data Not Found" })
                }
            })
        })
    }


})
function mysql_real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "%":
                return "\%";
            case "\"":
            case "'":
            case "\\":
                return "\\" + char;
            default:
                return char;
        }
    });
}
recipeRoute.post('/', isAuth, multerUploadMiddleware, async (req, res) => {
    const idUser = req.body.idUser
    const instruction = req.body.instruction
    const ingredient = req.body.ingredient
    const menuName = req.body.menuName
    const menuDesc = req.body.menuDesc

    const idMeals = req.body.idMeals
    const cookTime = req.body.cookTime
    const idCountry = req.body.idCountry
    let menuPict

    await sharp(req.file.path).resize(640, 480, {
        fit: sharp.fit.cover,
        withoutEnlargement: true
    }).toFile(path.resolve('public', 'images', req.file.filename))
        .then(async response => {
            await sharp(req.file.path).resize(360, 202, {
                fit: sharp.fit.cover,
                withoutEnlargement: true
            }).toFile(path.resolve('public', 'thumbnail', 'images', req.file.filename))
                .then(response => {
                    fs.unlinkSync(req.file.path)
                    menuPict = "/images/" + req.file.filename
                    db.getConnection((err, conn) => {
                        conn.beginTransaction(function (err) {
                            if (err) { throw err; }
                            const sql = `INSERT INTO tb_menu(menuName, menuDesc, menuPict, idMeals, cookTime, idCountry, idUser) VALUES (?,?,?,?,?,?,?)`
                            const values = [menuName, menuDesc, menuPict, idMeals, cookTime, idCountry, idUser]
                            conn.query(sql, values, function (err, result) {
                                if (err) {
                                    conn.rollback(function () {
                                        throw err;
                                    });
                                }
                                var menuId = result.insertId;
                                const sql = `INSERT INTO tb_ingredients(ingredientsName, idMenu) VALUES (?, ?)`
                                const values = [ingredient, menuId]
                                conn.query(sql, values, function (err, result) {
                                    if (err) {
                                        conn.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    const sql = `INSERT INTO tb_instruction( instructionName, idMenu) VALUES (?, ?)`
                                    const values = [instruction, menuId]
                                    conn.query(sql, values, function (err, result) {
                                        if (err) {
                                            conn.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        conn.commit(function (err) {
                                            if (err) {
                                                conn.rollback(function () {
                                                    throw err;
                                                });
                                            }
                                            conn.release()
                                            res.send({ idMenu: menuId, message: 'recipe created successfully' })
                                        });
                                    });
                                });
                            });
                        });
                    });


                }).catch(err => {
                    res.status(403).send("Something wrong ocurred when trying to upload please refresh and try again")
                })

        }).catch(err => {
            res.status(403).send("Something wrong ocurred when trying to upload please refresh and try again")
        })


})
recipeRoute.delete('/:id', isAuth, (req, res) => {
    db.getConnection((err, conn) => {
        const sql = `DELETE tb_menu, tb_ingredients, tb_instruction FROM tb_menu JOIN tb_ingredients ON tb_menu.idMenu = tb_ingredients.idMenu JOIN tb_instruction ON tb_menu.idMenu = tb_instruction.idMenu WHERE tb_menu.idMenu = ?`
        const values = [req.params.id]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) {
                await res.status(200).send("recipe deleted successfully")
            } else {
                res.status(400).send({ message: "Data Not Found" })
            }
        })
    })
})


recipeRoute.get('/latestmeals', (req, res) => {
    db.getConnection((err, conn) => {
        const sql = `SELECT tb_menu.idMenu, menuName, tb_menu.menuPict, tb_menu.idMeals, tb_menu.idCountry, tb_meals.mealsName as meal, tb_country.countryName as country, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_meals ON tb_menu.idMeals = tb_meals.idMeals ORDER BY tb_menu.idMenu DESC LIMIT 3;`
        conn.query(sql, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) {
                await res.status(200).send(result)
            } else {
                await res.status(400).send({ message: "Data Not Found" })
            }
        })
    })
})
recipeRoute.get('/meals', (req, res) => {
    db.getConnection((err, conn) => {
        const sql = `SELECT * FROM (SELECT menu.idMenu, menuName, menuPict, menu.idMeals, tb_meals.mealsName as meal, menu.idCountry, tb_country.countryName, tb_user.userName, menu.idUser, tb_country.flagCode,  ROW_NUMBER() OVER(PARTITION BY menu.idMeals ORDER BY menu.idMenu ASC) rn FROM tb_menu menu INNER JOIN tb_user ON menu.idUser = tb_user.idUser INNER JOIN tb_meals ON menu.idMeals = tb_meals.idMeals INNER JOIN tb_country ON menu.idCountry = tb_country.idCountry) t1 WHERE rn <= 3;`
        conn.query(sql, async (err, result) => {
            if (err) throw err;
            conn.release()
            let country = result[0].idCountry
            let mealsId = []
            let mealsKategori = []
            for (let i = 0; i < result.length; i++) {
                if (!mealsId.includes(result[i].idMeals)) {
                    mealsId.push(result[i].idMeals)
                }
            }
            for (let i = 0; i < mealsId.length; i++) {
                mealsKategori.push({ idMeals: mealsId[i], mealsName: "", menu: [] })
            }
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < mealsKategori.length; j++) {
                    if (result[i].idMeals === mealsKategori[j].idMeals) {
                        mealsKategori[j].mealsName = result[i].meal
                        mealsKategori[j].menu.push({ idMenu: result[i].idMenu, menuName: result[i].menuName, menuPict: result[i].menuPict, idCountry: result[i].idCountry, countryName: result[i].countryName, flagCode: result[i].flagCode, idUser: result[i].idUser, userName: result[i].userName })
                    }
                }
            }
            await res.send(mealsKategori)
        })
    })
})
recipeRoute.get('/:id/meals', (req, res) => {
    db.getConnection((err, conn) => {
        const sql = `SELECT tb_menu.idMenu, menuName, tb_menu.menuPict, tb_menu.idMeals, tb_menu.idCountry, tb_meals.mealsName, tb_country.countryName, tb_country.flagCode, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry INNER JOIN tb_meals ON tb_menu.idMeals = tb_meals.idMeals WHERE tb_menu.idMeals = ?`
        const values = [req.params.id]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) {
                await res.status(200).send(result)
            } else {
                res.status(400).send({ message: "Data Not Found" })
            }
        })
    })
})
recipeRoute.get('/:id/user', (req, res) => {
    let dataUser = {
        profile: {},
        userRecipe: []
    }
    db.getConnection((err, conn) => {
        conn.beginTransaction(function (err) {
            if (err) { throw err; }
            const sql = `SELECT * FROM tb_user WHERE idUser = ?;`
            const values = [req.params.id]
            conn.query(sql, values, async (err, result) => {
                if (err) {
                    conn.rollback(function () {
                        throw err;
                    });
                }
                if (result.length !== 0) {
                    dataUser.profile = result[0];
                    const sql = `SELECT tb_user.userName, tb_user.nameOfUser, tb_menu.idMenu, menuName, tb_menu.menuPict, tb_menu.idMeals, tb_menu.idCountry, tb_menu.idUser, tb_meals.mealsName, tb_country.countryName, tb_country.flagCode FROM tb_menu INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry INNER JOIN tb_meals ON tb_menu.idMeals = tb_meals.idMeals INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser WHERE tb_menu.idUser = ?;`
                    const values = [req.params.id]
                    conn.query(sql, values, async (err, result) => {
                        if (err) {
                            conn.rollback(function () {
                                throw err;
                            });
                        }
                        conn.release()
                        if (result.length !== 0) {
                            dataUser.userRecipe = result;
                            conn.commit(function (err) {
                                if (err) {
                                    conn.rollback(function () {
                                        throw err;
                                    });
                                }
                                res.send(dataUser)
                            });
                        } else {
                            res.send(dataUser)
                        }

                    });
                } else {
                    dataUser = {}
                    res.send(dataUser)
                }
            });
        });
    });
})
recipeRoute.get('/:id/country', (req, res) => {
    const menusCountry = {
        countryData: [],
        mealsKategori: []
    }
    db.getConnection((err, conn) => {
        conn.beginTransaction(function (err) {
            if (err) { throw err; }
            const sql = `SELECT * FROM tb_country WHERE idCountry = ?`
            const values = [req.params.id]
            conn.query(sql, values, async (err, result) => {
                if (err) {
                    conn.rollback(function () {
                        throw err;
                    });
                }
                menusCountry.countryData = result;
                const sql = `SELECT * FROM (SELECT *, ROW_NUMBER() OVER(PARTITION BY idMeals ORDER BY idMenu ASC) rn FROM (SELECT tb_menu.idMenu, menuName, tb_menu.menuPict, tb_menu.idMeals, tb_menu.idCountry, tb_meals.mealsName as meal, tb_country.flagCode , tb_country.countryName as country, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry INNER JOIN tb_meals ON tb_menu.idMeals = tb_meals.idMeals WHERE tb_menu.idCountry = ?) t1)t1 WHERE rn <= 3;`
                const values = [req.params.id]
                conn.query(sql, values, async (err, result) => {
                    if (err) {
                        conn.rollback(function () {
                            throw err;
                        });
                    }
                    if (result.length !== 0) {
                        let country = result[0].idCountry
                        let mealsId = []
                        for (let i = 0; i < result.length; i++) {
                            if (!mealsId.includes(result[i].idMeals)) {
                                mealsId.push(result[i].idMeals)
                            }
                        }
                        for (let i = 0; i < mealsId.length; i++) {
                            menusCountry.mealsKategori.push({ idMeals: mealsId[i], mealsName: "", menu: [] })
                        }
                        for (let i = 0; i < result.length; i++) {
                            for (let j = 0; j < menusCountry.mealsKategori.length; j++) {
                                if (result[i].idMeals === menusCountry.mealsKategori[j].idMeals) {
                                    menusCountry.mealsKategori[j].mealsName = result[i].meal
                                    menusCountry.mealsKategori[j].menu.push({ idMenu: result[i].idMenu, menuName: result[i].menuName, menuPict: result[i].menuPict, idCountry: result[i].idCountry, countryName: result[i].country, flagCode: result[i].flagCode, idUser: result[i].idUser, userName: result[i].userName })
                                }
                            }
                        }
                    } else {
                        menusCountry.mealsKategori = []
                    }
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                throw err;
                            });
                        }
                        conn.release()
                        res.send(menusCountry)
                    });
                });

            });
        });
    });
})
recipeRoute.get('/:idcountry/country/:idmeals/meals', (req, res) => {
    db.getConnection((err, conn) => {
        const sql = `SELECT tb_menu.idMenu, menuName, tb_menu.menuPict, tb_menu.idMeals, tb_menu.idCountry, tb_meals.mealsName as meal, tb_country.countryName, tb_country.flagCode, tb_user.userName, tb_menu.idUser FROM tb_menu INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN  tb_meals ON tb_menu.idMeals = tb_meals.idMeals WHERE tb_menu.idCountry = ? AND tb_menu.idMeals = ?;`
        const values = [req.params.idcountry, req.params.idmeals]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) {
                await res.status(200).send(result)
            } else {
                await res.status(400).send({ message: "Data Not Found" })
            }
        })
    })
})
recipeRoute.get('/:id', (req, res) => {
    db.getConnection((err, conn) => {
        const sql = `SELECT tb_menu.idMenu, tb_menu.menuName, tb_menu.menuDesc, tb_menu.menuPict,tb_menu.cookTime, tb_menu.idMeals, tb_menu.idCountry, tb_meals.mealsName, tb_country.countryName, tb_country.flagCode, tb_user.userName, tb_menu.idUser, tb_ingredients.ingredientsName, tb_instruction.instructionName FROM tb_menu INNER JOIN tb_meals ON tb_menu.idMeals = tb_meals.idMeals INNER JOIN tb_country ON tb_menu.idCountry = tb_country.idCountry INNER JOIN tb_user ON tb_menu.idUser = tb_user.idUser INNER JOIN tb_ingredients ON tb_menu.idMenu = tb_ingredients.idMenu INNER JOIN tb_instruction ON tb_menu.idMenu = tb_instruction.idMenu WHERE tb_menu.idMenu = ?`
        const values = [req.params.id]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) {
                await res.status(200).send({ idMenu: result[0].idMenu, menuName: result[0].menuName, menuDesc: result[0].menuDesc, menuPict: result[0].menuPict, cookTime: result[0].cookTime, userName: result[0].userName, idUser: result[0].idUser, meals: result[0].mealsName, idMeals: result[0].idMeals, idCountry: result[0].idCountry, countryName: result[0].countryName, flagCode: result[0].flagCode, ingredients: JSON.parse(result[0].ingredientsName), instruction: JSON.parse(result[0].instructionName) })
            } else {
                await res.status(400).send({ message: "Data Not Found" })
            }
        })
    })
})
recipeRoute.put('/menu/:id/detail', (req, res) => {
    db.getConnection((err, conn) => {
        const sql = `SELECT tb_menu.idMenu, tb_menu.menuName, tb_menu.menuDesc, tb_menu.menuPict, tb_ingredients.ingredientsName, tb_instruction.instructionName FROM tb_menu INNER JOIN tb_ingredients ON tb_menu.idMenu = tb_ingredients.idMenu INNER JOIN tb_instruction ON tb_menu.idMenu = tb_instruction.idMenu WHERE tb_menu.idMenu = ?;`
        const values = [req.params.id]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            await res.send({ idMenu: result[0].idMenu, menuName: result[0].menuName, menuDesc: result[0].menuDesc, menuPict: result[0].menuPict, ingredients: JSON.parse(result[0].ingredientsName), instruction: JSON.parse(result[0].instructionName) })
        })
    })
})

module.exports = recipeRoute
