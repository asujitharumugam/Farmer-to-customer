const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const FarmProfile = require('./models/FarmProfile');
const Category = require('./models/Category');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await FarmProfile.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Seeding Categories...');
    const categories = await Category.insertMany([
      { name: 'Fresh Vegetables', slug: 'vegetables', description: 'Farm crisp, pesticide-free fresh vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
      { name: 'Seasonal Fruits', slug: 'fruits', description: 'Tree-ripened organic sweet fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80' },
      { name: 'Grains & Pulses', slug: 'grains', description: 'Whole grain wheat, basmati rice & lentils', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' },
      { name: 'Dairy & Eggs', slug: 'dairy', description: 'Fresh farm milk, artisanal cheese & free-range eggs', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=500&q=80' },
      { name: 'Herbs & Microgreens', slug: 'herbs', description: 'Aromatic basil, mint, coriander & microgreens', image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=500&q=80' }
    ]);

    console.log('Seeding Users (Customer, Farmer, Admin)...');
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@farmtotable.com',
      password: 'Password123!',
      role: 'admin',
      phone: '+1 800 555 0199'
    });

    const farmer1 = await User.create({
      name: 'John Harvest',
      email: 'farmer@greenacres.com',
      password: 'Password123!',
      role: 'farmer',
      phone: '+1 555 014 8822',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    });

    const customer1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'customer@gmail.com',
      password: 'Password123!',
      role: 'customer',
      phone: '+1 555 019 3344',
      addresses: [{ street: '742 Evergreen Terrace', city: 'Springfield', state: 'IL', zipCode: '62704', isDefault: true }]
    });

    console.log('Seeding Verified Farm Profile...');
    const farmProfile1 = await FarmProfile.create({
      user: farmer1._id,
      farmName: 'Green Acres Organic Valley',
      story: 'Family-owned 45-acre certified organic farm operating since 1998. We specialize in heirloom tomatoes, crisp brassicas, and natural honey with 0% synthetic pesticides.',
      location: { address: '124 County Road 9', city: 'Greenfield', state: 'CA', zipCode: '93927' },
      farmSizeAcres: 45,
      verificationDocs: [{ docType: 'USDA Organic Accreditation', fileUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' }],
      verificationStatus: 'approved',
      ratingAverage: 4.9,
      ratingCount: 38
    });

    console.log('Seeding Produce Listings...');
    await Product.insertMany([
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Heirloom Vine Tomatoes',
        description: 'Naturally ripened on the vine with rich juicy flavor. Harvested daily every morning.',
        category: categories[0]._id,
        pricePerUnit: 3.50,
        unit: 'kg',
        stockQuantity: 120,
        harvestDate: new Date(Date.now() + 86400000 * 2), // 2 days in future
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Organic Hass Avocados',
        description: 'Creamy, rich avocados hand-picked at peak maturity. Perfect for guacamole and salads.',
        category: categories[1]._id,
        pricePerUnit: 4.99,
        unit: 'box',
        stockQuantity: 45,
        harvestDate: new Date(Date.now() + 86400000 * 1),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Farm Fresh Spinach Bunch',
        description: 'Crisp green spinach washed in natural spring water. High in iron and antioxidants.',
        category: categories[0]._id,
        pricePerUnit: 2.20,
        unit: 'piece',
        stockQuantity: 80,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Wild Mountain Forest Honey',
        description: 'Unfiltered raw wildflower honey collected directly from farm apiaries.',
        category: categories[3]._id,
        pricePerUnit: 8.50,
        unit: 'piece',
        stockQuantity: 30,
        harvestDate: new Date(Date.now() - 86400000 * 5),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      }
    ]);

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (err) {
    console.error('Database Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
