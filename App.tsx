import React, { useState, useRef, useEffect } from 'react';
import { generateElectricalAdvice } from './services/geminiService';
import { ChatMessage, ServiceItem, Testimonial } from './types';

// Icons components (using SVG directly for zero-dependency)
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
const WrenchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);
const MessageCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

// --- Sub Components ---

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'G\'day! I\'m VoltBot 🤖. Have you got any electrical issues I can help you with today?', timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateElectricalAdvice(userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <ZapIcon />
              </div>
              <div>
                <h3 className="font-semibold text-sm">VoltBot Assistant</h3>
                <p className="text-xs text-primary-100 opacity-90">Online • AI Powered</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
              <XIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about switchboards, wiring..."
              className="flex-1 bg-slate-100 text-sm text-slate-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-sm"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-neutral-850' : 'bg-primary'} hover:brightness-110 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center`}
      >
        {isOpen ? <XIcon /> : <MessageCircleIcon />}
      </button>
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-primary">
              <ZapIcon />
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-900">Volt<span className="text-primary">Safe</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-primary transition">Home</a>
            <a href="#services" className="hover:text-primary transition">Services</a>
            <a href="#about" className="hover:text-primary transition">About Us</a>
            <a href="#testimonials" className="hover:text-primary transition">Testimonials</a>
            <button className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dark transition flex items-center gap-2 shadow-sm shadow-primary/20">
              <PhoneIcon />
              <span>0412 345 678</span>
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2">
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <a href="#home" className="block py-2 text-slate-600 hover:text-primary font-medium">Home</a>
          <a href="#services" className="block py-2 text-slate-600 hover:text-primary font-medium">Services</a>
          <a href="#about" className="block py-2 text-slate-600 hover:text-primary font-medium">About Us</a>
          <button className="w-full mt-2 bg-primary text-white py-2 rounded-lg font-medium">
            Contact Us
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div id="home" className="relative bg-slate-50 pt-16 pb-24 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-semibold uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              24/7 Service • Sydney Region
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
              Safe & Reliable <br/>
              <span className="text-primary">Electrical Solutions</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Don't risk your home's safety. Our certified electricians are ready to help with installations, repairs, and maintenance meeting highest Australian Standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="px-8 py-3.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition shadow-lg shadow-neutral-900/20">
                Book Now
              </button>
              <button onClick={() => document.querySelector('.bg-primary')?.scrollIntoView()} className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition">
                AI Consultation
              </button>
            </div>
            
            <div className="pt-8 flex items-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon />
                <span>30 Day Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <ZapIcon />
                <span>Fast Response</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
              {/* Abstract representation of an electrician at work via colored div since we can't use external images reliably without prompt guidance, keeping it abstract/clean */}
              <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-slate-600">
                {/* Fallback visual */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark to-primary opacity-90"></div>
                 <div className="relative z-10 text-white/90 text-center p-8">
                    <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <WrenchIcon />
                    </div>
                    <p className="font-medium text-lg">Licensed Electrician</p>
                    <p className="text-sm opacity-75">AS/NZS 3000 Compliant</p>
                 </div>
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
               <div className="bg-green-100 p-3 rounded-full text-green-600">
                 <ShieldCheckIcon />
               </div>
               <div>
                 <p className="text-xs text-slate-500 font-medium uppercase">Total Projects</p>
                 <p className="text-xl font-bold text-neutral-900">1,500+</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const services: ServiceItem[] = [
    {
      id: '1',
      title: 'New Installations',
      description: 'Wiring and installation for new builds or renovations, fully compliant with Australian wiring rules.',
      icon: ZapIcon
    },
    {
      id: '2',
      title: 'Fault Finding & Repairs',
      description: 'Rapid detection and repair of short circuits, power outages, and electrical hazards.',
      icon: WrenchIcon
    },
    {
      id: '3',
      title: 'Switchboard Upgrades',
      description: 'Upgrading old fuse boxes to modern circuit breakers (RCBOs) for enhanced safety and stability.',
      icon: ShieldCheckIcon
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Premium Services</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We handle all types of residential and commercial electrical issues with modern equipment and certified expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <service.icon />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {service.description}
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <a href="#" className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  View Details <span className="text-lg">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews: Testimonial[] = [
    { id: '1', name: 'Sarah Jenkins', role: 'Homeowner', content: 'Service was incredibly fast. The technician arrived 30 mins after I called about a burning smell. Very professional and safe.', rating: 5 },
    { id: '2', name: 'Mike Thompson', role: 'Cafe Owner', content: 'Lighting installation and rewiring for my cafe went smoothly. Clean work and great result. Highly recommended!', rating: 5 },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">What Our Clients Say</h2>
            <p className="text-slate-600">Customer satisfaction is our top priority.</p>
          </div>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(i => <div key={i} className="text-secondary">★</div>)}
            <span className="font-bold text-neutral-900 ml-2">4.9/5.0 Google Rating</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex gap-1 text-secondary mb-4">
                {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-slate-700 italic mb-6">"{review.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-neutral-900 text-sm">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactCTA = () => {
  return (
    <section className="py-20 bg-primary overflow-hidden relative">
       {/* Decorative circles */}
       <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
       
       <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need Emergency Electrical Help?</h2>
         <p className="text-primary-light text-lg mb-8 max-w-2xl mx-auto">
           Our team is ready to dispatch to your location. Don't delay small issues before they become major hazards.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button className="bg-white text-primary font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition shadow-xl">
             Contact via WhatsApp
           </button>
           <button className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition">
             View Pricing
           </button>
         </div>
       </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4 text-white">
            <ZapIcon />
            <span className="font-bold text-xl">VoltSafe</span>
          </div>
          <p className="mb-4">Professional, safe, and guaranteed electrical services for the Greater Sydney area.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Services</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary-light">New Installations</a></li>
            <li><a href="#" className="hover:text-primary-light">Fault Repair</a></li>
            <li><a href="#" className="hover:text-primary-light">Power Upgrades</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary-light">About Us</a></li>
            <li><a href="#" className="hover:text-primary-light">Careers</a></li>
            <li><a href="#" className="hover:text-primary-light">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Contact Us</h4>
          <p>45 Energy St, Sydney NSW 2000</p>
          <p className="mt-2">support@voltsafe.com.au</p>
          <p>02 9555 0199</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-neutral-800 text-center">
        <p>&copy; {new Date().getFullYear()} VoltSafe Australia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <ContactCTA />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
