module.exports = (sequelize, DataTypes) => {
  const AdminStats = sequelize.define('AdminStats', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true
    },
    totalClients: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    newClientsToday: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    revenueToday: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    pendingPayouts: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    completedProjects: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    activeProjects: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true
  });

  return AdminStats;
};
