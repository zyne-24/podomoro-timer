import PocketBase from 'pocketbase';
import { config } from 'dotenv';

config();

const PB_URL = process.env.PUBLIC_PB_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const ADMIN_PASS = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASS) {
  console.error('Set PB_ADMIN_EMAIL dan PB_ADMIN_PASSWORD di .env dulu.');
  process.exit(1);
}

const pb = new PocketBase(PB_URL);

async function auth() {
  // v0.40: superuser auth (bukan pb.admins.*)
  await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  console.log('✓ Auth superuser berhasil');
}

async function createCollectionIfMissing(def) {
  try {
    await pb.collections.getOne(def.name);
    console.log(`  = Collection '${def.name}' sudah ada, skip.`);
  } catch (e) {
    await pb.collections.create(def);
    console.log(`  + Collection '${def.name}' dibuat.`);
  }
}

async function main() {
  await auth();

  // Buat 'categories' dulu supaya relasi 'products.category' punya collectionId nyata
  await createCollectionIfMissing({
    name: 'categories',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'slug', type: 'text', required: true },
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });

  const categories = await pb.collections.getOne('categories');

  await createCollectionIfMissing({
    name: 'products',
    type: 'base',
    schema: [
      { name: 'title', type: 'text', required: true },
      { name: 'category', type: 'relation', required: true, options: { collectionId: categories.id, cascadeDelete: false, maxSelect: 1 } },
      { name: 'price', type: 'number', required: true, options: { min: 0 } },
      { name: 'description', type: 'text' },
      { name: 'min_order', type: 'number', options: { min: 1 } },
      { name: 'image', type: 'file', options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] } },
      { name: 'sizes', type: 'json' },
      { name: 'is_active', type: 'bool' },
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });

  await createCollectionIfMissing({
    name: 'articles',
    type: 'base',
    schema: [
      { name: 'title', type: 'text', required: true },
      { name: 'content', type: 'editor' },
      { name: 'thumbnail', type: 'file', options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] } },
      { name: 'published_date', type: 'date' },
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });

  await createCollectionIfMissing({
    name: 'orders',
    type: 'base',
    schema: [
      { name: 'customer_name', type: 'text', required: true },
      { name: 'product', type: 'relation', options: { collectionId: (await pb.collections.getOne('products')).id, cascadeDelete: false, maxSelect: 1 } },
      { name: 'qty', type: 'number', required: true, options: { min: 1 } },
      { name: 'size', type: 'text' },
      { name: 'total', type: 'number' },
      { name: 'status', type: 'select', options: { values: ['pending', 'confirmed', 'produced', 'shipped', 'done', 'cancelled'], maxSelect: 1 } },
      { name: 'note', type: 'text' },
    ],
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: null,
    deleteRule: null,
  });

  console.log('\n✓ Setup collection selesai.');
}

main().catch((e) => {
  console.error('Gagal setup:', e.message);
  process.exit(1);
});
