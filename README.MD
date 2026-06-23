# 📇 Flashcard Manager

A full‑stack flashcard management web application with a dark theme. Built with **Python (Flask)** on the backend and a responsive **HTML/CSS/JavaScript** frontend.  
Supports **LaTeX** rendering (via MathJax), **Markdown** formatting in descriptions, **automatic text direction** (RTL/LTR) based on content, and **categorized flashcards** with full CRUD operations.

---

## ✨ Features

- **Category Management** – Create, rename, and delete folders (categories) to organize your flashcards.
- **Flashcard CRUD** – Add, edit, delete, and flip cards with a single click.
- **LaTeX Support** – Any content wrapped in `$...$` is automatically rendered as a mathematical formula using MathJax.
- **Markdown in Descriptions** – The back side of each card supports GitHub‑flavored Markdown:
  - `**bold**`, `*italic*`, `` `code` ``
  - Headings, lists, links, images, tables, blockquotes
  - Line breaks are preserved (press `Enter` for a new paragraph)
- **Automatic RTL/LTR Detection** – The description side adjusts its text direction based on the presence of Arabic, Hebrew, or other right‑to‑left scripts.
- **Dark Theme** – Easy on the eyes, perfect for late‑night study sessions.
- **Persistent Storage** – All data is stored in a local `data.json` file (no external database required).
- **Fully Responsive** – Works on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Backend     | Python 3 + Flask                    |
| Frontend    | HTML5, CSS3, Vanilla JavaScript     |
| Rendering   | MathJax (LaTeX), marked.js (Markdown) |
| Security    | DOMPurify (XSS sanitization)        |
| Data Store  | JSON file (persistent)              |

---

## 📁 Project Structure

```

flashcard-manager/
├── server.py              # Flask API server
├── templates/
│   └── index.html         # Single‑page frontend
├── data.json              # Auto‑generated (stores categories & cards)
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

1. Install dependencies
   ```bash
   pip install flask
   ```
2. Run the server
   ```bash
   python server.py
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

---

📖 Usage Guide

Managing Categories

· The sidebar lists all existing categories.
· Click a category to view its flashcards.
· Enter a new category name in the input field and click + to create it.
· Click the ✕ next to a category to delete it (this removes all its cards as well).

Working with Flashcards

· Once a category is selected, click + Add Flashcard to open the modal.
· Fill in:
  · Front – The question, term, or prompt.
        Use $...$ for LaTeX formulas (e.g., $E=mc^2$).
  · Back – The answer or description.
        Supports full Markdown (e.g., **bold**, - list items, [links](url)).
· Click Save – the card will appear in the grid.
· Click any card to flip it (front ↔ back).
· Use the ✎ (edit) or ✕ (delete) buttons on each card to modify or remove it.

LaTeX & Markdown Examples

Front (with LaTeX) Back (with Markdown)
$ \int_0^\infty e^{-x} dx $ **Integral** – converges to *1*.
$ \sum_{i=1}^n i = \frac{n(n+1)}{2} $ [Learn more](https://example.com)

Note: If the entire back content is wrapped in $...$, it will be rendered as LaTeX instead of Markdown (useful for purely mathematical descriptions).

RTL/LTR Auto‑Detection

· The back side detects characters from Arabic, Hebrew, Persian, and other RTL scripts.
· The appropriate CSS class (rtl or ltr) is applied automatically, ensuring correct text alignment.

---

🛡️ Security

· All user‑supplied content is escaped or sanitized:
  · Plain text fields use textContent to prevent XSS.
  · Markdown output is filtered through DOMPurify with safe tags/attributes.
  · LaTeX is processed by MathJax in a safe sandbox.

---

📦 API Endpoints (for developers)

Method Endpoint Description
GET /api/categories List all categories
POST /api/categories Create a new category
DELETE /api/categories/<name> Delete a category
GET /api/cards/<category> Get all cards in a category
POST /api/cards Add a new card
PUT /api/cards/<id> Update a card (supports moving to another category)
DELETE /api/cards/<id> Delete a card

All requests and responses are in JSON format.

---

🤝 Contributing

Pull requests and feature suggestions are welcome!
If you encounter any issues, please open an issue on GitHub.

---

📄 License

This project is open‑source and available under the MIT License.

---

🌟 Acknowledgements

· MathJax for LaTeX rendering.
· marked.js for Markdown parsing.
· DOMPurify for XSS sanitization.
· Flask for the lightweight Python backend.

---

Happy studying! 🎓


