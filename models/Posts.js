module.exports = (sequelize, DataTypes) => {
	const Posts = sequelize.define("Posts", {
		title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
		text: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
		userName: { type: DataTypes.STRING, allowNull: false, field: 'user_name' },
	})
	return Posts
}