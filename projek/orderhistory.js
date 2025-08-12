// Fungsi untuk generate order ID acak
function generateOrderId() {
  return 'LM-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
}

// Fungsi untuk format tanggal
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Fungsi untuk menyimpan order ke localStorage
function saveOrder(order) {
  let orders = JSON.parse(localStorage.getItem('userOrders')) || [];
  orders.unshift(order); // Tambahkan order baru di awal array
  localStorage.setItem('userOrders', JSON.stringify(orders));
}

// Fungsi untuk menampilkan order history
function displayOrderHistory() {
  const orderHistoryContainer = document.getElementById('orderHistoryContainer');
  const emptyOrderMessage = document.getElementById('emptyOrderMessage');
  const orders = JSON.parse(localStorage.getItem('userOrders')) || [];

  if (orders.length === 0) {
    emptyOrderMessage.style.display = 'block';
    return;
  }

  emptyOrderMessage.style.display = 'none';

  orders.forEach(order => {
    const orderElement = document.createElement('div');
    orderElement.className = 'border-b border-gray-200 p-6';
    orderElement.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900">Order #${order.id}</h3>
          <p class="text-sm text-gray-500">Placed on ${formatDate(order.date)}</p>
        </div>
        <span class="px-3 py-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs font-medium rounded-full">
          ${order.status}
        </span>
      </div>
      
      <div class="space-y-4 mb-4">
        ${order.items.map(item => `
          <div class="flex items-center space-x-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded object-cover" />
            <div>
              <h4 class="text-md font-medium text-gray-900">${item.name}</h4>
              <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
              <p class="text-sm text-gray-600">$${item.price.toFixed(2)}/each</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="flex justify-between items-center pt-4 border-t border-gray-100">
        <div>
          <p class="text-sm text-gray-600">Total: <span class="font-medium text-gray-900">$${order.total.toFixed(2)}</span></p>
        </div>
        <div class="space-x-2">
          <button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            View Details
          </button>
          <button class="px-4 py-2 bg-yellow-400 rounded-md text-sm font-medium text-gray-900 hover:bg-yellow-500">
            ${order.status === 'Delivered' ? 'Reorder' : 'Track Order'}
          </button>
        </div>
      </div>
    `;
    orderHistoryContainer.insertBefore(orderElement, emptyOrderMessage);
  });
}

// Panggil fungsi displayOrderHistory saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayOrderHistory);