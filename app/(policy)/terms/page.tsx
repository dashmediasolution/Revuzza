
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Revuzza",
  description:
    "Terms and Conditions governing the use of Revuzza and its services.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

      <p className="text-sm text-gray-500 mb-8">
        Last Updated: June 2026
      </p>

      <div className="space-y-8 text-gray-800 leading-relaxed">
        <p>
          Welcome to Revuzza ("Revuzza," "we," "our," or "us"). These Terms and
          Conditions ("Terms") govern your access to and use of revuzza.com and
          all related services, features, content, applications, and
          functionality (collectively, the "Platform").
        </p>

        <p>
          By accessing, browsing, creating an account, submitting content, or
          otherwise using the Platform, you agree to be legally bound by these
          Terms.
        </p>

        <Section title="1. About Revuzza">
          <p>
            Revuzza is an online platform that allows users to publish, read,
            share, and interact with reviews, ratings, opinions, comments, and
            other user-generated content regarding businesses, organizations,
            products, and services.
          </p>
          <p>
            Revuzza functions solely as a neutral technology platform that hosts
            user-generated content.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least eighteen (18) years of age or the age of legal
            majority in your jurisdiction to create an account or submit
            content.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>You meet all eligibility requirements.</li>
            <li>All information you provide is accurate.</li>
            <li>
              Your use of the Platform complies with applicable laws and
              regulations.
            </li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>You are solely responsible for:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining account security.</li>
            <li>Protecting login credentials.</li>
            <li>Activities occurring under your account.</li>
          </ul>

          <p>
            You agree to notify Revuzza immediately of any unauthorized access
            or security breach involving your account.
          </p>
        </Section>

        <Section title="4. User-Generated Content">
          <p>
            You retain ownership of your User Content. By submitting content,
            you grant Revuzza a worldwide, perpetual, irrevocable,
            royalty-free, transferable, sublicensable, and non-exclusive
            license to host, store, reproduce, modify, publish, distribute,
            display, and promote such content.
          </p>
        </Section>

        <Section title="5. Content Standards">
          <p>You agree not to submit content that:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Is knowingly false or misleading.</li>
            <li>Is defamatory or unlawful.</li>
            <li>Harasses, threatens, or intimidates others.</li>
            <li>Violates privacy rights.</li>
            <li>Contains personal information without consent.</li>
            <li>Infringes intellectual property rights.</li>
            <li>Contains spam or deceptive advertising.</li>
            <li>Manipulates ratings or reviews.</li>
            <li>Uses fake accounts or coordinated review activity.</li>
          </ul>
        </Section>

        <Section title="6. Review Authenticity">
          <p>
            Users should only publish reviews based upon genuine personal
            experiences.
          </p>
        </Section>

        <Section title="7. Moderation Rights">
          <ul className="list-disc pl-6 space-y-2">
            <li>Review content.</li>
            <li>Remove content.</li>
            <li>Edit content formatting.</li>
            <li>Restrict visibility.</li>
            <li>Suspend accounts.</li>
            <li>Permanently terminate accounts.</li>
          </ul>
        </Section>

        <Section title="8. Business Listings">
          <p>
            The presence of a business listing does not constitute endorsement,
            partnership, approval, verification, or recommendation by Revuzza.
          </p>
        </Section>

        <Section title="9. Intellectual Property">
          <p>
            Except for User Content, all Platform content, software,
            trademarks, branding, logos, graphics, and design elements belong
            to Revuzza or its licensors.
          </p>
        </Section>

        <Section title="10. Copyright Complaints">
          <p>
            Copyright complaints should include identification of the work,
            allegedly infringing material, contact information, and required
            legal statements.
          </p>
        </Section>

        <Section title="11. Disclaimer of Warranties">
          <p className="font-medium uppercase">
            The Platform is provided "AS IS" and "AS AVAILABLE."
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy</li>
            <li>Reliability</li>
            <li>Availability</li>
          </ul>
        </Section>

        <Section title="12. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Revuzza shall not be liable
            for indirect, incidental, special, consequential, exemplary, or
            punitive damages.
          </p>

          <p>
            Revuzza's total liability shall not exceed USD $100.
          </p>
        </Section>

        <Section title="13. Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless Revuzza and its
            affiliates from claims arising from your use of the Platform,
            submitted content, violations of these Terms, or violations of law.
          </p>
        </Section>

        <Section title="14. Third-Party Links and Services">
          <p>
            Revuzza does not endorse or assume responsibility for third-party
            websites, products, services, advertisements, or content.
          </p>
        </Section>

        <Section title="15. Termination">
          <p>
            Revuzza may suspend, restrict, or terminate access to the Platform
            at any time and for any reason, including violations of these
            Terms.
          </p>
        </Section>

        <Section title="16. Governing Law">
          <p>
            These Terms shall be governed by the laws of the State of
            California, United States.
          </p>
        </Section>

        <Section title="17. Dispute Resolution">
          <p>
            Any dispute relating to these Terms or the Platform shall be
            resolved exclusively in the state or federal courts located in
            California, United States.
          </p>
        </Section>

        <Section title="18. Changes to These Terms">
          <p>
            Revuzza may modify these Terms at any time. Continued use of the
            Platform constitutes acceptance of updated Terms.
          </p>
        </Section>

        <Section title="19. Contact Information">
          <div className="space-y-2">
            <p>Email: support@revuzza.com</p>
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-gray-700 space-y-3">{children}</div>
    </section>
  );
}
