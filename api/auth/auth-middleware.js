const User = require('../users/users-model')

const checkIfUsernameTaken = async (req, res, next) => {
    const {username} = req.user
    const [user] = await User.findBy({username});
    if (user) {
        res.status(400).json({
            message: 'username taken'
        })
        return;
    }
    next()
}

const verifyCreditials = (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({
            message: 'username and password required'
        });
        return;
    }
    req.user = {
        username: username.trim(),
        password: password.trim()
    }
    next()
}

const checkUsernameExists = (req, res, next) => {
next()
}

module.exports = {
    checkIfUsernameTaken,
    verifyCreditials,
    checkUsernameExists
}