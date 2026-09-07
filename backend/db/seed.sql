-- ====================================================================
-- Sample Seed Data for Smart Waste & Sanitation Management System
-- Stage 3: 1 Admin, 2 Workers, 2 Citizens, and Initial Civic Tickets
-- ====================================================================

-- 1. Insert Users
INSERT INTO users (id, name, email, role, phone)
VALUES
    (1, 'Dr. Neha Saxena', 'admin@municipal.gov.in', 'admin', '+91 98111 00001'),
    (2, 'Sanitation Team 01', 'team01@municipal.gov.in', 'worker', '+91 98222 00002'),
    (3, 'Sanitation Team 02', 'team02@municipal.gov.in', 'worker', '+91 98333 00003'),
    (4, 'Rahul Verma', 'rahul.verma@example.com', 'citizen', '+91 98765 43210'),
    (5, 'Pooja Sharma', 'pooja.sharma@example.com', 'citizen', '+91 98123 45678')
ON CONFLICT (id) DO NOTHING;

-- Reset users sequence to avoid collision on next insert
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. Insert Sample Tickets
INSERT INTO tickets (
    id,
    ticket_number,
    issue_type,
    description,
    location,
    latitude,
    longitude,
    image_url,
    priority,
    status,
    citizen_id,
    assigned_worker_id,
    resolution_note,
    after_image_url,
    created_at,
    updated_at,
    resolved_at
)
VALUES
(
    1,
    'SAN-1001',
    'Overflowing Bin',
    'The primary community waste receptacle has been overflowing for the past 24 hours. Stray animals are scattering plastic and organic waste onto the pedestrian walkway.',
    'Sector 4 Community Market, Near Booth 18, Ward 12',
    28.613900,
    77.209000,
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
    'Critical',
    'New',
    4,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours',
    NULL
),
(
    2,
    'SAN-1002',
    'Illegal Dumping',
    'Mini-truck dumped concrete rubble, gypsum boards, and commercial plastic packing materials during the night, choking the rainwater drain.',
    'Behind Metro Pillar 142, Ring Road Service Lane, Ward 7',
    28.535500,
    77.391000,
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    'High',
    'Assigned',
    5,
    2,
    NULL,
    NULL,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '4 hours',
    NULL
),
(
    3,
    'SAN-1003',
    'Scattered Waste',
    'Decaying vegetable market refuse spread across 30 meters of road, generating foul odor and attracting swarms near food stalls.',
    'Main Mandi Gate No. 2, Old Bus Stand Road, Ward 9',
    28.704100,
    77.102500,
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    'Medium',
    'In Progress',
    4,
    3,
    NULL,
    NULL,
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '1 hour',
    NULL
),
(
    4,
    'SAN-1004',
    'Dirty Public Area',
    'Public washroom approach road unusable due to choked effluent lines, standing water on tiled approach, and unattended trash.',
    'Central Bus Terminal, Near Waiting Hall 3, Ward 12',
    28.650700,
    77.233400,
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
    'High',
    'Resolved',
    5,
    2,
    'Sanitation squad mobilized with pressure jet washer and disinfectant lime powder. Area cleaned, drainage cleared, and floor sterilized.',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '6 hours'
),
(
    5,
    'SAN-1005',
    'Mixed Waste',
    'Dry cardboard and wet garden clippings dumped together into single heap instead of green and blue designated segregated bins.',
    'Central Park Jogging Track, East Gate, Ward 9',
    28.628900,
    77.206500,
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    'Low',
    'New',
    4,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours',
    NULL
)
ON CONFLICT (id) DO NOTHING;

SELECT setval('tickets_id_seq', (SELECT MAX(id) FROM tickets));

-- 3. Insert History Entries
INSERT INTO ticket_history (ticket_id, old_status, new_status, changed_by, note, created_at)
VALUES
(1, NULL, 'New', 'Rahul Verma (Citizen)', 'Grievance submitted with photo evidence.', NOW() - INTERVAL '2 hours'),
(1, 'New', 'New', 'Dr. Neha Saxena (Admin)', 'Priority escalated to Critical due to public health risk.', NOW() - INTERVAL '1 hour 50 minutes'),

(2, NULL, 'New', 'Pooja Sharma (Citizen)', 'Grievance reported with photo.', NOW() - INTERVAL '1 day'),
(2, 'New', 'Assigned', 'Dr. Neha Saxena (Admin)', 'Assigned to Sanitation Team 01.', NOW() - INTERVAL '4 hours'),

(3, NULL, 'New', 'Rahul Verma (Citizen)', 'Complaint registered.', NOW() - INTERVAL '5 hours'),
(3, 'New', 'Assigned', 'Dr. Neha Saxena (Admin)', 'Assigned to Sanitation Team 02.', NOW() - INTERVAL '3 hours'),
(3, 'Assigned', 'In Progress', 'Sanitation Team 02', 'Worker team on-site. Cleanup in progress.', NOW() - INTERVAL '1 hour'),

(4, NULL, 'New', 'Pooja Sharma (Citizen)', 'Public sanitation facility issue reported.', NOW() - INTERVAL '2 days'),
(4, 'New', 'Assigned', 'Dr. Neha Saxena (Admin)', 'Assigned to Sanitation Team 01.', NOW() - INTERVAL '1 day'),
(4, 'Assigned', 'In Progress', 'Sanitation Team 01', 'Dispatched pressure jet squad.', NOW() - INTERVAL '12 hours'),
(4, 'In Progress', 'Resolved', 'Sanitation Team 01', 'Jet washed and disinfected. Verification photo attached.', NOW() - INTERVAL '6 hours'),

(5, NULL, 'New', 'Rahul Verma (Citizen)', 'Unsegregated waste pile reported.', NOW() - INTERVAL '3 hours');
