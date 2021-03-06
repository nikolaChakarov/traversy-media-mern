const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// mongoose User model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public 

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('repeatPassword').custom(function (repeatPassword, { req }) {
        if (repeatPassword !== req.body.password) {
            throw ('Pass is not the same');
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User allready exists' }] });
        }

        // Get user gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name, email, avatar, password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return jswebtoken

        const payload = {
            user: {
                id: user.id
            }
        }

        const secret = config.get('jwtSecret');

        jwt.sign(
            payload,
            secret,
            { expiresIn: 36000 },
            (err, token) => {
                if (err) { throw err }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;