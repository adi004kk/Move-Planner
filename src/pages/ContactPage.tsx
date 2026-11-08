import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';

export const ContactPage: React.FC = () => {
  const { showToast } = useTravel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Trip Planning Assistance');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    showToast('Your message has been received! Our travel team will respond within 24 hours.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <SEOHead
        title="Contact MovePlanner — Customer Support & Travel Inquiries"
        description="Have a question about an itinerary or destination? Reach out to MovePlanner customer support and travel technology engineers."
        keywords="contact MovePlanner, customer support, travel help"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Support & Inquiries
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Contact MovePlanner
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Have questions about destination itineraries, feedback on guides, or custom group travel advice? Our concierge team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Support Channels (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <Mail className="w-5 h-5 text-sky-600" />
            <h3 className="font-serif font-bold text-slate-900 text-sm">Direct Email</h3>
            <p className="text-slate-500">support@moveplanner.app</p>
            <p className="text-slate-400 text-[11px]">Average response: Under 4 hours</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif font-bold text-slate-900 text-sm">24/7 Traveler Helpline</h3>
            <p className="text-slate-800 font-bold">+91 1800 200 4567</p>
            <p className="text-slate-400 text-[11px]">Toll-free emergency traveler assistance</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="font-serif font-bold text-slate-900 text-sm">Headquarters</h3>
            <p className="text-slate-600">Connaught Place, New Delhi, 110001, India</p>
          </div>
        </div>

        {/* Contact Form (2 Cols) */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">Message Dispatched!</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{name}</strong>. A MovePlanner destination specialist has been notified.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-2 text-xs font-bold text-sky-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="font-serif text-xl font-bold text-slate-900 mb-2">Send us a message</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="Trip Planning Assistance">Trip Planning Assistance</option>
                  <option value="Destination Guide Feedback">Destination Guide Feedback</option>
                  <option value="Hotel or Food Spot Listing">Hotel or Food Spot Recommendation</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">How can we help?</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your travel dates, preferred destination, questions, or ideas..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 h-32 focus:border-sky-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-sky-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
