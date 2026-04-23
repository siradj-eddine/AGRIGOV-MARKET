import type {
  RegisterRole,
  FarmerProfileState,
  BuyerProfileState,
  TransporterProfileState,
} from "@/types/Register";
import { WILAYAS, VEHICLE_TYPES } from "@/types/Register";
import FileUpload from "./FileUpload";
import AvatarUpload from "./AvatarUpload";

const field =
  "block w-full py-2.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary focus:outline-none text-sm transition";

const label = "text-sm font-medium text-gray-700";

// ─── Farmer ───────────────────────────────────────────────────────────────────

interface FarmerProps {
  form: FarmerProfileState;
  onChange: <K extends keyof FarmerProfileState>(k: K, v: FarmerProfileState[K]) => void;
}

function FarmerForm({ form, onChange }: FarmerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Avatar — full width, always first */}
      <AvatarUpload
        file={form.profile_image}
        onChange={(f) => onChange("profile_image", f)}
      />

      {/* Age */}
      <div className="space-y-1.5">
        <label htmlFor="age" className={label}>Age</label>
        <input
          id="age"
          type="number"
          min={18}
          max={100}
          value={form.age}
          onChange={(e) => onChange("age", e.target.value)}
          placeholder="e.g. 35"
          className={field}
        />
      </div>

      {/* Wilaya */}
      <div className="space-y-1.5">
        <label htmlFor="wilaya" className={label}>Wilaya</label>
        <div className="relative">
          <select
            id="wilaya"
            value={form.wilaya}
            onChange={(e) => onChange("wilaya", e.target.value)}
            className={`${field} appearance-none pr-8`}
          >
            <option value="">Select Wilaya</option>
            {WILAYAS.map((w) => <option key={w}>{w}</option>)}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </span>
        </div>
      </div>

      {/* Baladiya */}
      <div className="space-y-1.5">
        <label htmlFor="baladiya" className={label}>Baladiya (Commune)</label>
        <input
          id="baladiya"
          type="text"
          value={form.baladiya}
          onChange={(e) => onChange("baladiya", e.target.value)}
          placeholder="e.g. Bab Ezzouar"
          className={field}
        />
      </div>

      {/* Farm name */}
      <div className="space-y-1.5">
        <label htmlFor="farm-name" className={label}>Farm Name</label>
        <input
          id="farm-name"
          type="text"
          value={form.farm_name}
          onChange={(e) => onChange("farm_name", e.target.value)}
          placeholder="e.g. El Baraka Farm"
          className={field}
        />
      </div>

      {/* Farm size */}
      <div className="space-y-1.5">
        <label htmlFor="farm-size" className={label}>Farm Size (Hectares)</label>
        <input
          id="farm-size"
          type="number"
          min={0}
          step={0.1}
          value={form.farm_size}
          onChange={(e) => onChange("farm_size", e.target.value)}
          placeholder="e.g. 5.5"
          className={field}
        />
      </div>

      {/* Address */}
      <div className="md:col-span-2 space-y-1.5">
        <label htmlFor="address" className={label}>Detailed Address</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <span className="material-symbols-outlined text-lg">place</span>
          </span>
          <input
            id="address"
            type="text"
            value={form.Address}
            onChange={(e) => onChange("Address", e.target.value)}
            placeholder="Street, landmark..."
            className={`${field} pl-10`}
          />
        </div>
      </div>

      {/* Farmer card */}
      <FileUpload
        label="Farmer Card"
        hint="Official farmer card (JPG, PNG, PDF)"
        file={form.farmer_card_image}
        onChange={(f) => onChange("farmer_card_image", f)}
      />

      {/* National ID */}
      <FileUpload
        label="National ID Card"
        hint="Front side of your national identity card"
        file={form.national_card_image}
        onChange={(f) => onChange("national_card_image", f)}
      />
    </div>
  );
}

// ─── Buyer ────────────────────────────────────────────────────────────────────

interface BuyerProps {
  form: BuyerProfileState;
  onChange: <K extends keyof BuyerProfileState>(k: K, v: BuyerProfileState[K]) => void;
}

function BuyerForm({ form, onChange }: BuyerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Avatar — full width, always first */}
      <AvatarUpload
        file={form.profile_image}
        onChange={(f) => onChange("profile_image", f)}
      />

      {/* Age */}
      <div className="space-y-1.5">
        <label htmlFor="age" className={label}>Age</label>
        <input
          id="age"
          type="number"
          min={18}
          max={100}
          value={form.age}
          onChange={(e) => onChange("age", e.target.value)}
          placeholder="e.g. 35"
          className={field}
        />
      </div>

      {/* Business license — full width */}
      <div className="md:col-span-2">
        <FileUpload
          label="Business License"
          hint="Official business registration document (PDF, PNG, JPG)"
          file={form.business_license_image}
          onChange={(f) => onChange("business_license_image", f)}
        />
      </div>
    </div>
  );
}

