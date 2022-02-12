const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
// const User = require('../models/User')
const router = Router()


// /auth/register
router.post(
	'/register',
	[
		check('email', 'Incorect email').isEmail(),
		check('password', 'Password min length must be 6.')
			.isLength({ min: 6 })
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Incorrect data during registration'
				})
			}
			// const { email, password } = req.body
			// const candidate = await User.findOne({ email })
			// if (candidate) {
			// return res.status(400).json({ message: 'User with same email already exists.' })
			// }
			// const hashedPassword = await bcrypt.hash(password, 12)
			// const user = new User({ email, password: hashedPassword })
			// await user.save()
			// res.status(201).json({ message: 'User has been created' })
			res.status(200).json({ message: "register" })
		} catch (e) {
			res.status(500).json({ message: 'Something goes wrong, try again' })
		}
	})

// /auth/login
router.post(
	'/login',
	[
		check('email', 'Incorect email').normalizeEmail().isEmail(),
		check('password', 'Enter the password').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Incorrect data during the enter in system.'
				})
			}
			// const { email, password } = req.body
			// const user = await User.findOne({ email })
			// if (!user) {
			// 	return res.status(400).json({ message: "User doesn't exists" })
			// }
			// const isMatch = await bcrypt.compare(password, user.password)
			// if (!isMatch) {
			// 	return res.status(400).json({ message: 'Incorrect password, try again' })
			// }
			// const token = jwt.sign(
			// 	{ userId: user.id },
			// 	process.env.JWT_SECRET,
			// 	{ expiresIn: '1h' }
			// )
			// res.json({ token, userId: user.id })
			res.status(200).json({ message: "login" })
		} catch (e) {
			res.status(500).json({ message: 'Something goes wrong, try again' })
		}
	})


module.exports = router
