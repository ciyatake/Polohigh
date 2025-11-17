import { useEffect, useMemo, useState } from "react";

const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

const buildInitialState = (profile) => ({
  fullName: profile?.name ?? "",
  email: profile?.email ?? "",
  mobileNumber: profile?.phone ?? "",
  birthday: toDateInputValue(profile?.birthday),
});

const useInitialState = (profile, open) => {
  const initial = useMemo(() => buildInitialState(profile), [profile]);
  const [formValues, setFormValues] = useState(initial);

  useEffect(() => {
    if (open) {
      setFormValues(buildInitialState(profile));
    }
  }, [open, profile]);

  return [formValues, setFormValues];
};

const validateForm = (values) => {
  if (!values.fullName || values.fullName.trim().length < 2) {
    return "Please enter your full name.";
  }

  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    return "Please enter a valid email address.";
  }

  if (!/^[0-9]{10}$/.test(values.mobileNumber.trim())) {
    return "Please enter a valid 10-digit mobile number.";
  }

  if (values.birthday) {
    const date = new Date(values.birthday);
    if (Number.isNaN(date.getTime())) {
      return "Please pick a valid birthday.";
    }
  }

  return "";
};

const EditProfileDialog = ({ open, profile, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useInitialState(profile, open);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setError("");
      setSaving(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const validationError = validateForm(formValues);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      mobileNumber: formValues.mobileNumber.trim(),
    };

    if (formValues.birthday) {
      payload.birthday = formValues.birthday;
    }

    try {
      await onSubmit?.(payload);
      setSaving(false);
      onClose?.();
      return;
    } catch (submitError) {
      setError(
        submitError?.message || "We couldn't update your profile right now."
      );
      setSaving(false);
      return;
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutralc-900/40 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-neutralc-200 bg-white p-6 text-neutralc-600 shadow-[0_32px_56px_rgba(15,23,42,0.12)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutralc-400">
              Account details
            </p>
            <h2
              id="edit-profile-title"
              className="mt-2 text-2xl font-semibold text-neutralc-900"
            >
              Edit profile
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-full border border-neutralc-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutralc-600 transition hover:border-primary-500 hover:text-primary-500"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block text-sm">
            <span className="mb-2 block text-neutralc-600">Full name</span>
            <input
              type="text"
              name="fullName"
              value={formValues.fullName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-neutralc-200 bg-white px-4 py-3 text-sm text-neutralc-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Your name"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-neutralc-600">Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-neutralc-200 bg-white px-4 py-3 text-sm text-neutralc-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="name@example.com"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-neutralc-600">Mobile number</span>
            <input
              type="tel"
              name="mobileNumber"
              value={formValues.mobileNumber}
              onChange={handleChange}
              className="w-full rounded-2xl border border-neutralc-200 bg-white px-4 py-3 text-sm text-neutralc-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="10-digit mobile"
              pattern="[0-9]{10}"
              inputMode="numeric"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-neutralc-600">Birthday</span>
            <input
              type="date"
              name="birthday"
              value={formValues.birthday}
              onChange={handleChange}
              className="w-full rounded-2xl border border-neutralc-200 bg-white px-4 py-3 text-sm text-neutralc-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xs text-neutralc-400">
            These details update your primary customer profile.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-[8rem] items-center justify-center rounded-full border border-primary-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 transition hover:bg-primary-500 hover:text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileDialog;
