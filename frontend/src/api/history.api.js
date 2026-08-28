import apiClient from './axios';

export const historyApi = {
  getReviewHistory: async () => {
    const res = await apiClient.get('/history');
    return res.data;
  },

  getHistoryById: async (reviewId) => {
    const res = await apiClient.get(`/history/${reviewId}`);
    return res.data;
  },

  deleteHistory: async (reviewId) => {
    const res = await apiClient.delete(`/history/${reviewId}`);
    return res.data;
  }
};

export default historyApi;
