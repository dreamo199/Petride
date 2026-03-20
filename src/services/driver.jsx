import api from './api'

export const driverService = {

    async getDriverProfile() {
        const response = await api.get(`/drivers/me/`);
        return response.data;
    },

    async updateOrderStatus(orderId, {status: new_status, cancellation_reason: reason}) {
        const response = await api.post(`/orders/orders/${orderId}/update_status/`, { status: new_status, cancellation_reason: reason });
        return response.data;
    },

    async availableOrders() {
        const response = await api.get(`orders/orders/available_orders`);
        return response.data;
    },

    async acceptOrder(orderId) {
        const response = await api.post(`orders/orders/${orderId}/accept_order/`);
        return response.data
    },

    async activeOrder(){
        const response = await api.get(`orders/orders/active_orders/`)
        return response.data
    },

    async getAnalytics() {
        const response = await api.get(`/analytics/driver/`);
        return response.data;
  },

    async updateAvailability() {
        const response = await api.put(`/drivers/toggle_availability/`)
        return response.data;
    },

    async updateProfile(profileData) {
        const response = await api.patch(`/drivers/update_profile/`, profileData);
        return response.data;
    }
};