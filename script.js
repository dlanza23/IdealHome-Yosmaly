// Función para expandir la tarjeta y centrarla en pantalla
function expandCard(card) {
  if (card.classList.contains('expanded')) return;

  // Cerramos cualquier otra tarjeta abierta previamente
  document.querySelectorAll('.card.expanded').forEach(c => c.classList.remove('expanded'));

  card.classList.add('expanded');

  // Auto-scroll para centrar suavemente en pantalla
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Función para minimizar/cerrar la tarjeta
function closeCard(event, button) {
  event.stopPropagation(); // Evita interferencias con el clic de la tarjeta

  const card = button.closest('.card');
  const cardDetails = card?.querySelector('.card-details');
  if (!cardDetails) return;

  const pages = cardDetails.querySelectorAll('.card-page');
  const indicator = cardDetails.querySelector('.page-indicator');

  // 1. Quitar la clase expandida
  card.classList.remove('expanded');

  // 2. Reiniciar todas las páginas y activar solo la primera
  pages.forEach((page, index) => {
    page.classList.toggle('active', index === 0);
  });

  // 3. Reiniciar el texto del paginador
  if (indicator && pages.length > 0) {
    indicator.textContent = `Página 1 de ${pages.length}`;
  }
}

// Función para cambiar de página dentro de la tarjeta
function changePage(event, button, direction) {
  event.stopPropagation();

  const cardDetails = button.closest('.card-details');
  if (!cardDetails) return;

  const pages = cardDetails.querySelectorAll('.card-page');
  const indicator = cardDetails.querySelector('.page-indicator');
  
  // 1. Encontrar la página activa
  const activeIndex = Array.from(pages).findIndex(p => p.classList.contains('active'));
  if (activeIndex === -1) return;

  // 2. Ocultar la página actual
  pages[activeIndex].classList.remove('active');

  // 3. Calcular nuevo índice circular
  let newIndex = (activeIndex + direction + pages.length) % pages.length;

  // 4. Activar la nueva página y actualizar indicador
  pages[newIndex].classList.add('active');
  if (indicator) {
    indicator.textContent = `Página ${newIndex + 1} de ${pages.length}`;
  }
}

function sendToWhatsApp(event) {
  event.preventDefault();

  const phone = "+584140891908"; 

  const nombre = document.getElementById('nombre')?.value.trim() || '';
  const apellido = document.getElementById('apellido')?.value.trim() || '';
  const cedula = document.getElementById('cedula')?.value.trim() || '';
  const telefono = document.getElementById('telefono')?.value.trim() || '';
  const correo = document.getElementById('correo')?.value.trim() || '';
  const fechaNacimiento = document.getElementById('fechaNacimiento')?.value || '';
  const direccion = document.getElementById('direccion')?.value.trim() || '';

  // Formatear fecha de forma segura
  let formattedDate = 'No especificada';
  if (fechaNacimiento) {
    const parts = fechaNacimiento.split('-');
    if (parts.length === 3) {
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const message = `*¡NUEVA SOLICITUD DE REGISTRO DE VENDEDOR!* 📝\n\n` +
    `👤 *Nombre completo:* ${nombre} ${apellido}\n` +
    `🪪 *Cédula/ID:* ${cedula}\n` +
    `📞 *Teléfono:* ${telefono}\n` +
    `✉️ *Correo:* ${correo}\n` +
    `🎂 *Fecha de Nacimiento:* ${formattedDate}\n` +
    `🏠 *Dirección:* ${direccion}`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Cambiar entre Pestañas
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab && btn) {
    targetTab.classList.add('active');
    btn.classList.add('active');
  }
}

// Ordenar los videos dentro del contenedor activo
function sortVideos(criteria) {
  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;

  // Busca el contenedor interno si existe, o usa activeTab por defecto
  const container = activeTab.querySelector('.video-grid, .video-list') || activeTab;
  const videos = Array.from(container.querySelectorAll('.video-row'));

  videos.sort((a, b) => {
    if (criteria === 'recent') {
      return new Date(b.dataset.date) - new Date(a.dataset.date);
    } else if (criteria === 'oldest') {
      return new Date(a.dataset.date) - new Date(b.dataset.date);
    } else if (criteria === 'popular') {
      return (Number(b.dataset.popular) || 0) - (Number(a.dataset.popular) || 0);
    }
    return 0;
  });

  // Reorganizar los elementos en el DOM dentro de su contenedor
  videos.forEach(video => container.appendChild(video));
}

// Accesibilidad adicional: Cerrar tarjeta expandida con la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const expandedCard = document.querySelector('.card.expanded');
    if (expandedCard) {
      const closeBtn = expandedCard.querySelector('.close-btn, .btn-close');
      if (closeBtn) {
        closeBtn.click();
      } else {
        expandedCard.classList.remove('expanded');
      }
    }
  }
});

// Función para el Auto-Slider con velocidad ajustada
function initMiniSlider() {
  const slides = document.querySelectorAll('.mini-slider .mini-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;

  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 1500); // Cambia cada 2000ms (2 segundos)
}

document.addEventListener('DOMContentLoaded', initMiniSlider);

// Enfocar un premio en la cartelera
function openPrizeDetail(prizeCard, event) {
  event.stopPropagation(); // Evita interferir con los eventos superiores
  if (!prizeCard.classList.contains('focused')) {
    prizeCard.classList.add('focused');
  }
}

// Volver a la vista de cartelera
function closePrizeDetail(btn, event) {
  event.stopPropagation();
  const prizeCard = btn.closest('.prize-card');
  if (prizeCard) {
    prizeCard.classList.remove('focused');
  }
}

// Rotación automática del slider de premios (Vista Resumida)
function startPrizesSlider() {
  const images = document.querySelectorAll('#prizes-preview-slider img');
  if (images.length === 0) return;
  
  let currentIndex = 0;

  setInterval(() => {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
  }, 1500); // Cambia cada 3 segundos
}


document.addEventListener('DOMContentLoaded', startPrizesSlider);

// Rotación automática del slider de combos/colecciones (Tarjeta 3)
function startCombosSlider() {
  const images = document.querySelectorAll('#combos-preview-slider img');
  if (images.length === 0) return;

  let currentIndex = 0;

  setInterval(() => {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
  }, 1500);
}

document.addEventListener('DOMContentLoaded', startCombosSlider);