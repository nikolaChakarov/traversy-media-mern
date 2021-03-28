const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route   GET api/auth
// @desc    Test route
// @access  Public 

router.get('/', auth, async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select('-password'); // take off the password from the response!!!
        res.send(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Something went wrong...');
    }
});

// ------------------------

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public 

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Decrypt password
        const isPassOk = await bcrypt.compare(password, user.password);

        if (!isPassOk) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 36000 },
            (err, token) => {
                if (err) { throw err }
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;