// ═══════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ АДМИНКИ — ВИЗУАЛЬНЫЙ РЕДАКТОР
// ═══════════════════════════════════════════════════════
// Меняй только эти 4 поля под каждый проект

const CMS_CONFIG = {
    // Твой ник на GitHub
    owner: 'piarbookru-hub',
    
    // Название репозитория (буква в букву как в URL)
    repo: 'test',
    
    // Ветка (обычно main)
    branch: 'main',
    
    // Название проекта (отображается в шапке админки)
    projectName: 'Тестовый сайт'
};

function processHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    let maxExisting = 0;
    doc.querySelectorAll('[data-edit^="auto_"]').forEach(el => {
        const num = parseInt(el.getAttribute('data-edit').replace('auto_', ''), 10);
        if (!isNaN(num) && num > maxExisting) maxExisting = num;
    });
    let textCounter = maxExisting;

    const SKIP_TAGS = new Set([
        'script', 'style', 'title', 'meta', 'noscript',
        'input', 'textarea', 'select', 'option', 'button',
        'svg', 'path', 'rect', 'circle', 'line', 'polygon', 'polyline',
        'head', 'link', 'form'
    ]);

    // ============ УМНЫЕ ПАТТЕРНЫ ============
    // Телефон: +7, 8(XXX), 8-XXX, XXX-XX-XX
    const PHONE_REGEX = /(?:\+7|8)[\s\-\(]*\d{3}[\s\-\)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}/;
    // Простой телефон: XXX-XX-XX или XXX XX XX
    const PHONE_SIMPLE = /\d{3}[\s\-]\d{2}[\s\-]\d{2}/;
    // Email: что-то@что-то.что-то
    const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
    // Валюты
    const CURRENCY_REGEX = /[₽$€£¥₴₸]/;
    // Мессенджеры/соцсети
    const MESSENGER_REGEX = /\b(t\.me|wa\.me|vk\.com|instagram\.com|t.me)\//;

    // ============ ПРАВИЛО 1: КИРИЛЛИЦА (как было) ============
    const walker = doc.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                if (SKIP_TAGS.has(parent.tagName.toLowerCase())) return NodeFilter.FILTER_REJECT;
                if (parent.hasAttribute('data-edit')) return NodeFilter.FILTER_REJECT;
                const text = node.textContent;
                if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
                if (/[а-яА-ЯёЁ]/.test(text)) return NodeFilter.FILTER_ACCEPT;
                return NodeFilter.FILTER_REJECT;
            }
        }
    );

    const nodesToProcess = [];
    let node;
    while (node = walker.nextNode()) nodesToProcess.push(node);

    let textCount = 0;
    nodesToProcess.forEach(textNode => {
        const parent = textNode.parentElement;
        const key = `auto_${++textCounter}`;
        const span = doc.createElement('span');
        span.setAttribute('data-edit', key);
        span.textContent = textNode.textContent;
        parent.replaceChild(span, textNode);
        textCount++;
    });

    // ============ ПРАВИЛО 2: УМНОЕ РАСПОЗНАВАНИЕ ============
    // Проходим по всем элементам без вложенных детей
    const allElements = doc.body.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.hasAttribute('data-edit')) return;
        if (SKIP_TAGS.has(el.tagName.toLowerCase())) return;
        if (el.closest('form')) return;
        if (el.children.length > 0) return; // только "чистые" элементы

        const text = el.textContent.trim();
        if (!text) return;
        // Пропускаем если уже есть кириллица (она помечена в правиле 1)
        if (/[а-яА-ЯёЁ]/.test(text)) return;

        // Проверяем паттерны
        const isPhone = PHONE_REGEX.test(text) || PHONE_SIMPLE.test(text);
        const isEmail = EMAIL_REGEX.test(text) && text.length < 100;
        const isCurrency = CURRENCY_REGEX.test(text) && text.length < 30;
        const isMessenger = MESSENGER_REGEX.test(text);

        if (isPhone || isEmail || isCurrency || isMessenger) {
            const key = `auto_${++textCounter}`;
            const span = doc.createElement('span');
            span.setAttribute('data-edit', key);
            span.textContent = text;
            el.textContent = '';
            el.appendChild(span);
            textCount++;
        }
    });

    // ============ ПРАВИЛО 3: ССЫЛКИ tel: и mailto: ============
    // Даже если внутри нет кириллицы — помечаем
    const telMailLinks = doc.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
    telMailLinks.forEach(el => {
        if (el.hasAttribute('data-edit')) return;
        if (el.closest('form')) return;
        if (el.querySelector('[data-edit]')) return; // уже помечен в правиле 2
        
        const text = el.textContent.trim();
        if (!text) return;
        
        const key = `auto_${++textCounter}`;
        const span = doc.createElement('span');
        span.setAttribute('data-edit', key);
        span.textContent = text;
        el.textContent = '';
        el.appendChild(span);
        textCount++;
    });

    // ============ ПРАВИЛО 4: РУЧНЫЕ МЕТКИ data-editable ============
    doc.querySelectorAll('[data-editable]').forEach(el => {
        if (el.hasAttribute('data-edit')) return;
        const text = el.textContent.trim();
        if (!text) return;
        
        const key = `auto_${++textCounter}`;
        if (el.children.length === 0) {
            const span = doc.createElement('span');
            span.setAttribute('data-edit', key);
            span.textContent = text;
            el.textContent = '';
            el.appendChild(span);
        } else {
            el.setAttribute('data-edit', key);
        }
        el.removeAttribute('data-editable');
        textCount++;
    });

    // ============ ПРАВИЛО 5: ДОП. СЕЛЕКТОРЫ из config.js ============
    const extraSelectors = (CMS_CONFIG.extraEditableSelectors || []).join(', ');
    if (extraSelectors) {
        doc.querySelectorAll(extraSelectors).forEach(el => {
            if (el.hasAttribute('data-edit')) return;
            if (el.closest('form')) return;
            const text = el.textContent.trim();
            if (!text) return;
            
            const key = `auto_${++textCounter}`;
            if (el.children.length === 0) {
                const span = doc.createElement('span');
                span.setAttribute('data-edit', key);
                span.textContent = text;
                el.textContent = '';
                el.appendChild(span);
            } else {
                el.setAttribute('data-edit', key);
            }
            textCount++;
        });
    }

    // ============ КАРТИНКИ ============
    const CORE_IMAGE_WRAPPERS = [
        '.img-wrapper', '.gallery-item', '.team-photo',
        '.about-img-wrapper', '.hero-img-wrapper', '.product-image'
    ];
    const userWrappers = (CMS_CONFIG.imageWrappers || []);
    const wrapperSelector = [...CORE_IMAGE_WRAPPERS, ...userWrappers].join(', ');

    let imgCount = 0;
    doc.querySelectorAll('img').forEach(img => {
        if (img.hasAttribute('data-img')) return;
        const src = img.getAttribute('src');
        if (!src || /^(data:|blob:|https?:|\/\/)/i.test(src)) return;
        
        let path = src.split(/[?#]/)[0];
        try { path = decodeURIComponent(path); } catch {}
        path = path.replace(/^(\.\/)+/, '').replace(/^\/+/, '');
        if (!path || path.startsWith('../')) return;

        let wrapper = null;
        if (wrapperSelector) wrapper = img.closest(wrapperSelector);
        if (wrapper && wrapper.hasAttribute('data-img')) return;

        if (wrapper && wrapper.querySelector('[data-edit]')) {
            img.setAttribute('data-img', path);
        } else if (wrapper) {
            wrapper.setAttribute('data-img', path);
        } else {
            img.setAttribute('data-img', path);
        }
        imgCount++;
    });

    return {
        html: '<!DOCTYPE html>\n' + doc.documentElement.outerHTML,
        textCount,
        imgCount
    };
}
