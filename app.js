// Готовая защитная механика. Не изменяйте эту функцию.
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

let resultCount
let resultList

function selectAttempts(filter) {
  const attempts = window.reportData.attempts

  if (filter === 'passed') {
    return attempts.filter((attempt) => attempt.passed === true)
  }
  if (filter === 'failed') {
    return attempts.filter((attempt) => attempt.passed === false)
  }
  return attempts
}

function renderAttempts(attempts) {
  let html = ''

  attempts.forEach((attempt) => {
    const status = attempt.passed ? 'Порог пройден' : 'Порог не пройден'
    html += `<li class="result-item"><span class="result-name">${escapeHtml(attempt.name)}</span> ${attempt.score} из ${attempt.questionCount} (${attempt.percentage}%) — ${status}</li>`
  })

  resultList.innerHTML = html
  resultCount.textContent = `Показано: ${attempts.length} из ${window.reportData.attempts.length}`
}

function startFilter() {
  const form = document.querySelector('#filter-form')
  const select = document.querySelector('#filter')
  resultCount = document.querySelector('#result-count')
  resultList = document.querySelector('#result-list')

  function handleSubmit(event) {
    event.preventDefault()
    const attempts = selectAttempts(select.value)
    renderAttempts(attempts)
  }

  form.addEventListener('submit', handleSubmit)
}

startFilter()
