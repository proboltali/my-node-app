require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const { MongoClient, ObjectId } = require('mongodb');

const app = new Koa();
const router = new Router();
const client = new MongoClient(process.env.MONGO_URI);

app.use(async (ctx, next) => {
  ctx.set('X-Group', '477');
  await next();
});

app.use(async (ctx, next) => {
  try {
    if (ctx.method === 'POST' || ctx.method === 'PUT') {
      let body = '';
      await new Promise((resolve, reject) => {
        ctx.req.on('data', chunk => body += chunk);
        ctx.req.on('end', resolve);
        ctx.req.on('error', reject);
      });
      ctx.request.body = body ? JSON.parse(body) : {};
    }
    await next();
  } catch (err) {
    if (err instanceof SyntaxError) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid JSON' };
    } else {
      ctx.status = err.status || 500;
      ctx.body = { error: err.message || 'Internal Server Error' };
    }
  }
});

let db;
let usersCol;

(async () => {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  usersCol = db.collection('users_477');
  await usersCol.deleteMany({}); 
  
  const bulk = [];
  for (let i = 1; i <= 20; i++) {
    bulk.push({ name: `User ${i}`, email: `user${i}@mail.ru`, group_name: '477', age: 18 + (i % 5), course: (i % 4) + 1 });
  }
  await usersCol.insertMany(bulk);
  console.log('[INFO] MongoDB подключена, тестовые данные добавлены');
})();

// --- ЗАДАНИЕ 1: CRUD ---
router.get('/api/users', async (ctx) => {
  const users = await usersCol.find({}).toArray();
  ctx.body = { data: users };
});

// --- ЗАДАНИЕ 3: Поиск, Пагинация (должны быть ДО :id) ---
router.get('/api/users-search', async (ctx) => {
  const { page = 1, limit = 10, sort = 'name', group_name, course, age_min, age_max, search } = ctx.query;
  
  let query = {};
  if (group_name) query.group_name = group_name;
  if (course) query.course = Number(course);
  if (age_min || age_max) {
    query.age = {};
    if (age_min) query.age.$gte = Number(age_min);
    if (age_max) query.age.$lte = Number(age_max);
  }
  if (search) query.name = { $regex: search, $options: 'i' };

  let sortObj = {};
  if (sort.startsWith('-')) sortObj[sort.slice(1)] = -1;
  else sortObj[sort] = 1;

  const p = Number(page);
  const l = Math.min(Number(limit), 100);

  const total = await usersCol.countDocuments(query);
  const pages = Math.ceil(total / l);

  const users = await usersCol.find(query)
    .sort(sortObj)
    .skip((p - 1) * l)
    .limit(l)
    .toArray();

  ctx.body = {
    data: users,
    pagination: { total, page: p, limit: l, pages }
  };
});

// --- ЗАДАНИЕ 3: Статистика (должна быть ДО :id) ---
router.get('/api/users/stats', async (ctx) => {
  const stats = await usersCol.aggregate([
    { $group: { _id: '$group_name', count: { $sum: 1 }, avgAge: { $avg: '$age' } } }
  ]).toArray();
  ctx.body = { data: stats };
});

// --- ЗАДАНИЕ 1: CRUD по ID (должен быть в самом конце) ---
router.get('/api/users/:id', async (ctx) => {
  if (!ObjectId.isValid(ctx.params.id)) { ctx.status = 400; return ctx.body = { error: 'Invalid ID' }; }
  const user = await usersCol.findOne({ _id: new ObjectId(ctx.params.id) });
  if (!user) { ctx.status = 404; return ctx.body = { error: 'User not found', status: 404 }; }
  ctx.body = { data: user };
});

router.post('/api/users', async (ctx) => {
  const { name, email, group_name, age } = ctx.request.body;
  if (!name || !email || !group_name) { ctx.status = 400; return ctx.body = { error: 'Validation failed', details: 'Missing fields' }; }
  const newUser = { name, email, group_name, age };
  const res = await usersCol.insertOne(newUser);
  ctx.status = 201;
  ctx.body = { data: { _id: res.insertedId, ...newUser } };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log(`[INFO] Koa-сервер на порту ${process.env.PORT}`);
  console.log(`[INFO] Группа: 477`);
});