import React, { useMemo, useRef, useState, useEffect } from "react";
import { User, Pencil, Trash2 } from "lucide-react";

//////////////////////////////////////////////////////////////////////////////
// import { useEffect } from "react";
// import { Pencil, Trash2 } from "lucide-react";

// const fileInputRef = useRef(null);
// const [preview, setPreview] = useState(null);

// useEffect(() => {
//   if (form?.photo) {
//     const objectUrl = URL.createObjectURL(form.photo);
//     setPreview(objectUrl);

//     return () => URL.revokeObjectURL(objectUrl);
//   } else {
//     setPreview(null);
//   }
// }, [form?.photo]);
///////////////////////////////////////////////////////////////////////////////

import { State, City } from "country-state-city";
import indiaLanguages from "./data/indiaLanguages.json";

// ✅ Lucide Icons
import { PhoneCall, MapPin, Repeat2, Globe, Check } from "lucide-react";

const STEPS = [
  { key: "basic", label: "Basic Details" },
  { key: "lang", label: "Language" },
  { key: "role", label: " Role Selection" },
  { key: "exp", label: "Experience & Skills" },
  { key: "final", label: "Final Confirmation" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EDUCATION = [
  "10th",
  "12th",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "Other",
];
const YES_NO = ["Yes", "No"];
const ENGLISH_LEVELS = ["Basic", "Intermediate", "Fluent"];
const WORK_HOURS = ["1–2 hours", "2–4 hours", "4–6 hours", "6+ hours"];
const SHIFTS = ["Morning", "Afternoon", "Evening", "Flexible"];
const EMPLOYMENT = ["Unemployed", "Job", "Business", "Freelancer", "Other"];

const ROLE_OPTIONS = [
  {
    key: "tele",
    Icon: PhoneCall,
    title: "Tele calling",
    sub: "Calling + reporting",
  },
  {
    key: "field",
    Icon: MapPin,
    title: "Field visit",
    sub: "Market visit + reporting",
  },
  { key: "both", Icon: Repeat2, title: "Both", sub: "Tele + Field" },
];

function onlyDigits(v) {
  return (v || "").replace(/\D/g, "");
}
function isValidMobile10(v) {
  return onlyDigits(v).length === 10;
}
function isValidPincode6(v) {
  return onlyDigits(v).length === 6;
}
function normalizeEmail(v) {
  return (v || "").trim().toLowerCase();
}
function isValidGmail(email) {
  const e = normalizeEmail(email);
  return /^[a-z0-9._%+-]+@gmail\.com$/.test(e);
}
function getGmailSuggestion(email) {
  const v = normalizeEmail(email);
  if (!v.includes("@")) return "";
  const [user, domainPart] = v.split("@");
  if (!user) return "";
  if (domainPart === "") return `${user}@gmail.com`;
  if ("gmail.com".startsWith(domainPart)) return `${user}@gmail.com`;
  return "";
}
function isValidYear4(v) {
  const d = onlyDigits(v);
  if (d.length !== 4) return false;
  const y = Number(d);
  const now = new Date().getFullYear();
  return y >= 1950 && y <= now + 1;
}

export default function App() {
  const [step, setStep] = useState("basic");
  const [showTc, setShowTc] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [toast, setToast] = useState("");

  const indiaStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const emailRef = useRef(null);

  const [touched, setTouched] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    whatsapp: "",
    doYouHaveTelegram: "",
    email: "",
    gender: "",
    address: "",
    sameAddress: "",
    currentAddress: "",
    stateIso: "",
    stateName: "",
    city: "",
    pincode: "",
    photo: null,
    education: "",
    fatherOccupation: "",
    fatherBusinessType: "",
    fatherOtherOccupation: "",

    // ✅ College logic
    isCollegeStudent: "",
    collegeName: "",
    passoutYear: "",
    currentEmployment: "",
    dob: "",

    canHindi: "",
    englishLevel: "",
    nativeLanguage: "",

    role: "",
    workHours: "",
    shift: "",
    days: [],
    laptop: "",

    teleExp: "",
    teleTotalExp: "",
    mysteryCalling: "",
    teleConfidence: 3,

    fieldExp: "",
    twoWheeler: "",
    drivingLicense: "",
    travelCityDaily: "",
    travelOutsideSometimes: "",
    preferredArea: "",
    coverageRange: "",
    nearbyCities: "",

    confirmCorrect: false,
    agreeTc: false,
  });
  

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (form?.photo) {
      const objectUrl = URL.createObjectURL(form.photo);
      queueMicrotask(() => setPreview(objectUrl));
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      queueMicrotask(() => setPreview(null));
    }
  }, [form.photo]);

  const roleHasTele = form.role === "tele" || form.role === "both";
  const roleHasField = form.role === "field" || form.role === "both";

  // ✅ cities derived
  const cities = useMemo(() => {
    if (!form.stateIso) return [];
    return City.getCitiesOfState("IN", form.stateIso) || [];
  }, [form.stateIso]);

  const gmailSuggestion = getGmailSuggestion(form.email);

  function setField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
  }

  function markTouched(name) {
    setTouched((p) => ({ ...p, [name]: true }));
  }

  function toggleDay(day) {
    setForm((p) => {
      const has = p.days.includes(day);
      const days = has ? p.days.filter((d) => d !== day) : [...p.days, day];
      return { ...p, days };
    });
  }

  function fieldError(name) {
    const show = submitAttempted || touched[name];
    if (!show) return "";

    const v = form[name];

    if (name === "fullName" && v.trim().length < 2) return "Enter full name";
    if (name === "dob") {
      if (!v) return "Date of birth is required";
    }

    if (name === "mobile" && !isValidMobile10(v))
      return "Enter 10-digit mobile number";

    if (name === "whatsapp") {
      if (v.trim().length > 0 && !isValidMobile10(v))
        return "Enter 10-digit WhatsApp number";
    }

    if (name === "doYouHaveTelegram" && !v) return "Select Yes/No";
    if (name === "email" && !isValidGmail(v))
      return "Only Gmail is allowed (example@gmail.com)";
    if (name === "gender" && !v) return "Select gender";
    if (name === "address" && v.trim().length < 8) return "Enter full address";
    if (name === "sameAddress" && !v) return "Select Yes/No";

    if (name === "currentAddress") {
      if (form.sameAddress === "No" && v.trim().length < 8)
        return "Enter current address";
    }

    if (name === "stateIso" && !v) return "Select state";
    if (name === "city" && !v) return "Select city";
    if (name === "pincode" && !isValidPincode6(v))
      return "Enter 6-digit pincode";
    if (name === "education" && !v) return "Select education";
    if (name === "fatherOccupation" && !v) return "Select occupation";

    if (name === "fatherBusinessType") {
      if (form.fatherOccupation === "Business" && v.trim().length < 2)
        return "Specify business type";
    }
    if (name === "fatherOtherOccupation") {
      if (form.fatherOccupation === "Other" && v.trim().length < 2)
        return "Specify occupation";
    }

    // ✅ College validations
    if (name === "isCollegeStudent" && !v) return "Select Yes/No";

    if (name === "collegeName") {
      if (form.isCollegeStudent === "Yes" && v.trim().length < 2)
        return "Enter college name";
    }

    if (name === "passoutYear") {
      if (form.isCollegeStudent === "No" && !isValidYear4(v))
        return "Enter valid passout year (YYYY)";
    }

    if (name === "currentEmployment") {
      if (form.isCollegeStudent === "No" && !v)
        return "Select current employment";
    }

    if (name === "canHindi" && !v) return "Select Yes/No";
    if (name === "englishLevel" && !v) return "Select level";
    if (name === "nativeLanguage" && !v) return "Select native language";

    if (name === "role" && !v) return "Choose one role";
    if (name === "workHours" && !v) return "Select hours";
    if (name === "shift" && !v) return "Select shift";
    if (name === "days" && form.days.length === 0)
      return "Select at least one day";
    if (name === "laptop" && !v) return "Select Yes/No";

    if (roleHasTele) {
      if (name === "teleExp" && !v) return "Select Yes/No";
      if (name === "teleTotalExp" && form.teleExp === "Yes" && !v)
        return "Select experience";
      if (name === "mysteryCalling" && !v) return "Select Yes/No";
    }

    if (roleHasField) {
      if (name === "fieldExp" && !v) return "Select Yes/No";
      if (name === "twoWheeler" && !v) return "Select Yes/No";
      if (name === "drivingLicense" && !v) return "Select Yes/No";
      if (name === "travelCityDaily" && !v) return "Select Yes/No";
      if (name === "travelOutsideSometimes" && !v) return "Select Yes/No";
      if (name === "preferredArea" && v.trim().length < 2)
        return "Enter preferred area";
      if (name === "coverageRange" && !v) return "Select range";
    }

    return "";
  }

  function stepHasErrors(stepKey) {
    const must = [];

    if (stepKey === "basic") {
      must.push(
        "fullName",
        "mobile",
        "telegram",
        "email",
        "gender",
        "address",
        "sameAddress",
        "stateIso",
        "city",
        "pincode",
        "education",
        "fatherOccupation",
        "isCollegeStudent",
        "dob",
      );

      if (form.sameAddress === "No") must.push("currentAddress");
      if (form.fatherOccupation === "Business") must.push("fatherBusinessType");
      if (form.fatherOccupation === "Other") must.push("fatherOtherOccupation");

      if (form.whatsapp.trim().length > 0) must.push("whatsapp");

      if (form.isCollegeStudent === "Yes") must.push("collegeName");
      if (form.isCollegeStudent === "No")
        must.push("passoutYear", "currentEmployment");
    }

    if (stepKey === "lang")
      must.push("canHindi", "englishLevel", "nativeLanguage");
    if (stepKey === "role")
      must.push("role", "workHours", "shift", "days", "laptop");

    if (stepKey === "exp") {
      if (roleHasTele) {
        must.push("teleExp", "mysteryCalling");
        if (form.teleExp === "Yes") must.push("teleTotalExp");
      }
      if (roleHasField) {
        must.push(
          "fieldExp",
          "twoWheeler",
          "drivingLicense",
          "travelCityDaily",
          "travelOutsideSometimes",
          "preferredArea",
          "coverageRange",
        );
      }
    }

    if (stepKey === "final") {
      if (!form.confirmCorrect) return true;
      if (!form.agreeTc) return true;
    }

    return must.some((k) => fieldError(k));
  }

  function goNext() {
    setSubmitAttempted(true);

    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx < 0) return;

    if (stepHasErrors(step)) {
      setToast("Please fix the highlighted fields.");
      setTimeout(() => setToast(""), 2500);
      return;
    }

    const next = STEPS[idx + 1];
    if (next) setStep(next.key);
  }

  function goPrev() {
    const idx = STEPS.findIndex((s) => s.key === step);
    const prev = STEPS[idx - 1];
    if (prev) setStep(prev.key);
  }

  const canSubmit =
    !stepHasErrors("basic") &&
    !stepHasErrors("lang") &&
    !stepHasErrors("role") &&
    !stepHasErrors("exp") &&
    form.confirmCorrect &&
    form.agreeTc;

  function submit() {
    setSubmitAttempted(true);
    if (!canSubmit) {
      setToast("Please complete all required fields and accept T&C.");
      setTimeout(() => setToast(""), 2500);
      return;
    }

    const payload = {
      ...form,
      mobile: onlyDigits(form.mobile),
      whatsapp: form.whatsapp ? onlyDigits(form.whatsapp) : "",
      pincode: onlyDigits(form.pincode),
      email: normalizeEmail(form.email),
      photoName: form.photo ? form.photo.name : "",
      createdAt: new Date().toISOString(),
    };

    console.log("SUBMIT PAYLOAD:", payload);
    alert("Submitted (mock). Check console for payload.");
  }

  // ✅ tab done logic
  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const isDone = (k) => {
    if (k === "basic") return !stepHasErrors("basic");
    if (k === "lang") return !stepHasErrors("basic") && !stepHasErrors("lang");
    if (k === "role")
      return (
        !stepHasErrors("basic") &&
        !stepHasErrors("lang") &&
        !stepHasErrors("role")
      );
    if (k === "exp")
      return (
        !stepHasErrors("basic") &&
        !stepHasErrors("lang") &&
        !stepHasErrors("role") &&
        !stepHasErrors("exp")
      );
    return false;
  };

  const tcText = `Active Cells Freelancer – Terms & Conditions (T&C)
By submitting this form and selecting “I agree the T&C”, I confirm and accept the following:
1) Truth & Accuracy
I confirm all details shared in this form (name, number, city, state, skills, availability, etc.) are true and correct.
If any information is found false or misleading, Subtech/Active Cells may reject my application, remove me from tasks, and cancel payment for invalid work.
2) Freelance Nature
I understand this is freelance / task-based work, not permanent employment.
I will not claim employee benefits like PF/ESI/insurance/paid leave.
3) Work Allocation & Validation-Based Payment
Work will be assigned as per requirement and may vary by state/area.
Payment (if applicable) will be task-based and only for verified/validated tasks.
Tasks can be rejected if there is wrong data, incomplete reporting, fake proof, script violation, abusive behavior, duplicate entries, or suspicious activity.
Subtech/Active Cells may hold tasks for verification before approval.
4) Expenses (Important)
I understand mobile recharge, call charges, internet, travel, fuel, food, and personal expenses are my responsibility unless specifically approved in writing for a particular task.
Subtech/Active Cells will not pay for my general mobile recharge/calling packs.
5) Script & Process Compliance
I agree to follow the script, instructions, and reporting format provided.
I will not modify the objective, ask unrelated questions, or share internal information beyond the approved script.
I will complete tasks within the given timeline and submit updates properly.
6) Professional Conduct & Safety
I will be polite and professional with dealers and staff.
I will not use abusive language, threats, harassment, or spam calling/visits.
For field visits, I will not create arguments or unsafe situations. If a location feels unsafe, I will exit and report.
7) No Unauthorized Promises
I will not promise any pricing, scheme, delivery, warranty, partnership, dealership, or official commitment.
I will represent myself only as per the script (customer-style). I will not misrepresent Subtech beyond approved instructions.
I will not accept any cash/gift/commission from dealers on behalf of Subtech/Active Cells.
8) No Fake Reporting / No Data Manipulation
I will not submit fake calls/visits, fake dealer details, edited screenshots, copied data, or manipulated proofs.
Duplicate, guessed, or randomly filled entries are not allowed.
If fraud is detected, I understand I may be permanently blocked and payments for impacted tasks may be cancelled.
9) Confidentiality & Data Protection
Dealer lists, scripts, formats, instructions, and internal plans are confidential.
I will not share, forward, sell, publish, or reuse data anywhere (WhatsApp groups/other companies/personal use).
I will delete confidential data from my device if requested.
10) Proof & Quality Audit Consent
If required, I will provide call logs, screenshots, location proof, visit proof, and notes as per instructions.
I understand Subtech/Active Cells can audit submissions for quality and verification.
11) Right to Accept/Reject & Removal
Subtech/Active Cells can assign, pause, reduce, or stop tasks at any time.
They can remove any freelancer if quality is poor or policies are violated, without detailed explanation.
12) Social Media & Reputation
I will not post about Subtech, dealers, scripts, or tasks on social media/public platforms without written permission.
I will not use Subtech branding/logo/name for my personal promotion without approval.
13) Responsibility for Misconduct
Any misuse, legal issue, or complaint caused due to my behavior, false commitments, harassment, or policy violation will be my responsibility.
14) Communication Permission
I agree Subtech/Active Cells may contact me via call/WhatsApp/SMS for tasks, training, verification, and updates.`;

  return (
    <div className="container">
      <div className="shell">
        <div className="card">
          {/* Header */}
          <div className="header">
            <div className="brand">
              <div className="titleWrap">
                <h1>Active cells Freelancer registration</h1>
                <p>Fill details carefully. </p>
              </div>
            </div>

            <a
              className="badge"
              href="https://subtech.in"
              target="_blank"
              rel="noreferrer"
            >
              <Globe size={16} />
              subtech.in
            </a>
          </div>

          {/* ✅ Tabs like screenshot (full cover) */}
          <div className="tabsWrap">
            <div className="tabsBar">
              {STEPS.map((s) => {
                  const active = step === s.key;
  
                  return (
                  <button
                    key={s.key}
                    className={`tab ${active ? "tabActive" : ""}`}
                    onClick={() => setStep(s.key)}
                    type="button"
                  >
                    <span className="tabText">{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="tabsLine">
              <div
                className="tabsLineFill"
                style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="content">
            {toast ? <div className="toast">{toast}</div> : null}

            {/* =============== BASIC =============== */}
            {step === "basic" && (
              <div className="section">
                <h2 className="sectionTitle">
                  <span className="pill" /> A) Basic Details
                </h2>

                <div className="grid2">
                  <div className="field">
                    <label>
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      onBlur={() => markTouched("fullName")}
                      placeholder="e.g. Donald sharma"
                    />
                    {fieldError("fullName") ? (
                      <div className="error">{fieldError("fullName")}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <label>
                      Date of Birth <span className="req">*</span>
                    </label>

                    <input
                      type="date"
                      name="dob"
                      className="dob"
                      value={form.dob}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, dob: e.target.value }))
                      }
                    />

                    {fieldError("dob") && (
                      <p className="error">{fieldError("dob")}</p>
                    )}
                  </div>

                  <div className="field">
                    <label>
                      Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      inputMode="numeric"
                      value={form.mobile}
                      onChange={(e) =>
                        setField(
                          "mobile",
                          onlyDigits(e.target.value).slice(0, 10),
                        )
                      }
                      onBlur={() => markTouched("mobile")}
                      placeholder="10-digit mobile"
                    />
                    {fieldError("mobile") ? (
                      <div className="error">{fieldError("mobile")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Do you have telegram app? <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.telegram}
                      onChange={(e) => setField("telegram", e.target.value)}
                      onBlur={() => markTouched("telegram")}
                    >
                      <option value="">Select</option>
                      {YES_NO.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("telegram") ? (
                      <div className="error">{fieldError("telegram")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Email ID (Gmail only) <span className="req">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      className="input"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => markTouched("email")}
                      placeholder="username@gmail.com"
                      autoComplete="email"
                    />
                    {gmailSuggestion && !isValidGmail(form.email) ? (
                      <div className="help">
                        Suggestion:{" "}
                        <span
                          className="tcLink"
                          onClick={() => {
                            setField("email", gmailSuggestion);
                            markTouched("email");
                            emailRef.current?.focus();
                          }}
                        >
                          {gmailSuggestion}
                        </span>
                      </div>
                    ) : null}
                    {fieldError("email") ? (
                      <div className="error">{fieldError("email")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Gender <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.gender}
                      onChange={(e) => setField("gender", e.target.value)}
                      onBlur={() => markTouched("gender")}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldError("gender") ? (
                      <div className="error">{fieldError("gender")}</div>
                    ) : null}
                  </div>

                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label>
                      Address <span className="req">*</span>
                    </label>
                    <textarea
                      className="textarea"
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      onBlur={() => markTouched("address")}
                      placeholder="House/Street/Area..."
                    />
                    {fieldError("address") ? (
                      <div className="error">{fieldError("address")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Are you currently living on the same address?{" "}
                      <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.sameAddress}
                      onChange={(e) => setField("sameAddress", e.target.value)}
                      onBlur={() => markTouched("sameAddress")}
                    >
                      <option value="">Select</option>
                      {YES_NO.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("sameAddress") ? (
                      <div className="error">{fieldError("sameAddress")}</div>
                    ) : null}
                  </div>

                  {form.sameAddress === "No" && (
                    <div className="field">
                      <label>
                        Current Address <span className="req">*</span>
                      </label>
                      <input
                        className="input"
                        value={form.currentAddress}
                        onChange={(e) =>
                          setField("currentAddress", e.target.value)
                        }
                        onBlur={() => markTouched("currentAddress")}
                        placeholder="Current address"
                      />
                      {fieldError("currentAddress") ? (
                        <div className="error">
                          {fieldError("currentAddress")}
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="field">
                    <label>
                      State <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.stateIso}
                      onChange={(e) => {
                        const iso = e.target.value;
                        const st = indiaStates.find((s) => s.isoCode === iso);
                        setForm((p) => ({
                          ...p,
                          stateIso: iso,
                          stateName: st ? st.name : "",
                          city: "",
                        }));
                      }}
                      onBlur={() => markTouched("stateIso")}
                    >
                      <option value="">Select state</option>
                      {indiaStates.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {fieldError("stateIso") ? (
                      <div className="error">{fieldError("stateIso")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      City <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      onBlur={() => markTouched("city")}
                      disabled={!form.stateIso}
                    >
                      <option value="">
                        {form.stateIso ? "Select city" : "Select state first"}
                      </option>
                      {cities.map((c) => (
                        <option
                          key={`${c.name}-${c.latitude}-${c.longitude}`}
                          value={c.name}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {fieldError("city") ? (
                      <div className="error">{fieldError("city")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Pincode <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      inputMode="numeric"
                      value={form.pincode}
                      onChange={(e) =>
                        setField(
                          "pincode",
                          onlyDigits(e.target.value).slice(0, 6),
                        )
                      }
                      onBlur={() => markTouched("pincode")}
                      placeholder="6-digit pincode"
                    />
                    {fieldError("pincode") ? (
                      <div className="error">{fieldError("pincode")}</div>
                    ) : null}
                  </div>
                  <div className="field">
                    <label>
                      Your photo <span className="req">*</span>
                    </label>

                    <div className="file-wrapper">
                      <div className="upload-box">
                        {/* If no photo */}
                        {!form?.photo && (
                          <>
                            <User size={40} className="upload-icon" />
                            <span className="textual">
                              Click to upload your picture
                            </span>

                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="upload-btn"
                            >
                              Upload Photo
                            </button>
                          </>
                        )}

                        {/* If photo exists */}
                        {form?.photo && (
                          <div className="preview-section">
                            {/* Image Preview */}
                            {preview && (
                              <img
                                src={preview}
                                alt="Preview"
                                className="preview-image"
                              />
                            )}

                            {/* File Name */}
                            <span className="file-name">{form.photo.name}</span>

                            {/* Action Buttons */}
                            <div className="action-buttons">
                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="icon-btn edit-btn"
                              >
                                <Pencil size={16} />
                              </button>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => setField("photo", null)}
                                className="icon-btn remove-btn"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Hidden File Input (UNCHANGED functionality) */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) =>
                            setField("photo", e.target.files?.[0] || null)
                          }
                          className="hidden-file"
                        />
                      </div>
                    </div>

                    <div className="help">
                      {form?.photo
                        ? "Image ready for upload!"
                        : "You can capture from camera."}
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Education <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.education}
                      onChange={(e) => setField("education", e.target.value)}
                      onBlur={() => markTouched("education")}
                    >
                      <option value="">Select</option>
                      {EDUCATION.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("education") ? (
                      <div className="error">{fieldError("education")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Are you a college student? <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.isCollegeStudent}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((p) => ({
                          ...p,
                          isCollegeStudent: v,
                          collegeName: v === "Yes" ? p.collegeName : "",
                          passoutYear: v === "No" ? p.passoutYear : "",
                          currentEmployment:
                            v === "No" ? p.currentEmployment : "",
                        }));
                      }}
                      onBlur={() => markTouched("isCollegeStudent")}
                    >
                      <option value="">Select</option>
                      {YES_NO.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("isCollegeStudent") ? (
                      <div className="error">
                        {fieldError("isCollegeStudent")}
                      </div>
                    ) : null}
                  </div>

                  {form.isCollegeStudent === "Yes" && (
                    <div className="field">
                      <label>
                        College Name <span className="req">*</span>
                      </label>
                      <input
                        className="input"
                        value={form.collegeName}
                        onChange={(e) =>
                          setField("collegeName", e.target.value)
                        }
                        onBlur={() => markTouched("collegeName")}
                        placeholder="e.g. Galgotias University, Greater Noida"
                      />
                      {fieldError("collegeName") ? (
                        <div className="error">{fieldError("collegeName")}</div>
                      ) : null}
                    </div>
                  )}

                  {form.isCollegeStudent === "No" && (
                    <>
                      <div className="field">
                        <label>
                          Passout Year <span className="req">*</span>
                        </label>
                        <input
                          className="input"
                          inputMode="numeric"
                          value={form.passoutYear}
                          onChange={(e) =>
                            setField(
                              "passoutYear",
                              onlyDigits(e.target.value).slice(0, 4),
                            )
                          }
                          onBlur={() => markTouched("passoutYear")}
                          placeholder="YYYY"
                        />
                        {fieldError("passoutYear") ? (
                          <div className="error">
                            {fieldError("passoutYear")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Current Employment <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.currentEmployment}
                          onChange={(e) =>
                            setField("currentEmployment", e.target.value)
                          }
                          onBlur={() => markTouched("currentEmployment")}
                        >
                          <option value="">Select</option>
                          {EMPLOYMENT.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("currentEmployment") ? (
                          <div className="error">
                            {fieldError("currentEmployment")}
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}

                  <div className="field">
                    <label>
                      Father Occupation <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.fatherOccupation}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((p) => ({
                          ...p,
                          fatherOccupation: v,
                          fatherBusinessType:
                            v === "Business" ? p.fatherBusinessType : "",
                          fatherOtherOccupation:
                            v === "Other" ? p.fatherOtherOccupation : "",
                        }));
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Business">Business</option>
                      <option value="Job">Job</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Self employed">Self employed</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldError("fatherOccupation") ? (
                      <div className="error">
                        {fieldError("fatherOccupation")}
                      </div>
                    ) : null}
                  </div>

                  {(form.fatherOccupation === "Business" ||
                    form.fatherOccupation === "Other") && (
                    <div className="field">
                      <label>
                        {form.fatherOccupation === "Business"
                          ? "Specify business type"
                          : "Specify occupation"}
                        <span className="req">*</span>
                      </label>
                      <input
                        className="input"
                        value={form.fatherBusinessType}
                        onChange={(e) =>
                          setField("fatherBusinessType", e.target.value)
                        }
                        onBlur={() => markTouched("fatherBusinessType")}
                        placeholder="e.g. Retail, Shop, Trading..."
                      />
                      {fieldError("fatherBusinessType") ? (
                        <div className="error">
                          {fieldError("fatherBusinessType")}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =============== LANGUAGE =============== */}
            {step === "lang" && (
              <div className="section">
                <h2 className="sectionTitle">
                  <span className="pill" /> Language
                </h2>

                <div className="grid2">
                  <div className="field">
                    <label>
                      Can you speak in Hindi? <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.canHindi}
                      onChange={(e) => setField("canHindi", e.target.value)}
                      onBlur={() => markTouched("canHindi")}
                    >
                      <option value="">Select</option>
                      {YES_NO.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("canHindi") ? (
                      <div className="error">{fieldError("canHindi")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      English (level) <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.englishLevel}
                      onChange={(e) => setField("englishLevel", e.target.value)}
                      onBlur={() => markTouched("englishLevel")}
                    >
                      <option value="">Select</option>
                      {ENGLISH_LEVELS.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("englishLevel") ? (
                      <div className="error">{fieldError("englishLevel")}</div>
                    ) : null}
                  </div>

                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label>
                      Native language <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.nativeLanguage}
                      onChange={(e) =>
                        setField("nativeLanguage", e.target.value)
                      }
                      onBlur={() => markTouched("nativeLanguage")}
                    >
                      <option value="">Select</option>
                      {indiaLanguages.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("nativeLanguage") ? (
                      <div className="error">
                        {fieldError("nativeLanguage")}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* =============== ROLE (UI LIKE SCREENSHOT) =============== */}
            {step === "role" && (
              <div className="section">
                <h2 className="sectionTitle">
                  <span className="pill" /> B) Role Selection
                </h2>

                <div className="field" style={{ marginBottom: 12 }}>
                  <label>
                    Which work are you applying for?{" "}
                    <span className="req">*</span>
                  </label>

                  <div className="roleRowGrid">
                    {ROLE_OPTIONS.map((r) => {
                      const active = form.role === r.key;
                      return (
                        <button
                          key={r.key}
                          type="button"
                          className={`roleCard ${active ? "roleCardActive" : ""}`}
                          onClick={() => setField("role", r.key)}
                        >
                          <div className="roleCardLeft">
                            <div className="roleCardIcon">
                              <r.Icon size={18} />
                            </div>
                            <div className="roleCardText">
                              <div className="roleCardTitle">{r.title}</div>
                              <div className="roleCardSub">{r.sub}</div>
                            </div>
                          </div>

                          <div
                            className={`roleCardRight ${active ? "isActive" : ""}`}
                          >
                            {active ? "Selected" : "Select"}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {fieldError("role") ? (
                    <div className="error">{fieldError("role")}</div>
                  ) : null}
                </div>

                <div className="grid2">
                  <div className="field">
                    <label>
                      Available working hours per day{" "}
                      <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.workHours}
                      onChange={(e) => setField("workHours", e.target.value)}
                      onBlur={() => markTouched("workHours")}
                    >
                      <option value="">Select</option>
                      {WORK_HOURS.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("workHours") ? (
                      <div className="error">{fieldError("workHours")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Available shift <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.shift}
                      onChange={(e) => setField("shift", e.target.value)}
                      onBlur={() => markTouched("shift")}
                    >
                      <option value="">Select</option>
                      {SHIFTS.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("shift") ? (
                      <div className="error">{fieldError("shift")}</div>
                    ) : null}
                  </div>

                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label>
                      Days available <span className="req">*</span>
                    </label>
                    <div className="days">
                      {DAYS.map((d) => (
                        <button
                          type="button"
                          key={d}
                          className={`dayChip ${form.days.includes(d) ? "dayChipActive" : ""}`}
                          onClick={() => toggleDay(d)}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    {fieldError("days") ? (
                      <div className="error">{fieldError("days")}</div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label>
                      Do you have a laptop? <span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={form.laptop}
                      onChange={(e) => setField("laptop", e.target.value)}
                      onBlur={() => markTouched("laptop")}
                    >
                      <option value="">Select</option>
                      {YES_NO.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    {fieldError("laptop") ? (
                      <div className="error">{fieldError("laptop")}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* =============== EXP (UNCHANGED LOGIC) =============== */}
            {step === "exp" && (
              <div className="section">
                <h2 className="sectionTitle">
                  <span className="pill" /> C) Experience & Skills
                </h2>

                {!form.role ? (
                  <div className="help">
                    Please select a role in “Role Selection” step first.
                  </div>
                ) : null}

                {roleHasTele && (
                  <div style={{ marginBottom: 14 }}>
                    <div className="sectionTitle" style={{ marginBottom: 10 }}>
                      <span className="pill" /> For Tele-calling
                    </div>

                    <div className="grid2">
                      <div className="field">
                        <label>
                          Do you have prior telecalling experience?{" "}
                          <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.teleExp}
                          onChange={(e) => {
                            const v = e.target.value;
                            setForm((p) => ({
                              ...p,
                              teleExp: v,
                              teleTotalExp: v === "Yes" ? p.teleTotalExp : "",
                            }));
                          }}
                          onBlur={() => markTouched("teleExp")}
                        >
                          <option value="">Select</option>
                          {YES_NO.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("teleExp") ? (
                          <div className="error">{fieldError("teleExp")}</div>
                        ) : null}
                      </div>

                      {form.teleExp === "Yes" && (
                        <div className="field">
                          <label>
                            Total experience <span className="req">*</span>
                          </label>
                          <select
                            className="select"
                            value={form.teleTotalExp}
                            onChange={(e) =>
                              setField("teleTotalExp", e.target.value)
                            }
                            onBlur={() => markTouched("teleTotalExp")}
                          >
                            <option value="">Select</option>
                            {[
                              "<3 months",
                              "3–6 months",
                              "6–12 months",
                              "1–3 years",
                              "3+ years",
                            ].map((x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ))}
                          </select>
                          {fieldError("teleTotalExp") ? (
                            <div className="error">
                              {fieldError("teleTotalExp")}
                            </div>
                          ) : null}
                        </div>
                      )}

                      <div className="field">
                        <label>
                          Mystery calling / customer-style calling before?{" "}
                          <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.mysteryCalling}
                          onChange={(e) =>
                            setField("mysteryCalling", e.target.value)
                          }
                          onBlur={() => markTouched("mysteryCalling")}
                        >
                          <option value="">Select</option>
                          {YES_NO.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("mysteryCalling") ? (
                          <div className="error">
                            {fieldError("mysteryCalling")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Comfort level to speak confidently (1–5){" "}
                          <span className="req">*</span>
                        </label>
                        <input
                          className="input"
                          type="range"
                          min="1"
                          max="5"
                          value={form.teleConfidence}
                          onChange={(e) =>
                            setField("teleConfidence", Number(e.target.value))
                          }
                        />
                        <div className="help">
                          Selected: {form.teleConfidence}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {roleHasField && (
                  <div>
                    <div className="sectionTitle" style={{ marginBottom: 10 }}>
                      <span className="pill" /> For Field Visit
                    </div>

                    <div className="grid2">
                      <div className="field">
                        <label>
                          Do you have field sales/market visit experience?{" "}
                          <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.fieldExp}
                          onChange={(e) => setField("fieldExp", e.target.value)}
                          onBlur={() => markTouched("fieldExp")}
                        >
                          <option value="">Select</option>
                          {YES_NO.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("fieldExp") ? (
                          <div className="error">{fieldError("fieldExp")}</div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Do you have a two-wheeler?{" "}
                          <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.twoWheeler}
                          onChange={(e) =>
                            setField("twoWheeler", e.target.value)
                          }
                          onBlur={() => markTouched("twoWheeler")}
                        >
                          <option value="">Select</option>
                          {YES_NO.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("twoWheeler") ? (
                          <div className="error">
                            {fieldError("twoWheeler")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Driving license available?{" "}
                          <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.drivingLicense}
                          onChange={(e) =>
                            setField("drivingLicense", e.target.value)
                          }
                          onBlur={() => markTouched("drivingLicense")}
                        >
                          <option value="">Select</option>
                          {YES_NO.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("drivingLicense") ? (
                          <div className="error">
                            {fieldError("drivingLicense")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Can you travel within city daily?{" "}
                          <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.travelCityDaily}
                          onChange={(e) =>
                            setField("travelCityDaily", e.target.value)
                          }
                          onBlur={() => markTouched("travelCityDaily")}
                        >
                          <option value="">Select</option>
                          {YES_NO.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("travelCityDaily") ? (
                          <div className="error">
                            {fieldError("travelCityDaily")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Can you travel outside city sometimes?{" "}
                          <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.travelOutsideSometimes}
                          onChange={(e) =>
                            setField("travelOutsideSometimes", e.target.value)
                          }
                          onBlur={() => markTouched("travelOutsideSometimes")}
                        >
                          <option value="">Select</option>
                          {YES_NO.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {fieldError("travelOutsideSometimes") ? (
                          <div className="error">
                            {fieldError("travelOutsideSometimes")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Preferred working area (locality/market){" "}
                          <span className="req">*</span>
                        </label>
                        <input
                          className="input"
                          value={form.preferredArea}
                          onChange={(e) =>
                            setField("preferredArea", e.target.value)
                          }
                          onBlur={() => markTouched("preferredArea")}
                          placeholder="e.g. Civil Lines market"
                        />
                        {fieldError("preferredArea") ? (
                          <div className="error">
                            {fieldError("preferredArea")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field">
                        <label>
                          Coverage range <span className="req">*</span>
                        </label>
                        <select
                          className="select"
                          value={form.coverageRange}
                          onChange={(e) =>
                            setField("coverageRange", e.target.value)
                          }
                          onBlur={() => markTouched("coverageRange")}
                        >
                          <option value="">Select</option>
                          {["0–5 km", "5–10 km", "10–20 km", "20+ km"].map(
                            (x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ),
                          )}
                        </select>
                        {fieldError("coverageRange") ? (
                          <div className="error">
                            {fieldError("coverageRange")}
                          </div>
                        ) : null}
                      </div>

                      <div className="field" style={{ gridColumn: "1 / -1" }}>
                        <label>Nearby cities you can cover (optional)</label>
                        <input
                          className="input"
                          value={form.nearbyCities}
                          onChange={(e) =>
                            setField("nearbyCities", e.target.value)
                          }
                          placeholder="e.g. Noida, Ghaziabad..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =============== FINAL =============== */}
            {step === "final" && (
              <div className="section">
                <h2 className="sectionTitle">
                  <span className="pill" /> Final Confirmation
                </h2>

                <div className="tcRow" style={{ marginBottom: 12 }}>
                  <input
                    type="checkbox"
                    checked={form.confirmCorrect}
                    onChange={(e) =>
                      setField("confirmCorrect", e.target.checked)
                    }
                  />
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      I confirm the information is correct
                    </div>
                    {!form.confirmCorrect &&
                      (submitAttempted ? (
                        <div className="error">Required</div>
                      ) : null)}
                  </div>
                </div>

                <div className="tcRow">
                  <input
                    type="checkbox"
                    checked={form.agreeTc}
                    onChange={(e) => setField("agreeTc", e.target.checked)}
                  />
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      I agree the T&amp;C{" "}
                      <span className="tcLink" onClick={() => setShowTc(true)}>
                        (Read Terms &amp; Conditions)
                      </span>
                    </div>
                    {!form.agreeTc &&
                      (submitAttempted ? (
                        <div className="error">Required to submit</div>
                      ) : null)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="footer">
            <button
              className="btn btnLight"
              type="button"
              onClick={goPrev}
              disabled={step === "basic"}
            >
              Back
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              {step !== "final" ? (
                <button className="btn btnGhost" type="button" onClick={goNext}>
                  Next
                </button>
              ) : (
                <button
                  className="btn btnPrimary"
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showTc && (
        <div className="modalOverlay" onClick={() => setShowTc(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <h3>Terms &amp; Conditions (T&amp;C)</h3>
              <button
                className="btn btnLight"
                type="button"
                onClick={() => setShowTc(false)}
              >
                Close
              </button>
            </div>
            <div className="modalBody">
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                }}
              >
                {tcText}
              </pre>
            </div>
            <div className="modalFoot">
              <button
                className="btn btnPrimary"
                type="button"
                onClick={() => setShowTc(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
