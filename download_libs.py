import os
import requests
import shutil
import zipfile
import io
from pathlib import Path

# پوشه‌های مقصد
STATIC_JS = Path("static/js")
STATIC_JS_MATHJAX = STATIC_JS / "mathjax"

# ایجاد پوشه‌ها در صورت نبود
STATIC_JS.mkdir(parents=True, exist_ok=True)
STATIC_JS_MATHJAX.mkdir(parents=True, exist_ok=True)

# لیست کتابخانه‌های مورد نیاز با URL نسخه‌های پایدار
LIBS = {
    "marked.min.js": {
        "url": "https://cdn.jsdelivr.net/npm/marked@11.0.0/marked.min.js",
        "dest": STATIC_JS / "marked.min.js",
    },
    "purify.min.js": {
        "url": "https://cdn.jsdelivr.net/npm/dompurify@3.0.0/dist/purify.min.js",
        "dest": STATIC_JS / "purify.min.js",
    },
}


def download_file(url, dest):
    """دانلود یک فایل با نمایش پیشرفت ساده"""
    print(f"⬇️  Downloading {dest.name} ...")
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(dest, "wb") as f:
            total = int(response.headers.get("content-length", 0))
            if total == 0:
                f.write(response.content)
            else:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    downloaded += len(chunk)
                    percent = (downloaded / total) * 100
                    print(f"   Progress: {percent:.1f}%", end="\r")
                print()  # خط جدید
        print(f"✅ Saved to {dest}")
    else:
        print(f"❌ Failed to download {url} (status {response.status_code})")


def download_mathjax():
    """دانلود و استخراج MathJax (نسخه کامل ES5)"""
    mathjax_zip_url = "https://github.com/mathjax/MathJax/archive/refs/tags/3.2.2.zip"
    print("⬇️  Downloading MathJax (this may take a while)...")
    response = requests.get(mathjax_zip_url, stream=True)
    if response.status_code == 200:
        zip_data = io.BytesIO()
        total = int(response.headers.get("content-length", 0))
        downloaded = 0
        for chunk in response.iter_content(chunk_size=8192):
            zip_data.write(chunk)
            downloaded += len(chunk)
            if total:
                percent = (downloaded / total) * 100
                print(f"   Downloading MathJax: {percent:.1f}%", end="\r")
        print()  # خط جدید

        print("📦 Extracting MathJax...")
        with zipfile.ZipFile(zip_data) as zf:
            # استخراج فقط پوشهٔ es5 از داخل آرشیو
            for member in zf.namelist():
                if member.startswith("MathJax-3.2.2/es5/"):
                    # حذف پیشوند "MathJax-3.2.2/" برای کپی مستقیم در mathjax/
                    target_path = STATIC_JS_MATHJAX / member.replace(
                        "MathJax-3.2.2/es5/", ""
                    )
                    if member.endswith("/"):  # دایرکتوری
                        target_path.mkdir(parents=True, exist_ok=True)
                    else:
                        with open(target_path, "wb") as f:
                            f.write(zf.read(member))
        print(f"✅ MathJax extracted to {STATIC_JS_MATHJAX}")
    else:
        print(f"❌ Failed to download MathJax (status {response.status_code})")


def main():
    print("🚀 Starting library download...\n")

    # دانلود فایل‌های تک‌فایلی
    for name, info in LIBS.items():
        download_file(info["url"], info["dest"])

    # دانلود MathJax
    download_mathjax()

    print("\n✅ All libraries downloaded successfully!")
    print("Now you can run: python server.py")


if __name__ == "__main__":
    main()
