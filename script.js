document.addEventListener('DOMContentLoaded', () => {

    // 1. MENÚ HAMBURGUESA RESPONSIVO
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const expanded = navbar.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', expanded);
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. CAMBIO DE TEMA (Modo Oscuro / Claro)
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggleBtn.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
            } else {
                icon.className = 'fas fa-moon';
                themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
            }
        });
    }

    // 3. DIRECTORIO DOCENTE CON CARGA DENSAMENTE ACCESIBLE DE JSON (SECCIÓN 7 Y 13)
    let docentesData = [];
    const teachersGrid = document.getElementById('teachersGrid');
    const teacherSearch = document.getElementById('teacherSearch');
    const academyFilter = document.getElementById('academyFilter');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const noResults = document.getElementById('noResults');

    // Función auxiliar para quitar acentos en la búsqueda
    function normalizarTexto(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    async function cargarDocentesJSON() {
        try {
            const respuesta = await fetch('datos/docentes.json');
            if (!respuesta.ok) throw new Error('No se pudo cargar el archivo docentes.json');
            docentesData = await respuesta.json();
            renderDocentes(docentesData);
        } catch (error) {
            console.warn('Cargando respaldo local de datos de docentes...', error);
            // Respaldo de contingencia si no corre sobre un servidor HTTP local
            docentesData = [
                { nombre: "Ing. Benjamin Limon Martinez", academia: "Tecnología", materias: "Programación Web, Inteligencia Artificial", semestres: "5° Semestre" },
                { nombre: "Lic. Luis Lerma", academia: "Humanidades", materias: "Conciencia Histórica", semestres: "5° Semestre" },
                { nombre: "Ing. Yuridia Cepeda", academia: "Humanidades", materias: "Inglés", semestres: "5° Semestre" },
                { nombre: "Mtra. Mildred Reyes", academia: "Ciencias", materias: "Matemáticas Aplicadas, Física II", semestres: "5° Semestre" },
                { nombre: "Ing. L.F. Jasso", academia: "Tecnología", materias: "Ciberseguridad, Redes de Cómputo", semestres: "5° Semestre" },
                { nombre: "J. Trinidad Hernandez", academia: "Ciencias", materias: "La Energía en la Comunidad, Física", semestres: "5° Semestre" }
            ];
            renderDocentes(docentesData);
        }
    }

    function renderDocentes(lista) {
        if (!teachersGrid) return;
        teachersGrid.innerHTML = '';

        if (lista.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        } else {
            if (noResults) noResults.style.display = 'none';
        }

        lista.forEach(docente => {
            const card = document.createElement('article');
            card.className = 'teacher-card';
            card.innerHTML = `
                <div class="teacher-avatar"><i class="fas fa-user-tie" aria-hidden="true"></i></div>
                <h3>${docente.nombre}</h3>
                <span class="teacher-academy">${docente.academia}</span>
                <p class="teacher-subjects"><strong>Materias:</strong> ${docente.materias}</p>
                <p class="teacher-subjects"><small><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${docente.semestres}</small></p>
            `;
            teachersGrid.appendChild(card);
        });
    }

    function filtrarDocentes() {
        const query = normalizarTexto(teacherSearch.value.trim());
        const academia = academyFilter.value;

        const filtrados = docentesData.filter(docente => {
            const coincideNombreOMateria = normalizarTexto(docente.nombre).includes(query) || 
                                           normalizarTexto(docente.materias).includes(query);
            const coincideAcademia = (academia === 'todos') || (normalizarTexto(docente.academia) === normalizarTexto(academia));

            return coincideNombreOMateria && coincideAcademia;
        });

        renderDocentes(filtrados);
    }

    if (teacherSearch && academyFilter) {
        teacherSearch.addEventListener('input', filtrarDocentes);
        academyFilter.addEventListener('change', filtrarDocentes);

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                teacherSearch.value = '';
                academyFilter.value = 'todos';
                renderDocentes(docentesData);
            });
        }

        cargarDocentesJSON();
    }

    // 4. GALERÍA DE IMÁGENES / LIGHTBOX (AMPLIACIÓN INTERACTIVA)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.facility-card').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h4');
                const desc = item.querySelector('p');

                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt || "Imagen ampliada";
                    if (lightboxCaption && title && desc) {
                        lightboxCaption.innerHTML = `<strong>${title.innerText}</strong><br>${desc.innerText}`;
                    }
                    lightbox.style.display = 'flex';
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
});