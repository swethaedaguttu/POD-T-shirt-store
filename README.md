# POD T-Shirt Store

A modern, animated, and customizable e-commerce site for print-on-demand t-shirts. Built with **React**, **TypeScript**, **Framer Motion**, and **Tailwind CSS** to deliver a visually appealing and performant experience. The site supports transitions, typography controls, product customization (text/image), and smooth user interaction via modular components.

---

## ✨ Features

- 🌐 **Responsive Layout** — Grid-based, optimized for all screen sizes.
- 🎨 **Framer Motion Animations** — Smooth UI transitions and image effects.
- 🧩 **Component-Driven Development** — Atomic components, Storybook-driven.
- 🖋️ **Customizable Text & Images** — Users can preview their custom designs.
- 🛍️ **Product Options** — T-shirt, hoodie, sleevie, cap.
- 📦 **Drag and Drop File Upload** — Seamless user image input.
- 🎚️ **Live Body Metrics Input** — Height, weight, and build selector.
- 🔁 **Style Switching (Alt + Q)** — Switch between 3 unique styles instantly.

---

## 🛠️ Tech Stack

| Tech         | Description                                  |
|--------------|----------------------------------------------|
| **React 18** | Component-based UI library                   |
| **TypeScript** | Strongly typed JavaScript                  |
| **Vite**     | Fast bundler and dev server                  |
| **Tailwind CSS** | Utility-first CSS framework              |
| **Framer Motion** | Animation library for React             |
| **Storybook** | UI component explorer and documentation     |

---

## 📁 Project Structure

```bash
.
├── public/                  # Static assets (fonts, images)
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components (Home, Product)
│   ├── App.tsx              # App wrapper
│   ├── index.css            # Tailwind + custom styles
│   └── main.tsx             # Entry point
├── .storybook/              # Storybook config
├── tailwind.config.js       # Tailwind configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── README.md

🚀 Getting Started

1. Clone and Install

git clone https://your-repo-url.git
cd t-shirt-store
npm install

2. Development Server

npm run dev

3. Production Build

npm run build

4. Preview Production

npm run preview

🧪 Storybook
Storybook is used to develop and test components in isolation.

Launch Storybook

npm run storybook

Build Storybook

npm run build-storybook

Storybook Structure
.storybook/main.ts: Configuration

.storybook/preview.tsx: Global decorators and styles

src/components/*.stories.tsx: Component stories

🌈 Style Switching (Alt + Q)
Three distinct visual themes are included:

Theme 1 – Minimal white

Theme 2 – Dark neon

Theme 3 – Playful pastel

Use Alt + Q to switch between themes dynamically.

🎨 Customization Guide
Edit /src/index.css or tailwind.config.js to:

🎨 Update color palette

🖋️ Change font families

📐 Adjust layout spacing

📱 Modify responsive breakpoints

☁️ Deployment (Cloudflare)
Use the following command to deploy:


npm run build
Then deploy /dist folder to Cloudflare Pages using your dashboard or wrangler.

Note: Do not use Vercel. This project is optimized for Cloudflare.

📷 Screenshots
Home Page	Product Customization

📚 License
This project is licensed under the MIT License.

📬 Submission
When submitting:

✅ Provide a live Cloudflare URL

✅ Attach a .gz export of the GitLab repo

✅ Include availability for interviews

✅ Include a document describing:

📦 Component architecture

🔁 State management strategy

📖 How Storybook was integrated

🧩 How transitions and GSAP logic were converted into components

🤝 Acknowledgements
Original transition: Codrops Repeating Image Transition

UI components: CodePen


