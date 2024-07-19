const express = require('express');
const app = express();
const port = 3009;
const cookieParser = require('cookie-parser');
// [GET] /
app.set('view engine', 'ejs');
app.use(cookieParser())
// FAKE DB (MYSQL, MONGODB)
const db = {
    users: [{
        id: 1, email: 'nguyenvana@gmail.com', password: '123456', name: "Nguyen Van A"
    }]
}

app.use(express.urlencoded({extended: true})); // cho phep nhan va xu ly form trong express o backend

// get : homepage
app.get('/', (req, res) => {
    res.render('pages/index');
})

//session
const sessions = {};


app.get('/login', (req, res) => {
    res.render('pages/login');
})
// [POST] /login
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    const user = db.users.find(user => user.email === email && user.password === password);
    if (user) {
        const sessionId = Date.now().toString();
        sessions[sessionId] = {
            userId: user.id
            // expiredAt :
        }
        console.log(sessions);
        res.setHeader('Set-Cookie', `sessionId=${sessionId}; max-age=3600; httpOnly`).redirect('dashboard');
        return;
    }
    res.send("Username or password is incorrect.");
})

// [GET] /dashboard
app.get('/dashboard', (req, res) => {
    const session = sessions[req.cookies.sessionId];
    if (!session) {
        return res.redirect('/login');
    }
    const user = db.users.find(user => user.id === session.userId);
    if (!user) {
        return res.redirect('/login');
    }
    res.render('pages/dashboard', {user});
})

// [GET] /logout

app.get('/logout', (req, res) => {
    // xoa bo session
    delete sessions[req.cookies.sessionId];

    // xoa bo cookie
    res.setHeader('Set-Cookie', 'sessionId=;max-age=0').redirect('/login');


})


app.listen(port, () => {
    console.log(`Demo app is running on port ${port}`)
})