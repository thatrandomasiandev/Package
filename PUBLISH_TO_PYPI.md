# Publishing to PyPI Guide

**Make your packages installable with simple `pip install` commands**

Created by Joshua Terranova

---

## 🎯 Goal

After publishing to PyPI, anyone can install your packages with:
```bash
pip install syntax-forge
pip install python-lens
pip install visual-flow
# etc.
```

---

## 📋 Prerequisites

1. **Create PyPI Account**: https://pypi.org/account/register/
2. **Create Test PyPI Account** (optional, for testing): https://test.pypi.org/account/register/
3. **Install build tools**:
```bash
pip install build twine
```

---

## 🚀 Publishing Steps

### Step 1: Build All Packages

Run this script to build all packages:

```bash
cd "/Users/joshuaterranova/Desktop/Coding Files: Website Files/VSCode Packages"

# Build each package
for package in packages/*/; do
    echo "Building $(basename $package)..."
    cd "$package"
    python3 -m build
    cd ../..
done
```

Or build individually:
```bash
cd packages/syntax-forge
python3 -m build
cd ../..

cd packages/python-lens
python3 -m build
cd ../..

# Repeat for each package...
```

This creates `dist/` folders with `.whl` and `.tar.gz` files.

### Step 2: Create PyPI API Token

1. Go to https://pypi.org/manage/account/
2. Scroll to "API tokens"
3. Click "Add API token"
4. Name it (e.g., "code-lab-packages")
5. Select scope: "Entire account" (or specific projects)
6. Copy the token (starts with `pypi-`)
7. Save it securely!

### Step 3: Configure PyPI Credentials

Create `~/.pypirc`:
```bash
nano ~/.pypirc
```

Add this content:
```ini
[distutils]
index-servers =
    pypi
    testpypi

[pypi]
username = __token__
password = pypi-YOUR_TOKEN_HERE

[testpypi]
repository = https://test.pypi.org/legacy/
username = __token__
password = pypi-YOUR_TEST_TOKEN_HERE
```

### Step 4: Upload to PyPI

**Test on TestPyPI first (recommended):**
```bash
cd packages/syntax-forge
python3 -m twine upload --repository testpypi dist/*
```

**Upload to real PyPI:**
```bash
cd packages/syntax-forge
python3 -m twine upload dist/*
```

### Step 5: Publish All Packages

Script to publish all:
```bash
#!/bin/bash
cd "/Users/joshuaterranova/Desktop/Coding Files: Website Files/VSCode Packages"

packages=(
    "syntax-forge"
    "python-lens"
    "visual-flow"
    "runtime-spark"
    "data-pulse"
    "performance-lens"
    "graph-dynamics"
    "diagram-weaver"
    "java-lens"
    "spec-runner"
    "step-tracer"
    "color-forge"
    "ui-forge"
    "notebook-bridge"
    "version-chronicle"
)

for pkg in "${packages[@]}"; do
    echo "Publishing $pkg..."
    cd "packages/$pkg"
    
    # Clean old builds
    rm -rf dist/ build/ *.egg-info
    
    # Build
    python3 -m build
    
    # Upload
    python3 -m twine upload dist/*
    
    cd ../..
    echo "✅ $pkg published!"
done

echo "🎉 All packages published to PyPI!"
```

---

## 📝 After Publishing

Once published, update your README with:

```markdown
## Installation

Install any package with pip:

```bash
pip install syntax-forge
pip install python-lens
pip install visual-flow
pip install runtime-spark
pip install data-pulse
pip install performance-lens
pip install graph-dynamics
pip install diagram-weaver
pip install java-lens
pip install spec-runner
pip install step-tracer
pip install color-forge
pip install ui-forge
pip install notebook-bridge
pip install version-chronicle
```

Or install all at once:
```bash
pip install syntax-forge python-lens visual-flow runtime-spark data-pulse \
    performance-lens graph-dynamics diagram-weaver java-lens spec-runner \
    step-tracer color-forge ui-forge notebook-bridge version-chronicle
```

---

## 🔄 Updating Published Packages

When you make changes:

1. **Update version number** in `setup.py`:
```python
setup(
    name="syntax-forge",
    version="1.0.1",  # Increment this
    ...
)
```

2. **Rebuild and republish**:
```bash
cd packages/syntax-forge
rm -rf dist/ build/ *.egg-info
python3 -m build
python3 -m twine upload dist/*
```

---

## ⚠️ Important Notes

### Package Names
- Your PyPI package names use **hyphens**: `syntax-forge`
- Python imports use **underscores**: `from syntax_forge import ...`
- This is standard practice and works perfectly!

### Version Numbers
- Must increment for each update
- Format: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`, `1.0.1`, `1.1.0`)
- Can't reuse version numbers

### First-Time Publishing
- Package names are claimed on first publish
- Make sure no one else has these names
- Check here: https://pypi.org/search/?q=syntax-forge

---

## 🧪 Test Before Publishing

Test locally first:
```bash
cd packages/syntax-forge
pip install -e .
python3 -c "from syntax_forge import BaseParser; print('Works!')"
```

Test from TestPyPI:
```bash
pip install --index-url https://test.pypi.org/simple/ syntax-forge
```

---

## 📊 Package Status

Check your published packages:
- Your PyPI profile: https://pypi.org/user/YOUR_USERNAME/
- Package page example: https://pypi.org/project/syntax-forge/

---

## 🛠️ Troubleshooting

### "Package already exists"
- Someone else owns that name on PyPI
- Choose different name or add prefix (e.g., `jt-syntax-forge`)

### "Invalid credentials"
- Check your `~/.pypirc` file
- Make sure token is correct (starts with `pypi-`)

### "Version already exists"
- Increment version number in `setup.py`
- Can't upload same version twice

### "HTTP 403: Invalid or non-existent authentication"
- Generate new API token
- Update `~/.pypirc`

---

## 📦 Alternative: Create install script

If you don't want to publish to PyPI, create an install script:

**install.sh:**
```bash
#!/bin/bash
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/syntax-forge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/python-lens
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/visual-flow
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/runtime-spark
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/data-pulse
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/performance-lens
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/graph-dynamics
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/diagram-weaver
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/java-lens
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/spec-runner
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/step-tracer
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/color-forge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/ui-forge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/notebook-bridge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/version-chronicle
echo "✅ All packages installed!"
```

Users run:
```bash
curl -sSL https://raw.githubusercontent.com/thatrandomasiandev/Package/main/install.sh | bash
```

---

**Created by Joshua Terranova**  
**MIT License**

