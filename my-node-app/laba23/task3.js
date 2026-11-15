require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('students');

    await collection.deleteMany({});
    
    console.log('=== Курсоры ===');
    const bulk = [];
    for (let i = 1; i <= 100; i++) {
      bulk.push({ name: `Студент ${i}`, group_name: '477', course: (i % 4) + 1, grade: 2 + (i % 4), created_at: new Date() });
    }
    await collection.insertMany(bulk);
    console.log('Вставлено 100 тестовых документов для демонстрации');

    const cursor = collection.find({}).batchSize(10);
    let count = 0;
    for await (const doc of cursor) {
      count++;
    }
    console.log(`Итерация через for await: Получено ${count} документов\n`);

    console.log('=== Агрегации ===');
    const avgByGroup = await collection.aggregate([
      { $group: { _id: '$group_name', avgGrade: { $avg: '$grade' } } }
    ]).toArray();
    console.log('Средний балл по группам:');
    avgByGroup.forEach(g => console.log(`${g._id}: ${g.avgGrade.toFixed(2)}`));

    const countByCourse = await collection.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } }
    ]).toArray();
    console.log('\nКоличество по курсам:');
    countByCourse.forEach(c => console.log(`${c._id} курс: ${c.count}`));

    console.log('\n=== Индексы ===');
    await collection.createIndex({ group_name: 1 });
    console.log('✔ Создан индекс: group_name_1');
    
    const explain = await collection.find({ group_name: '477' }).explain('executionStats');
    console.log(`explain() с индексом: executionTimeMillis: ${explain.executionStats.executionTimeMillis}`);
    console.log(`totalDocsExamined: ${explain.executionStats.totalDocsExamined}`);

    console.log('\n=== Текстовый поиск ===');
    await collection.createIndex({ name: 'text' });
    console.log('Создан текстовый индекс: name_text');
    
    const searchRes = await collection.find({ $text: { $search: 'Студент 5' } }).toArray();
    console.log(`find({ $text: { $search: "Студент 5" } }):`);
    console.log(`Найдено: ${searchRes.length} документов`);

  } catch (err) {
    console.error(`Ошибка: ${err.message}`);
  } finally {
    await client.close();
  }
}
main();