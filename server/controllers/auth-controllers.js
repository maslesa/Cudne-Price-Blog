const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateLoginCode, sendLoginCodeEmail } = require('../utils/loginCodeVerification');

const userRegistration = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExist = await User.findOne({ $or: [{ username: username }, { email: email }] });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'User with that credentials already exists'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        newUser.save();

        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with that username doesn't exist`
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            })
        }

        const code = generateLoginCode();
        const expires = new Date(Date.now() + 5 * 60 * 1000);

        user.loginCode = code;
        user.loginCodeExpires = expires;
        await user.save();

        await sendLoginCodeEmail(code);

        res.status(200).json({
            success: true,
            message: 'Login request submitted.',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const verifyLoginCode = async (req, res) => {
    const { username, code } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({
        success: false,
        message: 'User not found'
    });

    if (!user.loginCode || user.loginCode !== code) {
        return res.status(401).json({
            success: false,
            message: 'Invalid login code'
        });
    }

    if (user.loginCodeExpires < new Date()) {
        return res.status(410).json({
            success: false,
            message: 'Login code expired'
        });
    }

    user.loginCode = null;
    user.loginCodeExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_TOKEN, { expiresIn: '2h' });

    return res.status(200).json({
        message: 'Login successful',
        user,
        token
    });
};

module.exports = {
    userRegistration,
    userLogin,
    verifyLoginCode
}