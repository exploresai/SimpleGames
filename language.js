function changeLanguage(lang) {
    if (!translations[lang]) return;
    
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // 更新界面文本
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // 更新输入框placeholder等属性
    const attrElements = document.querySelectorAll('[data-translate-attr]');
    attrElements.forEach(el => {
        const [key, attr] = el.getAttribute('data-translate-attr').split(':');
        if (translations[lang][key]) {
            el.setAttribute(attr, translations[lang][key]);
        }
    });
    
    // 更新当前语言显示 (仅当元素存在时)
    const currentLangElement = document.getElementById('current-language');
    if (currentLangElement) {
        currentLangElement.textContent = lang.toUpperCase();
    }
    
    // 更新侧边栏分类
    const categoryButtons = document.querySelectorAll('#category-list button');
    categoryButtons.forEach(btn => {
        const catKey = btn.dataset.cat;
        if (translations[lang].categories && translations[lang].categories[catKey]) {
            const labelSpan = btn.querySelector('.cat-label');
            if (labelSpan) {
                labelSpan.textContent = translations[lang].categories[catKey];
            }
        }
    });
}

// 初始化语言
function initLanguage() {
    const savedLang = localStorage.getItem('language') || 'en';
    changeLanguage(savedLang);
    
    // 确保元素存在后再绑定事件
    const languageToggle = document.getElementById('language-toggle');
    const languageMenu = document.getElementById('language-menu');
    
    if (languageToggle && languageMenu) {
        // 修复1：添加更可靠的事件绑定
        languageToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            languageMenu.classList.toggle('hidden');
        });
        
        // 修复2：为菜单项添加点击事件
        document.querySelectorAll('#language-menu button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                changeLanguage(btn.dataset.lang);
                languageMenu.classList.add('hidden');
            });
        });
        
        // 修复3：点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!languageMenu.contains(e.target) && e.target !== languageToggle) {
                languageMenu.classList.add('hidden');
            }
        });
    }
}

// 修复4：确保在DOM完全加载后初始化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initLanguage, 1);
} else {
    document.addEventListener('DOMContentLoaded', initLanguage);
}