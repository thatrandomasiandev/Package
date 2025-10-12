@echo off
REM Install all Code Lab packages (Windows)
REM Created by Joshua Terranova

echo =========================================
echo Code Lab Package Installation
echo By Joshua Terranova
echo =========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo Python version:
python --version
echo.

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip setuptools wheel

echo.
echo Installing Code Lab packages...
echo ========================================

REM Install packages in order
for %%p in (
    syntax-forge
    runtime-spark
    visual-flow
    python-lens
    java-lens
    rust-lens
    diagram-weaver
    graph-dynamics
    data-pulse
    spec-runner
    performance-lens
    step-tracer
    color-forge
    ui-forge
    notebook-bridge
    version-chronicle
    code-mentor
    snippet-vault
    output-forge
    live-sync
) do (
    echo.
    echo Installing %%p...
    if exist "packages\%%p" (
        pip install -e "packages\%%p"
        echo Package %%p installed
    ) else (
        echo Package directory not found: packages\%%p
    )
)

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo All packages have been installed in editable mode.
echo You can now import them in Python:
echo.
echo   from syntax_forge import BaseParser
echo   from runtime_spark import Executor
echo   from visual_flow import FlowChartGenerator
echo.
echo To activate the environment in the future, run:
echo   venv\Scripts\activate.bat
echo.
echo Created by Joshua Terranova

pause

