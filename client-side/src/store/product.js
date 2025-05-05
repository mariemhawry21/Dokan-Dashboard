import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [
      { Product: 'Handmade Pouch', sku: '302082', category: 'Bag & Pouch', stock: 10, price: 121.00, status: 'Low Stock', added: '29 Dec 2022', variants: '3', selected: false, image: '1.png' },
      { Product: 'Smartwatch E2', sku: '302011', category: 'Watch', stock: 204, price: 890.00, status: 'Published', added: '24 Dec 2022', variants: '2', selected: false, image: '1.png' },
      { Product: 'Smartwatch E1', sku: '302002', category: 'Watch', stock: 48, price: 125.00, status: 'Draft', added: '12 Dec 2022', variants: '3', selected: false, image: '1.png' },
      { Product: 'Headphone G1 Pro', sku: '301901', category: 'Audio', stock: 401, price: 348.00, status: 'Published', added: '21 Oct 2022', variants: '1', selected: false, image: '1.png' },
      { Product: 'Iphone X', sku: '301900', category: 'Smartphone', stock: 120, price: 607.00, status: 'Published', added: '21 Oct 2022', variants: '4', selected: false, image: '1.png' },
      { Product: 'Puma Shoes', sku: '301881', category: 'Shoes', stock: 432, price: 234.00, status: 'Published', added: '21 Oct 2022', variants: '3', selected: false, image: '1.png' },
    ],
  }),

  getters: {
    productCount(state) {
      return state.products.length;
    },
  },

  actions: {
    addProduct(newProduct) {
      this.products.push(newProduct);
      console.log('Current products array:', this.products);
    },

    deleteProduct(sku) {
      this.products = this.products.filter(product => product.sku !== sku);
    },

    updateProduct(updatedProduct) {
    
      const productIndex = this.products.findIndex(product => product.sku === updatedProduct.sku);
      if (productIndex !== -1) {
        this.products[productIndex] = { ...updatedProduct };  
        console.log('Product updated:', updatedProduct);
      } else {
        console.error('Product with SKU not found');
      }
    },

    async fetchAll() {
      const res = await axios.get("/api/products");
      this.products = res.data;
    },
  },
});
