const { Router } = require('express')
const router = Router()
// /
router.get('/', async (req, res) => {
	try {
		res.status(200).json({ message: 'index' })
	} catch (e) {
		res.status(500).json({ message: 'Something goes wrong, try again' })
	}
})

module.exports = router
