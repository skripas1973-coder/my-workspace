document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('poemsGrid');
    const themeBtn = document.getElementById('themeToggle');
    const modal = document.getElementById('poemModal');
    
    const hoverContainer = document.getElementById('hover-image-container');
    const hoverImage = document.getElementById('hover-image');
    
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const closeAuth = document.getElementById('closeAuth');

    if (authBtn) { authBtn.onclick = () => { authModal.style.display = 'flex'; }; }
    if (closeAuth) { closeAuth.onclick = () => { authModal.style.display = 'none'; }; }

    // 1. Функция открытия модального окна (вынес отдельно, чтобы работала везде)
    function openPoem(poem) {
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = `<h2>${poem.title}</h2><div class="full-poem-text">${poem.fullText}</div>`;
            modal.style.display = 'flex';
            hoverContainer.style.display = 'none';
        }
    }

    // 2. Показ основного списка
    function display(cat = 'all') {
        if (!grid) return;
        grid.innerHTML = '';
        const filtered = cat === 'all' ? poemsData : poemsData.filter(p => p.category === cat);
        
        filtered.forEach(poem => {
            const card = document.createElement('div');
            card.className = 'poem-card';
            card.innerHTML = `<h3>${poem.title}</h3><small>${poem.date}</small>`;
            
            card.onmouseenter = () => {
                if (poem.image) {
                    hoverImage.src = poem.image;
                    hoverContainer.style.display = 'block';
                }
            };
            card.onmouseleave = () => { hoverContainer.style.display = 'none'; };
            card.onclick = () => openPoem(poem);
            
            grid.appendChild(card);
        });
    }

    // 3. ОБНОВЛЕННЫЙ БЛОК "НОВИНКА" (теперь берет ПОСЛЕДНИЙ стих и открывает его)
    function updateNewPoemSidebar() {
        const titleElem = document.getElementById('newPoemTitle');
        const excerptElem = document.getElementById('newPoemExcerpt');
        const sidebar = document.querySelector('.new-poem-sidebar');

        if (typeof poemsData !== 'undefined' && poemsData.length > 0) {
            // Берем ПОСЛЕДНИЙ стих из массива (самый нижний в data.js)
            const latest = poemsData[poemsData.length - 1]; 
            
            if (titleElem) titleElem.textContent = latest.title;
            if (excerptElem) {
                const preview = latest.fullText.substring(0, 80).replace(/\n/g, '<br>');
                excerptElem.innerHTML = preview + '...';
            }

            // Делаем весь блок новинки кликабельным
            if (sidebar) {
                sidebar.style.cursor = 'pointer';
                sidebar.onclick = () => openPoem(latest);
            }
        }
    }

    // 4. Навигация (скрытие/показ блока Новинка)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = (e) => {
            const active = document.querySelector('.nav-link.active');
            if (active) active.classList.remove('active');
            e.target.classList.add('active');
            
            const category = e.target.dataset.category;
            const sidebar = document.querySelector('.new-poem-sidebar');
            
            // ЛОГИКА: Показываем новинку только на вкладке "Все" (all)
            if (sidebar) {
                if (category === 'all') {
                    sidebar.style.display = 'block';
                } else {
                    sidebar.style.display = 'none';
                }
            }
            
            display(category);
        };
    });

    // 5. Закрытие
    const closePoemBtn = document.getElementById('closePoem');
    if (closePoemBtn) closePoemBtn.onclick = () => modal.style.display = 'none';
    
    window.onclick = (e) => { 
        if(e.target == modal) modal.style.display = 'none'; 
        if(e.target == authModal) authModal.style.display = 'none'; 
    };

    // 6. Тема
    themeBtn.onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.textContent = isDark ? '🌙' : '☀️';
    };

    // 7. Защита (как договаривались)
    document.addEventListener('copy', (event) => {
        const selection = document.getSelection();
        if (selection.toString().length > 0) {
            const footer = `\n\n© Источник: Сергей Анатольевич Скрыпник — "Тихие строки"\nСайт автора: https://skrypnik-poetry.ru`;
            event.clipboardData.setData('text/plain', selection.toString() + footer);
            event.preventDefault();
        }
    });

    display(); 
    updateNewPoemSidebar();
});