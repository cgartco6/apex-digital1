module.exports = (sequelize, DataTypes) => {
  const LegalDocument = sequelize.define('LegalDocument', {
    type: {
      type: DataTypes.ENUM('terms', 'privacy', 'cookie'),
      unique: true,
      allowNull: false
    },
    content: DataTypes.TEXT,
    version: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    metadata: DataTypes.JSONB
  }, {
    timestamps: true
  });
  return LegalDocument;
};
