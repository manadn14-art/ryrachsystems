#!/usr/bin/env bash
set -e
mkdir -p public src/styles src/lib src/hooks src/data src/components/forms src/pages
touch vite.config.js netlify.toml .gitignore .env.example index.html README.md
touch public/favicon.svg public/robots.txt public/sitemap.xml
touch src/main.jsx src/App.jsx src/styles/global.css
touch src/lib/config.js src/lib/netlify.js
touch src/hooks/useDocMeta.js
touch src/data/products.js src/data/jobs.js src/data/solutions.js src/data/faqs.js
touch src/components/Icon.jsx src/components/Logo.jsx src/components/Navbar.jsx
touch src/components/Footer.jsx src/components/BackToTop.jsx src/components/Ticker.jsx
touch src/components/Reveal.jsx src/components/Counter.jsx src/components/Accordion.jsx
touch src/components/Modal.jsx src/components/SectionHead.jsx src/components/PageHero.jsx
touch src/components/SectionCta.jsx src/components/MockupConsole.jsx src/components/ProductMockup.jsx
touch src/components/ApplicationModal.jsx src/components/forms/FormKit.jsx
touch src/pages/Home.jsx src/pages/Products.jsx src/pages/ProductDetail.jsx src/pages/Solutions.jsx
touch src/pages/Careers.jsx src/pages/JobDetail.jsx src/pages/About.jsx src/pages/Contact.jsx
touch src/pages/RequestDemo.jsx src/pages/Order.jsx src/pages/Developers.jsx
touch src/pages/Legal.jsx src/pages/Admin.jsx src/pages/NotFound.jsx
echo ""
echo "SUCCESS - all folders and files created"
