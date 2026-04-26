// Point d'entrée principal — importe et orchestre tous les modules
import { addStudent, updateStudent, deleteStudent, filterStudents, getStats } from './modules/students.js'
import { clearStudents } from './modules/storage.js'
import { createStudentCard, showEmptyState, createPagination } from './modules/ui.js'

// ─── CONSTANTES ───────────────────────────────────────
const PER_PAGE = 6 // Nombre d'étudiants par page

// ─── ÉTAT DE L'APPLICATION ─────────────────────────────
let currentPage = 1
let editingId = null
let deleteTargetId = null

// ─── SÉLECTION DES ÉLÉMENTS DOM ───────────────────────
const studentForm = document.getElementById('studentForm')
const studentId = document.getElementById('studentId')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const email = document.getElementById('email')
const subject = document.getElementById('subject')
const grade = document.getElementById('grade')
const submitBtn = document.getElementById('submitBtn')
const cancelBtn = document.getElementById('cancelBtn')
const formTitle = document.getElementById('formTitle')
const formIcon = document.getElementById('formIcon')
const searchInput = document.getElementById('searchInput')
const subjectFilter = document.getElementById('subjectFilter')
const sortFilter = document.getElementById('sortFilter')
const studentGrid = document.getElementById('studentGrid')
const resultsCount = document.getElementById('resultsCount')
const clearAllBtn = document.getElementById('clearAllBtn')
const modal = document.getElementById('modal')
const modalCancel = document.getElementById('modalCancel')
const modalConfirm = document.getElementById('modalConfirm')
const totalStudents = document.getElementById('totalStudents')
const classAverage = document.getElementById('classAverage')
const bestStudent = document.getElementById('bestStudent')

// ─── RENDU DE LA LISTE ────────────────────────────────
function render() {
  const search = searchInput.value.trim()
  const subject = subjectFilter.value
  const sort = sortFilter.value

  // Filtrer et trier les étudiants
  const filtered = filterStudents(search, subject, sort)

  // Pagination — slice pour la page courante
  const start = (currentPage - 1) * PER_PAGE
  const paginated = filtered.slice(start, start + PER_PAGE)

  // Mettre à jour le compteur
  resultsCount.textContent = `${filtered.length} étudiant(s)`

  // Vider la grille
  studentGrid.innerHTML = ''

  // Afficher l'état vide ou les cartes
  if (filtered.length === 0) {
    showEmptyState(studentGrid)
  } else {
    // forEach pour créer une carte par étudiant
    paginated.forEach(student => {
      const card = createStudentCard(student, handleEdit, handleDeleteClick)
      studentGrid.appendChild(card)
    })
  }

  // Créer la pagination
  createPagination(filtered.length, PER_PAGE, currentPage, (page) => {
    currentPage = page
    render()
  })

  // Mettre à jour les stats du header
  updateStats()
}

// ─── MISE À JOUR DES STATISTIQUES ─────────────────────
function updateStats() {
  const stats = getStats()
  totalStudents.textContent = stats.total
  classAverage.textContent = stats.average
  bestStudent.textContent = stats.best
}

// ─── GESTION DU FORMULAIRE ────────────────────────────
studentForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const data = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    subject: subject.value,
    grade: grade.value
  }

  try {
    if (editingId) {
      // Mode modification
      updateStudent(editingId, data)
      resetForm()
    } else {
      // Mode ajout
      addStudent(data)
    }

    studentForm.reset()
    currentPage = 1
    render()

  } catch (error) {
    console.error('Erreur formulaire :', error)
  }
})

// ─── MODE MODIFICATION ────────────────────────────────
function handleEdit(student) {
  // Remplir le formulaire avec les données de l'étudiant
  editingId = student.id
  firstName.value = student.firstName
  lastName.value = student.lastName
  email.value = student.email
  subject.value = student.subject
  grade.value = student.grade

  // Changer le titre du formulaire
  formTitle.textContent = 'Modifier l\'étudiant'
  formIcon.textContent = '✏️'
  submitBtn.textContent = '💾 Enregistrer'
  cancelBtn.classList.remove('hidden')

  // Scroll vers le formulaire sur mobile
  document.querySelector('.sidebar').scrollIntoView({ behavior: 'smooth' })
}

// Annuler la modification
cancelBtn.addEventListener('click', resetForm)

function resetForm() {
  editingId = null
  studentForm.reset()
  formTitle.textContent = 'Ajouter un étudiant'
  formIcon.textContent = '➕'
  submitBtn.textContent = '➕ Ajouter'
  cancelBtn.classList.add('hidden')
}

// ─── SUPPRESSION AVEC MODAL ───────────────────────────
function handleDeleteClick(id) {
  deleteTargetId = id
  modal.classList.remove('hidden')
}

modalCancel.addEventListener('click', () => {
  modal.classList.add('hidden')
  deleteTargetId = null
})

modalConfirm.addEventListener('click', () => {
  if (deleteTargetId) {
    deleteStudent(deleteTargetId)
    deleteTargetId = null
    modal.classList.add('hidden')
    currentPage = 1
    render()
  }
})

// Fermer le modal en cliquant dehors
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden')
    deleteTargetId = null
  }
})

// ─── TOUT SUPPRIMER ───────────────────────────────────
clearAllBtn.addEventListener('click', () => {
  if (confirm('Supprimer tous les étudiants ?')) {
    clearStudents()
    currentPage = 1
    render()
  }
})

// ─── RECHERCHE ET FILTRES EN TEMPS RÉEL ───────────────
searchInput.addEventListener('input', () => {
  currentPage = 1
  render()
})

subjectFilter.addEventListener('change', () => {
  currentPage = 1
  render()
})

sortFilter.addEventListener('change', () => {
  currentPage = 1
  render()
})

// ─── DONNÉES DE DÉMONSTRATION ─────────────────────────
function loadDemoData() {
  const existing = filterStudents()
  if (existing.length > 0) return // Ne pas recharger si déjà des données

  const demoStudents = [
    { firstName: 'Amina', lastName: 'Barre', email: 'amina@bakeli.tech', subject: 'JavaScript', grade: 18 },
    { firstName: 'Moussa', lastName: 'Diallo', email: 'moussa@bakeli.tech', subject: 'React', grade: 15 },
    { firstName: 'Fatou', lastName: 'Sow', email: 'fatou@bakeli.tech', subject: 'HTML/CSS', grade: 17 },
    { firstName: 'Ibrahima', lastName: 'Ndiaye', email: 'ibrahima@bakeli.tech', subject: 'Node.js', grade: 12 },
    { firstName: 'Mariama', lastName: 'Ba', email: 'mariama@bakeli.tech', subject: 'Python', grade: 14 },
    { firstName: 'Oumar', lastName: 'Fall', email: 'oumar@bakeli.tech', subject: 'Base de données', grade: 9 },
    { firstName: 'Aissatou', lastName: 'Diop', email: 'aissatou@bakeli.tech', subject: 'JavaScript', grade: 16 },
  ]

  demoStudents.forEach(s => addStudent(s))
}

// ─── INITIALISATION ───────────────────────────────────
loadDemoData()
render()