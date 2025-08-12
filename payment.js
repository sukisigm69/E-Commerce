document.addEventListener("DOMContentLoaded", () => {
  const produkJSON = localStorage.getItem("produkDibeli");

  if (!produkJSON) {
    document.getElementById("error-message").classList.remove("hidden");
    document.getElementById("back-to-cart").classList.remove("hidden");
    return;
  }

  try {
    const data = JSON.parse(produkJSON);
    const produkList = Array.isArray(data) ? data : [data];
    const container = document.getElementById("produk-info");
    const summaryContainer = document.getElementById("order-summary");
    
    container.classList.remove("hidden");
    container.innerHTML = "";
    
    let subtotal = 0;
    let totalItems = 0;

    produkList.forEach((produk) => {
      subtotal += produk.price * produk.qty;
      totalItems += produk.qty;
      
      const item = document.createElement("div");
      item.className = "flex items-center gap-4 border p-4 mb-4 rounded";

      item.innerHTML = `
        <img src="${produk.image || 'https://via.placeholder.com/150'}" 
             class="w-24 h-24 object-contain"
             onerror="this.src='https://via.placeholder.com/150'">
        <div>
          <h2 class="font-bold text-lg">${produk.title || 'Unknown Product'}</h2>
          <p class="text-sm">Rp ${produk.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p class="text-sm">Jumlah: ${produk.qty} item</p>
          ${produk.size ? `<p class="text-sm">Size: ${produk.size}</p>` : ''}
          ${produk.color ? `<p class="text-sm">Color: ${produk.color}</p>` : ''}
        </div>
      `;

      container.appendChild(item);
    });

    // Update order summary
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    summaryContainer.innerHTML = `
      <div class="border-b pb-4 mb-4">
        <h3 class="font-bold text-lg">Order Summary</h3>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Items (${totalItems}):</span>
          <span>Rp ${subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between">
          <span>Tax:</span>
          <span>Rp ${tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Total:</span>
          <span>Rp ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Gagal memuat data produk:", err);
    document.getElementById("error-message").classList.remove("hidden");
    document.getElementById("back-to-cart").classList.remove("hidden");
  }
});

// Back to cart button
document.getElementById("back-to-cart").addEventListener("click", () => {
  window.location.href = "cart.html";
});