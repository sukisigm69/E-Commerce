async function fetchProductData() {
  try {
    const response = await fetch('http://localhost:8010/proxy');
    const data = await response.json();
    console.log(data);
    
    const product = [
      {
        product: data[0],
        image: "gmbr-1",
        name: "Product-1",
        price: "hargabarang-1",
        color: "warna-1",
      },
      {
        product: data[1],
        image: "gmbr-2",
        name: "Product-2",
        price: "hargabarang-2",
        color: "warna-2",
      },
      {
        product: data[2],
        image: "gmbr-3",
        name: "Product-3",
        price: "hargabarang-3",
        color: "warna-3",
      },
      {
        product: data[3],
        image: "gmbr-4",
        name: "Product-4",
        price: "hargabarang-4",
        color: "warna-4",
      },
      {
        product: data[4],
        image: "gmbr-5",
        name: "Product-5",
        price: "hargabarang-5",
        color: "warna-5",
      }
    ];

    product.forEach(display => {
      if (document.getElementById(display.image)) {
        document.getElementById(display.image).src = display.product.image;
      }
      if (document.getElementById(display.name)) {
        document.getElementById(display.name).textContent = display.product.name;
      }
      if (document.getElementById(display.price)) {
        document.getElementById(display.price).textContent = display.product.price;
      }
      if (document.getElementById(display.color)) {
        document.getElementById(display.color).textContent = display.product.color;
      }
      // Jangan akses rate kalau memang tidak ada
    });

  } catch (error) {
    console.error('Gagal mengambil data produk:', error);
  }
}

fetchProductData();
