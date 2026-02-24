document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('poemsGrid');
    const themeBtn = document.getElementById('themeToggle');
    const modal = document.getElementById('poemModal');
    
    // 1. Показ стихов
    function display(cat = 'all') {
        grid.innerHTML = '';
        const filtered = cat === 'all' ? poemsData : poemsData.filter(p => p.category === cat);
        
        filtered.forEach(poem => {
            const card = document.createElement('div');
            card.className = 'poem-card';
            card.innerHTML = `<h3>${poem.title}</h3><p>${poem.excerpt}</p><small>${poem.date}</small>`;
            card.onclick = () => {
                document.getElementById('modalBody').innerHTML = `<h2>${poem.title}</h2><div class="full-poem-text">${poem.fullText}</div>`;
                modal.style.display = 'flex';
            };
            grid.appendChild(card);
        });
    }

    // 2. Переключение вкладок
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = (e) => {
            document.querySelector('.nav-link.active').classList.remove('active');
            e.target.classList.add('active');
            display(e.target.dataset.category);
        };
    });

    // 3. Закрытие окна
    document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };

    // 4. Тема
    themeBtn.onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.textContent = isDark ? '🌙' : '☀️';
    };

    display(); // Запуск
});