// ─── Transporter ──────────────────────────────────────────────────────────────

interface TransporterProps {
  form: TransporterProfileState;
  onChange: <K extends keyof TransporterProfileState>(k: K, v: TransporterProfileState[K]) => void;
}

function TransporterForm({ form, onChange }: TransporterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Avatar — full width, always first */}
      <AvatarUpload
        file={form.profile_image}
        onChange={(f) => onChange("profile_image", f)}
      />

      {/* Age */}
      <div className="space-y-1.5">
        <label htmlFor="age" className={label}>Age</label>
        <input
          id="age"
          type="number"
          min={18}
          value={form.age}
          onChange={(e) => onChange("age", e.target.value)}
          placeholder="e.g. 30"
          className={field}
        />
      </div>

      {/* Vehicle type */}
      <div className="space-y-1.5">
        <label htmlFor="v-type" className={label}>Vehicle Type</label>
        <div className="relative">
          <select
            id="v-type"
            value={form.vehicule_type}
            onChange={(e) => onChange("vehicule_type", e.target.value)}
            className={`${field} appearance-none pr-8`}
          >
            <option value="">Select type</option>
            {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </span>
        </div>
      </div>

      {/* Model */}
      <div className="space-y-1.5">
        <label htmlFor="v-model" className={label}>Vehicle Model</label>
        <input
          id="v-model"
          type="text"
          value={form.vehicule_model}
          onChange={(e) => onChange("vehicule_model", e.target.value)}
          placeholder="e.g. Mercedes Actros"
          className={field}
        />
      </div>

      {/* Year */}
      <div className="space-y-1.5">
        <label htmlFor="v-year" className={label}>Year</label>
        <input
          id="v-year"
          type="number"
          min={1990}
          max={new Date().getFullYear()}
          value={form.vehicule_year}
          onChange={(e) => onChange("vehicule_year", e.target.value)}
          placeholder="e.g. 2019"
          className={field}
        />
      </div>

      {/* Capacity */}
      <div className="md:col-span-2 space-y-1.5">
        <label htmlFor="v-capacity" className={label}>Cargo Capacity (tonnes)</label>
        <input
          id="v-capacity"
          type="number"
          min={0}
          step={0.5}
          value={form.vehicule_capacity}
          onChange={(e) => onChange("vehicule_capacity", e.target.value)}
          placeholder="e.g. 10"
          className={field}
        />
      </div>

      {/* Driver license */}
      <FileUpload
        label="Driver's License"
        hint="Front of your valid driver's license"
        file={form.driver_license_image}
        onChange={(f) => onChange("driver_license_image", f)}
      />

      {/* Grey card */}
      <FileUpload
        label="Grey Card (Vehicle Registration)"
        hint="Vehicle registration document"
        file={form.grey_card_image}
        onChange={(f) => onChange("grey_card_image", f)}
      />
    </div>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

interface ProfileStepProps {
  role:            RegisterRole;
  farmerForm:      FarmerProfileState;
  buyerForm:       BuyerProfileState;
  transporterForm: TransporterProfileState;
  onFarmerChange:      FarmerProps["onChange"];
  onBuyerChange:       BuyerProps["onChange"];
  onTransporterChange: TransporterProps["onChange"];
}

const roleHeadings: Record<RegisterRole, { title: string; subtitle: string }> = {
  FARMER:      { title: "Farm Details",        subtitle: "Tell us about your farm and upload your documents."   },
  BUYER:       { title: "Buyer Profile",        subtitle: "Provide your business details for verification."      },
  TRANSPORTER: { title: "Transporter Profile",  subtitle: "Add your vehicle information to get started."         },
};

export default function ProfileStep({
  role,
  farmerForm, buyerForm, transporterForm,
  onFarmerChange, onBuyerChange, onTransporterChange,
}: ProfileStepProps) {
  const { title, subtitle } = roleHeadings[role];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{subtitle}</p>
      </div>

      {role === "FARMER"      && <FarmerForm      form={farmerForm}      onChange={onFarmerChange}      />}
      {role === "BUYER"       && <BuyerForm        form={buyerForm}       onChange={onBuyerChange}       />}
      {role === "TRANSPORTER" && <TransporterForm  form={transporterForm} onChange={onTransporterChange} />}
    </div>
  );
}