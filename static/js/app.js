// ---------- State ----------
let currentCategory = null;
let allCategories = [];
let cards = [];
let editingCardId = null;

// DOM refs
const categoryListEl = document.getElementById('categoryList');
const currentCategoryTitle = document.getElementById('currentCategoryTitle');
const cardsContainer = document.getElementById('cardsContainer');
const addCardBtn = document.getElementById('addCardBtn');
const newCatInput = document.getElementById('newCatInput');
const addCatBtn = document.getElementById('addCatBtn');
const modalOverlay = document.getElementById('cardModal');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalFront = document.getElementById('modalFront');
const modalBack = document.getElementById('modalBack');
const modalSave = document.getElementById('modalSave');
const modalCancel = document.getElementById('modalCancel');
const toastEl = document.getElementById('toast');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');

// ---------- تنظیمات marked ----------
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });
}

// ---------- Helpers ----------
function detectDirection(text) {
    const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text) ? 'rtl' : 'ltr';
}

function isLatex(text) {
    return text && text.startsWith('$') && text.endsWith('$');
}

function renderMarkdown(text) {
    if (!text) return '';
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        const rawHtml = marked.parse(text);
        return DOMPurify.sanitize(rawHtml, {
            ADD_TAGS: ['math', 'svg', 'path', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'mtable', 'mtd', 'mtr'],
            ADD_ATTR: ['xmlns', 'viewBox', 'stroke', 'fill', 'fontfamily', 'fontsize', 'mathcolor', 'mathvariant']
        });
    }
    return text;
}

function renderPlainText(text) {
    return nl2br(escapeHtml(text));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function nl2br(text) {
    return text.replace(/\n/g, '<br>');
}

function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._hideTimeout);
    toastEl._hideTimeout = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ---------- API calls ----------
async function fetchCategories() {
    const res = await fetch('/api/categories');
    return res.json();
}

async function fetchCards(category) {
    const res = await fetch(`/api/cards/${encodeURIComponent(category)}`);
    return res.json();
}

async function addCategory(name) {
    const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: name })
    });
    return res;
}

async function deleteCategory(name) {
    const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE'
    });
    return res;
}

async function addCard(category, front, back) {
    const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, front, back })
    });
    return res;
}

