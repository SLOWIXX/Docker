export async function getCitations() {
  const response = await fetch('/api/citations')
  return response.json()
}

export async function addCitation(author, text) {
  const response = await fetch('/api/citations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, text }),
  })
  return response.json()
}
