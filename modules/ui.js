// Module de gestion de l'interface utilisateur
// Obtenir la couleur de la note
export function getGradeClass(grade) {
  if (grade >= 16) return 'excellent'
  if (grade >= 12) return 'good'
  if (grade >= 10) return 'average'
  return 'poor'
}

// Obtenir les initiales de l'étudiant pour l'avatar
export function getInitials(firstName, lastName) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Créer une carte étudiant avec createElement()
export function createStudentCard(student, onEdit, onDelete) {
  const { id, firstName, lastName, email, subject, grade } = student

  // Créer les éléments avec createElement()
  const card = document.createElement('div')
  card.classList.add('student-card')
  card.dataset.id = id

  card.innerHTML = `
    <div class="card-header">
      <div class="card-avatar">${getInitials(firstName, lastName)}</div>
      <div class="card-info">
        <div class="card-name">${firstName} ${lastName}</div>
        <div class="card-email">${email}</div>
      </div>
    </div>
    <div class="card-body">
      <span class="card-subject">${subject}</span>
      <span class="card-grade ${getGradeClass(grade)}">${grade}/20</span>
    </div>
    <div class="card-footer">
      <button class="card-btn edit" data-id="${id}">✏️ Modifier</button>
      <button class="card-btn delete" data-id="${id}">🗑 Supprimer</button>
    </div>
  `

  // addEventListener sur les boutons
  card.querySelector('.edit').addEventListener('click', () => onEdit(student))
  card.querySelector('.delete').addEventListener('click', () => onDelete(id))

  return card
}

// Afficher l'état vide
export function showEmptyState(grid) {
  grid.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">👨‍🎓</div>
      <div class="empty-title">Aucun étudiant trouvé</div>
      <div class="empty-sub">Essaie une autre recherche ou ajoute un étudiant</div>
    </div>
  `
}

// Créer la pagination
export function createPagination(total, perPage, currentPage, onPageChange) {
  const totalPages = Math.ceil(total / perPage)
  const pagination = document.getElementById('pagination')

  if (totalPages <= 1) {
    pagination.classList.add('hidden')
    return
  }

  pagination.classList.remove('hidden')
  pagination.innerHTML = ''

  // Bouton précédent
  const prevBtn = document.createElement('button')
  prevBtn.classList.add('page-btn')
  prevBtn.textContent = '←'
  prevBtn.disabled = currentPage === 1
  prevBtn.addEventListener('click', () => onPageChange(currentPage - 1))
  pagination.appendChild(prevBtn)

  // Boutons des pages
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button')
    pageBtn.classList.add('page-btn')
    if (i === currentPage) pageBtn.classList.add('active')
    pageBtn.textContent = i
    pageBtn.addEventListener('click', () => onPageChange(i))
    pagination.appendChild(pageBtn)
  }

  // Bouton suivant
  const nextBtn = document.createElement('button')
  nextBtn.classList.add('page-btn')
  nextBtn.textContent = '→'
  nextBtn.disabled = currentPage === totalPages
  nextBtn.addEventListener('click', () => onPageChange(currentPage + 1))
  pagination.appendChild(nextBtn)
}