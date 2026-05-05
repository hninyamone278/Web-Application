require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Product } = require('./models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tables created');

    // Categories
    const [rings, necklaces, bracelets, earrings] = await Category.bulkCreate([
      { name: 'Rings' },
      { name: 'Necklaces' },
      { name: 'Bracelets' },
      { name: 'Earrings' },
    ]);
    console.log('Categories seeded');

    // Admin user
    await User.create({
      name: 'Admin',
      email: 'admin@jewellery.com',
      password_hash: await bcrypt.hash('admin123', 12),
      role: 'admin',
    });

    // Sample customer
    await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password_hash: await bcrypt.hash('password123', 12),
      role: 'customer',
    });
    console.log('Users seeded');

    // Products
    await Product.bulkCreate([
      {
        name: 'Gold Solitaire Ring',
        description: 'A classic 18k gold solitaire ring featuring a 0.5ct diamond. Perfect for engagements and special occasions.',
        price: 899.00, stock: 10, category_id: rings.id,
        image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      },
      {
        name: 'Rose Gold Band',
        description: 'Elegant rose gold band with a delicate twisted design. Available in sizes 5–9.',
        price: 299.00, stock: 15, category_id: rings.id,
        image_url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      },
      {
        name: 'Pearl Pendant Necklace',
        description: 'A stunning freshwater pearl pendant on a sterling silver chain. Timeless and elegant.',
        price: 149.00, stock: 20, category_id: necklaces.id,
        image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      },
      {
        name: 'Diamond Tennis Necklace',
        description: 'Luxurious white gold necklace set with 3ct of brilliant-cut diamonds. A showstopper for any event.',
        price: 2499.00, stock: 5, category_id: necklaces.id,
        image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      },
      {
        name: 'Gold Charm Bracelet',
        description: 'Delicate 14k gold chain bracelet with interchangeable charms. Personalise your style.',
        price: 199.00, stock: 12, category_id: bracelets.id,
        image_url: 'https://images.unsplash.com/photo-1573408301185-9519f94815fe?w=600',
      },
      {
        name: 'Silver Cuff Bracelet',
        description: 'Bold sterling silver open cuff with an engraved floral pattern. Adjustable fit.',
        price: 89.00, stock: 18, category_id: bracelets.id,
        image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
      },
      {
        name: 'Diamond Stud Earrings',
        description: 'Classic 1ct total weight diamond studs in 18k white gold setting. Secure push back clasps.',
        price: 749.00, stock: 8, category_id: earrings.id,
        image_url: 'https://images.unsplash.com/photo-1589207212797-cfd578c10f2f?w=600',
      },
      {
        name: 'Gold Drop Earrings',
        description: 'Sophisticated elongated gold drop earrings with a brushed finish. Lightweight and comfortable.',
        price: 179.00, stock: 14, category_id: earrings.id,
        image_url: 'https://images.unsplash.com/photo-1630700143697-63af2cf8d264?w=600',
      },
    ]);
    console.log('Products seeded');

    console.log('\n✔ Seed complete!');
    console.log('Admin login: admin@jewellery.com / admin123');
    console.log('Customer login: jane@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
