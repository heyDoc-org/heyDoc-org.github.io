// clearmedi_dummy_api.js

window.ClearMediDummyAPI = {
  getHospitals({ city, department }) {
    const hospitalsByCity = {
      delhi: [
        {
          hospital_id: "HOSP001",
          name: "Apollo Hospital",
          city: "Delhi",
          rating: 4.5,
          departments: ["general medicine", "orthopedics"],
          description: "Multi-specialty hospital with 24/7 emergency services"
        },
        {
          hospital_id: "HOSP002",
          name: "Fortis Healthcare",
          city: "Delhi",
          rating: 4.6,
          departments: ["orthopedics"],
          description: "Advanced orthopedic and trauma care center"
        }
      ],

      mysore: [
        {
          hospital_id: "HOSP003",
          name: "JSS Hospital",
          city: "Mysore",
          rating: 4.4,
          departments: ["general medicine", "cardiology"],
          description: "Teaching hospital with comprehensive medical care"
        },
        {
          hospital_id: "HOSP004",
          name: "Apollo BGS Hospital",
          city: "Mysore",
          rating: 4.3,
          departments: ["orthopedics"],
          description: "Specialized orthopedic and trauma care hospital"
        }
      ],

      bangalore: [
        {
          hospital_id: "HOSP005",
          name: "Narayana Health",
          city: "Bangalore",
          rating: 4.6,
          departments: ["cardiology", "general medicine"],
          description: "Renowned cardiac care hospital"
        },
        {
          hospital_id: "HOSP006",
          name: "Aster CMI Hospital",
          city: "Bangalore",
          rating: 4.5,
          departments: ["general medicine", "neurology"],
          description: "Advanced multi-specialty healthcare center"
        }
      ]
    };

    const cityKey = city?.toLowerCase();
    let hospitals = hospitalsByCity[cityKey] || [];

    // Optional department filter
    if (department) {
      hospitals = hospitals.filter(h =>
        h.departments.includes(department.toLowerCase())
      );
    }

    return hospitals;
  },

  getDoctors({ hospital_id, department }) {
    const doctorsByHospital = {
      HOSP001: [
        {
          doctor_id: "DOC001",
          name: "Dr. Rajesh Kumar",
          department: "general medicine",
          experience: 12
        },
        {
          doctor_id: "DOC002",
          name: "Dr. Ananya Singh",
          department: "orthopedics",
          experience: 8
        }
      ],

      HOSP002: [
        {
          doctor_id: "DOC003",
          name: "Dr. Amit Verma",
          department: "orthopedics",
          experience: 15
        }
      ],

      HOSP003: [
        {
          doctor_id: "DOC004",
          name: "Dr. Sunita Rao",
          department: "general medicine",
          experience: 10
        }
      ],

      HOSP004: [
        {
          doctor_id: "DOC005",
          name: "Dr. Mahesh Gowda",
          department: "orthopedics",
          experience: 14
        }
      ],

      HOSP005: [
        {
          doctor_id: "DOC006",
          name: "Dr. Prakash Shetty",
          department: "cardiology",
          experience: 18
        }
      ],

      HOSP006: [
        {
          doctor_id: "DOC007",
          name: "Dr. Neha Iyer",
          department: "general medicine",
          experience: 9
        }
      ]
    };

    let doctors = doctorsByHospital[hospital_id] || [];

    // Optional department filter
    if (department) {
      doctors = doctors.filter(
        d => d.department.toLowerCase() === department.toLowerCase()
      );
    }

    return doctors;
  },

  getSlots({ doctor_id, date }) {
    const baseDate = date || new Date().toISOString().split("T")[0];

    const slotsByDoctor = {
      DOC001: [
        { slot_id: "SLOT1", date: baseDate, time: "10:00 AM" },
        { slot_id: "SLOT2", date: baseDate, time: "11:30 AM" }
      ],
      DOC002: [
        { slot_id: "SLOT3", date: baseDate, time: "2:00 PM" }
      ],
      DOC003: [
        { slot_id: "SLOT4", date: baseDate, time: "4:00 PM" }
      ],
      DOC004: [
        { slot_id: "SLOT5", date: baseDate, time: "9:30 AM" }
      ],
      DOC005: [
        { slot_id: "SLOT6", date: baseDate, time: "1:00 PM" }
      ],
      DOC006: [
        { slot_id: "SLOT7", date: baseDate, time: "3:30 PM" }
      ],
      DOC007: [
        { slot_id: "SLOT8", date: baseDate, time: "11:00 AM" }
      ]
    };

    return slotsByDoctor[doctor_id] || [];
  }
};
