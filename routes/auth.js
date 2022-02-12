const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const { sequelize, Users } = require('../models')
const { Op } = require("sequelize");
const router = Router()


// /auth/register
router.post(
	'/register',
	[
		check("login", "Login is required").exists(),
		check('password', 'Password min length must be 6.').exists().isLength({ min: 6 }),
		check('email', 'Incorect email').exists().isEmail(),
		check("firstName", "Login is required").exists(),
		check("lastName", "Login is required").exists(),
		check("companyName", "Login is required").exists()
	],
	async (req, res) => {
		const transaction = await sequelize.transaction();
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Incorrect data during registration'
				})
			}
			const { login, password, email, firstName, lastName, companyName } = req.body
			const candidate = await Users.findOne({
				where: {
					[Op.or]: [{ login }, { email }]
				}
			})
			if (candidate) {
				return res.status(400).json({ message: 'User with same email or login already exists.' })
			}
			const hashedPassword = await bcrypt.hash(password, 10)
			const newUser = {
				login, email, firstName, lastName, companyName,
				password: hashedPassword
			}
			const { dataValues } = await Users.create(newUser, { transaction })
			await transaction.commit()
			res.status(201).json({ message: 'User has been created' })
		} catch (e) {
			transaction.rollback();
			res.status(500).json({ message: 'Something goes wrong, try again' })
		}
	})

// /auth/login
router.post(
	'/login',
	[
		check('loginOrEemail', 'Incorect email or login').exists(),
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
			const { loginOrEemail, password } = req.body
			const candidate = await Users.findOne({
				where: {
					[Op.or]: [{ login: loginOrEemail }, { email: loginOrEemail }]
				}
			})
			if (!candidate) {
				return res.status(400).json({ message: "User doesn't exists" })
			}
			const user = candidate.dataValues
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(400).json({ message: 'Wrong login and password combination.' })
			}
			const token = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)
			res.json({ token, userId: user.id })
		} catch (e) {
			res.status(500).json({ message: 'Something goes wrong, try again' })
		}
	})


module.exports = router
