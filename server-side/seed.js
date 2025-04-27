// require("dotenv").config();
// const mongoose = require("mongoose");
// const connectDB = require("./src/config/db");
// const User = require("./src/models/user.model");
// const Product = require("./src/models/product.model");
// const Category = require("./src/models/category.model");
// const Cart = require("./src/models/cart.model");
// const Blog = require("./src/models/blog.model");
// const Order = require("./src/models/order.model");

// const seedData = async () => {
//   try {
//     await connectDB();
//     console.log("Seeding Database...");

//     // Clear existing data
//     await User.deleteMany();
//     await Product.deleteMany();
//     await Category.deleteMany();
//     await Cart.deleteMany();
//     await Blog.deleteMany();
//     await Order.deleteMany();

//     // ======================
//     // 1. Create Users
//     // ======================
//     const users = await User.insertMany([
//       {
//         username: "Haleem",
//         email: "Haleemo777@example.com",
//         password: "haleemo236!",
//         role: "ADMIN",
//         phone: "01126105400",
//       },
//       {
//         username: "Mohamed",
//         email: "Mohamed236236@gmail.com",
//         password: "hiiiii263!",
//         phone: "01126105400",
//       },
//     ]);

//     // ======================
//     // 2. Create Categories
//     // ======================
//     const categories = await Category.insertMany([
//       {
//         name: "beds",
//         description:
//           "Beds are essential furniture pieces designed for sleeping and resting.",
//         image:
//           "https://res.cloudinary.com/dddhappm3/image/upload/v1742566578/categories/beds/Streiko%20Bed/walnut/Streiko_Bed-6_fypo21.jpg",
//       },
//     ]);

