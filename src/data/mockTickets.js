// Realistic sample waste issue tickets for Smart Waste & Sanitation Management System (SIH Prototype - Stage 2)

export const SANITATION_TEAMS = [
  {
    id: "TEAM-01",
    name: "Sanitation Team 01",
    leader: "Rajesh Kumar",
    zone: "North Zone (Ward 12)",
    vehicle: "Compactor Truck #DL-04-SN-9201",
    members: 4
  },
  {
    id: "TEAM-02",
    name: "Sanitation Team 02",
    leader: "Suresh Meena",
    zone: "Central Zone (Ward 9)",
    vehicle: "Mini Tipper #DL-04-SN-4102",
    members: 3
  },
  {
    id: "TEAM-03",
    name: "Sanitation Team 03",
    leader: "Manoj Yadav",
    zone: "South-West Zone (Ward 7)",
    vehicle: "Pressure Jet Squad #DL-04-SN-5520",
    members: 5
  }
];

export const INITIAL_TICKETS = [
  {
    id: "SAN-1001",
    title: "Overflowing Community Dustbin near Sector 4 Market",
    issueType: "Overflowing Bin",
    priority: "Critical",
    status: "New",
    location: "Sector 4 Community Market, Near Booth 18, Ward 12",
    description: "The primary municipal waste receptacle has been overflowing for the past 24 hours. Stray animals are scattering plastic containers and food packaging onto the pedestrian walkway.",
    reportedBy: "Rahul Verma",
    citizenPhone: "+91 98765 43210",
    contactEmail: "rahul.verma@example.com",
    reportedDate: "2026-09-05 08:30 AM",
    zone: "North Zone (Ward 12)",
    assignedWorker: null,
    assignedWorkerId: null,
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
    afterImageUrl: null,
    resolutionNotes: null,
    history: [
      {
        time: "08:30 AM, Today",
        action: "Ticket created",
        actor: "Rahul Verma (Citizen)",
        note: "Submitted with photo evidence via Citizen Portal."
      },
      {
        time: "08:35 AM, Today",
        action: "Priority changed to Critical",
        actor: "Municipal Admin (HQ)",
        note: "Flagged critical due to pedestrian obstruction and animal scattering."
      }
    ]
  },
  {
    id: "SAN-1002",
    title: "Illegal Construction Debris & Plastic Dumping",
    issueType: "Illegal Dumping",
    priority: "High",
    status: "Assigned",
    location: "Behind Metro Pillar 142, Ring Road Service Lane, Ward 7",
    description: "Unidentified mini-truck dumped heavy concrete rubble, damaged gypsum boards, and commercial plastic packing materials during the night, choking the rainwater drain.",
    reportedBy: "Pooja Sharma",
    citizenPhone: "+91 98123 45678",
    contactEmail: "pooja.sharma@example.com",
    reportedDate: "2026-09-04 04:15 PM",
    zone: "South-West Zone (Ward 7)",
    assignedWorker: "Sanitation Team 03",
    assignedWorkerId: "TEAM-03",
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
    afterImageUrl: null,
    resolutionNotes: null,
    history: [
      {
        time: "04:15 PM, 04 Sep",
        action: "Ticket created",
        actor: "Pooja Sharma (Citizen)",
        note: "Initial status: New (Medium priority)."
      },
      {
        time: "05:00 PM, 04 Sep",
        action: "Priority changed to High",
        actor: "Municipal Admin (HQ)",
        note: "Identified drain choking risk before monsoon showers."
      },
      {
        time: "05:15 PM, 04 Sep",
        action: "Assigned to Sanitation Team 03",
        actor: "Municipal Admin (HQ)",
        note: "Dispatched to Manoj Yadav (Team 03, Ward 7)."
      }
    ]
  },
  {
    id: "SAN-1003",
    title: "Scattered Organic Food Waste near Sabzi Mandi",
    issueType: "Scattered Waste",
    priority: "Medium",
    status: "New",
    location: "Main Mandi Gate No. 2, Old Bus Stand Road, Ward 9",
    description: "Decaying vegetables and wet organic market refuse spread across 30 meters of the road. Generating foul odor and attracting flies near the fruit stalls.",
    reportedBy: "Amit Patel",
    citizenPhone: "+91 97654 32109",
    contactEmail: "amit.patel@example.com",
    reportedDate: "2026-09-05 07:45 AM",
    zone: "Central Zone (Ward 9)",
    assignedWorker: null,
    assignedWorkerId: null,
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
    afterImageUrl: null,
    resolutionNotes: null,
    history: [
      {
        time: "07:45 AM, Today",
        action: "Ticket created",
        actor: "Amit Patel (Citizen)",
        note: "Submitted with photo evidence."
      }
    ]
  },
  {
    id: "SAN-1004",
    title: "Dirty Public Sanitation Facility & Water Stagnation",
    issueType: "Dirty Public Area",
    priority: "High",
    status: "Resolved",
    location: "Central Bus Terminal, Near Waiting Hall 3, Ward 12",
    description: "Public washroom complex unusable due to choked effluent lines, standing water on tiled approach, and unattended trash cans.",
    reportedBy: "Deepak Joshi",
    citizenPhone: "+91 99887 76655",
    contactEmail: "deepak.j@example.com",
    reportedDate: "2026-09-03 11:20 AM",
    zone: "North Zone (Ward 12)",
    assignedWorker: "Sanitation Team 01",
    assignedWorkerId: "TEAM-01",
    resolutionNotes: "Sanitation squad mobilized with pressure jet washer and disinfectant lime powder. Effluent line cleared, tiles disinfected, and new trash liners installed.",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    history: [
      {
        time: "11:20 AM, 03 Sep",
        action: "Ticket created",
        actor: "Deepak Joshi (Citizen)",
        note: "Public health hazard reported."
      },
      {
        time: "11:35 AM, 03 Sep",
        action: "Priority changed to High",
        actor: "Municipal Admin (HQ)",
        note: "High footfall utility prioritized."
      },
      {
        time: "11:40 AM, 03 Sep",
        action: "Assigned to Sanitation Team 01",
        actor: "Municipal Admin (HQ)",
        note: "Assigned to Rajesh Kumar and field unit."
      },
      {
        time: "12:15 PM, 03 Sep",
        action: "Worker started work (Status: In Progress)",
        actor: "Sanitation Team 01",
        note: "Field crew reached location with jet washer."
      },
      {
        time: "02:30 PM, 03 Sep",
        action: "Worker marked issue as Resolved",
        actor: "Sanitation Team 01",
        note: "Jet washed and disinfected. Verification photo uploaded."
      }
    ]
  },
  {
    id: "SAN-1005",
    title: "Unsegregated Mixed Waste Piles near Central Park",
    issueType: "Mixed Waste",
    priority: "Low",
    status: "In Progress",
    location: "Central Park Jogging Track, East Gate, Ward 9",
    description: "Dry cardboard and wet garden clippings dumped together into single pile instead of green and blue designated bins.",
    reportedBy: "Sunita Roy",
    citizenPhone: "+91 94567 89012",
    contactEmail: "sunita.roy@example.com",
    reportedDate: "2026-09-04 02:00 PM",
    zone: "Central Zone (Ward 9)",
    assignedWorker: "Sanitation Team 02",
    assignedWorkerId: "TEAM-02",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
    afterImageUrl: null,
    resolutionNotes: null,
    history: [
      {
        time: "02:00 PM, 04 Sep",
        action: "Ticket created",
        actor: "Sunita Roy (Citizen)",
        note: "Reported with location details."
      },
      {
        time: "08:10 AM, Today",
        action: "Assigned to Sanitation Team 02",
        actor: "Municipal Admin (HQ)",
        note: "Assigned for manual segregation and cart dispatch."
      },
      {
        time: "09:00 AM, Today",
        action: "Worker started work (Status: In Progress)",
        actor: "Sanitation Team 02",
        note: "Crew arrived on-site with separate collection bins."
      }
    ]
  },
  {
    id: "SAN-1006",
    title: "Uncollected Dry Waste Bags Blockading Walkway",
    issueType: "Other",
    priority: "Medium",
    status: "Closed",
    location: "Govt Senior Secondary School Boundary, Block C, Ward 12",
    description: "Ten heavy gunny bags filled with shredded office paper and dry leaves stacked against the school compound wall.",
    reportedBy: "Vikas Deshmukh",
    citizenPhone: "+91 91234 56789",
    contactEmail: "vikas.d@example.com",
    reportedDate: "2026-09-02 09:10 AM",
    zone: "North Zone (Ward 12)",
    assignedWorker: "Sanitation Team 01",
    assignedWorkerId: "TEAM-01",
    resolutionNotes: "All waste bags loaded into compactor vehicle. Walkway cleared and swept clean.",
    imageUrl: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&auto=format&fit=crop&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    history: [
      {
        time: "09:10 AM, 02 Sep",
        action: "Ticket created",
        actor: "Vikas Deshmukh (Citizen)",
        note: "Reported near school perimeter."
      },
      {
        time: "10:30 AM, 02 Sep",
        action: "Assigned to Sanitation Team 01",
        actor: "Municipal Admin (HQ)",
        note: "Assigned for compactor pickup."
      },
      {
        time: "11:00 AM, 02 Sep",
        action: "Worker started work (Status: In Progress)",
        actor: "Sanitation Team 01",
        note: "Compactor vehicle on-site."
      },
      {
        time: "01:20 PM, 02 Sep",
        action: "Worker marked issue as Resolved",
        actor: "Sanitation Team 01",
        note: "All bags collected. Site clearance confirmed."
      },
      {
        time: "04:00 PM, 02 Sep",
        action: "Ticket Closed",
        actor: "Municipal Admin (HQ)",
        note: "Grievance resolved satisfactorily and closed."
      }
    ]
  }
];

export const ISSUE_TYPES = [
  { id: "Overflowing Bin", label: "Overflowing Bin", icon: "Trash2", color: "amber" },
  { id: "Illegal Dumping", label: "Illegal Dumping", icon: "AlertTriangle", color: "rose" },
  { id: "Scattered Waste", label: "Scattered Waste", icon: "Wind", color: "orange" },
  { id: "Mixed Waste", label: "Mixed Waste", icon: "Layers", color: "indigo" },
  { id: "Dirty Public Area", label: "Dirty Public Area", icon: "Sparkles", color: "purple" },
  { id: "Other", label: "Other", icon: "HelpCircle", color: "slate" }
];
