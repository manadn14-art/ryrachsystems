import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BackToTop from './components/BackToTop.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Solutions from './pages/Solutions.jsx';
import Careers from './pages/Careers.jsx';
import JobDetail from './pages/JobDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import RequestDemo from './pages/RequestDemo.jsx';
import Order from './pages/Order.jsx';
import Developers from './pages/Developers.jsx';
import Legal from './pages/Legal.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:jobId" element={<JobDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/request-demo" element={<RequestDemo />} />
          <Route path="/order" element={<Order />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}