const express = require('express')
const userRouter = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../db/db_config')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
var cookie = require('cookie');
const nodemailer = require('nodemailer')
const axios = require('axios')
const { accessToken, refreshToken, refreshTokenVerify, isAuth } = require('./utils')
const { createHmac } = require('node:crypto');


// userRouter.get('/', (req, res) => {
//     const offset = 11;
//     const date = new Date()
//     const Date_expired = new Date(new Date().getTime() + offset * 3600 * 1000)
// })
let transporter = nodemailer.createTransport({
    host: "kavinesia.my.id",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
    },
})
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Ready for Message");
        console.log("success");
    }
})
userRouter.post('/register', async (req, res) => {
    const nameOfUser = req.body.nameOfUser
    const userName = req.body.userName
    const userEmail = req.body.userEmail
    const userPassword = await bcrypt.hash(req.body.userPassword, 8)

    db.getConnection((err, conn) => {
        const sql = `SELECT userEmail from tb_user WHERE userEmail = ?`
        const values = [userEmail]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) return res.status(400).json({ message: "Invalid email address" })
            const currentUrl = "http://localhost:5173/"
            const saltRounds = 10
            const uniqueString = (Math.random() + 1).toString(36).substring(2)
            const hashString = createHmac('sha512', uniqueString)
                .digest('hex');
            var offset = 11;
            const createdAt = new Date().getTime()
            const expiredAt = new Date().getTime() + 4 * 3600 * 1000
            const mailOptions = {
                from: `RecipeOfWorld <${process.env.USER_EMAIL}>`,
                to: "ronisahaja@kavinesia.my.id",
                subject: "Account Verification",
                html: `<p>To activated your account please click <a href=${currentUrl + "verify?xNaLHVXNAWbfi=" + hashString}>here</a></p><p>This link will expire within 4 hours.</p><p>If you didn't create this account, just ignore this message.</p>`
            }
            await transporter
                .sendMail(mailOptions)
                .then(async () => {
                    conn.beginTransaction(function (err) {
                        if (err) { throw err; }
                        const sql = `INSERT INTO tb_user (nameOfUser, userName, userEmail, userPassword ) VALUES (?,?, ?, ?)`
                        const values = [nameOfUser, userName, userEmail, userPassword]
                        conn.query(sql, values, async (err, result) => {
                            if (err) {
                                conn.rollback(function () {
                                    throw err;
                                });
                            }
                            var idUser = result.insertId;
                            const sql = `INSERT INTO tb_userverification (idUser, uniqueString, createdAt, expiredAt) VALUES (?, ?, ?, ?) `
                            const values = [idUser, hashString, createdAt, expiredAt]
                            conn.query(sql, values, async (err, result) => {
                                if (err) {

                                    throw err;
                                }
                                conn.commit(function (err) {
                                    if (err) {
                                        conn.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    return res.status(201).send({
                                        message: `Check your email To finish creating your account, click on the link sent to ${userEmail} `
                                    })
                                });


                            });
                        });
                    });
                })
                .catch((error) => {
                    return res.status(401).json({ message: "Invalid email address" })
                })
        })
    })

})
userRouter.get('/verify/:uniqueString', async (req, res) => {
    const uniqueString = req.params.uniqueString
    db.getConnection((err, conn) => {
        const sql = `SELECT * FROM tb_userverification WHERE uniqueString = ?`
        const values = [uniqueString]
        conn.query(sql, values, async (err, rslt) => {
            if (err) throw err;
            conn.release()
            if (rslt.length !== 0) {
                var offset = 7;
                const currentTime = new Date().getTime()
                if (currentTime < rslt[0].expiredAt) {
                    conn.beginTransaction(function (err) {
                        if (err) { throw err; }
                        const sql = `UPDATE tb_user SET verified = true where idUser = ? `
                        const values = [rslt[0].idUser]
                        conn.query(sql, values, async (err, result) => {
                            if (err) {
                                conn.rollback(function () {
                                    throw err;
                                });
                            }
                            const sql = `DELETE FROM tb_userverification WHERE idUser = ?`
                            const values = [rslt[0].idUser]
                            conn.query(sql, values, async (err, result) => {
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
                                    return res.status(200).send({ message: 'Your account has been activated, please login through the application' })
                                });
                            });
                        });
                    });
                } else {
                    conn.beginTransaction(function (err) {
                        if (err) { throw err; }
                        const sql = `DELETE FROM tb_userverification WHERE idUser = ?`
                        const values = [rslt[0].idUser]
                        conn.query(sql, values, async (err, result) => {
                            if (err) {
                                conn.rollback(function () {
                                    throw err;
                                });
                            }
                            const sql = `DELETE FROM tb_user WHERE idUser = ?`
                            const values = [rslt[0].idUser]
                            conn.query(sql, values, async (err, result) => {
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
                                    return res.status(400).send({ message: "Action expired, Please Register/Login again" })
                                });
                            });
                        });
                    });
                }
            } else {
                return res.status(400).send({ message: "An error occurred, please login again through your application." })
            }
        })
    })

})
userRouter.post('/signin', (req, res) => {
    const userEmail = req.body.userName
    const userPassword = req.body.userPassword
    db.getConnection((err, conn) => {
        const sql = `SELECT * FROM tb_user WHERE userEmail = ?;`
        const values = [userEmail]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) {
                const match = await bcrypt.compareSync(userPassword, result[0].userPassword)
                if (match) {
                    if (result[0].verified) {
                        const accessTokens = accessToken({
                            "idUser": result[0].idUser,
                            "userName": result[0].userName,
                            "userEmail": result[0].userEmail,
                            "nameOfUser": result[0].nameOfUser,
                        })
                        const refreshTokens = refreshToken({
                            "idUser": result[0].idUser,
                            "userName": result[0].userName,
                            "userEmail": result[0].userEmail,
                            "nameOfUser": result[0].nameOfUser,
                        })
                        res.cookie('refresh', refreshTokens, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 2 * 60 * 60 * 1000 })
                        return res.status(200).send({
                            "idUser": result[0].idUser,
                            "userName": result[0].userName,
                            "userEmail": result[0].userEmail,
                            "nameOfUser": result[0].nameOfUser, accessTokens
                        })
                    } else {
                        return res.status(422).send({ message: `Check your email, To finish creating your account, click on the link sent to ${result[0].userEmail}` })
                    }
                } else {
                    return res.status(401).send({ message: "Invalid email and/or password" })
                }
            } else {
                return res.status(401).send({ message: "Invalid email and/or password" })
            }
        })
    })
})
userRouter.get('/signout', (req, res) => {
    res.clearCookie("refresh");
    res.end()
})
userRouter.get('/refresh', refreshTokenVerify);
const upsert = async (req, res) => {
    res.cookie('refresh', req, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
}
userRouter.post("/google-login", async (req, res, next) => {
    const jwt = req.body.jwt
    await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { authorization: `Bearer ${jwt}` } }).then(data => {
        const userName = data.data.name.split(" ").join("").toLowerCase()
        db.getConnection((err, conn) => {
            const sql = `SELECT * FROM tb_user WHERE userEmail = ?;`
            const values = [data.data.email]
            conn.query(sql, values, async (err, result) => {
                if (err) throw err;
                conn.release()
                if (result.length !== 0) {
                    const accessTokens = await accessToken({
                        "idUser": result[0].idUser,
                        "userName": result[0].userName,
                        "userEmail": result[0].userEmail,
                        "nameOfUser": result[0].nameOfUser,
                    })
                    const refreshTokens = await refreshToken({
                        "idUser": result[0].idUser,
                        "userName": result[0].userName,
                        "userEmail": result[0].userEmail,
                        "nameOfUser": result[0].nameOfUser,
                    })
                    res.cookie('refresh', refreshTokens, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
                    console.log('berhasil')
                    return res.send({
                        "idUser": result[0].idUser,
                        "userName": result[0].userName,
                        "userEmail": result[0].userEmail,
                        "nameOfUser": result[0].nameOfUser, accessTokens
                    })
                } else {
                    console.log('gagal')
                    conn.beginTransaction(function (err) {
                        if (err) { throw err; }
                        conn.query(`SELECT idUser FROM tb_user ORDER BY idUser DESC LIMIT 1;`, function (err, result) {
                            if (err) {
                                conn.rollback(function () {
                                    throw err;
                                });
                            }
                            var userId = result[0].idUser + 1
                            const userName = data.data.name.split(" ").join("").toLowerCase() + userId
                            const sql = `INSERT INTO tb_user (nameOfUser, userName, userEmail, verified ) VALUES (?,?, ?, ?)`
                            const values = [data.data.name, userName, data.data.email, 1]
                            conn.query(sql, values, async (err, result) => {
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
                                    const accessTokens = accessToken({
                                        "userName": userName,
                                        "nameOfUser": data.data.name
                                    })
                                    const refreshTokens = refreshToken({
                                        "userName": userName
                                    })
                                    res.cookie('refresh', refreshTokens, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
                                    return res.send({
                                        "idUser": result.insertId,
                                        "userName": userName,
                                        "userEmail": data.data.email,
                                        "nameOfUser": data.data.name, accessTokens
                                    })
                                });
                            });
                        });
                    });
                }
            })
        })
    })
        .catch(err => { return res.send(err) });
});
userRouter.get('/test', isAuth, (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: 'Session Expired' })
    }
    return res.send(req.user)
})
userRouter.post('/forgotPwd', async (req, res) => {
    const userEmail = req.body.userEmail
    db.getConnection((err, conn) => {
        if (err) throw err;
        const sql = `SELECT * FROM tb_user WHERE userEmail = ?;`
        const values = [userEmail]
        conn.query(sql, values, async (err, ress) => {
            if (err) throw err;
            conn.release()
            if (ress.length !== 0) {
                const currentUrl = "http://localhost:5173/"
                const uniqueString = (Math.random() + 1).toString(36).substring(2)
                const hashString = createHmac('sha512', uniqueString).digest('hex');
                var offset = 11;
                const createdAt = new Date().getTime()
                const expiredAt = new Date().getTime() + 2 * 3600 * 1000
                const mailOptions = {
                    from: `RecipeOfWorld <${process.env.USER_EMAIL}>`,
                    to: userEmail,
                    subject: "Forgot Password",
                    html: `<p>To change your password please click <a href=${currentUrl + "reset?cGLIxZ9TK3pBtV=" + hashString}>here</a></p><p>This link will expire within 2 hours.</p>`
                }
                const sql = `SELECT * FROM tb_forgotpwd WHERE idUser = ?`
                const values = [ress[0].idUser]
                conn.query(sql, values, async (err, result) => {
                    if (err) { throw err; }
                    if (result.length !== 0) {
                        const sql = `UPDATE tb_forgotpwd SET uniqueString = ?, createdAt = ?, expiredAt = ? where idUser = ?`
                        const values = [hashString, createdAt, expiredAt, ress[0].idUser]
                        conn.query(sql, values, async (err, result) => {
                            if (err) {
                                throw err;
                            }
                            await transporter
                                .sendMail(mailOptions)
                                .then(async () => {
                                    return res.status(201).send({
                                        message: `You should receive an email shortly with further instructions. Don't see it? Be sure to check your spam and junk folders`
                                    })
                                })

                        });
                    } else {
                        const sql = `INSERT INTO tb_forgotpwd (idUser, uniqueString, createdAt, expiredAt) VALUES (?, ?, ?, ?) `
                        const values = [ress[0].idUser, hashString, createdAt, expiredAt]
                        conn.query(sql, values, async (err, result) => {
                            if (err) throw err;
                            await transporter
                                .sendMail(mailOptions)
                                .then(async () => {
                                    return res.status(201).send({
                                        message: `You should receive an email shortly with further instructions. Don't see it? Be sure to check your spam and junk folders`
                                    })
                                })
                                .catch((error) => {
                                    console.log(error);
                                    return res.status(403).send({
                                        message: `Invalid email address`
                                    })
                                })
                        });
                    }
                })
            } else {
                console.log("test1")
                return res.status(201).send({
                    message: `You should receive an email shortly with further instructions. Don't see it? Be sure to check your spam and junk folders`
                })
            }
        })
    })
})
userRouter.get('/reset/:uniqueString', async (req, res) => {
    const uniqueString = req.params.uniqueString
    db.getConnection((err, conn) => {
        const sql = `SELECT * FROM tb_forgotpwd WHERE uniqueString = ?`
        const values = [uniqueString]
        conn.query(sql, values, async (err, result) => {
            if (err) throw err;
            conn.release()
            if (result.length !== 0) {
                const currentTime = new Date().getTime()
                if (currentTime < result[0].expiredAt) {
                    return res.status(200).send(result[0])
                } else {
                    return res.status(400).send({ message: 'Action expired' })
                }
            } else {
                return res.status(400).send({ message: "An error occurred, please login again through your application." })
            }
        })
    })
})
userRouter.post('/reset/update', async (req, res) => {
    const idUser = req.body.idUser
    const userPassword = await bcrypt.hash(req.body.userPassword, 8)
    db.getConnection((err, conn) => {
        conn.beginTransaction(function (err) {
            if (err) { throw err; }
            const sql = `UPDATE tb_user SET userPassword = ? where idUser = ?`
            const values = [userPassword, idUser]
            conn.query(sql, values, async (err, ress) => {
                if (err) {
                    conn.rollback(function () {
                        throw err;
                    });
                }
                const sql = `DELETE FROM tb_forgotpwd WHERE idUser = ?`
                const values = [idUser]
                conn.query(sql, values, async (err, ress) => {
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
                        return res.status(200).send({ message: 'Your password has been changed, please login through the application' })
                    });
                });
            });
        });
    });

})

userRouter.get('/test1', (req, res) => {
    const accessTokens = accessToken({
        "userName": "oke",
        "nameOfUser": "wesh"
    })
    const refreshTokens = refreshToken({
        "userName": "oke"
    })
    res.cookie('refresh', refreshTokens, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 5 * 60 * 1000 })
    return res.send({

        "idUser": 3,
        "userName": "siap1",
        "userEmail": "siap1",
        "nameOfUser": "wesh",
        "userPassword": "$2b$08$cGLIxZ9TK3pBtVPlZKLS2.TYtJFGB001sUGCC78Ar9lNThI85vpEC"
        , accessTokens
    })

})

module.exports = userRouter