// Module de gestion du LocalStorage

const STORAGE_KEY = 'studentManager_students'

// Récupérer tous les étudiants depuis le LocalStorage
export function getStudents() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Erreur lecture LocalStorage :', error)
    return []
  }
}

// Sauvegarder tous les étudiants dans le LocalStorage
export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  } catch (error) {
    console.error('Erreur sauvegarde LocalStorage :', error)
  }
}

// Vider tout le LocalStorage
export function clearStudents() {
  localStorage.removeItem(STORAGE_KEY)
}