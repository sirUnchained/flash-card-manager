# 📇 Flashcard Manager

A full‑stack flashcard management web application with a **dark theme**, built with **Python (Flask)** on the backend and **vanilla HTML/CSS/JavaScript** on the frontend.  
It supports **LaTeX** rendering (via MathJax), **Markdown** formatting in descriptions, **automatic RTL/LTR** text direction, **categorized flashcards** with full CRUD, and a fully **responsive** layout for desktop and mobile.

All frontend libraries are **served locally** – no CDN dependencies. A Python script downloads them automatically.

---

## ✨ Features

- **Category Management** – Create, view, and delete folders (categories) to organize your flashcards.
- **Flashcard CRUD** – Add, edit, delete, and flip cards with a single click.
- **LaTeX Support** – Content wrapped in `$...$` is rendered as mathematical formulas using MathJax.
- **Markdown in Descriptions** – The back side supports GitHub‑flavored Markdown:
  - `**bold**`, `*italic*`, `` `code` ``
  - Headings, lists, links, images, tables, blockquotes
  - Line breaks are preserved (press `Enter` for new paragraphs)
- **Automatic RTL/LTR Detection** – The description side adjusts its text direction based on the presence of Arabic, Hebrew, or other right‑to‑left scripts.
- **Responsive Design** – Optimised for both desktop and mobile:
  - Collapsible sidebar with hamburger menu on small screens
  - Touch‑friendly buttons and cards
  - Adaptive grid layout
- **Dark Theme** – Easy on the eyes, perfect for late‑night studying.
- **Persistent Storage** – All data is stored in a local `data.json` file (no database required).
- **Local Dependencies** – All libraries (MathJax, marked, DOMPurify) are downloaded and served locally – no CDN, no npm/Node.js needed.

---

## 🛠️ Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Backend     | Python 3 + Flask                    |
| Frontend    | HTML5, CSS3, Vanilla JavaScript     |
| Rendering   | MathJax (LaTeX), marked.js (Markdown) |
| Security    | DOMPurify (XSS sanitization)        |
| Data Store  | JSON file (persistent)              |
| Build Tool  | Python script (downloads libraries) |

---

## 📁 Project Structure

```
flashcard-manager/
├── server.py                 # Flask API server
├── download_libs.py          # Python script to download frontend libraries
├── templates/
│   └── index.html            # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css         # All styles (responsive)
│   └── js/
│       ├── app.js            # Main application logic
│       ├── marked.min.js     # (auto‑downloaded)
│       ├── purify.min.js     # (auto‑downloaded)
│       └── mathjax/          # (auto‑downloaded – MathJax ES5 distribution)
├── data.json                 # Auto‑generated (stores categories & cards)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.7 or higher
- `pip` (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flashcard-manager.git
   cd flashcard-manager
   ```

2. **Install Python dependencies**
   ```bash
   pip install flask requests
   ```

3. **Download frontend libraries**
   ```bash
   python download_libs.py
   ```
   This script will:
   - Download `marked.min.js` and `purify.min.js` from CDN.
   - Download and extract MathJax (version 3.2.2) into `static/js/mathjax/`.

4. **Run the server**
   ```bash
   python server.py
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

---

## 📖 Usage Guide

### Managing Categories
- The sidebar lists all existing categories.
- Click a category to view its flashcards.
- Enter a new category name in the input field and click **`+`** to create it.
- Click the **`✕`** next to a category to delete it (this removes all its cards as well).

### Working with Flashcards
- Once a category is selected, click **`+ Add Flashcard`** to open the modal.
- Fill in:
  - **Front** – The question, term, or prompt.  
    Use `$...$` for LaTeX formulas (e.g., `$E=mc^2$`).
  - **Back** – The answer or description.  
    Supports full Markdown (e.g., `**bold**`, `- list items`, `[links](url)`).
- Click **Save** – the card will appear in the grid.
- Click any card to flip it (front ↔ back).
- Use the **`✎`** (edit) or **`✕`** (delete) buttons on each card to modify or remove it.

### LaTeX & Markdown Examples
| Front (with LaTeX) | Back (with Markdown) |
|-------------------|----------------------|
| `$ \int_0^\infty e^{-x} dx $` | `**Integral** – converges to *1*.` |
| `$ \sum_{i=1}^n i = \frac{n(n+1)}{2} $` | `[Learn more](https://example.com)` |

> **Note:** If the entire back content is wrapped in `$...$`, it will be rendered as LaTeX instead of Markdown (useful for purely mathematical descriptions).

### RTL/LTR Auto‑Detection
- The back side detects characters from Arabic, Hebrew, Persian, and other RTL scripts.
- The appropriate CSS class (`rtl` or `ltr`) is applied automatically, ensuring correct text alignment.

---

## 📱 Responsive Behaviour

- **Desktop (≥901px)**: Sidebar always visible, cards in a multi‑column grid.
- **Tablet / Mobile (≤900px)**: Sidebar collapses behind a hamburger menu; cards switch to a single‑column layout; font sizes and touch targets are optimised for fingers.
- **Small Mobile (≤480px)**: Further reduced padding and font sizes for comfortable use on tiny screens.

---

## 🛡️ Security

- All user‑supplied content is **escaped** or **sanitized**:
  - Plain text fields use `textContent` to prevent XSS.
  - Markdown output is filtered through **DOMPurify** with safe tags/attributes.
  - LaTeX is processed by MathJax in a safe sandbox.

---

## 📦 API Endpoints (for developers)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/categories` | List all categories |
| POST   | `/api/categories` | Create a new category |
| DELETE | `/api/categories/<name>` | Delete a category |
| GET    | `/api/cards/<category>` | Get all cards in a category |
| POST   | `/api/cards` | Add a new card |
| PUT    | `/api/cards/<id>` | Update a card (supports moving to another category) |
| DELETE | `/api/cards/<id>` | Delete a card |

All requests and responses are in **JSON** format.

---

## 🧹 Maintaining Dependencies

To update any library, simply edit the URLs and version numbers inside `download_libs.py` and run it again.  
The script will overwrite the existing files with the new versions.

```python
# Example: change marked version
'marked.min.js': {
    'url': 'https://cdn.jsdelivr.net/npm/marked@NEW_VERSION/marked.min.js',
    'dest': STATIC_JS / 'marked.min.js'
}
```

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome!  
If you encounter any issues, please open an issue on GitHub.

---

## 📄 License

This project is open‑source and available under the **MIT License**.

---

## 🌟 Acknowledgements

- [MathJax](https://www.mathjax.org/) for LaTeX rendering.
- [marked.js](https://marked.js.org/) for Markdown parsing.
- [DOMPurify](https://github.com/cure53/DOMPurify) for XSS sanitization.
- [Flask](https://flask.palletsprojects.com/) for the lightweight Python backend.

---

**Happy studying!** 🎓