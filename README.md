# 🛠️ CommonShare Technical Assessment - Nuxt Project

A professional Nuxt 3 project for demonstrating frontend and full-stack skills. This project includes a dashboard, user management interface, and responsive design. Emphasis is placed on modern DevOps practices, CI/CD integration, and test automation.  

---

## 📸 Preview

![Project Screenshot](public/favicon.ico)  
> Clean, modern design powered by Nuxt 3, Vue 3, and TypeScript.

---

## 🚀 Tech Stack

| Category        | Technology                                  |
|----------------|---------------------------------------------|
| Frontend       | Nuxt 3, Vue 3, TypeScript                   |
| State/Store    | Vuex / Pinia (if used)                      |
| Forms & Validation | VeeValidate / Custom Form Handling       |
| Icons          | Font Awesome / Custom SVGs                  |
| Animations     | Vue Transitions / CSS Animations            |
| DevOps/CI      | GitHub Actions                              |
| Testing        | Vitest, Vue Test Utils                       |
| Build Tool     | Vite                                        |

---

## 📂 Project Structure

```

CommonShare-technical-assessment/
├── .github/workflows/    # GitHub Actions CI/CD workflows
├── app/                  # Vue components / pages
│   ├── app.vue
│   ├── dashboard.vue
│   └── users.vue
├── plugins/              # Nuxt plugins
├── public/               # Static assets
├── tests/                # Unit & integration tests
│   ├── app.test.ts
│   └── setup.ts
├── nuxt.config.ts        # Nuxt configuration
├── package.json          # Project metadata & scripts
├── tsconfig.json         # TypeScript config
├── vitest.config.ts      # Vitest config
└── README.md             # Project documentation

````

---

## 📦 Installation

```bash
# Clone the repository
git clone d:/GitHub/CommonShare-technical-assessment/
cd CommonShare-technical-assessment

# Install dependencies
npm install

# Run in development
npm run dev
````

---

## 🧪 Run Tests

```bash
npm run test
```

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

---

## ⚙️ GitHub Actions (CI/CD)

This project uses **GitHub Actions** to:

* ✅ Run build and lint checks on pull requests
* 🧪 Run tests automatically
* 🚀 Deploy to hosting platforms like Netlify, Vercel, or GitHub Pages

> Sample workflow file: `.github/workflows/ci.yml`

```yaml
name: Nuxt CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
```

---

## 🤝 Contributions

PRs and feedback are welcome! Feel free to fork, contribute, or improve upon this project.

---

## 📜 License

This project is licensed under the MIT License. See LICENSE for details.

---

## About Me

I'm Ongun Akay, a Senior Full-Stack Developer with expertise across various technologies.

* 👀 I specialize in full-stack development with extensive experience in frontend and backend technologies.
* 🌱 Currently, I'm sharpening my skills in advanced web development.
* 💞️ I’m always open to exciting collaborations and challenging projects.
* 📫 You can reach me at [info@ongunakay.com](mailto:info@ongunakay.com).

- 🌐 Website: [ongunakay.com](https://ongunakay.com)
- 💼 LinkedIn: [linkedin.com/in/ongunakay](https://linkedin.com/in/ongunakay)
- 🧑‍💻 GitHub: [github.com/ongunakaycom](https://github.com/ongunakaycom)
- 📬 Email: [info@ongunakay.com](mailto:info@ongunakay.com)
