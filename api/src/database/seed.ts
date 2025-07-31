import 'reflect-metadata';
import { AppDataSource } from './createConnection';
import { seedRoles } from './seedRoles';

const runSeed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Seed roles
    await seedRoles();
    console.log('✅ Roles seeded successfully');
    
    console.log('🎉 Database seeding completed!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
};

runSeed();