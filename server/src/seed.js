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
      { name: 'Fresh Vegetables', slug: 'vegetables', description: 'Farm fresh pesticide-free Tamil Nadu regional vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
      { name: 'Seasonal Fruits', slug: 'fruits', description: 'Tree-ripened organic sweet Tamil Nadu fruits & coconuts', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80' },
      { name: 'Traditional Grains & Rice', slug: 'grains', description: 'Thanjavur Ponni Rice, Karuppu Kavuni & traditional pulses', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' },
      { name: 'Dairy & Country Eggs', slug: 'dairy', description: 'Fresh A2 cow milk, ghee & Chettinad country eggs', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=500&q=80' },
      { name: 'Organic Greens & Spices', slug: 'herbs', description: 'Erode Turmeric, fresh Keerai greens & Chettinad spices', image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=500&q=80' },
      { name: 'Cold Pressed Oils & Honey', slug: 'oils-honey', description: 'Pollachi coconut oil, sesame oil & Western Ghats wild honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80' }
    ]);

    console.log('Seeding Tamil Nadu Users (Customer, Farmers, Admin)...');
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@farmtotable.com',
      password: 'Password123!',
      role: 'admin',
      phone: '+91 98765 00001'
    });

    const farmer1 = await User.create({
      name: 'Muthusamy Gounder',
      email: 'farmer@greenacres.com',
      password: 'Password123!',
      role: 'farmer',
      phone: '+91 94432 10987',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    });

    const farmer2 = await User.create({
      name: 'Sundaram Ayya',
      email: 'sundaram@deltafarms.tn',
      password: 'Password123!',
      role: 'farmer',
      phone: '+91 94431 55443',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    });

    const customer1 = await User.create({
      name: 'Anand Kumar',
      email: 'customer@gmail.com',
      password: 'Password123!',
      role: 'customer',
      phone: '+91 98401 23456',
      addresses: [{ street: '12th Main Road, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600040', isDefault: true }]
    });

    const farmer3 = await User.create({
      name: 'Ramasamy Gounder',
      email: 'farmer3@konguhydro.tn',
      password: 'Password123!',
      role: 'farmer',
      phone: '+91 94421 88990',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    });

    console.log('Seeding Verified Tamil Nadu Farm Profiles with Real Farm Site Images...');
    const farmProfile1 = await FarmProfile.create({
      user: farmer1._id,
      farmName: 'Kongu Organic Agriculture Farm',
      story: '35-acre pesticide-free family farm located in Coimbatore/Pollachi belt, Tamil Nadu. We specialize in organic Chinna Vengayam (small onions), Madurai Country Tomatoes, Drumsticks, Pollachi Tender Coconuts, and cold-pressed coconut oil using traditional organic farming techniques.',
      location: { address: 'Pollachi Road, Kinathukadavu', city: 'Coimbatore', state: 'Tamil Nadu', zipCode: '641109' },
      farmSizeAcres: 35,
      verificationDocs: [{ docType: 'Tamil Nadu Organic Certification (TNOCD)', fileUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' }],
      verificationStatus: 'approved',
      ratingAverage: 4.9,
      ratingCount: 42,
      siteImages: [
        { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80', caption: 'Kongu Organic Vegetable Patch & Irrigation Canal', dateUploaded: new Date() },
        { url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=800&q=80', caption: 'Fresh Country Tomato Plants in Harvest Season', dateUploaded: new Date() },
        { url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80', caption: 'Organic Small Onion (Chinna Vengayam) Drying Yard', dateUploaded: new Date() }
      ]
    });

    const farmProfile2 = await FarmProfile.create({
      user: farmer2._id,
      farmName: 'Cauvery Delta Bio Farms',
      story: 'Heritage 50-acre bio farm along the fertile Cauvery basin in Thanjavur, Tamil Nadu. Known for cultivating traditional Ponni Rice, Karuppu Kavuni Black Rice, fresh Erode Turmeric, and organic country eggs.',
      location: { address: 'Papanasam Main Road', city: 'Thanjavur', state: 'Tamil Nadu', zipCode: '613001' },
      farmSizeAcres: 50,
      verificationDocs: [{ docType: 'TN FSSAI Bio Accreditation', fileUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' }],
      verificationStatus: 'approved',
      ratingAverage: 4.95,
      ratingCount: 56,
      siteImages: [
        { url: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80', caption: 'Golden Cauvery Paddy Field - Thanjavur', dateUploaded: new Date() },
        { url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80', caption: 'Organic Farm Poultry & Free-Range Country Hen Enclosure', dateUploaded: new Date() }
      ]
    });

    const farmProfile3 = await FarmProfile.create({
      user: farmer3._id,
      farmName: 'Kongu Hydroponics & Bio Farm',
      story: 'Advanced 12-acre hydroponics and organic microgreens unit based near Coimbatore, Tamil Nadu.',
      location: { address: '88 Pollachi Main Road', city: 'Coimbatore', state: 'Tamil Nadu', zipCode: '641001' },
      farmSizeAcres: 12,
      verificationDocs: [{ docType: 'Tamil Nadu Organic Certification (TNOCD)', fileUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' }],
      verificationStatus: 'pending',
      ratingAverage: 0,
      ratingCount: 0
    });

    console.log('Seeding Authentic Tamil Nadu Produce Listings...');
    await Product.insertMany([
      // === FRESH VEGETABLES (TAMIL NADU) ===
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Madurai Country Organic Tomatoes (மதுரை தக்காளி)',
        description: 'Juicy, rich sour-sweet country tomatoes harvested fresh from Madurai / Pollachi fields. 100% organic without chemicals.',
        category: categories[0]._id,
        pricePerUnit: 22.00,
        unit: 'kg',
        stockQuantity: 180,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Perambalur Small Onions / Chinna Vengayam (சின்ன வெங்காயம்)',
        description: 'Pungent, highly aromatic authentic Tamil Nadu small shallot onions (Chinna Vengayam), essential for Sambar and Rasam.',
        category: categories[0]._id,
        pricePerUnit: 45.00,
        unit: 'kg',
        stockQuantity: 220,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Theni Fresh Organic Murungakkai / Drumstick (முருங்கைக்காய்)',
        description: 'Tender long green drumsticks grown naturally in Theni & Dindigul region. Loaded with iron and natural fiber.',
        category: categories[0]._id,
        pricePerUnit: 38.00,
        unit: 'kg',
        stockQuantity: 120,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Tirunelveli Green Kathirikai / Brinjal (கத்திரிக்காய்)',
        description: 'Crisp, glossy green striped country eggplants perfect for Ennai Kathirikai Vathal and Kara Kuzhambu.',
        category: categories[0]._id,
        pricePerUnit: 28.00,
        unit: 'kg',
        stockQuantity: 140,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer2._id,
        farm: farmProfile2._id,
        title: 'Ooty Hillside Organic Carrots (ஊட்டி கேரட்)',
        description: 'Sweet, crunchy, deep orange carrots harvested straight from the cool Nilgiris hill terraces.',
        category: categories[0]._id,
        pricePerUnit: 40.00,
        unit: 'kg',
        stockQuantity: 160,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer2._id,
        farm: farmProfile2._id,
        title: 'Nilgiris Fresh Farm Potatoes (நீலகிரி உருளைக்கிழங்கு)',
        description: 'Smooth, golden mountain potatoes cultivated organically in high altitude Nilgiris soil.',
        category: categories[0]._id,
        pricePerUnit: 32.00,
        unit: 'kg',
        stockQuantity: 200,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Fresh Organic Vendakkai / Okra (வெண்டைக்காய்)',
        description: 'Tender young green ladies finger, crisp and pesticide-free, harvested daily morning.',
        category: categories[0]._id,
        pricePerUnit: 30.00,
        unit: 'kg',
        stockQuantity: 110,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Fresh Farm Vazhaipoo / Banana Flower (வாழைப்பூ)',
        description: 'Nutritious fresh organic banana flower, cleaned and packed direct from Tamil Nadu plantain groves.',
        category: categories[0]._id,
        pricePerUnit: 25.00,
        unit: 'piece',
        stockQuantity: 70,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Fresh Organic Surakai / Bottle Gourd (சுரைக்காய்)',
        description: 'Hydrating, sweet green organic bottle gourd, perfect for healthy juices and Poriyal.',
        category: categories[0]._id,
        pricePerUnit: 24.00,
        unit: 'piece',
        stockQuantity: 85,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Fresh Peerkangai / Ridge Gourd (பீர்க்கங்காய்)',
        description: 'Crisp green ridge gourd, rich in minerals and dietary fiber.',
        category: categories[0]._id,
        pricePerUnit: 30.00,
        unit: 'kg',
        stockQuantity: 90,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Organic Pavakkai / Bitter Gourd (பாகற்காய்)',
        description: 'Dark green firm bitter gourds, excellent for blood sugar management and traditional Vathal.',
        category: categories[0]._id,
        pricePerUnit: 35.00,
        unit: 'kg',
        stockQuantity: 75,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Dindigul Spicy Green Chillies (பச்சை மிளகாய்)',
        description: 'Fiery, fresh green chillies direct from Dindigul vegetable farms.',
        category: categories[0]._id,
        pricePerUnit: 30.00,
        unit: 'kg',
        stockQuantity: 100,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },

      // === SEASONAL FRUITS ===
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Salem Malgova & Alphonso Mangoes (சேலம் மாம்பழம்)',
        description: 'World-famous Salem organic Malgova mangoes, tree-ripened with irresistible natural sweetness.',
        category: categories[1]._id,
        pricePerUnit: 120.00,
        unit: 'kg',
        stockQuantity: 95,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Pollachi Fresh Tender Coconut (பொள்ளாச்சி இளநீர்)',
        description: 'Sweet, natural electrolyte-packed tender coconut with rich water content straight from Pollachi groves.',
        category: categories[1]._id,
        pricePerUnit: 35.00,
        unit: 'piece',
        stockQuantity: 250,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1525257831700-18389ad16575?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Kanyakumari Nendran Organic Bananas (நேந்திரன் பழம்)',
        description: 'Sweet golden Nendran bananas cultivated organically along Kanyakumari coastal belt.',
        category: categories[1]._id,
        pricePerUnit: 50.00,
        unit: 'dozen',
        stockQuantity: 130,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },

      // === TRADITIONAL GRAINS & RICE ===
      {
        farmer: farmer2._id,
        farm: farmProfile2._id,
        title: 'Thanjavur Deluxe Ponni Boiled Rice (தஞ்சாவூர் பொன்னி அரிசி)',
        description: 'Premium aged Thanjavur Cauvery delta Ponni rice, fluffy and nutritious for daily meals.',
        category: categories[2]._id,
        pricePerUnit: 62.00,
        unit: 'kg',
        stockQuantity: 400,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer2._id,
        farm: farmProfile2._id,
        title: 'Karuppu Kavuni Traditional Black Rice (கருப்பு கவுனி அரிசி)',
        description: 'Ancient royal Tamil Nadu heritage black rice, immensely rich in anthocyanin antioxidants and minerals.',
        category: categories[2]._id,
        pricePerUnit: 140.00,
        unit: 'kg',
        stockQuantity: 150,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1603048297172-c92544798d5b?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },

      // === DAIRY & EGGS ===
      {
        farmer: farmer2._id,
        farm: farmProfile2._id,
        title: 'Chettinad Country Free-Range Eggs (செட்டிநாடு நாட்டுக்கோழி முட்டை)',
        description: 'Natural free-range country hen eggs with rich golden yolk from Chettinad organic bio farm.',
        category: categories[3]._id,
        pricePerUnit: 90.00,
        unit: 'dozen',
        stockQuantity: 120,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },

      // === ORGANIC GREENS & SPICES ===
      {
        farmer: farmer2._id,
        farm: farmProfile2._id,
        title: 'Erode Pure Organic Turmeric Powder / Manjal (ஈரோடு மஞ்சள்)',
        description: 'High curcumin natural vibrant yellow turmeric cultivated in Erode district.',
        category: categories[4]._id,
        pricePerUnit: 110.00,
        unit: 'kg',
        stockQuantity: 180,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Fresh Manathakkali & Arai Keerai (மணத்தக்காளி கீரை)',
        description: 'Freshly plucked organic Tamil greens (Keerai), rich in iron and traditional healing properties.',
        category: categories[4]._id,
        pricePerUnit: 15.00,
        unit: 'piece',
        stockQuantity: 150,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },

      // === COLD PRESSED OILS & HONEY ===
      {
        farmer: farmer1._id,
        farm: farmProfile1._id,
        title: 'Pollachi Cold Pressed Wood-Chekku Coconut Oil (தேங்காய் எண்ணெய்)',
        description: '100% pure cold pressed unrefined coconut oil extracted from sundried Pollachi copra.',
        category: categories[5]._id,
        pricePerUnit: 210.00,
        unit: 'litre',
        stockQuantity: 100,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      },
      {
        farmer: farmer2._id,
        farm: farmProfile2._id,
        title: 'Western Ghats Palani Wild Forest Honey (இயற்கை தேன்)',
        description: 'Raw unpasteurized wild honey collected sustainably from deep mountain forests near Palani.',
        category: categories[5]._id,
        pricePerUnit: 180.00,
        unit: 'piece',
        stockQuantity: 80,
        harvestDate: new Date(),
        isOrganic: true,
        images: ['https://images.unsplash.com/photo-1471943038886-b9a3f02dde73?auto=format&fit=crop&w=800&q=80'],
        status: 'available'
      }
    ]);

    console.log('Tamil Nadu Database Seeding Completed Successfully! 🌾');
    process.exit(0);
  } catch (err) {
    console.error('Database Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
