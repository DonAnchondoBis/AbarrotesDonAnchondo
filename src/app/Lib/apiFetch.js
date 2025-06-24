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
      'Authorization': token ? `Bearer ${token}` : '',
    },
  }
  if (method !== 'GET' && !(payload instanceof FormData)) {
    options.headers['Content-Type'] = contentType ?? 'application/json'
    options.body = JSON.stringify(payload)
  }
  else if (method !== 'GET' && (payload instanceof FormData)) {
    options.body = payload
  }
  const response = await fetch(url, options)
  return await response.json()
}

export default apiFetch