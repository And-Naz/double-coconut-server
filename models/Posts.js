module.exports = (sequelize, DataTypes) => {
	const Posts = sequelize.define("Posts", {
		title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
		text: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
	})
	Posts.associate = models => {
		Posts.belongsTo(models.Users, {
			onDelete: 'cascade',
			foreignKey: {
				allowNull: false
			}
		})
		// Posts.belongsToMany(models.Users);
	}
	return Posts
}