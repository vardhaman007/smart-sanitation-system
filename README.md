# AI-Powered Smart Waste & Sanitation Management System
**Smart India Hackathon (SIH) Prototype — Stage 2: Functional Ticket Management System**

A software-first civic-tech platform designed for municipal corporations to detect, report, prioritize, assign, track, and verify waste and sanitation issues.

---

## 👥 Three Portals & User Roles in Stage 2

| Role | Target Users | Available Screens & Features in Stage 2 |
| :--- | :--- | :--- |
| **1. Citizen** | General Public & Residents | • **Report Issue:** 6 categories, location, photo evidence, optional contact info (Name, Phone, Email).<br>• **Confirmation Modal:** Instant feedback with assigned `SAN-xxxx` ID.<br>• **My Tickets:** Filter by `All`, `New`, `Assigned`, `In Progress`, `Resolved`, `Closed`.<br>• **Ticket Details:** Site photo, status timeline, and worker cleaning proof. |
| **2. Sanitation Worker** | Ward Field Squads (`Sanitation Team 01`, `02`, `03`) | • **Team Isolation:** Worker sees only tasks assigned to their squad.<br>• **Task Acceptance:** Move from `Assigned` to `In Progress` with 1 click.<br>• **Resolution Workflow:** Submit detailed resolution notes and upload **After-Cleaning Photo Proof**.<br>• **Dashboard:** 6 dynamic KPI cards and active tasks queue. |
| **3. Administrator** | Municipal Authority & Zonal Officers | • **Command Center:** Citywide KPIs, high/critical priority triage alert, and squad workload breakdown.<br>• **Central Registry (`All Tickets`):** Table/Cards view, multi-filter by status & priority.<br>• **Dispatch Squads:** Assign unassigned tickets to `Sanitation Team 01`, `02`, or `03` (advances status to `Assigned`).<br>• **Priority Triage:** Escalate/downgrade to `Critical`, `High`, `Medium`, or `Low`.<br>• **Lifecycle Control:** Verify & `Close` tickets, or `Reopen` if needed. |

---

## 📊 Stage 2 Dashboard Statistics (6 KPIs)
Every portal dashboard dynamically displays:
1. **Total Tickets:** All grievances in the system (or assigned to squad)
2. **New:** Newly reported grievances awaiting municipal review
3. **Assigned:** Dispatched to a sanitation field squad
4. **In-Progress:** Field crew actively cleaning on-site
5. **Resolved:** Sanitation completed with after-cleaning photo proof
6. **High / Critical Priority:** Urgent public health and drainage hazards

---

## 🚀 How to Run the Project

### Method 1: Double Click (Windows)
Double-click **`start.bat`** in this folder.

### Method 2: Terminal (PowerShell)
```powershell
$env:PATH = "D:\node.js;$env:PATH"
npm.cmd run dev
```
Then visit **`http://localhost:3000`** in your browser.

---

## 🧪 Testing the Complete Citizen → Admin → Worker Workflow

1. **Step 1: Citizen Reports an Issue**
   - Click **Citizen** on the top demo bar.
   - Click **"Report Waste Issue"**.
   - Select an issue category (e.g., *Overflowing Bin*).
   - Enter location (e.g., *"Sector 4 Community Market"*) and description.
   - Attach a photo (or click one of the demo photo presets).
   - Click **"Submit Grievance Ticket"**.
   - **Verify:** A confirmation modal pops up with a new unique ID like **`SAN-1007`**, initial status **`New`**, and initial priority **`Medium`**.

2. **Step 2: Administrator Triages & Assigns Squad**
   - Click **Administrator** on the top demo bar.
   - Click **"All Tickets"**.
   - Locate the newly created ticket (`SAN-1007`).
   - Change Priority dropdown to **`Critical`** (observe history entry created).
   - In the Squad column, assign the ticket to **`Sanitation Team 01`**.
   - **Verify:** The status automatically moves to **`Assigned`**.

3. **Step 3: Sanitation Worker Accepts & Resolves Task**
   - Click **Worker** on the top demo bar (ensure **Team 01** is active).
   - Observe that `SAN-1007` appears in **Pending Field Tasks**.
   - Click **"Accept & Start"** → Status advances to **`In Progress`**.
   - Click **"Mark Resolved"** → Modal appears.
   - Enter resolution notes (e.g., *"Compactor truck emptied the bin. Disinfected area."*) and attach an after-cleaning photo.
   - Click **"Confirm Resolution"**.
   - **Verify:** Status changes to **`Resolved`** with both Before & After photos stored.

4. **Step 4: Administrator Verifies & Closes**
   - Return to **Administrator** and inspect `SAN-1007` details.
   - Compare the **Before** and **After** photos and read the worker notes.
   - Click **"Verify & Close Ticket"** → Status moves to **`Closed`**.
   - Inspect the complete audit trail in the **Ticket History Log**.

---

## 💾 How Ticket Data is Stored
- **Local Browser Persistence:** Stored in browser `localStorage` under the key `sih_sanitation_tickets_v2`.
- All state changes (creations, triage changes, assignments, status transitions, and resolution notes/photos) are automatically synchronized in real-time.
- You can reset the dataset back to the realistic default anytime using the **"Reset Mock Data"** button in the top demo bar.

---

## ⚠️ Limitations to Address in Stage 3 (When adding Real Backend/Database)
1. **Single-Browser Isolation:** Because `localStorage` is tied to your individual browser, multiple distinct physical devices cannot see each other's live updates without a real database.
2. **Image Storage Capacity:** In `localStorage`, image uploads are saved as base64 strings. Real production backends should store images in cloud object storage (e.g. Firebase Storage, AWS S3, or Supabase) and store only image URLs in the database.
3. **Role Security / Permissions:** In this stage, role switching is instantaneous for easy evaluation. A real backend will enforce JWT / session authentication and backend role-based access control (RBAC).
