import axiosClient from './axiosClient';

export async function fetchFormSubmissions(params) {
  const { data } = await axiosClient.get('/form-submissions', { params });
  return data;
}

export async function runFormSync() {
  const { data } = await axiosClient.post('/form-sync/run');
  return data;
}
