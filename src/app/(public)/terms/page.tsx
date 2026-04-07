import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Blitz Analyzer",
  description:
    "Read the Terms of Service for Blitz Analyzer — the AI-powered resume analysis platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto px-6 mb-20">
        <div className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
          Legal
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: <span className="font-semibold">January 2025</span>
        </p>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* 1. Acceptance of Terms */}
        <Section number="1" title="Acceptance of Terms">
          <p>
            By accessing or using Blitz Analyzer (&quot;the Service&quot;), you
            agree to be bound by these Terms of Service (&quot;Terms&quot;). If
            you do not agree to all of these Terms, you may not access or use
            the Service.
          </p>
          <p>
            We reserve the right to update or modify these Terms at any time
            without prior notice. Your continued use of the Service after any
            such changes constitutes your acceptance of the new Terms. It is
            your responsibility to review these Terms periodically.
          </p>
        </Section>

        {/* 2. Description of Service */}
        <Section number="2" title="Description of Service">
          <p>
            Blitz Analyzer is an AI-powered resume analysis platform that helps
            job seekers optimize their resumes for Applicant Tracking Systems
            (ATS) and improve their overall application quality. The Service may
            include, but is not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
            <li>Resume scoring and ATS compatibility analysis</li>
            <li>Keyword optimization recommendations</li>
            <li>Formatting and content improvement suggestions</li>
            <li>Job description matching and gap analysis</li>
            <li>AI-generated resume enhancement suggestions</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of
            the Service at any time, with or without notice. We shall not be
            liable to you or any third party for any modification, suspension, or
            discontinuance of the Service.
          </p>
        </Section>

        {/* 3. User Accounts */}
        <Section number="3" title="User Accounts">
          <p>
            To access certain features of the Service, you may be required to
            create an account. When creating an account, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
            <li>
              Provide accurate, current, and complete information during
              registration
            </li>
            <li>
              Maintain and promptly update your account information to keep it
              accurate and complete
            </li>
            <li>
              Maintain the security and confidentiality of your login
              credentials
            </li>
            <li>
              Accept responsibility for all activities that occur under your
              account
            </li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
          </ul>
          <p>
            We reserve the right to suspend or terminate your account at our
            sole discretion, without notice, for conduct that we determine
            violates these Terms or is harmful to other users, us, or third
            parties, or for any other reason.
          </p>
        </Section>

        {/* 4. Acceptable Use */}
        <Section number="4" title="Acceptable Use">
          <p>
            You agree not to use the Service for any unlawful purpose or in any
            way that could damage, disable, or impair the Service. Specifically,
            you agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
            <li>
              Upload content that is fraudulent, misleading, or contains false
              information
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Service or
              its related systems
            </li>
            <li>
              Use automated scripts, bots, or other means to access the Service
              without our express permission
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the
              Service
            </li>
            <li>
              Reproduce, duplicate, copy, sell, or resell any part of the
              Service without express written permission
            </li>
            <li>
              Use the Service to generate spam, phishing content, or any other
              abusive material
            </li>
          </ul>
        </Section>

        {/* 5. Intellectual Property */}
        <Section number="5" title="Intellectual Property">
          <p>
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of Blitz Analyzer and its
            licensors. The Service is protected by copyright, trademark, and
            other intellectual property laws.
          </p>
          <p>
            You retain all rights to the resume content and personal data you
            upload to the Service. By uploading content, you grant Blitz
            Analyzer a limited, non-exclusive license to process, analyze, and
            store your content solely for the purpose of providing the Service
            to you.
          </p>
          <p>
            Our trademarks, logos, and service marks may not be used in
            connection with any product or service without our prior written
            consent.
          </p>
        </Section>

        {/* 6. Payment & Refunds */}
        <Section number="6" title="Payment & Refunds">
          <p>
            Certain features of the Service may require a paid subscription.
            By subscribing to a paid plan, you agree to pay the applicable fees
            as described at the time of purchase.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
            <li>
              All fees are billed in advance on a recurring basis (monthly or
              annually) unless otherwise stated
            </li>
            <li>
              You authorize us to charge your designated payment method for all
              fees incurred
            </li>
            <li>
              Prices are subject to change with reasonable notice; changes will
              not affect your current billing cycle
            </li>
            <li>
              Refund requests may be submitted within 14 days of the initial
              purchase or renewal and are handled on a case-by-case basis
            </li>
          </ul>
          <p>
            You may cancel your subscription at any time through your account
            settings. Cancellation will take effect at the end of your current
            billing period, and you will retain access to paid features until
            that time.
          </p>
        </Section>

        {/* 7. Limitation of Liability */}
        <Section number="7" title="Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Blitz Analyzer
            and its affiliates, officers, directors, employees, and agents shall
            not be liable for any indirect, incidental, special, consequential,
            or punitive damages, including but not limited to loss of profits,
            data, use, or goodwill, arising out of or in connection with your
            use of the Service.
          </p>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis without warranties of any kind, whether
            express or implied. We do not guarantee that the Service will be
            uninterrupted, error-free, or that any analysis results will lead
            to specific employment outcomes.
          </p>
          <p>
            In no event shall our total liability to you exceed the amount you
            have paid to Blitz Analyzer in the twelve (12) months preceding the
            event giving rise to the claim.
          </p>
        </Section>

        {/* 8. Termination */}
        <Section number="8" title="Termination">
          <p>
            We may terminate or suspend your access to the Service immediately,
            without prior notice or liability, for any reason, including but not
            limited to a breach of these Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately
            cease. If you wish to terminate your account, you may do so by
            contacting us or using the account deletion feature within the
            Service.
          </p>
          <p>
            All provisions of these Terms which by their nature should survive
            termination shall survive, including but not limited to ownership
            provisions, warranty disclaimers, indemnity, and limitations of
            liability.
          </p>
        </Section>

        {/* 9. Governing Law */}
        <Section number="9" title="Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which Blitz Analyzer operates,
            without regard to its conflict of law provisions.
          </p>
          <p>
            Any disputes arising from or relating to these Terms or the Service
            shall be resolved through binding arbitration in accordance with the
            applicable arbitration rules, unless you are located in a
            jurisdiction where arbitration agreements are not enforceable.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights.
          </p>
        </Section>

        {/* 10. Contact Us */}
        <Section number="10" title="Contact Us">
          <p>
            If you have any questions, concerns, or requests regarding these
            Terms of Service, please contact our legal team:
          </p>
          <div className="bg-muted/30 rounded-2xl p-6 border border-border space-y-2">
            <p className="font-semibold text-foreground">
              Blitz Analyzer — Legal Department
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:legal@blitz-analyzer.com"
                className="text-blue-500 hover:underline font-medium"
              >
                legal@blitz-analyzer.com
              </a>
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              We aim to respond to all inquiries within 5 business days.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        <span className="text-primary">{number}.</span> {title}
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}
