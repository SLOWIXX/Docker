import './style.css'
import { getCitations, addCitation } from './api.js'

const list = document.querySelector('.citations')
const form = document.querySelector('.citation-form')

async function showCitations() {
  const citations = await getCitations()
  list.innerHTML = ''
  for (const citation of citations) {
    const item = document.createElement('li')
    item.textContent = `"${citation.text}" - ${citation.author}`
    list.append(item)
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  await addCitation(form.author.value, form.text.value)
  form.reset()
  showCitations()
})

showCitations()
