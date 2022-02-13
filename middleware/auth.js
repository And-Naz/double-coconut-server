const jwt = require('jsonwebtoken')
const { Users } = require('../models')
module.exports = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next()
	}
	try {
		const token = req.headers.authorization
		if (!token) {
			return res.status(401).json({ message: "There isn't authorization" })
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await Users.findOne({ login: decoded.login })
		if (!user) {
			return res.status(500).json({ message: "There isn't Bad Request" })
		}
		req.user = user.dataValues
		next()
	} catch (e) {
		res.status(401).json({ message: "There isn't authorization" })
	}
}
