const express = require('express')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()
const db = require('./models')

app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use('/posts', require('./routes/posts'))
app.use('/auth', require('./routes/auth'))

async function Main() {
	try {
		await db.sequelize.sync();
		app.listen(PORT, () => console.log(`Server is running and listening the port: ${PORT}.`));
	} catch (e) {
		console.log('Server Error', e.message)
		process.exit(1)
	}
}

Main()

