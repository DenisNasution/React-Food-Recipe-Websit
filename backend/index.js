const express = require('express')
require('dotenv').config()
const app = express()
const db = require('./db/db_config')
const userRouter = require('./routes/userRoute')
const countryRoute = require('./routes/countryRoute')
const recipeRoute = require('./routes/recipeRoute')
const userRoute = require('./routes/userRoute')
const oauth = require('./routes/oauth')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer()
const path = require('path');
// const cookieSession = require("cookie-session");
const cors = require('cors')

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.resolve('./public')));
app.use(cookieParser())

// app.use(
//     cookieSession({
//         name: "refresh",
//         keys: ["refreshTest"],
//         maxAge: 24 * 60 * 60 * 100,
//     })
// );
// app.use(multer().array())
// app.use(upload.none())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.json({ user: 'tobi' })
})

db.getConnection(err => {
    if (err) throw err
    console.log('database connected')
})

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-no-retry");
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//     next();
// });
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
        allowedHeader: "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-no-retry"

    })
);

app.use('/api/user', userRouter)
app.use('/api/country', countryRoute)
app.use('/api/recipe', recipeRoute)
app.use('/auth', oauth);
// app.use('/api/user', userRoute)

// app.listen()
app.listen(1000, () => {
    console.log(`App listening on port ${1000}`)
})