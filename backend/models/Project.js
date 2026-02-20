module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    type: {
      type: DataTypes.ENUM('design', 'marketing', 'web', 'landing', 'ecommerce'),
      allowNull: false
    },
    package: {
      type: DataTypes.ENUM('basic', 'pro', 'enterprise'),
      allowNull: false
    },
    style: {
      type: DataTypes.STRING
    },
    requirements: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM(
        'pending_payment',
        'ai_processing',
        'proof_check',
        'delivered',
        'completed',
        'cancelled'
      ),
      defaultValue: 'pending_payment'
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    files: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded'),
      defaultValue: 'pending'
    },
    aiMetadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    deliveredAt: {
      type: DataTypes.DATE
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    timestamps: true
  });

  Project.associate = function(models) {
    Project.belongsTo(models.User, { foreignKey: 'userId' });
    Project.hasMany(models.Payment, { foreignKey: 'projectId' });
    Project.hasMany(models.CampaignMetric, { foreignKey: 'projectId' });
  };

  return Project;
};
