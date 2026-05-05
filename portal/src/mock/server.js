export function startMockServer() {
  console.log("%cMock backend running...", "color:#4da6ff; font-weight:bold;");

  // Simulated database
  const mockSubscriber = {
    id: 1,
    name: "Lucie",
    email: "lucie@example.com",
    role: "Engineer",
    region: "US-East",
  };

  const mockRisk = {
    score: 62,
    level: "Medium",
    model_score: 50,
  };

  const mockDeviceHealth = {
    status: "healthy",
    last_seen: "2026-03-29T20:31:00",
    avg_interval_sec: 58.2,
    anomaly_rate: 0.12,
    uptime_percent: 98.4,
  };

  const mockAlerts = [
    {
      level: "warning",
      timestamp: "2026-03-29T20:31:00",
      message: "Elevated climate risk or anomaly detected.",
      risk_score: 62,
    },
    {
      level: "critical",
      timestamp: "2026-03-29T19:55:00",
      message: "Critical climate risk detected.",
      risk_score: 88,
    },
    {
      level: "info",
      timestamp: "2026-03-29T19:20:00",
      message: "Minor anomaly detected.",
      risk_score: 45,
    },
  ];

  const mockClusters = [];

  // Expose mock API globally
  window.mockApi = {
    // -----------------------------
    // AUTH
    // -----------------------------
    login: async (email, password) => {
      console.log("Mock login:", email);
      return {
        name: "Lucie",
        email,
        role: "Engineer",
      };
    },

    // -----------------------------
    // SUBSCRIBER
    // -----------------------------
    getSubscriber: async (id) => {
      console.log("Mock getSubscriber:", id);
      return mockSubscriber;
    },

    // -----------------------------
    // RISK
    // -----------------------------
    getRisk: async (deviceId) => {
      console.log("Mock getRisk:", deviceId);
      return mockRisk;
    },

    // -----------------------------
    // DEVICE HEALTH
    // -----------------------------
    getDeviceHealth: async (deviceId) => {
      console.log("Mock getDeviceHealth:", deviceId);
      return mockDeviceHealth;
    },

    // -----------------------------
    // ALERTS
    // -----------------------------
    getAlerts: async (deviceId) => {
      console.log("Mock getAlerts:", deviceId);
      return mockAlerts;
    },

    // -----------------------------
    // CLUSTERS
    // -----------------------------
    getClusters: async (subscriberId) => {
      console.log("Mock getClusters:", subscriberId);
      return mockClusters;
    },
  };
}