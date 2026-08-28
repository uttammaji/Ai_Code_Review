import apiClient from './axios';

export const reviewApi = {
  analyzeCode: async (data) => {
    const res = await apiClient.post('/review/analyze', data);
    return res.data;
  },

  getReview: async (reviewId) => {
    const res = await apiClient.get(`/review/${reviewId}`);
    return res.data;
  }
};

export default reviewApi;
