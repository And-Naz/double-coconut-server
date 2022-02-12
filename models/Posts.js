module.exports = (sequelize, DataTypes) => {
	const Posts = sequelize.define("Posts", {
		title: { type: DataTypes.STRING, allowNull: false },
		postText: { type: DataTypes.STRING, allowNull: false, field: 'post_text' },
		userName: { type: DataTypes.STRING, allowNull: false, field: 'user_name' },
	})
	return Posts
}