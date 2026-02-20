module.exports = (sequelize, DataTypes) => {
  const CampaignMetric = sequelize.define('CampaignMetric', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    impressions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    conversions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    spend: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    revenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    ctr: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.impressions ? (this.clicks / this.impressions) * 100 : 0;
      }
    },
    conversionRate: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.clicks ? (this.conversions / this.clicks) * 100 : 0;
      }
    },
    roi: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.spend ? ((this.revenue - this.spend) / this.spend) * 100 : 0;
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'date']
      }
    ]
  });

  CampaignMetric.associate = function(models) {
    CampaignMetric.belongsTo(models.Project, { foreignKey: 'projectId' });
  };

  return CampaignMetric;
};
