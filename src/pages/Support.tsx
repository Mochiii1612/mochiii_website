import { Link } from 'react-router-dom';
import { BookOpen, Bug, HelpCircle, Lightbulb, Mail, Shield } from 'lucide-react';
import { DOCS_URL, SECURITY_EMAIL, SUPPORT_EMAIL } from '../site.config';
import '../Support.css';

function Email({ to }: { to: string }) {
  return (
    <a href={`mailto:${to}`} className="inline-link">
      {to}
    </a>
  );
}

export default function Support() {
  return (
    <div className="support-page">
      <div className="support-hero">
        <div className="container">
          <h1 className="support-title">
            <span className="text-gradient">Support</span>
          </h1>
          <p className="support-subtitle">
            Write to us, report a bug or a security issue, or ask for a feature. Setup help is in the{' '}
            <a href={DOCS_URL} className="inline-link">docs</a>, and common questions are in the{' '}
            <Link to="/faq" className="inline-link">FAQ</Link>.
          </p>
        </div>
      </div>

      <div className="support-content container">
        <section className="support-section" aria-labelledby="support-email">
          <div className="section-icon">
            <Mail size={24} />
          </div>
          <h2 id="support-email">Email support</h2>
          <p>
            Email <Email to={SUPPORT_EMAIL} /> with a question, a bug report or a feature request.
          </p>
          <div className="info-box">
            <p><strong>No SLA.</strong> We do our best.</p>
          </div>
        </section>

        <section className="support-section" aria-labelledby="support-bug">
          <div className="section-icon">
            <Bug size={24} />
          </div>
          <h2 id="support-bug">Report a bug</h2>
          <p>
            Email <Email to={SUPPORT_EMAIL} /> with:
          </p>
          <div className="checklist">
            <ul>
              <li>Your OS and its version, for example Ubuntu 24.04 or Windows 11</li>
              <li>
                Which client: the VS Code extension or the terminal app, and its version (<code>mochiii --version</code>
                {' '}for the terminal app)
              </li>
              <li>What you did, step by step</li>
              <li>What you expected, and what happened instead</li>
              <li>
                The lines from Mochiii's logs around the problem. They are in <code>~/.local/state/mochiii/logs/</code>.
              </li>
            </ul>
          </div>
          <div className="info-box">
            <p>Logs can contain file paths from your project. Remove anything you don't want to share before you send them.</p>
          </div>
        </section>

        <section className="support-section" aria-labelledby="support-security">
          <div className="section-icon">
            <Shield size={24} />
          </div>
          <h2 id="support-security">Report a security issue</h2>
          <p>
            Email <Email to={SECURITY_EMAIL} />, not the support address, and don't post it anywhere public. Include:
          </p>
          <div className="checklist">
            <ul>
              <li>What the problem is</li>
              <li>Steps to reproduce it</li>
              <li>What it exposes, or what it lets someone do</li>
              <li>Any proof-of-concept code (please don't publish it)</li>
            </ul>
          </div>
          <p className="text-secondary">We treat security reports as a priority.</p>
        </section>

        <section className="support-section" aria-labelledby="support-feature">
          <div className="section-icon">
            <Lightbulb size={24} />
          </div>
          <h2 id="support-feature">Request a feature</h2>
          <p>
            Email <Email to={SUPPORT_EMAIL} /> with what you'd like Mochiii to do, and why it matters to you.
          </p>
        </section>

        <section className="support-section links-section" aria-labelledby="support-links">
          <h2 id="support-links">Help yourself</h2>
          <div className="links-grid">
            <a href={DOCS_URL} className="link-card">
              <BookOpen size={20} />
              <span>Docs</span>
            </a>
            <Link to="/faq" className="link-card">
              <HelpCircle size={20} />
              <span>FAQ</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
