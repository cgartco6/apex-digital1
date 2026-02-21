module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    platforms: DataTypes.JSONB, // array of { platform, accountId }
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'published', 'failed'),
      defaultValue: 'draft'
    },
    scheduledAt: DataTypes.DATE,
    publishedAt: DataTypes.DATE,
    performance: DataTypes.JSONB, // likes, shares, comments per platform
    abTestId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });
  return Post;
};
