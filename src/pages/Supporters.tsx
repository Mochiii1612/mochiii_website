import { Heart } from 'lucide-react';
import '../Support.css';

export default function Supporters() {
  return (
    <div className="support-page">
      <div className="support-hero">
        <div className="container">
          <h1 className="support-title">
            Our <span className="text-gradient">Supporters</span>
          </h1>
          <p className="support-subtitle">
            The people who make Mochiii possible.
          </p>
        </div>
      </div>

      <div className="support-content container">
        {/* Our Supporters */}
        <section className="support-section supporters-section">
          <div className="section-icon">
            <Heart size={24} />
          </div>
          <h2>Our Supporters</h2>
          <p>Mochiii is made possible by the support of our community. Special thanks to:</p>

          <div className="supporters-grid">
            <div className="supporter-card glass-panel">
              <h3>Community</h3>
              <ul>
                <li>Everyone who files bug reports and suggests features</li>
                <li>Early adopters who trust Mochiii despite the rough edges</li>
                <li>Developers who run their own local models and want an agent that works with them</li>
              </ul>
            </div>
          </div>

          <div className="cta-box">
            <h3>Support Mochiii's Development</h3>
            <p>If you'd like to support the project, consider:</p>
            <ul>
              <li>Contributing code or documentation</li>
              <li>Spreading the word to developers who want a coding agent that can also run on a local model</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
