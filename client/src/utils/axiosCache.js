import axios from 'axios';

const cache = {};

export async function cachedGet(url, options = {}) {
  const key = url + JSON.stringify(options?.params || {});
  if (cache[key]) return cache[key];
  const res = await axios.get(url, options);
  cache[key] = res;
  return res;
}
