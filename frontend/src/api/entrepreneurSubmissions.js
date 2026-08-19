import axiosClient from './axiosClient';

export async function fetchEntrepreneurSubmissions(params) {
  const { data } = await axiosClient.get('/entrepreneur-submissions', { params });
  return data;
}

export async function runEntrepreneurSync() {
  const { data } = await axiosClient.post('/entrepreneur-sync/run');
  return data;
}
