module.exports = (sequelize, DataTypes) => {
  const Payout = sequelize.define('Payout', {
    weekStart: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    weekEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    breakdown: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        fnb: 0,
        africanBank: 0,
        aiFnb: 0,
        reserveFnb: 0,
        retained: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'paid', 'failed'),
      defaultValue: 'pending'
    },
    paymentReference: {
      type: DataTypes.STRING
    },
    paidAt: {
      type: DataTypes.DATE
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    timestamps: true
  });

  Payout.associate = function(models) {
    Payout.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Payout;
};
