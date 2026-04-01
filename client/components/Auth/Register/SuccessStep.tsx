import Link from "next/link";

interface Props {
  email: string;
}

export default function SuccessStep({ email }: Props) {
  return (
    <div className="py-4 space-y-6 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-4xl text-primary-dark"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            how_to_reg
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Your account has been created and your profile is pending review by a Ministry agent.
        </p>
      </div>

      {/* What happens next */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-left space-y-3">
        {[
          { icon: "email",         text: `A confirmation email has been sent to ${email}.` },
          { icon: "schedule",      text: "Verification takes 2–3 business days."           },
          { icon: "support_agent", text: "Contact support@agri.gov for expedited review."  },
        ].map((item) => (
          <div key={item.icon} className="flex items-start gap-3 text-sm text-gray-600">
            <span
              className="material-symbols-outlined text-primary-dark text-base mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {item.icon}
            </span>
            {item.text}
          </div>
        ))}
      </div>

      <Link
        href="/Login"
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg text-sm font-bold text-black bg-primary hover:bg-primary-dark transition-all"
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
          login
        </span>
        Go to Sign In
      </Link>
    </div>
  );
}