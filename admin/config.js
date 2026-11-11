
// ============ КОНФИГУРАЦИЯ АДМИНКИ ============
// Измени эти настройки под свой проект

const CMS_CONFIG = {
    // GitHub репозиторий
    owner: 'piarbookru-hub',
    repo: 'test',
    branch: 'main',
    
    // Название проекта (отображается в шапке)
    projectName: 'AVTOSERVIS',
    
    // Поля для редактирования товаров
    productFields: [
        { name: 'name', label: 'Название', type: 'text' },
        { name: 'price', label: 'Цена (₽)', type: 'number' },
        { name: 'old_price', label: 'Старая цена (₽)', type: 'number' },
        { name: 'volume', label: 'Объём', type: 'text' },
        { name: 'description', label: 'Описание', type: 'textarea' },
        { name: 'color', label: 'Цвет', type: 'select', options: [
            { value: 'classic', label: 'Classic (красный)' },
            { value: 'zero', label: 'Zero (чёрный)' },
            { value: 'light', label: 'Light (серебристый)' },
            { value: 'vanilla', label: 'Vanilla (бежевый)' },
            { value: 'cherry', label: 'Cherry (вишнёвый)' }
        ]}
    ],
    
    // Поля для отзывов
    reviewFields: [
        { name: 'name', label: 'Имя', type: 'text' },
        { name: 'company', label: 'Компания', type: 'text' },
        { name: 'text', label: 'Текст отзыва', type: 'textarea' },
        { name: 'rating', label: 'Рейтинг (1-5)', type: 'select', options: [
            { value: 5, label: '★★★★★' },
            { value: 4, label: '★★★★☆' },
            { value: 3, label: '★★★☆☆' },
            { value: 2, label: '★★☆☆☆' },
            { value: 1, label: '★☆☆☆☆' }
        ]}
    ],
    
    // Поля для контактов
    contactFields: [
        { name: 'phone', label: 'Телефон', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'address', label: 'Адрес', type: 'text' },
        { name: 'hours', label: 'Режим работы', type: 'text' },
        { name: 'vk', label: 'VK', type: 'text' },
        { name: 'telegram', label: 'Telegram', type: 'text' },
        { name: 'whatsapp', label: 'WhatsApp', type: 'text' }
    ],
    
    // Цвета для выбора
    colorPresets: [
        { name: 'Красный', value: '#F40009' },
        { name: 'Синий', value: '#0066CC' },
        { name: 'Зелёный', value: '#00AA44' },
        { name: 'Чёрный', value: '#1a1a1a' },
        { name: 'Оранжевый', value: '#FF6B00' },
        { name: 'Фиолетовый', value: '#8B00FF' },
        { name: 'Бирюзовый', value: '#00CED1' },
        { name: 'Розовый', value: '#FF1493' }
    ]
};