//     // ======================
//     // 3. Create Products (All your original products with fixes)
//     // ======================
//     const products = await Product.insertMany([
//       {
//         name: "Streiko bed",
//         subtitle: "streiko bed is comfortable",
//         price: 1900.99,
//         sale: 15,
//         categories: [categories[0]._id],
//         description:
//           "The Streiko bed is a stylish and comfortable sleeping solution that combines modern design with functionality.",
//         brand: "IkEA",
//         colors: [
//           {
//             name: "walnut",
//             hex: "#8B4513",
//             sku: "STR-WAL-001",
//             images: [
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-7_x7f4fk",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744665757/Streiko_Bed-7_x7f4fk_fogokr.png",
//               },
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-6_fypo21",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667156/Streiko_Bed-6_fypo21_oqj7mq.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-8_jw5ewj",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667166/Streiko_Bed-8_jw5ewj_lbecmy.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-5_r88fyc",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667178/Streiko_Bed-5_r88fyc_imb5dx.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-4_ceyiib",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667276/Streiko_Bed-4_ceyiib_vfvxky.png",
//               },
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-1_g5kumg",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667326/Streiko_Bed-1_g5kumg_xi8fwg.png",
//               },
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-2_ryeui0",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667342/Streiko_Bed-2_ryeui0_i4uyzi.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/Streiko Bed/walnut/Streiko_Bed-3_kjgtza",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667348/Streiko_Bed-3_kjgtza_bs2izo.jpg",
//               },
//             ],
//             quantity: 9,
//           },
//         ],
//         additionalInformation: {
//           general: {
//             salesPackage: "bed",
//             modelNumber: "bed--123",
//             configuration: "Fixed sleep",
//             upholsteryMaterial: "Velvet",
//             upholsteryColor: "Black",
//           },
//           productDetails: {
//             fillingMaterial: "Foam",
//             finishType: "Matte",
//             adjustableHeadrest: false,
//             maximumLoadCapacity: 300,
//             originOfManufacture: "USA",
//           },
//           dimensions: {
//             width: 200,
//             height: 85,
//             depth: 90,
//             seatHeight: 45,
//             legHeight: 10,
//           },
//           warranty: {
//             summary: "1 Year Warranty",
//             serviceType: "Onsite Service",
//             covered: "Manufacturing Defects",
//             notCovered: "Physical Damage",
//             domesticWarranty: "Yes",
//           },
//         },
//       },
//       {
//         name: "Slattum",
//         subtitle: "slattum bed is comfortable bed",
//         price: 1450.99,
//         sale: 7.5,
//         categories: [categories[0]._id],
//         description:
//           "The Slattum bed is a stylish and comfortable sleeping solution that combines modern design with functionality.",
//         brand: "IkEA",
//         colors: [
//           {
//             name: "Dark Gray",
//             hex: "#A9A9A9",
//             sku: "SLT-DGR-001",
//             images: [
//               {
//                 public_id: "categories/beds/slattum/dark gray/slattum-5_yphje9",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667563/slattum-1_gyiggf_oflrbq.jpg",
//               },
//               {
//                 public_id: "categories/beds/slattum/dark gray/slattum-1_gyiggf",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667563/slattum-1_gyiggf_oflrbq.jpg",
//               },
//               {
//                 public_id: "categories/beds/slattum/dark gray/slattum-2_m1tsg5",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667595/slattum-2_m1tsg5_atjrts.jpg",
//               },
//               {
//                 public_id: "categories/beds/slattum/dark gray/slattum-6_azojr6",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667624/slattum-6_azojr6_gilov5.jpg",
//               },
//               {
//                 public_id: "categories/beds/slattum/dark gray/slattum-4_jcunut",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667629/slattum-4_jcunut_nxauja.jpg",
//               },
//             ],
//             quantity: 3,
//           },
//           {
//             name: "Light Blue",
//             hex: "#ADD8E6",
//             sku: "SLT-LBL-002",
//             images: [
//               {
//                 public_id:
//                   "categories/beds/slattum/light blue/slattum-5_ekky4m",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667688/slattum-5_ekky4m_p4wdov.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/slattum/light blue/slattum-6_dqcpkw",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667725/slattum-6_dqcpkw_ldwhst.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/slattum/light blue/slattum-2_bdlret",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667734/slattum-2_bdlret_zqf8dv.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/slattum/light blue/slattum-3_pzovdz",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667784/slattum-3_pzovdz_riw69q.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/slattum/light blue/slattum-4_juxrob",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667831/slattum-4_juxrob_doigla.jpg",
//               },
//               {
//                 public_id:
//                   "categories/beds/slattum/light blue/slattum-1_kd8wy5",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667898/slattum-1_kd8wy5_uzcma8.jpg",
//               },
//             ],
//             quantity: 11,
//           },
//         ],
//         additionalInformation: {
//           general: {
//             salesPackage: "Bed",
//             modelNumber: "confo-bed--135",
//             configuration: "Fixed",
//             upholsteryMaterial: "Velvet",
//             upholsteryColor: "Black",
//           },
//           productDetails: {
//             fillingMaterial: "Foam",
//             finishType: "Matte",
//             adjustableHeadrest: false,
//             maximumLoadCapacity: 300,
//             originOfManufacture: "USA",
//           },
//           dimensions: {
//             width: 200,
//             height: 85,
//             depth: 90,
//             seatHeight: 45,
//             legHeight: 10,
//           },
//           warranty: {
//             summary: "1 Year Warranty",
//             serviceType: "Onsite Service",
//             covered: "Manufacturing Defects",
//             notCovered: "Physical Damage",
//             domesticWarranty: "Yes",
//           },
//         },
//       },
//       {
//         name: "Tarva",
//         subtitle: "tarva bed is a stylish and comfortable bed",
//         price: 1600.99,
//         sale: 14,
//         categories: [categories[0]._id],
//         description:
//           "The Tarva bed is a stylish and comfortable sleeping solution that combines modern design with functionality.",
//         brand: "IkEA",
//         colors: [
//           {
//             name: "Pine",
//             hex: "#DEB887",
//             sku: "TRV-PIN-001",
//             images: [
//               {
//                 public_id: "categories/beds/tarva/pine/tarva-5_mtkd9x",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667961/tarva-5_mtkd9x_xs2rhv.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/pine/tarva-4_pbjhos",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744667961/tarva-4_pbjhos_swwtv3.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/pine/tarva-3_pb6q5h",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668064/tarva-3_pb6q5h_upuwsh.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/pine/tarva-6_pnnqky",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668114/tarva-6_pnnqky_ozelur.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/pine/tarva-1_mdx7j4",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668073/tarva-1_mdx7j4_qqjtt3.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/pine/tarva-2_xpaeqy",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668297/tarva-2_xpaeqy_pe9buq.jpg",
//               },
//             ],
//             quantity: 11,
//           },
//           {
//             name: "White Stained",
//             hex: "#F5F5F5",
//             sku: "TRV-WST-002",
//             images: [
//               {
//                 public_id: "categories/beds/tarva/white stained/tarva-2_icpu7d",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668448/tarva-2_icpu7d_pt7sjv.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/white stained/tarva-3_bd0tyk",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668458/tarva-3_bd0tyk_y2avlc.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/white stained/tarva-5_ifcu3z",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668469/tarva-5_ifcu3z_sch7fc.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/white stained/tarva-4_amgcvj",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668476/tarva-4_amgcvj_s9krnu.jpg",
//               },
//               {
//                 public_id: "categories/beds/tarva/white stained/tarva-1_yj1z3d",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744711895/tarva-1_yj1z3d_unsrnc.jpg",
//               },
//             ],
//             quantity: 9,
//           },
//         ],
//         additionalInformation: {
//           general: {
//             salesPackage: "bed",
//             modelNumber: "bedd-135",
//             configuration: "Fixed Seat",
//             upholsteryMaterial: "Velvet",
//             upholsteryColor: "Black",
//           },
//           productDetails: {
//             fillingMaterial: "Foam",
//             finishType: "Matte",
//             adjustableHeadrest: false,
//             maximumLoadCapacity: 300,
//             originOfManufacture: "USA",
//           },
//           dimensions: {
//             width: 200,
//             height: 85,
//             depth: 90,
//             seatHeight: 45,
//             legHeight: 10,
//           },
//           warranty: {
//             summary: "1 Year Warranty",
//             serviceType: "Onsite Service",
//             covered: "Manufacturing Defects",
//             notCovered: "Physical Damage",
//             domesticWarranty: "Yes",
//           },
//         },
//       },
//       {
//         name: "Valt Bed",
//         subtitle: "valt bed is a stylish and comfortable bed",
//         price: 999.99,
//         sale: 11.5,
//         categories: [categories[0]._id],
//         description:
//           "The Valt bed is a stylish and comfortable sleeping solution that combines modern design with functionality.",
//         brand: "IkEA",
//         colors: [
//           {
//             name: "Oak",
//             hex: "#FFD700",
//             sku: "VLT-OAK-001",
//             images: [
//               {
//                 public_id: "categories/beds/Valt Bed/oak/Valt_Bed-5_bmtn6t",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668546/Valt_Bed-5_bmtn6t_nrx2p5.jpg",
//               },
//               {
//                 public_id: "categories/beds/Valt Bed/oak/Valt_Bed-7_bultft",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668556/Valt_Bed-7_bultft_z6mm9v.jpg",
//               },
//               {
//                 public_id: "categories/beds/Valt Bed/oak/Valt_Bed-6_jd0ta3",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668567/Valt_Bed-6_jd0ta3_refylw.png",
//               },
//               {
//                 public_id: "categories/beds/Valt Bed/oak/Valt_Bed-1_fcssyg",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668579/Valt_Bed-1_fcssyg_b6oavu.jpg",
//               },
//               {
//                 public_id: "categories/beds/Valt Bed/oak/Valt_Bed-4_ohgfkr",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668590/Valt_Bed-4_ohgfkr_kjejjb.png",
//               },
//               {
//                 public_id: "categories/beds/Valt Bed/oak/Valt_Bed-3_woi4xn",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744668596/Valt_Bed-3_woi4xn_ytwsj7.jpg",
//               },
//               {
//                 public_id: "categories/beds/Valt Bed/oak/Valt_Bed-2_j3dm78",
//                 url: "https://res.cloudinary.com/dzj7opitz/image/upload/v1744712035/Valt_Bed-2_j3dm78_bjvhbm.jpg",
//               },
//             ],
//             quantity: 19,
//           },
//         ],
//         additionalInformation: {
//           general: {
//             salesPackage: "bed",
//             modelNumber: "comfoo--135",
//             configuration: "Fixed Seat",
//             upholsteryMaterial: "Velvet",
//             upholsteryColor: "Black",
//           },
//           productDetails: {
//             fillingMaterial: "Foam",
//             finishType: "Matte",
//             adjustableHeadrest: false,
//             maximumLoadCapacity: 300,
//             originOfManufacture: "USA",
//           },
//           dimensions: {
//             width: 200,
//             height: 85,
//             depth: 90,
//             seatHeight: 45,
//             legHeight: 10,
//           },
//           warranty: {
//             summary: "1 Year Warranty",
//             serviceType: "Onsite Service",
//             covered: "Manufacturing Defects",
//             notCovered: "Physical Damage",
//             domesticWarranty: "Yes",
//           },
//         },
//       },
//     ]);

