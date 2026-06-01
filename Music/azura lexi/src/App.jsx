import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  Clock, 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  Mail,
  Menu,
  X,
  Maximize2
} from 'lucide-react';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Cars', href: '#cars' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Booking', href: '#booking' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl py-4 shadow-2xl border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="text-2xl font-bold font-playfair tracking-tighter">
            <span className="text-white">AZURA</span>
            <span className="text-gold ml-2">LEXI</span>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-white/70 hover:text-gold transition-all text-xs uppercase tracking-[0.2em] font-semibold"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="tel:7510586080" 
            className="group relative px-6 py-2.5 bg-gold text-black rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2"
          >
            <Phone size={14} /> CALL NOW
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-gold text-sm uppercase tracking-widest font-medium border-b border-white/5 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-4 pt-4">
                <a 
                  href="tel:7510586080" 
                  className="bg-gold text-black text-center py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> CALL NOW
                </a>
                <a 
                  href="https://wa.me/917510586080" 
                  className="bg-[#25D366] text-white text-center py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> WHATSAPP US
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/WhatsApp Image 2026-05-12 at 11.34.00 AM.jpeg" 
          alt="Luxury Wedding Car" 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/40 to-luxury-black"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-gold uppercase tracking-[0.4em] text-xs md:text-sm font-bold mb-6 bg-gold/10 inline-block px-4 py-1.5 rounded-full border border-gold/20 backdrop-blur-sm">
            Est. 2020 • Kerala's Premier Fleet
          </h2>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-playfair font-bold text-white mb-8 leading-[1.1] tracking-tight">
            Luxury Wedding Cars <br /> <span className="gold-text-gradient">in Kerala</span>
          </h1>

          <p className="text-white/70 text-lg md:text-2xl max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Elegance is not being noticed, it's being remembered. Make your grand entrance 
            truly unforgettable with our exclusive collection of premium automobiles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/917510586080" 
              className="group relative px-10 py-5 bg-gold text-black font-extrabold rounded-2xl overflow-hidden transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center gap-3"
            >
              <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" /> 
              WHATSAPP FOR BOOKING
            </motion.a>
            
            <motion.a 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              href="tel:7510586080" 
              className="px-10 py-5 border border-white/20 text-white font-bold rounded-2xl transition-all backdrop-blur-md flex items-center gap-3"
            >
              <Phone size={20} /> CALL NOW
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/40 cursor-pointer"
        onClick={() => document.getElementById('about').scrollIntoView()}
      >
        <div className="w-7 h-12 border-2 border-gold/20 rounded-full flex justify-center p-1.5">
          <motion.div 
            animate={{ height: [4, 12, 4], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 bg-gold rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-32 bg-luxury-black relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            {...fadeIn}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] md:aspect-square">
              <img 
                src="/images/WhatsApp Image 2026-05-12 at 11.33.58 AM (2).jpeg" 
                alt="Luxury Car Interior" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-gold/20 rounded-3xl -z-0"></div>
            <div className="absolute top-10 -left-10 p-8 glass rounded-2xl z-20 hidden md:block">
              <div className="text-4xl font-playfair font-bold text-gold mb-1">500+</div>
              <div className="text-white/60 text-xs uppercase tracking-widest font-bold">Weddings Served</div>
            </div>
          </motion.div>

          <motion.div {...fadeIn}>
            <h3 className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">Premium Heritage</h3>
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-8 leading-tight">
              Where Luxury Meets <br /> <span className="italic text-gold/80">Every Detail</span>
            </h2>
            <div className="space-y-6 text-white/60 text-lg leading-relaxed">
              <p>
                AZURA LEXI is not just a car rental service; we are curators of moments. 
                Founded with a vision to bring world-class automotive luxury to the vibrant weddings of Kerala.
              </p>
              <p>
                Whether it's the classic grace of a Mercedes S-Class or the modern authority of a Jaguar, 
                our fleet is meticulously maintained to showroom standards.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Cars = () => {
  const cars = [
    {
      name: "Jaguar XJL",
      image: "/images/WhatsApp Image 2026-05-12 at 11.33.56 AM.jpeg",
      desc: "The ultimate statement of power and grace.",
      price: "Premium"
    },
    {
      name: "Mercedes S-Class",
      image: "/images/WhatsApp Image 2026-05-12 at 11.33.57 AM (2).jpeg",
      desc: "The global standard for luxury comfort.",
      price: "Luxury"
    },
    {
      name: "Audi A6 Matrix",
      image: "/images/WhatsApp Image 2026-05-12 at 11.33.58 AM.jpeg",
      desc: "Futuristic design and smooth handling.",
      price: "Executive"
    },
    {
      name: "BMW 5 Series",
      image: "/images/WhatsApp Image 2026-05-12 at 11.33.59 AM.jpeg",
      desc: "Perfect blend of sportiness and elegance.",
      price: "Sport"
    }
  ];

  return (
    <section id="cars" className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">The Selection</h2>
          <h3 className="text-4xl md:text-6xl font-playfair font-bold text-white">
            Curated <span className="gold-text-gradient">Luxury Fleet</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.map((car, idx) => (
            <motion.div 
              key={idx}
              {...fadeIn}
              transition={{ delay: idx * 0.1 }}
              className="group relative glass rounded-3xl overflow-hidden hover:border-gold/40 transition-all duration-500"
            >
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-white mb-3 font-playfair">{car.name}</h4>
                <p className="text-white/50 text-sm mb-8">{car.desc}</p>
                <a 
                  href={`https://wa.me/917510586080?text=I'm interested in booking the ${car.name}`}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/5 transition-all text-sm font-bold uppercase tracking-widest text-gold"
                >
                  Book Now <ChevronRight size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    { icon: <Star size={24} className="text-gold" />, title: "Luxury Experience", desc: "Top-tier vehicles and VIP treatment." },
    { icon: <UserCheck size={24} className="text-gold" />, title: "Chauffeur Driven", desc: "Professional drivers for your big day." },
    { icon: <Clock size={24} className="text-gold" />, title: "Precision Timing", desc: "We are always on time, every time." },
    { icon: <CheckCircle2 size={24} className="text-gold" />, title: "Premium Decor", desc: "Complimentary decoration support." }
  ];

  return (
    <section className="py-32 bg-luxury-black border-y border-white/5 relative">
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">Why Azura Lexi</h2>
        <h3 className="text-4xl md:text-6xl font-playfair font-bold text-white">The Gold Standard</h3>
      </div>
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            {...fadeIn}
            className="p-10 glass rounded-[40px] border border-white/5 hover:bg-gold/5 hover:border-gold/20 transition-all group text-center"
          >
            <div className="mb-8 p-5 bg-gold/10 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h4 className="text-xl font-bold text-white mb-4 font-playfair uppercase tracking-widest">{feature.title}</h4>
            <p className="text-white/40 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const images = [
    "/images/WhatsApp Image 2026-05-12 at 11.33.56 AM (1).jpeg",
    "/images/WhatsApp Image 2026-05-12 at 11.33.57 AM (1).jpeg",
    "/images/WhatsApp Image 2026-05-12 at 11.33.57 AM.jpeg",
    "/images/WhatsApp Image 2026-05-12 at 11.33.58 AM (1).jpeg",
    "/images/WhatsApp Image 2026-05-12 at 11.33.58 AM (3).jpeg",
    "/images/WhatsApp Image 2026-05-12 at 11.33.59 AM (1).jpeg",
    "/images/WhatsApp Image 2026-05-12 at 11.33.59 AM (2).jpeg",
    "/images/WhatsApp Image 2026-05-12 at 11.33.56 AM (2).jpeg",
  ];

  return (
    <section id="gallery" className="py-32 bg-black">
      <div className="container mx-auto px-6 text-center mb-20">
        <h2 className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">Captured Elegance</h2>
        <h3 className="text-4xl md:text-6xl font-playfair font-bold text-white">Our Gallery</h3>
      </div>
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -10 }}
            className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/5 cursor-pointer group"
            onClick={() => setSelectedImg(img)}
          >
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setSelectedImg(null)}
          >
            <motion.img 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              src={selectedImg} className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Booking = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', location: '', car: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `*Inquiry from Azura Lexi Website*%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Date:* ${formData.date}%0A*Location:* ${formData.location}%0A*Preferred Car:* ${formData.car}`;
    window.open(`https://wa.me/917510586080?text=${message}`, '_blank');
  };

  return (
    <section id="booking" className="py-32 bg-luxury-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-4xl glass p-12 md:p-20 rounded-[50px]">
        <h3 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-12 text-center">Reservation</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input type="text" placeholder="Full Name" required className="w-full bg-white/5 border-b border-white/20 py-4 text-white outline-none focus:border-gold" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input type="tel" placeholder="Phone Number" required className="w-full bg-white/5 border-b border-white/20 py-4 text-white outline-none focus:border-gold" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <input type="date" required className="w-full bg-white/5 border-b border-white/20 py-4 text-white outline-none focus:border-gold" onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
          <input type="text" placeholder="Wedding Location" required className="w-full bg-white/5 border-b border-white/20 py-4 text-white outline-none focus:border-gold" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          <select className="w-full bg-transparent border-b border-white/20 py-4 text-white/60 outline-none focus:border-gold appearance-none" onChange={(e) => setFormData({...formData, car: e.target.value})}>
            <option value="" className="bg-luxury-black">Select Preferred Car</option>
            <option value="Jaguar XJL" className="bg-luxury-black">Jaguar XJL</option>
            <option value="Mercedes S-Class" className="bg-luxury-black">Mercedes S-Class</option>
            <option value="Audi A6" className="bg-luxury-black">Audi A6</option>
            <option value="BMW 5 Series" className="bg-luxury-black">BMW 5 Series</option>
          </select>
          <button type="submit" className="w-full bg-gold text-black font-extrabold py-5 rounded-2xl uppercase tracking-widest mt-6 hover:shadow-lg transition-all">Send Inquiry</button>
        </form>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black py-20 border-t border-white/5 text-center">
      <div className="container mx-auto px-6">
        <div className="text-4xl font-bold font-playfair tracking-tighter mb-8">
          <span className="text-white">AZURA</span>
          <span className="text-gold ml-2">LEXI</span>
        </div>
        <p className="text-white/40 mb-10 max-w-sm mx-auto">Elevating the luxury wedding car experience in Kerala.</p>
        <div className="flex justify-center gap-6 mb-12">
          <Phone className="text-gold" /> <span className="text-white/60">+91 75105 86080</span>
        </div>
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} Azura Lexi. Designed by PixelPulse Marketing.</p>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="bg-luxury-black text-white selection:bg-gold selection:text-black font-inter">
      <Navbar />
      <Hero />
      <About />
      <Cars />
      <WhyChooseUs />
      <Gallery />
      <Booking />
      <Footer />
      <a href="https://wa.me/917510586080" className="fixed bottom-10 right-10 z-[60] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
        <MessageCircle className="text-white fill-white" size={32} />
      </a>
    </div>
  );
};

export default App;
