// this component is used in both live and mock modes to display subscriber settings.
import React, { useEffect, useState } from "react";

export default function SubscriberSettings({ mode = "live" }) {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  const base = mode === "live" ? "/api" : "/mock";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${base}/subscriber.json`);
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data);
      } catch (e) {
        console.error("Failed to load subscriber profile", e);
      }
    }
    fetchProfile();
  }, [mode]);

  if (!profile) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Subscriber Settings</h3>
        <p className="text-gray-400 italic">Loading profile...</p>
      </div>
    );
  }

  function updatePref(key, value) {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    // In mock mode we just simulate a save
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm max-w-lg">
      <h3 className="text-lg font-semibold mb-4">Subscriber Settings</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
            value={profile.name}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
            value={profile.email}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
            value={profile.preferences.theme}
            onChange={(e) => updatePref("theme", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Alerts enabled</span>
          <input
            type="checkbox"
            checked={profile.preferences.alerts_enabled}
            onChange={(e) => updatePref("alerts_enabled", e.target.checked)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-3 px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}