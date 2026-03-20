import api from './api';

export const orderService = {
  async getFuelTypes() {
    const response = await api.get('/orders/fuel-types/');
    return response.data;
  },

  async createOrder(orderData) {
    const response = await api.post('/orders/orders/', orderData);
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/orders/orders');
    return response.data;
  },

  async getOrderDetails(orderId) {
    const response = await api.get(`/orders/orders/${orderId}/`);
    return response.data;
  },

  async rateOrder(orderId, { customer_rating: rating }) {
    const response = await api.post(`/orders/orders/${orderId}/rate_order/`, { customer_rating: rating });
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get(`/analytics/customer/`);
    return response.data;
  },

  async createPaymentIntent(orderId) {
    const response = await api.post('/payments/create_payment_intent/', { order_id: orderId });
    return response.data;
  },

  async updateOrderStatus(orderId, {status: new_status, cancellation_reason: reason}) {
    const response = await api.post(`/orders/orders/${orderId}/update_status/`, { status: new_status, cancellation_reason: reason });
    return response.data;
    },
};