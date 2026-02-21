module.exports = (sequelize, DataTypes) => {
  const SocialAccount = sequelize.define('SocialAccount', {
    platform: {
      type: DataTypes.ENUM('facebook', 'twitter', 'linkedin', 'instagram', 'tiktok'),
      allowNull: false
    },
    accountName: DataTypes.STRING,
    accessToken: DataTypes.TEXT,
    refreshToken: DataTypes.TEXT,
    tokenExpires: DataTypes.DATE,
    pageId: DataTypes.STRING, // for Facebook pages
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    metadata: DataTypes.JSONB
  });
  return SocialAccount;
};
