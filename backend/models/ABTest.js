module.exports = (sequelize, DataTypes) => {
  const ABTest = sequelize.define('ABTest', {
    name: DataTypes.STRING,
    variants: DataTypes.JSONB, // array of { content, imageUrl, videoUrl }
    platforms: DataTypes.JSONB,
    audienceSize: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: DataTypes.ENUM('draft', 'running', 'completed'),
    winnerVariant: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });
  return ABTest;
};
