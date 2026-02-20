module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    fullName: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'client' },
    bankDetails: DataTypes.JSONB, // { fnbAccount, africanBankAccount }
  });
  return User;
};
