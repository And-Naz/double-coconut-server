const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth')
const { sequelize, Posts, Users } = require('../models')
// /posts
router.get('/', auth, async (req, res) => {
	try {
		const postsList = await Posts.findAll({
			include: {
				model: Users,
				attributes: ['login', 'firstName', 'lastName', 'companyName'],
			}
		})
		res.status(200).json(postsList)
	} catch (e) {
		res.status(500).json({ message: 'Something goes wrong, try again' })
	}
})

router.post('/', auth, async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const post = req.body
		post.UserId = req.user.id
		const { dataValues } = await Posts.create(post, { transaction })
		await transaction.commit()
		res.status(201).json(dataValues)
	} catch (e) {
		transaction.rollback();
		res.status(500).json({ message: 'Something goes wrong, try again' })
	}
})

router.delete('/:id', auth, async (req, res) => {
	try {
		const transaction = await sequelize.transaction();
		const { id } = req.params
		await Posts.destroy({ where: { id } }, { transaction })
		await transaction.commit()
		res.status(204).json({ ok: true })
	} catch (e) {
		transaction.rollback();
		res.status(500).json({ ok: false })
	}
})

router.patch('/', auth, async (req, res) => {
	try {
		const transaction = await sequelize.transaction();
		const { post, id } = req.body
		await Posts.update(
			{ ...post },
			{ where: { id } },
			{ transaction })
		await transaction.commit()
		res.status(204).json({ ok: true })
	} catch (e) {
		transaction.rollback();
		res.status(500).json({ ok: false })
	}
})

module.exports = router
