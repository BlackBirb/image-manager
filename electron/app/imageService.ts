export const fetchURLMime = async (url: string) => {
  const response = await fetch(url, { method: 'HEAD' })
  return response.headers.get('content-type')
}
