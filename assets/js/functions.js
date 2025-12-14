// functions.js
// Mock "client frontend APIs" for embed.js testing.
// Load this BEFORE embed.js so embed.js can call handlers on demand.
//
// Usage in HTML:
// <script src="/path/to/functions.js"></script>
// <script src="https://your-domain.com/static/embed.js" data-base-url="https://your-domain.com" data-path="/assistant"></script>
//
// Remove or replace these mocks in production.

(function () {
  // ---------- Config ----------
  const DEFAULT_DELAY_MS = 900;      // default simulated latency
  const SLOW_DELAY_MS = 3000;        // slow API latency
  const FLAKY_FAILURE_RATE = 0.35;   // 35% chance to fail for flaky APIs

  // Small helper: wait
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Helper: sometimes fail
  function maybeFail(rate, message = "Simulated failure") {
    if (Math.random() < rate) {
      const e = new Error(message);
      e._simulated = true;
      throw e;
    }
  }

  // ---------- Mock handlers ----------
  const handlers = {
    // Return a mock user profile (fast)
    GET_USER_PROFILE: async (payload) => {
      console.log("[ClientMock] GET_USER_PROFILE", payload);
      await wait(200);
      return {
        userId: "user-demo-001",
        name: "Loki Tester",
        dob: "1996-04-01",
        gender: "M",
        phone: "+91-99999-00000",
        email: "loki@example.com",
      };
    },

    // Insurance policy: typical fields you may expect
    GET_INSURANCE_POLICY: async (payload) => {
      console.log("[ClientMock] GET_INSURANCE_POLICY", payload);
      await wait(DEFAULT_DELAY_MS);

      // Example: payload may include ?policyId or memberId
      return {
        policyId: payload?.policyId || "POL-2025-0001",
        status: "active",
        holder: {
          name: "Loki Tester",
          memberId: "M-1234",
        },
        planName: "Wellness Plus",
        sumInsured: 500000,
        coPayPercent: 10,
        roomRentLimitPerDay: 4000,
        waitingPeriods: {
          maternityMonths: 24,
        },
        exclusions: ["cosmetic procedures", "experimental treatments"],
        networkHospitals: ["Alpha Hospital", "Beta Clinic"],
        raw: {
          externalReference: "EXT-abc-123"
        }
      };
    },

    // Pharmacy inventory search - simulates paged results & slower response
    SEARCH_PHARMACY_INVENTORY: async (payload) => {
      console.log("[ClientMock] SEARCH_PHARMACY_INVENTORY", payload);
      const q = (payload?.query || "").toLowerCase();
      await wait(SLOW_DELAY_MS);

      // Very simple "search" over sample set
      const catalog = [
        { sku: "PARA-500", name: "Paracetamol 500mg", price: 40, in_stock: true },
        { sku: "PARA-650", name: "Paracetamol 650mg", price: 60, in_stock: true },
        { sku: "IBU-200", name: "Ibuprofen 200mg", price: 45, in_stock: false },
        { sku: "AMOX-250", name: "Amoxicillin 250mg", price: 120, in_stock: true },
      ];

      const results = catalog.filter(item => !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q));

      return {
        query: q,
        total: results.length,
        results,
        fetchedAt: new Date().toISOString()
      };
    },

    // Simulate a slow backend call to test timeouts / waiting
    SLOW_TEST: async (payload) => {
      console.log("[ClientMock] SLOW_TEST", payload);
      await wait(SLOW_DELAY_MS);
      return {
        ok: true,
        took_ms: SLOW_DELAY_MS,
        message: "Simulated slow async API completed",
        timestamp: new Date().toISOString()
      };
    },

    // Flaky: sometimes throws to simulate transient issues
    FLAKY_TEST: async (payload) => {
      console.log("[ClientMock] FLAKY_TEST", payload);
      await wait(1200);
      maybeFail(FLAKY_FAILURE_RATE, "Simulated intermittent failure from client API");
      return { success: true, message: "FLAKY_TEST succeeded this run", ts: new Date().toISOString() };
    },

    // Echo - returns whatever it receives
    ECHO_PAYLOAD: async (payload) => {
      console.log("[ClientMock] ECHO_PAYLOAD", payload);
      await wait(150);
      return { echoed: payload, when: new Date().toISOString() };
    },

    // Recent lab reports - example array
    GET_RECENT_LABS: async (payload) => {
      console.log("[ClientMock] GET_RECENT_LABS", payload);
      await wait(600);
      return {
        labs: [
          { id: "LAB-001", test: "CBC", date: "2025-11-20", resultSummary: "Normal" },
          { id: "LAB-002", test: "Lipid Profile", date: "2025-10-10", resultSummary: "Raised LDL" }
        ],
        fetchedAt: new Date().toISOString()
      };
    }
  };

  // ---------- Expose to global window as HealthAssistantBridge ----------
  // If the host already defines handlers, we merge (host overrides)
  const existing = window.HealthAssistantBridge || {};
  window.HealthAssistantBridge = Object.assign({}, handlers, existing);

  console.info("[ClientMock] HealthAssistantBridge ready. Handlers:", Object.keys(window.HealthAssistantBridge));
})();
