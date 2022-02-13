const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const { sequelize, Users } = require('../models')
const { Op } = require("sequelize");
const router = Router()

// /auth/registration
router.post(
	'/registration',
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
			await Users.create(newUser, { transaction })
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
			const user = { ...candidate.dataValues }
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(400).json({ message: 'Wrong login and password combination.' })
			}
			delete user.id
			delete user.password
			delete user.updatedAt
			delete user.createdAt
			const token = jwt.sign(
				user,
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)
			res.status(200).json({ token, user })
		} catch (e) {
			res.status(500).json({ message: 'Something goes wrong, try again' })
		}
	})

// /auth/edit
router.patch(
	'/edit',
	[
		check("login", "Login is required").exists(),
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
					message: 'Incorrect data during editing.'
				})
			}
			const user = { ...req.user, ...req.body }
			if (req.body.password) {
				passwordValidation = await check('password', 'Password min length must be 6.').isLength({ min: 6 }).run(req)
				if (!passwordValidation.isEmpty()) {
					return res.status(400).json({
						errors: errors.array(),
						message: 'Incorrect password.'
					})
				}
				const hashedPassword = await bcrypt.hash(user.password, 10)
				user.password = hashedPassword
			}

			await Users.update(
				user,
				{ where: { login: user.login } },
				{ transaction }
			)
			await transaction.commit()

			if (user.password) {
				delete user.password
			}

			const token = jwt.sign(
				user,
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)
			res.status(200).json({ token, user })

		} catch (e) {
			transaction.rollback();
			res.status(500).json({ message: 'Something goes wrong, try again' })
		}
	})

module.exports = router
