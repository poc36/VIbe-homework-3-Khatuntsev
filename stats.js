const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !isArray(value)
}

export function validateQuizData(data) {
  if (!isObject(data)) {
    return false
  }
  if (typeof data.quizTitle !== 'string' || data.quizTitle === '') {
    return false
  }
  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }
  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  for (const attempt of data.attempts) {
    if (!isObject(attempt)) {
      return false
    }
    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
      return false
    }
    if (!isArray(attempt.answers) || attempt.answers.length !== data.correctAnswers.length) {
      return false
    }
  }

  return true
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0
  for (let i = 0; i < correctAnswers.length; i++) {
    if (attempt.answers[i] === correctAnswers[i]) {
      score++
    }
  }

  const percentage = Math.round((score / correctAnswers.length) * 100)

  return {
    name: attempt.name.trim(),
    score: score,
    percentage: percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) => calculateAttempt(attempt, data.correctAnswers))

  const percentageSum = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0)
  const averagePercentage = Math.round(percentageSum / attempts.length)

  const passedAttempts = attempts.filter((attempt) => attempt.passed)

  let best = attempts[0]
  for (const attempt of attempts) {
    if (attempt.score > best.score) {
      best = attempt
    }
  }

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: averagePercentage,
    passedCount: passedAttempts.length,
    threshold: PASSING_PERCENTAGE,
    best: best,
    attempts: attempts,
  }
}
