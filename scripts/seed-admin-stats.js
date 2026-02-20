// Run with: node scripts/seed-admin-stats.js
const { sequelize, AdminStats } = require('../backend/models');

async function seed() {
  await sequelize.sync();
  const today = new Date().toISOString().split('T')[0];
  // Generate 30 days of mock data
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    await AdminStats.upsert({
      date: dateStr,
      totalClients: 100 + (30 - i) * 10 + Math.floor(Math.random() * 10),
      newClientsToday: Math.floor(Math.random() * 15) + 5,
      totalRevenue: 50000 + (30 - i) * 2000 + Math.floor(Math.random() * 1000),
      revenueToday: Math.floor(Math.random() * 3000) + 1000,
      pendingPayouts: Math.floor(Math.random() * 5000) + 2000,
      completedProjects: 50 + (30 - i) * 2 + Math.floor(Math.random() * 5),
      activeProjects: 20 + Math.floor(Math.random() * 10)
    });
  }
  console.log('Admin stats seeded');
  process.exit();
}

seed();
