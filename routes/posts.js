const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth')
const { sequelize, Posts } = require('../models')
// /posts
// router.get('/', auth, async (req, res) => {
router.get('/', async (req, res) => {
	try {
		const postsList = await Posts.findAll()
		res.status(200).json(postsList)
	} catch (e) {
		res.status(500).json({ message: 'Something goes wrong, try again' })
	}
})

// router.post('/', auth, async (req, res) => {
router.post('/', async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const post = req.body
		const { dataValues } = await Posts.create(post, { transaction })
		await transaction.commit()
		res.status(201).json(dataValues)
	} catch (e) {
		transaction.rollback();
		res.status(500).json({ message: 'Something goes wrong, try again' })
	}
})

module.exports = router