//     // ======================
//     // 4. Create Carts
//     // ======================
//     const carts = await Cart.insertMany([
//       {
//         userId: users[1]._id,
//         products: [
//           {
//             id: products[0]._id,
//             color: products[0].colors[0].name,
//             quantity: 2,
//           },
//           {
//             id: products[1]._id,
//             color: products[1].colors[1].name,
//             quantity: 1,
//           },
//         ],
//       },
//       {
//         userId: users[0]._id,
//         products: [
//           {
//             id: products[0]._id,
//             color: products[0].colors[0].name,
//             quantity: 2,
//           },
//           {
//             id: products[1]._id,
//             color: products[1].colors[0].name,
//             quantity: 4,
//           },
//         ],
//       },
//     ]);

//     // ======================
//     // 5. Create Orders
//     // ======================
//     // const orders = await Order.insertMany([
//     //   {
//     //     userId: users[1]._id,
//     //     orderItems: [
//     //       {
//     //         product: products[0]._id,
//     //         color: products[0].colors[0].name,
//     //         quantity: 1,
//     //         price: products[0].price * (1 - products[0].sale / 100),
//     //       },
//     //     ],
//     //     shippingAddress: {
//     //       street: "123 Main Street",
//     //       city: "New York",
//     //       province: "NY",
//     //       zipCode: "10001",
//     //       country: "USA",
//     //     },
//     //     paymentMethod: "Direct Bank Transfer",
//     //     itemsPrice: products[0].price * (1 - products[0].sale / 100),
//     //     taxPrice: 0,
//     //     shippingPrice: 0,
//     //     totalPrice: products[0].price * (1 - products[0].sale / 100),
//     //     status: "Delivered",
//     //     isPaid: true,
//     //     paidAt: new Date(),
//     //     transactionId: "TX123456789",
//     //   },
//     // ]);

