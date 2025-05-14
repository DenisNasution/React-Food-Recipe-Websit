var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const cors = require('cors');
// const { jwtDecode } = require('jwt-decode');
dotenv.config(); // Load environment variables from .env file


router.post("/google", (req, res) => {
    // res.send({ test: 'test' })
    // console.log(req.body.jwt)
    // const jwt = req.body.jwt
    // const decode = jwtDecode(jwt)
    // console.log(decode)
    // res.cookie('refresh', "test1", { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
    res.send(req.body)

});


// process.env.GOOGLE_ID,
//             process.env.GOOGLE_SECRET,
/* GET home page. */
// var corsOptions = {
//     origin: 'http://localhost:5173',
//     credentials: true
// }
// router.get("/login/success", (req, res) => {
//     // res.cookie('refresh', "test", { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
//     // res.send({ test: 'test' })
//     if (req.user) {
//         res.status(200).json({
//             error: false,
//             message: "Successfully Loged In",
//             user: req.user,
//         });
//     } else {
//         res.status(403).json({ error: true, message: "Not Authorized" });
//     }
// });

// router.get("/login/failed", (req, res) => {
//     res.status(401).json({
//         error: true,
//         message: "Log in failure",
//     });
// });

// router.get("/google", passport.authenticate("google", ["profile", "email"]));

// router.get(
//     "/google/callback",
//     passport.authenticate("google", {
//         successRedirect: process.env.CLIENT_URL,
//         failureRedirect: "/login/failed",
//     })
//     // passport.authenticate("google", { session: false, failureRedirect: '/auth/google/failure' }),
//     // function (req, res) {
//     //     // console.log(req.user._json.name)
//     //     res.cookie('refresh', 'test', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
//     //     // res.json(req.user._json.name)
//     //     res.redirect(process.env.CLIENT_URL);
//     // }

// )

// router.get("/logout", (req, res) => {
//     req.logout(function (err) {
//         if (err) { return next(err) }
//         res.redirect(process.env.CLIENT_URL);
//     })
// });
module.exports = router;