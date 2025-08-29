import { Receipt as ReceiptType } from '@/types/pos';

export const formatThermalReceipt = (receipt: ReceiptType, formatPrice: (price: number) => string): string => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return `
===============================
  TOKO ANJAR FOTOCOPY & ATK
===============================
Jl. Raya Gajah - dempet
(Depan Koramil Gajah)
Telp/WA: 0895630183347

===============================
       STRUK PENJUALAN
===============================
Invoice: ${receipt.id}
Tanggal: ${formatDate(receipt.timestamp)}
-------------------------------

${receipt.items.map(item => {
  const price = item.finalPrice || item.product.sellPrice;
  const total = price * item.quantity;
  const line1 = item.product.name;
  const line2 = `${item.quantity} x ${formatPrice(price)}`;
  const line3 = formatPrice(total).padStart(31);
  return `${line1}\n${line2}\n${line3}`;
}).join('\n\n')}

-------------------------------
Subtotal:${formatPrice(receipt.subtotal).padStart(20)}${receipt.discount > 0 ? `\nDiskon:${formatPrice(receipt.discount).padStart(22)}` : ''}
-------------------------------
TOTAL:${formatPrice(receipt.total).padStart(23)}

Metode: ${receipt.paymentMethod?.toUpperCase() || 'CASH'}
Profit: ${formatPrice(receipt.profit)}

===============================
    TERIMA KASIH ATAS
    KUNJUNGAN ANDA!
    
  Semoga Hari Anda Menyenangkan
===============================
`;
};

export const formatPrintReceipt = (receipt: ReceiptType, formatPrice: (price: number) => string): string => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return `
      <div style="font-family: monospace; max-width: 300px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>TOKO ANJAR FOTOCOPY & ATK</h2>
          <p>Jl. Raya Gajah - dempet (Depan Koramil Gajah)</p>
          <p>Telp/WA: 0895630183347</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h3>STRUK PENJUALAN</h3>
          <p>${receipt.id}</p>
          <p>${formatDate(receipt.timestamp)}</p>
        </div>
        
        <div style="border-top: 1px dashed #000; margin: 20px 0; padding-top: 10px;">
          ${receipt.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div>
                <div style="font-weight: bold;">${item.product.name}</div>
                <div style="font-size: 12px;">${formatPrice(item.finalPrice || item.product.sellPrice)} × ${item.quantity}</div>
              </div>
              <div style="font-weight: bold;">
                ${formatPrice((item.finalPrice || item.product.sellPrice) * item.quantity)}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="border-top: 1px dashed #000; margin: 20px 0; padding-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>${formatPrice(receipt.subtotal)}</span>
          </div>
          ${receipt.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #dc2626;">
              <span>Diskon:</span>
              <span>-${formatPrice(receipt.discount)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px;">
            <span>TOTAL:</span>
            <span>${formatPrice(receipt.total)}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Semoga Hari Anda Menyenangkan</p>
          <p style="margin-top: 10px;">Kasir: Admin | ${receipt.paymentMethod?.toUpperCase() || 'CASH'}</p>
        </div>
      </div>
    `;
};