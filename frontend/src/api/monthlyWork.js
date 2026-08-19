import axiosClient from './axiosClient';

export async function fetchMonthlyWork(params) {
  const { data } = await axiosClient.get('/monthly-work', { params });
  return data;
}

export async function fetchMonthlyWorkMonths() {
  const { data } = await axiosClient.get('/monthly-work/months');
  return data.months || [];
}

export async function createMonthlyWork(payload) {
  const { data } = await axiosClient.post('/monthly-work', payload);
  return data;
}

export async function updateMonthlyWork(id, payload) {
  const { data } = await axiosClient.put(`/monthly-work/${id}`, payload);
  return data;
}

export async function deleteMonthlyWork(id) {
  await axiosClient.delete(`/monthly-work/${id}`);
}
