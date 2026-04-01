import Image from "next/image";
import { BENEFITS, HERO_IMAGE_URL } from "@/types/Register";

export default function RegistrationSidebar() {
  return (
    <div className="lg:col-span-4 hidden lg:block space-y-6 pt-8">
      {/* Benefits card */}
      <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Why Join AgriConnect?</h3>
        <ul className="space-y-4">
          {BENEFITS.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-primary-dark text-xl mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
              <div>
                <strong className="block text-sm font-semibold text-gray-800">{item.title}</strong>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Hero image */}
      <div className="relative rounded-xl overflow-hidden aspect-4/3">
        <Image
          src={HERO_IMAGE_URL}
          alt="Farmer inspecting crops"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 0px, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-6">
          <p className="text-white text-sm font-medium">
            &ldquo;AgriConnect helped us reduce post-harvest losses by 40%.&rdquo;
            <span className="opacity-75 text-xs block mt-1">— Sarah M., Grain Farmer</span>
          </p>
        </div>
      </div>
    </div>
  );
}