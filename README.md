# Thapa Construction Website

A professional construction company website built with Nuxt 3, featuring responsive design, SEO optimization, and modern UI components.

## Setup Instructions

### Prerequisites
- Node.js (v16 or newer)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd thapaConstruction
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create necessary folders for images:
```bash
mkdir -p public/images/{services,projects,team,testimonials,clients}
```

4. Add your logo and images to the public/images directory

5. Check environment configuration:
   - Copy `.env.example` to `.env` (if applicable)
   - Update any environment variables as needed

### Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Your website will be available at http://localhost:3000

### Production Build

Build the application for production:
```bash
npm run build
# or
yarn build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
```

### Generate Static Site

Generate a static version of the website:
```bash
npm run generate
# or
yarn generate
```

## Dependencies

- Nuxt 3 (v3.8.0)
- Vue 3 (v3.3.4)
- TailwindCSS (v6.8.0)
- Nuxt Image (v1.0.0)
- Nuxt Icon (v0.5.0)
- Tailwind Forms plugin (v0.5.6)
- Tailwind Typography plugin (v0.5.10)

## Project Structure
