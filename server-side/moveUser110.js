const { MongoClient } = require('mongodb');

// رابط الاتصال بـ MongoDB
const uri = "mongodb+srv://mariem:mariem2002@cluster0.qgg7s.mongodb.net/?retryWrites=true&w=majority";

async function moveUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const sourceDb = client.db('dokan_dashboard'); // قاعدة البيانات المصدر
    const targetDb = client.db('test'); // قاعدة البيانات الهدف

    // التحقق من وجود مجموعة 'users' في قاعدة البيانات المصدر
    const sourceCollection = sourceDb.collection('users');
    const targetCollection = targetDb.collection('users');

    // جلب جميع المستخدمين من مجموعة 'users' في قاعدة بيانات dokan_dashboard
    const users = await sourceCollection.find().toArray();

    if (users.length === 0) {
      console.log("❌ No users found in dokan_dashboard.users");
      return;
    }

    console.log("✅ Found users to transfer, starting transfer...");

    // إزالة مفتاح _id من كل مستخدم ليتم توليد _id جديد عند الإدخال في مجموعة 'users' في قاعدة بيانات test
    const usersWithoutId = users.map(user => {
      const { _id, ...userWithoutId } = user; // إزالة _id
      return userWithoutId;
    });

    // تنفيذ عملية upsert بدلاً من insert
    const upsertPromises = usersWithoutId.map(user => {
      return targetCollection.updateOne(
        { email: user.email }, // تحقق من وجود البريد الإلكتروني
        { $set: user }, // إذا كان موجودًا يتم التحديث
        { upsert: true } // إذا لم يكن موجودًا يتم إضافته
      );
    });

    // تنفيذ جميع عمليات upsert
    await Promise.all(upsertPromises);
    console.log(`✅ ${users.length} users upserted to test.users`);

    // حذف جميع المستخدمين من مجموعة 'users' في قاعدة بيانات dokan_dashboard
    await sourceCollection.deleteMany({});
    console.log("🗑️ All users removed from dokan_dashboard.users");

  } catch (error) {
    console.error("🔥 Error during transfer:", error);
  } finally {
    await client.close();
  }
}

moveUsers();
