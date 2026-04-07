import { Metadata } from "next";
import { Shield, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Blitz Analyzer",
  description:
    "Learn how Blitz Analyzer collects, uses, and protects your personal information and resume data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white dark:bg-[#030303] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[400px] bg-blue-50/60 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Last updated: <span className="font-semibold text-slate-700 dark:text-slate-300">January 2025</span>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-32">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="space-y-16">
            {/* Intro */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-6 md:p-8">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                At <strong className="text-slate-900 dark:text-white">Blitz Analyzer</strong>, your privacy is
                fundamental to how we build our product. This Privacy Policy explains how we collect, use, store, and
                protect your personal information when you use our resume analysis platform. By using Blitz Analyzer, you
                agree to the practices described in this policy.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <PolicySection number="1" title="Information We Collect">
              <p>We collect the following types of information to provide and improve our services:</p>
              <ul>
                <li>
                  <strong>Account Information:</strong> When you create an account, we collect your name, email address,
                  and authentication credentials.
                </li>
                <li>
                  <strong>Resume Data:</strong> When you upload a resume for analysis, we process the content of your
                  document, including work experience, education, skills, and other professional information.
                </li>
                <li>
                  <strong>Job Description Data:</strong> If you provide job descriptions for matching analysis, we
                  process and store that content for the duration of the analysis.
                </li>
                <li>
                  <strong>Usage Data:</strong> We automatically collect information about how you interact with our
                  platform, including pages visited, features used, timestamps, and device information.
                </li>
                <li>
                  <strong>Payment Information:</strong> When you purchase a plan, payment details are processed securely
                  through our third-party payment provider. We do not store full credit card numbers.
                </li>
              </ul>
            </PolicySection>

            {/* 2. How We Use Your Information */}
            <PolicySection number="2" title="How We Use Your Information">
              <p>Your information is used exclusively for the following purposes:</p>
              <ul>
                <li>
                  <strong>Resume Analysis:</strong> To analyze your resume against ATS standards and provide actionable
                  optimization recommendations.
                </li>
                <li>
                  <strong>Job Matching:</strong> To compare your resume against job descriptions and generate match
                  scores and improvement suggestions.
                </li>
                <li>
                  <strong>Account Management:</strong> To manage your account, process transactions, and communicate
                  service-related updates.
                </li>
                <li>
                  <strong>Product Improvement:</strong> To understand usage patterns and improve our AI algorithms,
                  features, and user experience.
                </li>
                <li>
                  <strong>Communication:</strong> To send you important service updates, security alerts, and, with your
                  consent, promotional content.
                </li>
              </ul>
            </PolicySection>

            {/* 3. Data Storage & Security */}
            <PolicySection number="3" title="Data Storage & Security">
              <p>
                We take the security of your data seriously and implement industry-standard measures to protect it:
              </p>
              <ul>
                <li>
                  All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption.
                </li>
                <li>
                  Resume files are stored in secure, access-controlled cloud infrastructure with regular security audits.
                </li>
                <li>
                  Access to personal data is restricted to authorized personnel only, following the principle of least
                  privilege.
                </li>
                <li>
                  We conduct regular vulnerability assessments and penetration testing to identify and address potential
                  threats.
                </li>
              </ul>
              <p>
                While we strive to protect your information, no method of electronic transmission or storage is 100%
                secure. We encourage you to use strong passwords and keep your account credentials confidential.
              </p>
            </PolicySection>

            {/* 4. Cookies & Tracking */}
            <PolicySection number="4" title="Cookies & Tracking">
              <p>Blitz Analyzer uses cookies and similar technologies for the following purposes:</p>
              <ul>
                <li>
                  <strong>Essential Cookies:</strong> Required for the platform to function properly, including session
                  management and authentication.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform so we can
                  improve the experience.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings and preferences, such as theme selection
                  and language.
                </li>
              </ul>
              <p>
                You can manage your cookie preferences through your browser settings. Disabling certain cookies may
                affect the functionality of our platform.
              </p>
            </PolicySection>

            {/* 5. Third-Party Services */}
            <PolicySection number="5" title="Third-Party Services">
              <p>
                We work with trusted third-party providers to deliver our services. These providers are bound by
                contractual obligations to protect your data:
              </p>
              <ul>
                <li>
                  <strong>AI Processing:</strong> We use third-party AI models to power our resume analysis and
                  optimization features. Data sent to these services is processed in accordance with their privacy
                  policies and our data processing agreements.
                </li>
                <li>
                  <strong>Payment Processing:</strong> Transactions are handled by PCI-DSS compliant payment processors.
                  We never store your full payment card details on our servers.
                </li>
                <li>
                  <strong>Cloud Infrastructure:</strong> Our platform is hosted on enterprise-grade cloud providers with
                  industry-leading security certifications.
                </li>
                <li>
                  <strong>Analytics:</strong> We use privacy-conscious analytics tools to monitor platform performance
                  and usage trends.
                </li>
              </ul>
            </PolicySection>

            {/* 6. Your Rights */}
            <PolicySection number="6" title="Your Rights">
              <p>
                Depending on your jurisdiction, you may have the following rights regarding your personal data:
              </p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Request that we correct any inaccurate or incomplete personal data.
                </li>
                <li>
                  <strong>Deletion:</strong> Request the deletion of your personal data and account from our systems.
                </li>
                <li>
                  <strong>Portability:</strong> Request your data in a structured, commonly used, and machine-readable
                  format.
                </li>
                <li>
                  <strong>Objection:</strong> Object to the processing of your personal data for certain purposes,
                  including marketing.
                </li>
                <li>
                  <strong>Withdrawal of Consent:</strong> Withdraw your consent at any time where processing is based on
                  consent.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@blitz-analyzer.com"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  privacy@blitz-analyzer.com
                </a>
                . We will respond to your request within 30 days.
              </p>
            </PolicySection>

            {/* 7. Data Retention */}
            <PolicySection number="7" title="Data Retention">
              <p>We retain your data only for as long as necessary to fulfill the purposes outlined in this policy:</p>
              <ul>
                <li>
                  <strong>Account Data:</strong> Retained for the duration of your active account. Upon account deletion,
                  personal data is permanently removed within 30 days.
                </li>
                <li>
                  <strong>Resume Files:</strong> Uploaded resumes are retained while your account is active. You can
                  delete individual resumes at any time from your dashboard.
                </li>
                <li>
                  <strong>Analysis Results:</strong> Analysis history is maintained for your reference and is deleted
                  alongside your account data.
                </li>
                <li>
                  <strong>Payment Records:</strong> Transaction records are retained as required by applicable tax and
                  accounting regulations.
                </li>
              </ul>
            </PolicySection>

            {/* 8. Changes to This Policy */}
            <PolicySection number="8" title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or
                legal requirements. When we make material changes, we will:
              </p>
              <ul>
                <li>Update the &ldquo;Last updated&rdquo; date at the top of this page.</li>
                <li>Notify registered users via email for significant changes.</li>
                <li>Display a prominent notice on our platform when applicable.</li>
              </ul>
              <p>
                We encourage you to review this page periodically to stay informed about how we protect your data.
              </p>
            </PolicySection>

            {/* 9. Contact Us */}
            <PolicySection number="9" title="Contact Us">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, we
                are here to help.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:privacy@blitz-analyzer.com"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Email us at
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">privacy@blitz-analyzer.com</p>
                  </div>
                </a>
              </div>
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-500">
                We aim to respond to all privacy-related inquiries within 48 hours during business days.
              </p>
            </PolicySection>
          </div>
        </div>
      </section>
    </div>
  );
}

function PolicySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-bold shrink-0">
          {number}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_li]:leading-relaxed [&_strong]:text-slate-800 [&_strong]:dark:text-slate-200">
        {children}
      </div>
    </section>
  );
}
