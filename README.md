# Личный сайт организационного психолога

## Установка зависимостей

1. Клонируйте репозиторий:
    ```bash
    git clone https://github.com/mariaemel/project-org-psychologist
    ```

2. Для запуска бекенда перейдите в директорию проекта:
    ```bash
    cd orgPsych
    ```

3. Создайте виртуальное окружение:
    ```bash
    python -m venv venv
    ```

4. Активируйте виртуальное окружение:
    - Для **Windows**:
      ```bash
      venv\Scripts\activate
      ```
    - Для **macOS/Linux**:
      ```bash
      source venv/bin/activate
      ```

5. Установите зависимости:
    ```bash
    pip install -r requirements.txt
    ```
6. Запустите админку в виртуальном окружении:
   ```bash
   python manage.py runserver
   ```
7. Для запуска самого сайта перейдите в директорию проекта:
    ```bash
    cd frontend
    ```
8. Установите зависимости:
    ```bash
    npm install
    ```
9. Запустите проект:
    ```bash
    npm run dev
    ```