//     // ======================
//     // 6. Create Blogs
//     // ======================
//     // const blogs = await Blog.insertMany([
//     //   {
//     //     title: "The Ultimate Guide to Choosing a Bed",
//     //     content: "Lorem ipsum dolor sit amet...",
//     //     author: users[0]._id,
//     //     image: "https://example.com/blog-image.jpg",
//     //     tags: ["beds", "furniture", "sleep"],
//     //   },
//     // ]);

//     // console.log("Database Seeding Completed ✅");
//     // console.log(`
//     //   Seeding Summary:
//     //   - Users: ${users.length}
//     //   - Categories: ${categories.length}
//     //   - Products: ${products.length}
//     //   - Carts: ${carts.length}
//     //   - Orders: ${orders.length}
//     //   - Blogs: ${blogs.length}
//     // `);

//     await mongoose.connection.close();
//     console.log("MongoDB Connection Closed 🔌");
//     process.exit(0);
//   } catch (error) {
//     console.error("Seeding Failed ❌", error);
//     await mongoose.connection.close();
//     process.exit(1);
//   }
// };

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/user.model");
const { faker } = require('@faker-js/faker');
const { ObjectId } = mongoose.Types;

// Country-specific data generators
const countryData = {
  SA: {
    country: "Saudi Arabia",
    mobilePrefix: "05",
    provinces: ["Riyadh", "Makkah", "Madinah", "Eastern Province", "Qassim", "Asir", "Tabuk", "Hail", "Northern Borders", "Jazan", "Najran", "Bahah", "Jawf"],
    cities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Taif", "Tabuk", "Abha"]
  },
  AE: {
    country: "United Arab Emirates",
    mobilePrefix: "05",
    provinces: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al-Quwain", "Ras Al Khaimah", "Fujairah"],
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah"]
  },
  EG: {
    country: "Egypt",
    mobilePrefix: "01",
    provinces: ["Cairo", "Alexandria", "Giza", "Sharqia", "Dakahlia", "Beheira", "Monufia", "Qalyubia", "Gharbia"],
    cities: ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said", "Suez", "Luxor", "Mansoura", "Tanta"]
  }
};

