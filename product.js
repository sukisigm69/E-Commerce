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
        product: data[3],
        image: "gmbr-10",
        name: "Product-10",
      },
      {
        product: data[5],
        image: "gmbr-11",
      },
      {
        product: data[4],
        image: "gmbr-5",
        name: "Product-5",
        price: "hargabarang-5",
        color: "warna-5",
      },
      {
        product: data[6],
        image: "gmbr-6",
        name: "Product-6",
        price: "hargabarang-6",
        color: "warna-6",
      },
      {
        product: data[6],
        name: "Product-11",
      },
      {
        product: data[6],
        image: "gmbr-8"
      },
      {
        product: data[7],
        image: "gmbr-7",
        name: "Product-7",
        price: "hargabarang-7",
        color: "warna-7"
      },
      {
        product: data[8],
        image: "gmbr-13"
      },
      {
        product: data[9],
        image: "gmbr-9"
      },
      {
        product: data[10],
        image: "gmbr-14",
        name: "Product-14",
        color:"warna-14"
      },
      {
        product:data[11],
        price:"hargabarang-15"
      },
      {
        product:data[12],
        name:"Product-16",
        image:"gmbr-16"
      },
      {
        product:data[13],
        name:"Product-17",
        image:"gmbr-17"
      },
      {
        product:data[14],
        name:"Product-18",
        image:"gmbr-18"
      },
      {
        product:data[15],
        image:"gmbr-19"
      },
      {
        product:data[16],
        image:"gmbr-20"
      },
      {
        product:data[17],
        image:"gmbr-21"
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
