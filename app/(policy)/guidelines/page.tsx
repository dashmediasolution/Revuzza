
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Guidelines | Revuzza",
  description:
    "Review Guidelines for Revuzza explaining standards for reviews, ratings, comments, photos, and other user-generated content.",
};

export default function ReviewGuidelinesPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Review Guidelines</h1>

      <p className="text-sm text-gray-500 mb-8">
        Last Updated: June 2026
      </p>

      <div className="space-y-8 text-gray-800 leading-relaxed">
        <p>
          Revuzza is committed to providing a trustworthy platform where users
          can share genuine experiences and opinions about businesses, products,
          and services.
        </p>

        <p>
          These Review Guidelines explain the standards that apply to reviews,
          ratings, comments, photos, and other user-generated content submitted
          to Revuzza ("Content").
        </p>

        <p>
          By submitting Content to the Platform, you agree to comply with these
          Guidelines, our Terms and Conditions, and all applicable laws.
        </p>

        <Section title="1. Our Goal">
          <p>
            The purpose of Revuzza is to help users make informed decisions
            through authentic experiences and honest feedback.
          </p>
          <p>
            We encourage constructive reviews that contribute meaningful
            information to the community while maintaining fairness,
            transparency, and respect for others.
          </p>
        </Section>

        <Section title="2. Authentic Experiences">
          <p>
            Reviews should be based on genuine first-hand experiences.
          </p>
          <p>
            Users should only submit reviews that accurately reflect their own
            interactions with a business, product, service, or organization.
          </p>
          <p>
            Reviews should be honest, truthful, and based on actual events.
          </p>
          <p>
            You should not submit reviews for experiences you did not personally
            have or verify.
          </p>
        </Section>

        <Section title="3. Accurate and Honest Content">
          <p>
            Users should make reasonable efforts to ensure statements are
            accurate and truthful.
          </p>
          <p>
            Users should avoid exaggerations, knowingly false claims,
            misleading statements, or fabricated allegations.
          </p>
          <p>
            Opinions are welcome, but factual claims should be supported by
            genuine experience whenever possible.
          </p>
        </Section>

        <Section title="4. Prohibited Content">
          <ul className="list-disc pl-6 space-y-2">
            <li>False or misleading reviews</li>
            <li>Fake ratings or fabricated experiences</li>
            <li>Fraudulent content</li>
            <li>Defamatory statements</li>
            <li>Harassment or bullying</li>
            <li>Hate speech</li>
            <li>Threats or intimidation</li>
            <li>Obscene or offensive content</li>
            <li>Discriminatory content</li>
            <li>Illegal content</li>
            <li>Spam or promotional content</li>
            <li>Political campaigning unrelated to the review</li>
            <li>Malicious accusations</li>
            <li>Content encouraging unlawful activity</li>
            <li>Content intended to manipulate ratings or rankings</li>
          </ul>
        </Section>

        <Section title="5. Conflicts of Interest">
          <p>
            Reviews must be impartial and independent.
          </p>

          <p>Examples include:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Reviewing your own business</li>
            <li>Reviewing an employer for promotional purposes</li>
            <li>Reviewing a direct competitor</li>
            <li>Reviewing a family member's business</li>
            <li>Coordinated review campaigns</li>
          </ul>
        </Section>

        <Section title="6. Incentivized Reviews">
          <p>
            Users should not publish reviews in exchange for compensation,
            gifts, discounts, rewards, services, or benefits unless properly
            disclosed and permitted by law.
          </p>
        </Section>

        <Section title="7. Privacy and Personal Information">
          <p>Reviews must not contain personal or sensitive information.</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Home addresses</li>
            <li>Personal phone numbers</li>
            <li>Government identification numbers</li>
            <li>Financial information</li>
            <li>Medical information</li>
            <li>Private communications</li>
            <li>Non-public personal information</li>
          </ul>
        </Section>

        <Section title="8. Intellectual Property">
          <p>
            Users should only upload content they own or have permission to use.
          </p>
        </Section>

        <Section title="9. Business Disputes">
          <p>
            Businesses may dispute reviews they believe violate these
            Guidelines.
          </p>
        </Section>

        <Section title="10. Reporting Content">
          <p>
            Users and businesses may report reviews or content that may violate
            these Guidelines.
          </p>
        </Section>

        <Section title="11. Enforcement">
          <p>
            Revuzza may take action against content or accounts that violate
            these Guidelines.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Content removal</li>
            <li>Content visibility restrictions</li>
            <li>Review rejection</li>
            <li>Account warnings</li>
            <li>Temporary account suspension</li>
            <li>Permanent account termination</li>
            <li>Restriction of Platform features</li>
          </ul>
        </Section>

        <Section title="12. Moderation Discretion">
          <p>
            Revuzza is not obligated to publish, retain, display, or remove any
            particular review or content.
          </p>
        </Section>

        <Section title="13. Changes to These Guidelines">
          <p>
            Revuzza may update these Review Guidelines at any time. Continued
            use of the Platform constitutes acceptance of updated versions.
          </p>
        </Section>

        <Section title="14. Contact Information">
          <div className="space-y-2">
            <p>Review Policy Questions: support@revuzza.com</p>
            <p>Website: https://revuzza.com</p>
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

