const { connectDB, sequelize } = require('./database');
const { User, Car, Driver, Booking } = require('./models');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seed() {
    await connectDB();
    await sequelize.sync({ alter: true });

    // Check if admin exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@citycars.az';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Vaqif1988@';

    const adminExists = await User.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        console.log(`Admin user ${adminEmail} created`);
    } else {
        console.log('Admin user already exists');
    }

    // Seed Cars
    const carsCount = await Car.count();
    if (carsCount === 0) {
        await Car.bulkCreate([
            { name: 'BMW 5 Series', price: 120, type: 'Limousine', image: 'https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80', rating: 4.9, fuel: 'Petrol' },
            { name: 'Mercedes E-Class', price: 140, type: 'Sedan', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', rating: 4.8, fuel: 'Diesel' },
            { name: 'Audi Q7', price: 180, type: 'SUV', image: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80', rating: 4.9, fuel: 'Hybrid' },
        ]);
        console.log('Cars seeded');
    }

    // Seed Drivers
    const driversCount = await Driver.count();
    if (driversCount === 0) {
        await Driver.bulkCreate([
            {
                name: 'Elchin Aliyev',
                image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
                experience: 8,
                rating: 4.9,
                languages: 'Azerbaijani, Russian, English',
                price: 50,
                available: true
            },
            {
                name: 'Mehman Mammadov',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                experience: 12,
                rating: 5.0,
                languages: 'Azerbaijani, Turkish, English',
                price: 65,
                available: true
            },
            {
                name: 'Rashad Guliyev',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                experience: 5,
                rating: 4.8,
                languages: 'Azerbaijani, English',
                price: 45,
                available: true
            }
        ]);
        console.log('Drivers seeded');
    }

    // Seed Bookings
    const bookingsCount = await Booking.count();
    if (bookingsCount === 0) {
        const firstCar = await Car.findOne();
        const firstUser = await User.findOne();
        if (firstCar && firstUser) {
            await Booking.bulkCreate([
                {
                    userId: firstUser.id,
                    carId: firstCar.id,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000 * 3), // 3 days
                    totalPrice: firstCar.price * 3,
                    status: 'confirmed',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '+994 50 123 45 67',
                    pickupLocation: 'Baku Airport',
                    returnLocation: 'Baku Airport',
                    pickupDate: new Date().toISOString().split('T')[0],
                    pickupTime: '10:00',
                    returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                    returnTime: '10:00'
                },
                {
                    userId: firstUser.id,
                    carId: firstCar.id,
                    startDate: new Date(Date.now() - 86400000 * 5),
                    endDate: new Date(Date.now() - 86400000 * 2),
                    totalPrice: firstCar.price * 3,
                    status: 'completed',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane@example.com',
                    phone: '+994 70 987 65 43',
                    pickupLocation: 'City Center',
                    returnLocation: 'City Center',
                    pickupDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
                    pickupTime: '14:00',
                    returnDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
                    returnTime: '14:00'
                }
            ]);
            console.log('Bookings seeded');
        }
    }

    console.log('Seeding completed');
    process.exit();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
