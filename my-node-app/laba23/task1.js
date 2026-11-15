require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    console.log('=== Подключение к MongoDB ===');
    console.log('✔ Подключение установлено');

    const adminDb = client.db('admin');
    const buildInfo = await adminDb.command({ buildInfo: 1 });
    console.log(`Версия MongoDB: ${buildInfo.version}`);

    const db = client.db(process.env.DB_NAME);
    console.log(`База данных: ${process.env.DB_NAME}`);

    const dbs = await adminDb.command({ listDatabases: 1 });
    console.log('\n=== Информация о сервере ===');
    console.log('Список БД:');
    dbs.databases.forEach(d => console.log(`- ${d.name}`));

    const collections = await db.listCollections().toArray();
    console.log(`\nКоллекции в ${process.env.DB_NAME}:`);
    if (collections.length === 0) {
      console.log('(пусто – БД создана лениво)');
    } else {
      collections.forEach(c => console.log(`- ${c.name}`));
    }

    console.log('\n=== Heartbeat ===');
    console.log(`[HEARTBEAT] Успешно: ${new Date().toISOString()}`);
    console.log('✔ Соединение стабильно');

  } catch (err) {
    console.error(`✖ Ошибка подключения: ${err.message}`);
  } finally {
    await client.close();
    console.log('✔ Соединение закрыто');
  }
}
main();