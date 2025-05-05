import { defineStore } from "pinia";
import axios from "axios";

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [],
        totalOrders: 0,
        loading: false,
        error: null
    }),
    actions: {
        async getOrders({ page = 1, limit = 10, search = '', status = '' } = {}) {
            this.loading = true;
            this.error = null;
            try {
                const res = await axios.get('http://localhost:5000/orders', {
                    params: { page, limit, search, status }
                })
                console.log("Response data:", res.data);
                if (res.data && res.data.data) {
                    this.orders = res.data.data.orders || [];
                    this.totalOrders = res.data.data.totalOrders || 0;
                } else {
                    console.error("Unexpected data format:", res.data);
                }
            } catch (err) {
                // this.error = err.response?.data?.message || "Something went wrong";
                console.log(err);
            } finally {
                this.loading = false;
            }
        },

        async updateOrderStatus(id, status) {
            try {
                const res = await axios.put(`http://localhost:5000/orders/${id}`, { status });
                if (res.status === 200) {
                    console.log('Order status updated successfully');
                    await this.getOrders();
                } else {
                    throw new Error('Failed to update order status');
                }
            } catch (err) {
                console.log(err);
            }
        },

        async softDeleteOrder(id) {
            try {
                await axios.patch(`http://localhost:5000/orders/${id}/soft-delete`)
            } catch (err) {
                console.log(err);
            }
        },

        async restoreOrder(id) {
            try {
                await axios.patch(`http://localhost:5000/orders/${id}/restore`)
                await this.getOrders();
            } catch (err) {
                console.log(err);
            }
        }
    }
})