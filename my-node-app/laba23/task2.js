require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('students');

    await collection.deleteMany({});
    console.log('=== Коллекция students (группа 477) ===\n');

    console.log('--- INSERT ---');
    const res1 = await collection.insertOne({ name: 'Иван', group_name: '477', course: 2, grade: 4.5, created_at: new Date() });
    console.log(`✔ Вставлен: insertedId=${res1.insertedId}`);

    const res2 = await collection.insertMany([
      { name: 'Мария', group_name: '477', course: 2, grade: 3.8, created_at: new Date() },
      { name: 'Петр', group_name: '477', course: 3, grade: 4.2, created_at: new Date() }
    ]);
    console.log(`✔ Вставлено 3 документа: insertedIds=${Object.values(res2.insertedIds).join(', ')}\n`);

    console.log('--- SELECT ---');
    const all = await collection.find({}).toArray();
    console.log(`Все документы (${all.length}):`);
    all.forEach(d => console.log(`{ name: "${d.name}", group: "${d.group_name}", grade: ${d.grade} }`));

    const filtered = await collection.find({ group_name: '477' }).toArray();
    console.log(`\nС фильтром по группе (${filtered.length}):`);
    filtered.forEach(d => console.log(`{ name: "${d.name}", group: "${d.group_name}", grade: ${d.grade} }`));

    const projected = await collection.find({}, { projection: { name: 1, grade: 1, _id: 0 } }).toArray();
    console.log('\nС проекцией (только name, grade):');
    projected.forEach(d => console.log(`{ name: "${d.name}", grade: ${d.grade} }`));

    console.log('\n--- UPDATE ---');
    const upd1 = await collection.updateOne({ name: 'Иван' }, { $set: { grade: 4.8 } });
    console.log(`✔ updateOne: matchedCount=${upd1.matchedCount}, modifiedCount=${upd1.modifiedCount}`);

    const updMany = await collection.updateMany({ group_name: '477' }, { $inc: { course: 1 } });
    console.log(`✔ updateMany (group=477, $inc: course+1): matchedCount=${updMany.matchedCount}\n`);

    console.log('--- DELETE ---');
    const del1 = await collection.deleteOne({ name: 'Мария' });
    console.log(`✔ deleteOne: deletedCount=${del1.deletedCount}`);

    const delMany = await collection.deleteMany({ grade: { $lt: 3 } });
    console.log(`✔ deleteMany (grade < 3): deletedCount=${delMany.deletedCount}`);

  } catch (err) {
    console.error(`Ошибка: ${err.message}`);
  } finally {
    await client.close();
  }
}
main();