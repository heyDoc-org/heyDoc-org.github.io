// clearmedi_dummy_api.js

window.ClearMediDummyAPI = {
  getHospitals({ city, department }) {
    return [
      {
        hospital_id: "HOSP001",
        name: "Apollo Hospital",
        departments: ["orthopedics", "general medicine"],
        city
      },
      {
        hospital_id: "HOSP002",
        name: "Fortis Healthcare",
        departments: ["orthopedics"],
        city
      }
    ];
  },

  getDoctors({ hospital_id, department }) {
    return [
      {
        doctor_id: "DOC001",
        name: "Dr. Rajesh Kumar",
        experience: 12
      },
      {
        doctor_id: "DOC002",
        name: "Dr. Ananya Singh",
        experience: 8
      }
    ];
  },

  getSlots({ doctor_id, date }) {
    return [
      { slot_id: "SLOT1", time: "10:00 AM" },
      { slot_id: "SLOT2", time: "11:30 AM" }
    ];
  }
};