// Generate realistic customers from GCC countries
const generateGCCCustomers = (count = 30) => {
  const customers = [];
  
  for (let i = 0; i < count; i++) {
    const countryCode = faker.helpers.arrayElement(["SA", "AE", "EG"]);
    const countryInfo = countryData[countryCode];
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const mobile = `${countryInfo.mobilePrefix}${faker.number.int({ min: 10000000, max: 99999999 })}`;
    
    customers.push({
      firstName,
      lastName,
      email,
      mobile,
      password: `Customer${i+1}@123`, // Strong password
      role: "user",
      status: "approved",
      joinDate: faker.date.past({ years: 2 }),
      isBlocked: false,
      verification: {
        emailVerified: faker.datatype.boolean(),
        phoneVerified: faker.datatype.boolean(),
        identityVerified: false
      },
      communicationPreferences: {
        email: true,
        sms: faker.datatype.boolean(),
        whatsapp: faker.datatype.boolean(),
        pushNotifications: true
      },
      addresses: [{
        country: countryInfo.country,
        province: { 
          id: faker.number.int({ min: 1, max: 20 }).toString(),
          name: faker.helpers.arrayElement(countryInfo.provinces)
        },
        city: {
          id: faker.number.int({ min: 1, max: 50 }).toString(),
          provinceId: faker.number.int({ min: 1, max: 20 }).toString(),
          name: faker.helpers.arrayElement(countryInfo.cities)
        },
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        isDefault: true
      }],
      ordersCount: faker.number.int({ min: 0, max: 50 }),
      totalSpent: faker.number.int({ min: 0, max: 10000 }),
      lastOrderDate: faker.date.recent(),
      lastSiteVisit: faker.date.recent(),
      isSubscribedToNewsletter: faker.datatype.boolean(),
      customerTier: calculateCustomerTier(faker.number.int({ min: 0, max: 10000 }))
    });
  }
  
  return customers;
};

// Calculate customer tier based on total spending
const calculateCustomerTier = (totalSpent) => {
  if (totalSpent >= 5000) return "platinum";
  if (totalSpent >= 2000) return "gold";
  if (totalSpent >= 500) return "silver";
  return "basic";
};

// Main seeding function
const seedCustomers = async () => {
  try {
    await connectDB();
    console.log("🚀 Generating fake customers...");

    await User.deleteMany({ role: "user" });
    console.log("🧹 Cleared existing customers");

    const customers = generateGCCCustomers(50);
    await User.insertMany(customers);

    console.log(`✅ Successfully created ${customers.length} customers`);
    console.log("Sample customer:", customers[0]);

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
seedCustomers();
