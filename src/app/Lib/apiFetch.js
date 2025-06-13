const apiFetch = async ({
  payload,
  method = 'GET',
  url,
  contentType,
  token = null
}) => {
  const options = {
    method,
    headers: {
      'Content-Type': contentType ?? 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  }
  if (method !== 'GET') {
    options.body = JSON.stringify(payload)
  }
  const response = await fetch(url, options)
  return await response.json()
}

export default apiFetch