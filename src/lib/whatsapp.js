export function waCheckoutUrl({ phone, productName, size, qty, total, note }) {
  const cleanPhone = String(phone || '628123456789').replace(/[^0-9]/g, '');
  const text = `Halo Konveksi Nusa,\n\nSaya ingin memesan:\n- Produk: ${productName}\n- Ukuran: ${size || 'All Size'}\n- Jumlah: ${qty} Pcs\n- Total Estimasi: Rp ${Number(total).toLocaleString('id-ID')}\n- Catatan: ${note || '-'}\n\nMohon konfirmasi ketersediaan slot produksi. Terima kasih.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
