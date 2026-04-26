// Module de gestion des étudiants
import { getStudents, saveStudents } from './storage.js'

// Générer un ID unique
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// Ajouter un étudiant
export function addStudent(data) {
  const students = getStudents()

  const newStudent = {
    id: generateId(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    subject: data.subject,
    grade: parseFloat(data.grade),
    createdAt: new Date().toISOString()
  }

  // Ajouter au début du tableau (plus récent en premier)
  students.unshift(newStudent)
  saveStudents(students)
  return newStudent
}

// Modifier un étudiant existant
export function updateStudent(id, data) {
  const students = getStudents()

  // Trouver l'index de l'étudiant à modifier
  const index = students.findIndex(s => s.id === id)
  if (index === -1) return null

  // Spread operator pour garder les données existantes et écraser les modifiées
  students[index] = {
    ...students[index],
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    subject: data.subject,
    grade: parseFloat(data.grade)
  }

  saveStudents(students)
  return students[index]
}

// Supprimer un étudiant
export function deleteStudent(id) {
  const students = getStudents()

  // filter() pour garder tous sauf celui à supprimer
  const filtered = students.filter(s => s.id !== id)
  saveStudents(filtered)
}

// Rechercher et filtrer les étudiants
export function filterStudents(search = '', subject = '', sort = 'newest') {
  let students = getStudents()

  // Filtrer par recherche (prénom, nom ou email)
  if (search) {
    const query = search.toLowerCase()
    students = students.filter(s =>
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    )
  }

  // Filtrer par matière
  if (subject) {
    students = students.filter(s => s.subject === subject)
  }

  // Trier les résultats
  switch (sort) {
    case 'name':
      students.sort((a, b) => a.lastName.localeCompare(b.lastName))
      break
    case 'grade-desc':
      students.sort((a, b) => b.grade - a.grade)
      break
    case 'grade-asc':
      students.sort((a, b) => a.grade - b.grade)
      break
    default:
      // Plus récent en premier (par défaut)
      students.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return students
}

// Calculer les statistiques de la classe
export function getStats() {
  const students = getStudents()

  if (students.length === 0) {
    return { total: 0, average: 0, best: '—', worst: '—' }
  }

  // map() pour extraire les notes
  const grades = students.map(s => s.grade)

  // Calcul de la moyenne
  const average = grades.reduce((sum, g) => sum + g, 0) / grades.length

  // Meilleur et pire étudiant avec find()
  const best = students.reduce((a, b) => a.grade > b.grade ? a : b)
  const worst = students.reduce((a, b) => a.grade < b.grade ? a : b)

  return {
    total: students.length,
    average: average.toFixed(1),
    best: `${best.firstName} (${best.grade})`,
    worst: `${worst.firstName} (${worst.grade})`
  }
}