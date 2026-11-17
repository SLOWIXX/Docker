import './style.css'
import { getCitations } from './api.js'

const list = document.querySelector('.citations')

async function showCitations() {
  const citations = await getCitations()
  list.innerHTML = ''
  for (const citation of citations) {
    const item = document.createElement('li')
    item.textContent = `"${citation.text}" - ${citation.author}`
    list.append(item)
  }
}

showCitations()
