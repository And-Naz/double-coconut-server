module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define("Users", {
		login: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
		companyName: { type: DataTypes.STRING, allowNull: false, field: 'company_name' },
		firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
		lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
	})

	Users.associate = models => {
		Users.hasMany(models.Posts, {
			onDelete: 'cascade'
		})
	}

	return Users
}