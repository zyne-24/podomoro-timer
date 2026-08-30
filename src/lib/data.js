import { getPb } from './pb';

const SEED = {
  categories: [
    { id: 'cat1', name: 'Kaos & Apparel', slug: 'kaos' },
    { id: 'cat2', name: 'Kemeja & PDH', slug: 'kemeja' },
    { id: 'cat3', name: 'Jaket & Hoodie', slug: 'jaket' }
  ],
  products: [
    {
      id: 'p1',
      title: 'Kaos Combed 30s Custom Sablon',
      category: 'cat1',
      price: 55000,
      description: 'Katun Combed 30s reaktif, super adem, sablon plastisol discharge tajam anti luntur. Minimal order 24 pcs.',
      min_order: 24,
      image: '',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'p2',
      title: 'Kemeja PDH Organisasi / Korsa',
      category: 'cat2',
      price: 98000,
      description: 'Bahan American Drill / Japan Drill tebal dan kokoh. Bordir komputer presisi di dada dan lengan. Minimal order 36 pcs.',
      min_order: 36,
      image: '',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'p3',
      title: 'Jaket Hoodie Fleece Premium',
      category: 'cat3',
      price: 135000,
      description: 'Katun Fleece tebal tidak berbulu saat dicuci. Nyaman untuk malam hari, organisasi kampus, atau komunitas motor. Minimal order 24 pcs.',
      min_order: 24,
      image: '',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
  ],
  articles: [
    {
      id: 'a1',
      title: 'Panduan Memilih Bahan Kaos untuk Event Kampus',
      content: 'Memilih bahan kaos untuk event tidak boleh sembarangan. Katun Combed 30s adalah standar emas karena keseimbangannya antara ketebalan dan kesejukan...',
      published_date: '2026-08-01',
      thumbnail: ''
    },
    {
      id: 'a2',
      title: 'Perbedaan American Drill vs Japan Drill untuk Kemeja PDH',
      content: 'Korsa atau kemeja PDH membutuhkan kain yang tahan lama. Mari kita bedah perbedaan kedua jenis kain andalan konveksi ini...',
      published_date: '2026-08-10',
      thumbnail: ''
    }
  ]
};

export async function fetchList(collection, opts = {}) {
  try {
    const records = await getPb().collection(collection).getList(1, 50, { sort: '-created', ...opts });
    return records.items;
  } catch (err) {
    return SEED[collection] || [];
  }
}

export async function fetchOne(collection, id) {
  try {
    return await getPb().collection(collection).getOne(id);
  } catch (err) {
    const list = SEED[collection] || [];
    return list.find(item => item.id === id) || null;
  }
}

export async function getProducts() {
  return fetchList('products');
}

export async function getArticles() {
  return fetchList('articles');
}
