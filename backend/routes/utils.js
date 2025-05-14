const jwt = require('jsonwebtoken')
const accessToken = (user) => {
    // console.log({
    //     "userInfo": {
    //         "userName": user.userName,
    //         "nameOfUser": user.nameOfUser
    //     }
    // })
    return jwt.sign(
        {
            "userInfo": {
                "idUser": user.idUser,
                "userName": user.userName,
                "userEmail": user.userEmail,
                "nameOfUser": user.nameOfUser,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '60m'
        }
    )
}
const refreshToken = (user) => {
    return jwt.sign(
        {
            "userInfo": {
                "idUser": user.idUser,
                "userName": user.userName,
                "userEmail": user.userEmail,
                "nameOfUser": user.nameOfUser,
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '120m'
        }
    )
}

const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log(authHeader?.startsWith('Bearer '))

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).send({ message: 'Please login' })
    const accessToken = authHeader.split(' ')[1]
    const cookies = req.cookies
    // console.log(cookies.refresh)
    if (!cookies.refresh) return res.status(401).send({ message: 'Please login' })
    // const accessToken = cookies.access
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decode) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decode.userInfo;
            next()
        }
    )
}

const refreshTokenVerify = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies.refresh) return res.status(401).send({ message: "Please login" })
    const refreshToken = cookies.refresh
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decode) => {
            if (err) {
                res.clearCookie("refresh");
                return res.status(403).send({ message: "Session expired, please login again" })
            };
            const accessTokens = accessToken({
                "idUser": decode.userInfo.idUser,
                "userName": decode.userInfo.userName,
                "userEmail": decode.userInfo.userEmail,
                "nameOfUser": decode.userInfo.nameOfUser,
            })
            // res.cookie('access', accessTokens, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 1 * 60 * 1000 })
            // next()
            res.send({
                "idUser": decode.userInfo.idUser,
                "userName": decode.userInfo.userName,
                "userEmail": decode.userInfo.userEmail,
                "nameOfUser": decode.userInfo.nameOfUser, accessTokens
            })

        }
    )
}
module.exports = { accessToken, refreshToken, isAuth, refreshTokenVerify }