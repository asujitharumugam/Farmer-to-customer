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
      { name: 'Fresh Vegetables', slug: 'vegetables', description: 'Farm crisp, pesticide-free fresh Indian vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
      { name: 'Seasonal Fruits', slug: 'fruits', description: 'Tree-ripened organic sweet Indian fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80' },
      { name: 'Grains & Pulses', slug: 'grains', description: 'Whole grain wheat, basmati rice, lentils & pulses', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' },
      { name: 'Dairy & Farm Eggs', slug: 'dairy', description: 'Fresh cow milk, paneer, curd, ghee & free-range eggs', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=500&q=80' },
      { name: 'Herbs & Spices', slug: 'herbs', description: 'Aromatic mint, palak, coriander & fresh green chillies', image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=500&q=80' },
      { name: 'Honey & Oils', slug: 'oils-honey', description: 'Raw forest honey, cold pressed mustard oil & organics', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80' }
    ]);

    console.log('Seeding Users (Customer, Farmer, Admin)...');
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@farmtotable.com',
      password: 'Password123!',
      role: 'admin',
      phone: '+91 98765 00001'
    });

    const farmer1 = await User.create({
      name: 'Ramesh Patel',
      email: 'farmer@greenacres.com',
      password: 'Password123!',
      role: 'farmer',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    });

    const customer1 = await User.create({
      name: 'Priya Sharma',
      email: 'customer@gmail.com',
      password: 'Password123!',
      role: 'customer',
      phone: '+91 98765 12345',
      addresses: [{ street: 'MG Road, Flat 402', city: 'Mumbai', state: 'MH', zipCode: '400001', isDefault: true }]
    });

    console.log('Seeding Verified Farm Profile...');
    const farmProfile1 = await FarmProfile.create({
      user: farmer1._id,
      farmName: 'Green Acres Organic Valley',
      story: 'Family-owned 45-acre certified organic farm operating since 1998 in Nashik. We specialize in heirloom tomatoes, fresh fruits, whole grains, and natural honey with 0% synthetic pesticides.',
      location: { address: 'Plot 12, Farm Belt Road', city: 'Nashik', state: 'MH', zipCode: '422003' },
      farmSizeAcres: 45,
      verificationDocs: [{ docType: 'FSSAI Organic Accreditation', fileUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' }],
      verificationStatus: 'approved',
      ratingAverage: 4.9,
      ratingCount: 38
    });

    console.log('Seeding 50 Indian Produce Listings...');
    await Product.insertMany([
      // === FRESH VEGETABLES (19) ===
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Farm Fresh Red Tomatoes (Tamatar)', description: 'Naturally ripened fresh juicy red tomatoes harvested daily morning.', category: categories[0]._id, pricePerUnit: 20.00, unit: 'kg', stockQuantity: 150, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Nashik Fresh Red Onions (Pyaz)', description: 'Crisp, flavorful organic red onions harvested fresh from the soil of Nashik.', category: categories[0]._id, pricePerUnit: 22.00, unit: 'kg', stockQuantity: 200, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Organic New Crop Potatoes (Aloo)', description: 'Clean, smooth-skinned organic farm potatoes.', category: categories[0]._id, pricePerUnit: 18.00, unit: 'kg', stockQuantity: 250, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Crisp Orange Carrots (Gajar)', description: 'Sweet crunchy organic orange carrots packed with vitamin A.', category: categories[0]._id, pricePerUnit: 30.00, unit: 'kg', stockQuantity: 100, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh White Cauliflower (Phool Gobhi)', description: 'Farm fresh white curd cauliflower, pesticide free.', category: categories[0]._id, pricePerUnit: 25.00, unit: 'piece', stockQuantity: 80, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Green Capsicum (Simla Mirch)', description: 'Vibrant green bell peppers, fresh and crunchy.', category: categories[0]._id, pricePerUnit: 35.00, unit: 'kg', stockQuantity: 90, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Farm Crisp Cucumbers (Kheera)', description: 'Hydrating, crisp green farm cucumbers.', category: categories[0]._id, pricePerUnit: 20.00, unit: 'kg', stockQuantity: 120, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Green Peas (Hari Matar)', description: 'Sweet pods filled with tender green peas.', category: categories[0]._id, pricePerUnit: 40.00, unit: 'kg', stockQuantity: 70, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Organic Purple Brinjal (Baingan)', description: 'Glossy purple eggplants harvested fresh from fields.', category: categories[0]._id, pricePerUnit: 25.00, unit: 'kg', stockQuantity: 85, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Tender Lady Finger (Bhindi)', description: 'Fresh tender green okra harvested daily.', category: categories[0]._id, pricePerUnit: 30.00, unit: 'kg', stockQuantity: 110, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Bottle Gourd (Lauki)', description: 'Nutritious hydrating green bottle gourd.', category: categories[0]._id, pricePerUnit: 20.00, unit: 'piece', stockQuantity: 60, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Ridge Gourd (Torai)', description: 'Organic ridge gourd packed with dietary fiber.', category: categories[0]._id, pricePerUnit: 28.00, unit: 'kg', stockQuantity: 75, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Organic Bitter Gourd (Karela)', description: 'Fresh green bitter gourd, great for health and detox.', category: categories[0]._id, pricePerUnit: 32.00, unit: 'kg', stockQuantity: 65, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Green Cabbage (Patta Gobhi)', description: 'Crisp green cabbage head washed in farm water.', category: categories[0]._id, pricePerUnit: 22.00, unit: 'piece', stockQuantity: 95, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Organic Red Beetroot (Chukandar)', description: 'Rich blood-red organic beetroots, high in iron.', category: categories[0]._id, pricePerUnit: 35.00, unit: 'kg', stockQuantity: 80, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Farm Radish (Mooli)', description: 'Crisp white radishes with tender green leaves.', category: categories[0]._id, pricePerUnit: 15.00, unit: 'piece', stockQuantity: 100, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1623227413711-25a05de1e5b0?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Green Pumpkin (Kaddu)', description: 'Sweet farm pumpkin, rich in beta carotene.', category: categories[0]._id, pricePerUnit: 25.00, unit: 'kg', stockQuantity: 50, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1506917728037-b6af01a7d403?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Farm Fresh Ginger (Adrak)', description: 'Aromatic spicy organic ginger roots.', category: categories[0]._id, pricePerUnit: 60.00, unit: 'kg', stockQuantity: 60, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Organic Garlic (Lahsun)', description: 'Pungent white organic garlic bulbs.', category: categories[0]._id, pricePerUnit: 90.00, unit: 'kg', stockQuantity: 70, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80'], status: 'available' },

      // === SEASONAL FRUITS (12) ===
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Sweet Alphonso Mangoes (Aam)', description: 'Tree-ripened organic sweet Alphonso mangoes with rich golden pulp.', category: categories[1]._id, pricePerUnit: 65.00, unit: 'kg', stockQuantity: 80, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Kashmiri Red Apples (Seb)', description: 'Crisp sweet red apples direct from orchards.', category: categories[1]._id, pricePerUnit: 75.00, unit: 'kg', stockQuantity: 100, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Ripe Golden Bananas (Kela)', description: 'Naturally ripened sweet yellow bananas.', category: categories[1]._id, pricePerUnit: 35.00, unit: 'dozen', stockQuantity: 150, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Sweet Nagpur Oranges (Santra)', description: 'Juicy sweet oranges packed with vitamin C.', category: categories[1]._id, pricePerUnit: 45.00, unit: 'kg', stockQuantity: 120, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Ruby Pomegranates (Anaar)', description: 'Juicy red pomegranates loaded with antioxidants.', category: categories[1]._id, pricePerUnit: 85.00, unit: 'kg', stockQuantity: 60, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1565271921421-5fb5f18d3e79?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Farm Fresh Green Guava (Amrood)', description: 'Crisp green guava with sweet pink pulp.', category: categories[1]._id, pricePerUnit: 30.00, unit: 'kg', stockQuantity: 90, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1536511157201-5222b3a985d7?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Sweet Red Watermelon (Tarbooz)', description: 'Cool and refreshing red watermelon.', category: categories[1]._id, pricePerUnit: 25.00, unit: 'piece', stockQuantity: 40, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Ripe Yellow Papaya (Papita)', description: 'Sweet papaya great for digestion.', category: categories[1]._id, pricePerUnit: 30.00, unit: 'kg', stockQuantity: 70, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Sweet Muskmelon (Kharbooja)', description: 'Aromatic sweet muskmelon.', category: categories[1]._id, pricePerUnit: 35.00, unit: 'kg', stockQuantity: 55, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Green Grapes (Angoor)', description: 'Seedless sweet green grapes.', category: categories[1]._id, pricePerUnit: 50.00, unit: 'kg', stockQuantity: 80, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Sweet Chikoo (Sapota)', description: 'Brown sweet chikoo with rich caramel flavor.', category: categories[1]._id, pricePerUnit: 40.00, unit: 'kg', stockQuantity: 65, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Sweet Lime (Mosambi)', description: 'Juicy citrus sweet lime for fresh juice.', category: categories[1]._id, pricePerUnit: 45.00, unit: 'kg', stockQuantity: 75, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'], status: 'available' },

      // === GRAINS & PULSES (7) ===
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Aromatic Basmati Rice (Chawal)', description: 'Aromatic long-grain organic Basmati rice naturally aged.', category: categories[2]._id, pricePerUnit: 55.00, unit: 'kg', stockQuantity: 300, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Organic Whole Wheat Flour (Atta)', description: 'Stone-ground whole wheat flour.', category: categories[2]._id, pricePerUnit: 32.00, unit: 'kg', stockQuantity: 250, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Yellow Toor Dal (Arhar Dal)', description: 'Protein-rich polished yellow lentils.', category: categories[2]._id, pricePerUnit: 85.00, unit: 'kg', stockQuantity: 180, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1612257416648-b9c37e59b7e9?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Organic Chana Dal (Bengal Gram)', description: 'High protein split Bengal gram pulses.', category: categories[2]._id, pricePerUnit: 70.00, unit: 'kg', stockQuantity: 160, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1603048297172-c92544798d5b?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Green Moong Dal Whole', description: 'Organic green gram pulses.', category: categories[2]._id, pricePerUnit: 75.00, unit: 'kg', stockQuantity: 140, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Organic Rajma (Red Kidney Beans)', description: 'Premium Jammu organic red kidney beans.', category: categories[2]._id, pricePerUnit: 90.00, unit: 'kg', stockQuantity: 120, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Kabuli Chana (White Chickpeas)', description: 'Large white chickpeas, perfect for Chole.', category: categories[2]._id, pricePerUnit: 85.00, unit: 'kg', stockQuantity: 130, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80'], status: 'available' },

      // === DAIRY & FARM EGGS (6) ===
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Pure Dairy Cow Milk (Doodh)', description: 'Fresh pure organic whole milk delivered daily.', category: categories[3]._id, pricePerUnit: 30.00, unit: 'litre', stockQuantity: 100, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Farm Paneer (Cottage Cheese)', description: 'Soft artisanal fresh farm paneer.', category: categories[3]._id, pricePerUnit: 80.00, unit: 'box', stockQuantity: 50, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Pure Country Cow Ghee (Shuddh Ghee)', description: 'Traditional bilona method pure cow ghee.', category: categories[3]._id, pricePerUnit: 250.00, unit: 'piece', stockQuantity: 40, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Farm Thick Curd (Dahi)', description: 'Natural thick clay-pot curd.', category: categories[3]._id, pricePerUnit: 35.00, unit: 'piece', stockQuantity: 60, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Free-Range Country Hen Eggs (Ande)', description: 'Organic free-range brown eggs.', category: categories[3]._id, pricePerUnit: 60.00, unit: 'dozen', stockQuantity: 80, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Butter Milk (Chaach)', description: 'Refreshing spiced farm buttermilk.', category: categories[3]._id, pricePerUnit: 20.00, unit: 'litre', stockQuantity: 90, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'], status: 'available' },

      // === HERBS & SPICES (4) ===
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Organic Palak (Spinach)', description: 'Crisp green spinach washed in natural farm water.', category: categories[4]._id, pricePerUnit: 12.00, unit: 'piece', stockQuantity: 100, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Green Coriander (Hara Dhaniya)', description: 'Aromatic green coriander leaves.', category: categories[4]._id, pricePerUnit: 10.00, unit: 'piece', stockQuantity: 150, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1588879460418-7247754f9408?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Fresh Aromatic Mint Leaves (Pudina)', description: 'Fragrant mint leaves harvested daily.', category: categories[4]._id, pricePerUnit: 10.00, unit: 'piece', stockQuantity: 120, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Spicy Fresh Green Chillies (Hari Mirch)', description: 'Fiery green chillies direct from farm.', category: categories[4]._id, pricePerUnit: 15.00, unit: 'gram', stockQuantity: 100, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80'], status: 'available' },

      // === NATURAL HONEY & OILS (2) ===
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Wild Forest Raw Honey (Madhu)', description: 'Unfiltered raw wildflower honey collected directly from farm apiaries.', category: categories[5]._id, pricePerUnit: 120.00, unit: 'piece', stockQuantity: 40, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1471943038886-b9a3f02dde73?auto=format&fit=crop&w=800&q=80'], status: 'available' },
      { farmer: farmer1._id, farm: farmProfile1._id, title: 'Cold Pressed Mustard Oil (Sarson Tel)', description: 'Pure unrefined cold-pressed mustard oil.', category: categories[5]._id, pricePerUnit: 110.00, unit: 'litre', stockQuantity: 80, harvestDate: new Date(), isOrganic: true, images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'], status: 'available' }
    ]);

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (err) {
    console.error('Database Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
