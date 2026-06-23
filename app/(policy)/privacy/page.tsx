import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Revuzza",
  description:
    "Learn how Revuzza collects, uses, protects, and manages information on our platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="text-sm text-gray-500 mb-8">
        Last Updated: June 2026
      </p>

      <div className="space-y-8 text-gray-800 leading-relaxed">
        <Section title="1. Information We Collect">
          <p>
            Revuzza collects information in several ways to provide, maintain,
            improve, and protect the Platform. The information we collect
            depends on how you interact with the Platform.
          </p>

          <p>
            We collect information directly from users, automatically through
            technology, and from third-party sources where permitted by
            applicable law.
          </p>

          <h3 className="font-medium mt-4">A. Information You Provide</h3>

          <p>
            When you create an account, submit a review, communicate with us,
            report content, or otherwise interact with the Platform, you may
            voluntarily provide certain information.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Username</li>
            <li>Email address</li>
            <li>Profile information</li>
            <li>Reviews, ratings, comments, and other content</li>
            <li>Communications sent to Revuzza</li>
            <li>Information submitted through contact forms</li>
            <li>
              Information provided when reporting content or filing complaints
            </li>
          </ul>

          <p>
            You are responsible for ensuring that any information you provide is
            accurate and that you have the right to share such information with
            us.
          </p>
        </Section>

        <Section title="2. How We Use Information">
          <p>
            Revuzza uses collected information to operate the Platform, improve
            user experiences, maintain security, investigate misuse, and comply
            with legal obligations.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Operate and maintain the Platform</li>
            <li>Create and manage user accounts</li>
            <li>Publish user-generated content</li>
            <li>Improve Platform functionality</li>
            <li>Personalize user experiences</li>
            <li>Respond to inquiries and support requests</li>
            <li>Detect fraudulent or abusive activity</li>
            <li>Enforce our Terms and Policies</li>
            <li>Protect users and businesses</li>
            <li>Analyze Platform performance</li>
            <li>Comply with legal obligations</li>
            <li>Investigate complaints and disputes</li>
            <li>Protect our legal rights and interests</li>
          </ul>

          <p>
            We may also use aggregated, anonymized, or de-identified
            information for research, analytics, operational, business, and
            marketing purposes where such information cannot reasonably identify
            an individual.
          </p>
        </Section>

        <Section title="3. Public Content">
          <p>
            Revuzza operates as a public review platform designed to allow users
            to share experiences, opinions, and feedback regarding businesses,
            products, and services.
          </p>

          <p>
            Reviews, ratings, comments, usernames, profile information, and
            other content you voluntarily publish may become publicly accessible
            and may remain available even after being copied, shared, indexed,
            cached, or archived by third parties beyond Revuzza's control.
          </p>

          <p>
            Users should carefully consider what information they choose to
            publish and avoid posting confidential, sensitive, financial, or
            personal information.
          </p>
        </Section>

        <Section title="4. Disclosure of Information">
          <p>
            Revuzza does not sell personal information to third parties for
            monetary compensation.
          </p>

          <p>
            We may disclose information where necessary to operate the Platform,
            comply with legal obligations, protect users, investigate abuse, or
            facilitate legitimate business operations.
          </p>

          <p>
            Any disclosure of information will be conducted in accordance with
            applicable law and only to the extent reasonably necessary.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain information for as long as necessary to fulfill the
            purposes described in this Privacy Policy, comply with legal
            requirements, resolve disputes, enforce agreements, maintain
            business records, and protect Platform integrity.
          </p>

          <p>
            Even after information is deleted from active systems, copies may
            remain in backups, archives, logs, legal files, and disaster
            recovery environments for a reasonable period.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement commercially reasonable administrative, technical, and
            organizational safeguards designed to protect information from
            unauthorized access, disclosure, alteration, misuse, or
            destruction.
          </p>

          <p>
            No method of electronic transmission, internet communication, or
            storage can be guaranteed to be completely secure, and Revuzza
            cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="7. California Privacy Rights">
          <p>
            California residents may have certain rights under applicable
            California privacy laws, including the CCPA and CPRA where
            applicable.
          </p>

          <p>
            Eligible individuals may request access to certain information
            regarding how their personal information is collected, used,
            disclosed, corrected, or deleted.
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            Revuzza may modify, revise, or update this Privacy Policy from time
            to time to reflect changes in legal requirements, business
            operations, technologies, security practices, or Platform
            functionality.
          </p>

          <p>
            Continued use of the Platform after an updated Privacy Policy
            becomes effective constitutes acceptance of the revised terms.
          </p>
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