async function updateCard(id, category, front, back) {
    const res = await fetch(`/api/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, front, back })
    });
    return res;
}

async function deleteCard(id) {
    const res = await fetch(`/api/cards/${id}`, {
        method: 'DELETE'
    });
    return res;
}

// ---------- Render functions ----------
function renderCategoryList() {
    categoryListEl.innerHTML = '';
    allCategories.forEach(cat => {
        const li = document.createElement('li');
        li.className = (cat === currentCategory) ? 'active' : '';
        const span = document.createElement('span');
        span.className = 'cat-name';
        span.textContent = cat;
        li.appendChild(span);

        const delBtn = document.createElement('button');
        delBtn.className = 'del-cat';
        delBtn.textContent = '✕';
        delBtn.title = 'Delete category';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDeleteCategory(cat);
        });
        li.appendChild(delBtn);

        li.addEventListener('click', () => {
            selectCategory(cat);
        });
        categoryListEl.appendChild(li);
    });
    populateModalCategories();
}

function populateModalCategories() {
    const currentVal = modalCategory.value;
    modalCategory.innerHTML = '';
    allCategories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        modalCategory.appendChild(opt);
    });
    if (allCategories.length > 0) {
        if (currentVal && allCategories.includes(currentVal)) {
            modalCategory.value = currentVal;
        } else {
            modalCategory.value = allCategories[0];
        }
    }
}

function renderCards() {
    if (!currentCategory) {
        cardsContainer.innerHTML = `<div class="empty-msg">Choose a category to see flashcards</div>`;
        currentCategoryTitle.textContent = 'Select a category';
        addCardBtn.disabled = true;
        return;
    }
    currentCategoryTitle.textContent = `📂 ${currentCategory}`;
    addCardBtn.disabled = false;

    if (cards.length === 0) {
        cardsContainer.innerHTML = `<div class="empty-msg">No flashcards in this category. Add one!</div>`;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'flashcard';
        cardDiv.dataset.id = card.id;

        const inner = document.createElement('div');
        inner.className = 'flashcard-inner';

        // Front
        const frontDiv = document.createElement('div');
        frontDiv.className = 'flashcard-front';
        let frontContent = card.front || '';
        if (isLatex(frontContent)) {
            frontDiv.innerHTML = frontContent;
        } else {
            frontDiv.innerHTML = renderPlainText(frontContent);
        }

        // Back
        const backDiv = document.createElement('div');
        backDiv.className = 'flashcard-back';
        const backText = card.back || '';
        const dir = detectDirection(backText);
        backDiv.classList.add(dir);
        if (isLatex(backText)) {
            backDiv.innerHTML = backText;
        } else {
            backDiv.innerHTML = renderMarkdown(backText);
        }

        inner.appendChild(frontDiv);
        inner.appendChild(backDiv);
        cardDiv.appendChild(inner);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        const editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(card);
        });
        const delBtn = document.createElement('button');
        delBtn.className = 'del-card';
        delBtn.textContent = '✕';
        delBtn.title = 'Delete';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDeleteCard(card.id);
        });
        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        cardDiv.appendChild(actions);

        cardDiv.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions')) return;
            cardDiv.classList.toggle('flipped');
        });

        grid.appendChild(cardDiv);
    });

    cardsContainer.innerHTML = '';
    cardsContainer.appendChild(grid);

    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise().catch(() => { });
    }
}

// ---------- Actions ----------
async function selectCategory(cat) {
    currentCategory = cat;
    try {
        cards = await fetchCards(cat);
    } catch (e) {
        cards = [];
        showToast('Error loading cards');
    }
    renderCategoryList();
    renderCards();

    // بستن سایدبار در موبایل بعد از انتخاب دسته
    if (window.innerWidth <= 900) {
        sidebar.classList.remove('open');
        hamburgerBtn.classList.remove('open');
    }
}

async function handleDeleteCategory(cat) {
    if (!confirm(`Delete category "${cat}" and all its flashcards?`)) return;
    try {
        const res = await deleteCategory(cat);
        if (res.ok) {
            if (currentCategory === cat) {
                currentCategory = null;
                cards = [];
            }
            allCategories = await fetchCategories();
            renderCategoryList();
            renderCards();
            showToast(`Category "${cat}" deleted`);
        } else {
            const err = await res.json();
            showToast('Error: ' + (err.error || ''));
        }
    } catch (e) {
        showToast('Error deleting category');
    }
}

async function handleDeleteCard(id) {
    if (!confirm('Delete this flashcard?')) return;
    try {
        const res = await deleteCard(id);
        if (res.ok) {
            cards = cards.filter(c => c.id !== id);
            renderCards();
            showToast('Card deleted');
        } else {
            const err = await res.json();
            showToast('Error: ' + (err.error || ''));
        }
    } catch (e) {
        showToast('Error deleting card');
    }
}

function openAddModal() {
    editingCardId = null;
    modalTitle.textContent = 'Add Flashcard';
    modalFront.value = '';
    modalBack.value = '';
    populateModalCategories();
    if (currentCategory && allCategories.includes(currentCategory)) {
        modalCategory.value = currentCategory;
    }
    modalOverlay.classList.add('open');
}

function openEditModal(card) {
    editingCardId = card.id;
    modalTitle.textContent = 'Edit Flashcard';
    modalFront.value = card.front || '';
    modalBack.value = card.back || '';
    populateModalCategories();
    if (currentCategory && allCategories.includes(currentCategory)) {
        modalCategory.value = currentCategory;
    } else if (allCategories.length > 0) {
        modalCategory.value = allCategories[0];
    }
    modalOverlay.classList.add('open');
}

async function saveCardFromModal() {
    const category = modalCategory.value;
    const front = modalFront.value.trim();
    const back = modalBack.value.trim();
    if (!category) {
        showToast('Please select a category');
        return;
    }
    if (!front && !back) {
        showToast('Please fill at least one field');
        return;
    }

    try {
        let res;
        if (editingCardId) {
            res = await updateCard(editingCardId, category, front, back);
        } else {
            res = await addCard(category, front, back);
        }
        if (res.ok) {
            if (currentCategory === category) {
                cards = await fetchCards(category);
                renderCards();
            } else {
                showToast('Card saved in "' + category + '"');
                if (currentCategory) {
                    cards = await fetchCards(currentCategory);
                    renderCards();
                }
            }
            if (!currentCategory) {
                selectCategory(category);
            }
            modalOverlay.classList.remove('open');
            showToast('Card saved!');
        } else {
            const err = await res.json();
            showToast('Error: ' + (err.error || ''));
        }
    } catch (e) {
        showToast('Error saving card');
    }
}

// ---------- Event listeners ----------
addCardBtn.addEventListener('click', openAddModal);

modalCancel.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
});

modalSave.addEventListener('click', saveCardFromModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
    }
});

addCatBtn.addEventListener('click', async () => {
    const name = newCatInput.value.trim();
    if (!name) return;
    try {
        const res = await addCategory(name);
        if (res.ok) {
            allCategories = await fetchCategories();
            renderCategoryList();
            newCatInput.value = '';
            showToast(`Category "${name}" created`);
        } else {
            const err = await res.json();
            showToast('Error: ' + (err.error || ''));
        }
    } catch (e) {
        showToast('Error creating category');
    }
});

newCatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addCatBtn.click();
    }
});

// ===== Hamburger menu =====
hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    sidebar.classList.toggle('open');
});

// بستن سایدبار با کلیک بیرون
document.addEventListener('click', (e) => {
    const isMobile = window.innerWidth <= 900;
    if (isMobile && sidebar.classList.contains('open')) {
        const target = e.target;
        if (!sidebar.contains(target) && !hamburgerBtn.contains(target)) {
            sidebar.classList.remove('open');
            hamburgerBtn.classList.remove('open');
        }
    }
});

// بستن سایدبار هنگام تغییر اندازه به دسکتاپ
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        sidebar.classList.remove('open');
        hamburgerBtn.classList.remove('open');
    }
});

// ---------- Initialisation ----------
async function init() {
    try {
        allCategories = await fetchCategories();
        renderCategoryList();
        if (allCategories.length > 0) {
            selectCategory(allCategories[0]);
        } else {
            renderCards();
        }
    } catch (e) {
        showToast('Error connecting to server');
    }
}

init();