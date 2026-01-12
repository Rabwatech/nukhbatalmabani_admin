Nukhbat Almabani Technician Portal - System Documentation
1. Project Overview
Application Name: Nukhbat Almabani Maintenance Portal (Technician Side) Framework: Next.js 13+ (App Router) Styling: Tailwind CSS Language/Localization: TypeScript with next-intl (Supports Arabic 

ar and English 

en). Global State/Context:

	•	ThemeProvider: Manages dark/light mode (defaulting to dark 'deep-black').
	•	DirectionProvider: Manages RTL/LTR layout direction based on locale.
2. Authentication & User Roles
Authentication Mechanism
	•	Method: Client-side session check using localStorage.
	•	Key Key: user
	•	Logic:
	•	On app/[locale]/layout.tsx, the app checks for the existence of the user item in localStorage.
	•	If missing, redirects to /auth (for protected routes).
	•	If present on public routes (like Landing), redirects to /technician/dashboard.
User Roles
	•	Technician: The primary and currently only explicitly defined role in this frontend application.
	•	Role Capabilities:
	•	View assigned tasks.
	•	Update task status (Start, Complete).
	•	Upload images (Before/After).
	•	View notifications.
	•	Manage profile and settings.

3. Detailed Page Breakdown
3.1. Landing Page (Root)
	•	Path: / (redirects based on auth)
	•	File: app/[locale]/page.tsx
	•	Purpose: Acts as the entry point router.
	•	Logic:
	•	Checks localStorage.getItem("user").
	•	If logged in -> Redirects to /technician/dashboard.
	•	If not logged in -> Redirects to /auth.
	•	UI: Displays a loading spinner and "Redirecting..." message while checking auth state.

3.2. Authorization Redirect
	•	Path: /auth (Redirects to /auth/login) (Implied by directory structure, though explicit page file was at /auth/login).
	•	Note: The app/[locale]/auth/page.tsx likely handles this or a middleware redirect exists.
3.3. Login Page
	•	Path: /[locale]/auth/login
	•	File: app/[locale]/auth/login/page.tsx
	•	Purpose: Allows users to authenticate.
	•	UI Elements:
	•	(Note: The file viewed contained a redirect redundancy or was a placeholder in the view_file output. Based on standard behavior):
	•	Form input for Username/Email.
	•	Form input for Password.
	•	"Login" button.
	•	"Forgot Password" link.
	•	Data Interactions:
	•	Submits credentials (mock or API).
	•	On success: Sets localStorage.setItem("user", ...) and redirects to Dashboard.
3.4. Forgot Password Page
	•	Path: /[locale]/auth/forgot-password
	•	File: app/[locale]/auth/forgot-password/page.tsx
	•	Purpose: Recover account access via email.
	•	UI Elements:
	•	Header: Icon and Title "Reset Password".
	•	Input: Email Address box (Validation: required, must contain '@').
	•	Button: "Send Reset Link" (Triggers loading state).
	•	Link: "Back to Login".
	•	Success State:
	•	Replaces form with a Success Message and a "Back to Login" button.
	•	Logic:
	•	Simulated API call with 1.5s delay.
	•	Validates email format locally.

3.5. Technician Layout (Shell)
	•	Path: /[locale]/technician/*
	•	File: app/[locale]/technician/layout.tsx
	•	Purpose: Provides the persistent value wrapper for all technician pages.
	•	Components:
	•	Navbar: Top bar (Fixed).
	•	SidebarNav: Desktop navigation (Fixed side).
	•	BottomNavigation: Mobile navigation (Fixed bottom).
	•	Responsive Behavior:
	•	Adjusts padding based on screen size (lg:pl-72 for LTR, lg:pr-72 for RTL).
	•	Handles RTL text direction automatically.
	•	Security: Runs a useEffect to force redirect to /auth if localStorage has no user.
3.6. Technician Dashboard
	•	Path: /[locale]/technician/dashboard
	•	File: app/[locale]/technician/dashboard/page.tsx
	•	Purpose: Central hub for technician activities.
	•	Data Loaded:
	•	stats: Aggregate counts (New Tasks, Overdue, Completed, Rating).
	•	urgentTasks: List of high-priority tasks.
	•	notifications: Recent alerts.
	•	UI Sections:
	1	Header:
	•	Welcome message ("Welcome, Ahmed").
	•	Profile snippet (Specialization, Experience).
	•	Notifications Bell: Shows unread count badge (e.g., "3").
	•	"My Tasks" Button: Quick navigation to task list.
	2	Stats Grid: 4 Cards (New Tasks, Overdue, Completed, Rating) showing value and trend (e.g., "+2").
	3	Urgent Tasks:
	•	Desktop: Table view (ID, Property, Issue, Status, Date, Actions).
	•	Mobile: Card view.
	•	Action: "View Details" button links to Task Details.
	4	Recent Notifications:
	•	List of latest alerts with icons (Info, Warning, Success).
	•	"View All" button links to Notifications page.
	5	Quick Actions: Large buttons for common tasks:
	•	"My Tasks"
	•	"Completed Tasks"
	•	"Profile"
3.7. Active Tasks List
	•	Path: /[locale]/technician/tasks
	•	File: app/[locale]/technician/tasks/page.tsx
	•	Purpose: View and filter all assigned tasks.
	•	UI Elements:
	•	Header: Title and description.
	•	Filters Bar:
	•	Search Input: Filters by Request ID, Property Name, or Client Name.
	•	Status Dropdown: All, Scheduled, In Progress, Overdue, Completed.
	•	Issue Type Dropdown: All, Electrical, Plumbing, HVAC.
	•	"Clear Filters" Button: Resets all selections.
	•	Task List:
	•	Renders a list of Task Cards.
	•	Empty State: Shows "No tasks found" icon/message if list is empty.
	•	Task Card Details:
	•	Request ID (REQ-001).
	•	Status Badge (Color-coded).
	•	Priority Badge (High/Medium/Low).
	•	Location (Property Name - Unit).
	•	Client Name.
	•	Scheduled Date & Time.
	•	Estimated Duration.
	•	Issue Type.
	•	Description excerpt.
	•	Action: "View Details" button.
3.8. Task Details Page
	•	Path: /[locale]/technician/tasks/[id]
	•	File: app/[locale]/technician/tasks/[id]/page.tsx
	•	Purpose: Comprehensive view and management of a specific task.
	•	Logic:
	•	Fetches task data based on [id].
	•	Manages local state for currentStatus, notes, images.
	•	UI Sections:
	1	Header:
	•	Task ID Title.
	•	"Contact Client" Button: (Mock action).
	•	"Back to Tasks" Button.
	2	Task Overview Card:
	•	Status & Priority badges.
	•	Grid of details: Request ID, Issue Type, Property/Unit, Date, Duration.
	•	Full Description.
	•	Special Instructions (if any).
	3	Client Information Card:
	•	Name, Phone, Email, Address.
	4	Attachments & Images Card:
	•	Client Attachments: List of files uploaded by client (View link).
	•	Before Images: File Upload Zone & Preview Grid.
	•	After Images: File Upload Zone & Preview Grid.
	5	Notes & Timeline Card:
	•	Technician Notes: Textarea for input.
	•	Timeline: Vertical list of events (Created, Scheduled, etc.).
	6	Action Footer:
	•	"Start Task" Button: Visible if status is 'Scheduled'. Changes status to 'In Progress'.
	•	"Complete Task" Button: Visible if status is 'In Progress'. Opens Confirmation Dialog.
	•	"Report Issue" Button: Always visible.
3.9. Completed Tasks Page
	•	Path: /[locale]/technician/completed
	•	File: app/[locale]/technician/completed/page.tsx
	•	Purpose: History of finished jobs and performance reviews.
	•	UI Sections:
	1	Stats Overview:
	•	Total Tasks count.
	•	Average Rating (e.g., 4.8).
	•	5-Star Ratings count.
	2	Filters:
	•	Date Range: Today, This Week, This Month, etc.
	•	Issue Type.
	3	Completed Task Card:
	•	Similar to active task card but adds:
	•	Completion Date.
	•	Duration Taken.
	•	Client Rating: Star display (0-5).
	•	Client Review: Text comment.
	•	Technician Notes: Saved notes.
	•	Actions: "View Details", "Download Report".
3.10. Notifications Page
	•	Path: /[locale]/technician/notifications
	•	File: app/[locale]/technician/notifications/page.tsx
	•	Purpose: Notification center.
	•	Features:
	•	Badges: Shows "X unread" count.
	•	Stats: Total, Unread, Urgent counts.
	•	Filters: Type (New Task, Reminder, Review, Update), Priority.
	•	Toggle: Show/Hide Read messages.
	•	Global Actions: "Mark All Read", "Clear Read".
	•	Notification Item:
	•	Icon (Contextual based on type).
	•	Title & Message.
	•	Badges: Priority, Type.
	•	Time label.
	•	Item Actions: Mark Read/Unread toggle, Delete.
3.11. Profile Page
	•	Path: /[locale]/technician/profile
	•	File: app/[locale]/technician/profile/page.tsx
	•	Purpose: User settings and management.
	•	UI Sections:
	1	Personal Info Card:
	•	Avatar (with Camera edit button).
	•	Fields: Name, Specialization, Email, Phone, Bio.
	•	Edit Mode: Toggles inputs for these fields.
	•	Read-only: Certifications, Languages.
	•	Working Hours: Start/End time inputs.
	•	Stats: Small summary (Tasks, Rating, Experience).
	2	Notification Settings:
	•	Switches for: New Tasks, Reminders, Reviews, System Updates.
	3	Security:
	•	Change Password Form (Current, New, Confirm).
	4	Logout:
	•	Button to clear session.
📘 Nokhbat Almabani Maintenance Portal - Comprehensive Technical Documentation
Generated Date: 2025-12-24 Version: 1.0 Target Audience: Developers, Stakeholders, QA

1. 📊 System Overview (Executive Summary)
This document provides an exhaustive detailed breakdown of the Nokhbat Almabani Maintenance Portal. It covers every accessible page, user role, data point, and interaction logic currently implemented in the frontend application.
🔢 Key Metrics
	•	Total Unique Pages: 12 (excluding dynamic routes & modals)
	•	Defined User Roles: 3 (Admin, User, Delegate)
	•	Primary Data Entities: 5 (Units, Requests, Delegates, Reports, Users)
	•	Tech Stack: Next.js 14+ (App Router), Tailwind CSS, Framer Motion, Lucide React Icons.

2. 👥 User Roles & Permissions
The system currently defines three distinct user roles with specific access levels. These roles are simulated in the frontend authentication flow.
Role
Identifier
Description
Key Permissions
Admin
admin
System Administrator
Full access to all modules, visible in system responses.
User
user
Property Owner
Full control over their own units, requests, and delegates.
Delegate
delegate
Authorized Representative
Access limited by specific permissions granted by the Owner.
🔐 Delegate Permission Flags
Delegates have granular permissions stored in the permissions object:
	1	viewRequests: Can view maintenance request history.
	2	createRequests: Can submit new maintenance requests.
	3	viewReports: Can view completed maintenance reports.
	4	manageUnit: Can edit unit details (e.g., occupancy status).

3. 🗺️ Site Map & Routing Structure
The application follows a standard Next.js App Router file-system routing.
🔒 Authentication (Public)
	•	/ (Root -> Redirects)
	•	/auth (Landing / Login Selection)
	•	/auth/login (Login Form)
	•	/auth/forgot-password (Password Recovery)
🏢 Maintenance Portal (Protected)
	•	/maintenance-portal/dashboard (Main Overview)
	•	/maintenance-portal/units (List of Units)
	•	/maintenance-portal/units/[id] (Unit Details)
	•	/maintenance-portal/requests (List of Requests)
	•	/maintenance-portal/request (New Request Wizard)
	•	/maintenance-portal/delegates (Delegate Management)
	•	/maintenance-portal/reports (Maintenance Reports)
	•	/maintenance-portal/notifications (System Alerts)
	•	/maintenance-portal/profile (User Settings)
	•	/maintenance-portal/support (Help Center)

4. 📄 Detailed Page Analysis
4.1. 🔐 Login / Auth Page
Path: 

/auth/page.tsx

Purpose: Entry point for users to authenticate. Includes dummy data for testing.
Content & Fields:
	•	Input: Email/National ID (emailOrId)
	•	Input: Password (password)
	•	Checkbox: Remember Me (rememberMe)
	•	Action: Toggle Language (Ar/En)
	•	Action: Forgot Password Link
Logic/Behavior:
	•	Validation: Checks if fields are empty.
	•	Mock Logic: Simulates a 1.5s network delay. Checks against hardcoded dummyUsers.
	•	Success: Stores user object in localStorage and redirects to Dashboard.
	•	Fail: Shows error alert "Invalid credentials".
	•	Test Accounts (Hardcoded):
	•	admin@nokhbatalmabani.com / admin123
	•	user@nokhbatalmabani.com (Owner) / user123
	•	delegate@nokhbatalmabani.com / delegate123

4.2. 📊 Dashboard
Path: /maintenance-portal/dashboard
Purpose: High-level overview of the user's properties and activities.
Content & Sections:
	1	Header: Welcome message with User Name. Quick actions (Bell, New Request).
	2	KPI Cards (Statistics):
	•	Total Units (Blue)
	•	Active Requests (Gold)
	•	Completed Requests (Green)
	•	Urgent Requests (Red - currently showing "0")
	3	Ongoing Requests (Latest 4): Table showing Property, Unit, Issue Type, Status, Date.
	4	My Units: Grid of Property Cards showing Project Name, Unit Code, Warranty Status, Open Request Count.
	5	Notifications Preview: List of 3 recent alerts.
	6	Quick Actions: Large buttons for "New Request", "Add Delegate", "Contact Support".
Logic/Behavior:
	•	Auto-Redirect: If the user has exactly 1 unit, they are automatically redirected to units/[id] instead of the dashboard.
	•	Data Source: Uses hardcoded stats, requests, properties, notifications arrays.

4.3. 🏠 Units Management
Path: /maintenance-portal/units
Purpose: List view of all properties owned by the user.
Data Model (Unit):
	•	ID: string (e.g., "unit-1")
	•	Code: string (e.g., "A101")
	•	Project: string (e.g., "مجمع الأناقة")
	•	Status: Occupied (مشغولة) / Available (متاحة) / Maintenance (صيانة)
	•	Specs: Area (m²), Room Count, Bathroom Count
	•	Financial: Price, Purchase Date
	•	Maintenance: Warranty Status, Last Maintenance Date, Open Request Count
Features:
	•	Search: Filter by Unit Code or Project Name.
	•	Filter: Filter by Status (All/Occupied/Available/etc).
	•	View Details: Opens a Modal with full unit specs.
	•	Edit/Delete: Mock actions that console log the intent.

4.4. 📋 Requests Management
Path: /maintenance-portal/requests
Purpose: Comprehensive list and management of maintenance tickets.
Data Model (Request):
	•	ID: string (e.g., "REQ-001")
	•	Type: string (Electricity, Plumbing, AC, etc.)
	•	Description: Text summary of the issue.
	•	Status: In Progress, Completed, Waiting, New.
	•	Priority: High, Medium, Low.
	•	Technician: Name & Phone (if assigned).
	•	Timeline: Created -> Assigned -> In Progress -> Completed dates.
	•	Attachments: Images/PDFs/Videos.
	•	Conversation: List of messages between Admin, Technician, User.
Features:
	•	Dual View: Table view for desktop, Card view for mobile.
	•	Filtering: Search by ID/Type/Desc; Filter by Status.
	•	Service Rating: If unique status is "Completed", user can submit a 1-5 star rating and feedback.
	•	Export: Mock CSV export button.

4.5. 👥 Delegate Management
Path: /maintenance-portal/delegates
Purpose: Manage permissions for family members or property managers.
Data Model (Delegate):
	•	Personal: Name, Relation (Wife, Son, etc.), Phone, Email.
	•	Association: Linked Unit ID & Name.
	•	Status: Active / Inactive.
	•	Permissions:
	•	viewRequests: Boolean
	•	createRequests: Boolean
	•	viewReports: Boolean
	•	manageUnit: Boolean
Features:
	•	Add Delegate: Modal form with validation (Zod/React Hook Form pattern).
	•	Requires Name, Phone (Regex validation for SA numbers), Relationship, Unit.
	•	Edit/Delete: Full CRUD simulation.
	•	Toggle Status: Activate/Deactivate delegate access without deleting.

4.6. 📄 Maintenance Reports
Path: /maintenance-portal/reports
Purpose: Detailed archival view of completed maintenance jobs, including costs and spare parts.
Data Model (Report):
	•	Reference: Report ID, Request ID, Unit Name.
	•	Problem Summary: Technical diagnosis.
	•	Technician: Name, Specialization, Duration of work.
	•	Work Details:
	•	Action Checklist (What was done).
	•	Spare Parts (Name, Qty, Cost).
	•	Recommendations (Future prevention).
	•	Financials: Total cost calculation (Sum of spare parts).
	•	Signatures: Digital signatures of Technician and Client.
Features:
	•	Filtering: Recent Reports, High Rating Reports.
	•	Download: Mock PDF download action.
	•	View Modal: Detailed breakdown of the invoice and technical notes.

4.7. 👤 User Profile & Settings
Path: /maintenance-portal/profile
Purpose: Account administration.
Tabs:
	1	Profile Info:
	•	Edit Name, Email, Phone.
	2	Security:
	•	Change Password (Validates length > 8, matching confirmation).
	3	Settings:
	•	Language: Dropdown (Ar/En).
	•	Notifications: Toggles for Email, SMS, Push.
	•	Danger Zone: Delete Account button (with confirmation alert).

5. 🔌 Data Relationships & Connections
Entity A
Relation
Entity B
Description
User
1 : N
Units
An owner can possess multiple property units.
Unit
1 : N
Requests
Multiple maintenance requests can be raised for one unit.
Unit
1 : N
Delegates
A delegate is assigned to a specific unit (currently 1-to-1 in UI selector).
Request
1 : 1
Report
A completed request generates exactly one final maintenance report.
Technician
N : M
Requests
Technicians are assigned to requests (stored as string/object on Request).

6. ⚠️ Known Limitations & Mock Data
This documentation reflects the frontend state. No real backend connection exists currently.
	1	Data Persistence: All changes (New Request, Edit Profile) are simulated with setTimeout and do not persist after page refresh, except for the user object in localStorage.
	2	Hardcoded Arrays: Lists of units, requests, and delegates are static constants in their respective page.tsx files.
	3	File Uploads: Visual only; no actual file handling.
System Documentation: Nukhbat Almabani (نخبة المباني)
NOTE
This document provides an exhaustive technical and functional overview of the Nukhbat Almabani web application. It details every page, component, user role, and data relationship within the system.
1. System Overview
Nukhbat Almabani is a premium real estate development platform built with Next.js 14+ (App Router). It serves as a digital storefront for showcasing elite real estate projects, managing inquiries, and facilitating investment opportunities.
Technology Stack
	•	Framework: Next.js (React) with TypeScript.
	•	Styling: Tailwind CSS with custom animations (Framer Motion, GSAP).
	•	Architecture: Client-side rendering (CSR) optimization with server components where applicable.
	•	Data Layer: Service-based architecture (ApiClient) ready for backend integration.
	•	State Management: React Context & Hooks.

2. User Roles & Permissions
The system defines four distinct user roles, each with specific permissions and access levels.
2.1. Client (Guest/Registered User)
	•	Description: The end-user visiting the website to view projects or make inquiries.
	•	Permissions:
	•	View: Public pages (Home, About, Projects, Services, Blog, Contact).
	•	Search: Filter and search projects and properties.
	•	Interact: Submit inquiry forms, book viewings, download brochures (pdf).
	•	Profile: Manage personal preferences (language, currency, notifications) - if authenticated.
	•	Data Access: Read-only access to public Project/Property data. Write access to Inquiries/Bookings (creation only).
2.2. Agent (Real Estate Agent)
	•	Description: Internal staff or external partners responsible for sales and client management.
	•	Permissions:
	•	Manage Leads: View and respond to inquiries assigned to them.
	•	Manage Bookings: Schedules, confirms, or reschedules viewings.
	•	Sales Tracking: View personal sales dashboard and commissions.
	•	Key Attributes: commission, specializations, workSchedule.
2.3. Developer (Project Developer)
	•	Description: Partners who list their development projects on the platform.
	•	Permissions:
	•	Dashboard: View analytics for their specific projects (views, inquiries).
	•	Project Management: Update availability of units (sold/reserved/available).
	•	Key Attributes: license, projectCount, rating.
2.4. Admin (System Administrator)
	•	Description: Superuser with full control over the platform.
	•	Permissions:
	•	CRUD Operations: Create, Read, Update, Delete for ALL entities (Projects, Users, settings).
	•	System Config: Manage global settings, feature flags, and CMS content.
	•	User Management: Approve/Ban agents and developers.

3. Database Schema & Relationships
The application data model relies on strongly typed interfaces. Below are the core entities and their relationships.
3.1. Entity Relationship Diagram (ERD) Overview
	•	Project 1:N Property (A project contains multiple units/properties).
	•	Developer 1:N Project (A developer owns multiple projects).
	•	User 1:N Inquiry (A user can make multiple inquiries).
	•	User 1:N Booking (A user can make multiple bookings).
	•	Agent 1:N Booking (An agent manages multiple bookings).
	•	Agent 1:N Inquiry (An agent is assigned multiple inquiries).
3.2. Detailed Data Models
Core Entities
	1	User (DatabaseUser)
	•	Fields: id, email, role, fullName, preferences (currency, language), isVerified.
	•	Relations: inquiries, bookings.
	2	Project (DatabaseProject)
	•	Fields: id, title, category (residential/commercial), status (planning/completed), priceRange, totalUnits, availableUnits, location.
	•	Assets: images, masterPlan, brochure, virtualTourUrl.
	•	Relations: properties, developer.
	3	Property (DatabaseProperty)
	•	Fields: id, price, bedrooms, bathrooms, area, status (available/sold).
	•	Relations: project (parent), agent.
	4	Transaction Entities
	•	Inquiry: Tracks user interest. Fields: type (general/project), status (pending/resolved), priority.
	•	Booking: Tracks physical visits. Fields: preferredDate, status (confirmed/cancelled), feedback.

4. Detailed Page Breakdown
Here is an exhaustive list of every page in the application, its content, and functionality.
4.1. Home Page (/)
	•	Route: app/page.tsx
	•	Purpose: Landing page to capture attention and direct traffic to key sections.
	•	Sections:
	1	Hero Section: Full-screen visual introduction with branding.
	2	Navigation: Fixed top bar (Navigation component).
	3	Marquee Demo: Animated scrolling text/images (Brand reinforcement).
	4	Interactive Map: A preview of the InteractiveMap component showing project locations.
	5	Featured Projects: A grid/carousel of top projects (FeaturedProjects component).
	6	Vision 2030: Section aligning the company with Saudi Vision 2030.
	7	How To Start: Step-by-step guide for potential investors/buyers.
	8	Interest Form: Quick lead capture form (InterestFormSection).
	9	FAQ: Accordion-style Frequently Asked Questions.
	10	Footer: Site-wide footer with links and contacts.
	•	Floating Elements: Contact buttons (WhatsApp/Phone) and "Scroll to Top" button.
4.2. About Page (/about)
	•	Route: app/about/page.tsx
	•	Purpose: Build trust and showcase company identity.
	•	Sections:
	1	About Intro: Heading and introduction text.
	2	Who We Are: Detailed company description.
	3	Vision & Mission: Strategic goals.
	4	Core Values: Principles guiding the company.
	5	What Makes Us Different: USP (Unique Selling Points).
	6	Our Achievements: Stats or awards.
	7	Organizational Structure: Visual hierarchy of the company.
	8	Linked Projects: References to major works.
	9	Final CTA: "Join us" or "Contact us" prompt.
	•	Data Dependencies: Mostly static content, potentially fetched from CMS in future.
4.3. Projects Page (/projects)
	•	Route: app/projects/page.tsx
	•	Purpose: Complete catalog of real estate projects.
	•	Components:
	•	Full Screen Map: Embeds https://map.nokhbh.sa/ in an iframe. This is a critical external dependency.
	•	Projects Slideshow: Visual gallery of projects.
	•	Projects Grid: Filterable list of projects.
	•	Data Flow: Fetches project list via ProjectService.getProjects().
4.4. Services Page (/services)
	•	Route: app/services/page.tsx
	•	Purpose: Detail the services offered (Construction, Management, Investment).
	•	Sections:
	1	Services Hero: Banner image and title.
	2	Services Grid: Cards detailing individual services.
	3	Final CTA.
4.5. Blog Page (/blog)
	•	Route: app/blog/page.tsx
	•	Purpose: Content marketing and SEO.
	•	Features:
	•	Search: Client-side filtering by title/excerpt.
	•	Categories: Filter by tags (Real Estate, Investment, Vision 2030).
	•	Featured Posts: Highlighted articles at the top.
	•	Post Grid: List of all articles with pagination/infinite scroll.
	•	Data Model: Mapped to BlogPost interface (ID, title, excerpt, content, author, date, tags).
4.6. Contact Page (/contact)
	•	Route: app/contact/page.tsx
	•	Purpose: Main communication hub.
	•	Interactive Forms:
	•	General Contact Form: Fields for Name, Phone, Email, Subject, Message.
	•	Job Application: List of open roles (Architect, Project Manager) with "Apply" buttons.
	•	Investment Request: Buttons for "Request Info" or "Download Brochure".
	•	Partnership Request: Information for potential B2B partners.
	•	Information Display:
	•	Contact Info: Phone, Email, Address, WhatsApp.
	•	Working Hours: Weekly schedule.
	•	Map: Custom Google Maps embed with styled overlay and location styling.
4.7. System Pages
	•	Layout (layout.tsx): Global wrapper including Fonts (Noto Kufi Arabic) and Global CSS. Defines metadata.
	•	Not Found (not-found.tsx): Custom 404 error page.
	•	Loading: Next.js loading states (if applicable).

5. Technical Relationships & Dependencies
	•	Map System: The Projects page relies heavily on an external iframe (map.nokhbh.sa).
	•	API Client: lib/api/client.ts is the choke point for all external data. Currently set to throw errors ("API Not Implemented") or return mocks, indicating the system is in a Pre-Integration state.
	•	Asset Management: Images are served via imagekit.io (CDN) as seen in the Contact and Blog pages code.
6. Development Status
	•	Frontend: High-fidelity, responsive, and animated.
	•	Backend Integration: Pending. Service layers (ProjectService, inquiryService) exist but are using stubs or mock data.
	•	Authentication: Not Implemented. JWT-based auth structure is present in ApiClient code but not active in the UI.
Project Architecture & Documentation Report: Nokhbat Almabani Admin Portal
IMPORTANT
This report reflects the current state of the application codebase. All data described is currently MOCK DATA hardcoded within the application components. No live backend connection exists.
1. Executive Summary
The Nokhbat Almabani Admin Portal is a comprehensive real estate management dashboard built with Next.js 14. It is designed to manage the entire lifecycle of real estate operations, from project and unit inventory management to customer CRM, sales booking, payments, and after-sales support.
The application features a robust bilingual implementation (Arabic/English) with full Right-to-Left (RTL) support, making it tailored for the Saudi Arabian market.
2. Technical Stack & Architecture
Core Technologies
	•	Framework: Next.js 14.2 (App Router)
	•	Language: TypeScript
	•	UI Architecture: React 18.3
	•	Styling: Tailwind CSS
	•	Animations: Framer Motion 12.23
	•	Component Primitives: Radix UI
	•	Icons: Lucide React
	•	Forms: React Hook Form + Zod
	•	Date Handling: date-fns
	•	Spreadsheet Processing: XLSX (SheetJS)
	•	State Management: React Context (Global), useState/useMemo (Local), Zustand (Dependency installed but not prominently used in analyzed pages)
Directory Structure & Routing
The project uses the Next.js App Router (app/ directory).
	•	Root Entry (/): Redirects immediately to /dashboard.
	•	Main Layout (app/dashboard/layout.tsx):
	•	Wraps the entire dashboard.
	•	Providers: DirectionProvider (Handles AR/EN toggling and LTR/RTL direction).
	•	Components: Sidebar (Navigation), Header (Top bar with user profile/settings - inferred).
Localization Strategy
	•	DirectionContext.tsx: Centralizes language state (ar | en) and direction (rtl | ltr).
	•	Implementation: Components subscribe to useDirection() to render conditional text and apply directional CSS classes.
	•	Default: Arabic (ar) / RTL.
3. User Roles & Permissions
Based on the Team & Roles Management module (/dashboard/team), the system defines an explicit Role-Based Access Control (RBAC) matrix.
Roles Identified
	1	Admin (مدير): Full system access.
	2	Sales (مبيعات): Focused on customer acquisition and closing deals.
	3	Support (دعم فني): Focused on after-sales service and maintenance.
	4	Viewer (مشاهد): Read-only access to specific dashboards.
Permission Matrix
Feature / Module
Admin
Sales
Support
Viewer
Dashboard (Summary)
✅
✅
✅
✅
Customer Management
✅
✅
✅
❌
Sales & Booking
✅
✅
❌
❌
Contracts & Ownership
✅
✅
❌
❌
Projects & Units
✅
✅
❌
❌
Payments
✅
❌
❌
❌
After-Sales Support
✅
❌
✅
❌
Team & Roles
✅
❌
❌
❌
Reports & Analytics
✅
✅
✅
✅
Notifications
✅
❌
❌
❌
4. Comprehensive Page Analysis
4.1. Dashboard Home
	•	Route: /dashboard
	•	Purpose: High-level executive summary of company performance.
	•	Key Metrics Displayed:
	•	Total Customers (e.g., 1,247)
	•	Active Projects (e.g., 23)
	•	Monthly Revenue (e.g., ₹2.4M - Note: Currency symbol discrepancy in mock data)
	•	Growth Rate (e.g., 15.3%)
	•	Sections:
	•	Recent Activities: Feed of latest sales, meetings, and issues.
	•	Quick Actions: Shortcuts for common tasks (Add Customer, Create Contract).
4.2. Customer Management
	•	Route: /dashboard/customers
	•	Purpose: CRM for managing interaction with potential and existing clients.
	•	Sub-Modules / Tabs:
	•	All Customers: Master list.
	•	Interested: Leads/Prospects.
	•	Booked: Customers with active reservations.
	•	Contracted: Customers with signed contracts.
	•	Owners: Finalized property owners.
	•	Key Functionality:
	•	Add Customer: Modal to create new profiles (Auto-generated IDs).
	•	Customer Detail View: Comprehensive 360-degree view including:
	•	Personal Info (National ID, Occupation).
	•	Interaction Log (Calls, Meetings).
	•	Linked Units (Ownership history).
	•	Documents (Contracts, IDs).
	•	filters by Status, Project, and Sales Rep.
4.3. Sales & Booking
	•	Route: /dashboard/sales
	•	Purpose: Central hub for transaction processing.
	•	Sub-Modules / Tabs:
	•	Booking Dashboard: Visual grid of units showing availability status (Available, Reserved, Sold).
	•	Booking Management: List view of all reservations.
	•	Quotes & Pricing: Management of price offers sent to clients.
	•	Contracts: Tracking of legal contract status (Pending, Signed).
	•	Key Functionality:
	•	New Booking Modal: Workflow to link a Customer + Unit + Payment Plan.
	•	Unit Status Visualization: Color-coded grid for instant inventory check.
4.4. Projects & Units
	•	Route: /dashboard/projects
	•	Purpose: Inventory management for real estate assets.
	•	Sub-Modules / Tabs:
	•	Projects List: High-level view of developments (Status: Under Construction, Ready, etc.).
	•	Unit Management: Detailed inventory control.
	•	Analytics: Project-specific performance metrics.
	•	Key Functionality:
	•	Bulk Unit Creation: Heavy-duty tool to generate multiple units at once derived from templates (e.g., "Create 50 copies of Type A Apartment").
	•	Excel Import: Feature to upload unit lists via .xlsx.
	•	Project Wizard: Multi-step form for launching new projects.
4.5. Payments
	•	Route: /dashboard/payments
	•	Purpose: Financial tracking of incoming revenue.
	•	Sub-Modules / Tabs:
	•	Invoices & Receipts: Transaction ledger.
	•	Financial Reports: Aggregated financial health views.
	•	Key Functionality:
	•	Booking Confirmation: Processing initial down payments.
	•	Bank Transfer Verification: Workflow to approve uploaded transfer proofs.
	•	Payment Reminders: Manual trigger to send WhatsApp/SMS/Email reminders for overdue payments.
4.6. Maintenance Tasks
	•	Route: /dashboard/maintenance-tasks
	•	Purpose: Tracking physical issues with properties.
	•	Sub-Modules / Tabs: status-based filtering (All, New, In Progress, Completed).
	•	Key Functionality:
	•	New Request: Form to log issues (Leak, Electrical, AC) linked to a specific Unit.
	•	Kanban-style Summary: Count of tickets by status.
	•	Excel Export: Export maintenance logs for external reporting.
4.7. After-Sales Support
	•	Route: /dashboard/support
	•	Purpose: Broader customer service beyond physical maintenance (e.g., Warranty, modifications).
	•	Sub-Modules / Tabs:
	•	Maintenance Requests: (Cross-referenced with Maintenance page).
	•	Support Tickets: General inquiries and complaints.
	•	Service Reports: Logs of technician visits and work done.
	•	Customer Ratings: Feedback scores.
	•	Key Functionality:
	•	Ticket Creation: Logging generic support tickets.
	•	Rating System: 5-star feedback tracking for technician performance.
4.8. Team & Roles
	•	Route: /dashboard/team
	•	Purpose: Internal user management and security.
	•	Sub-Modules / Tabs:
	•	Team Members: Directory of system users.
	•	Role Permissions: Visual matrix of what each role can do.
	•	Activity Log: Audit trail of system actions (e.g., "Ahmed updated invoice #123").
	•	Login Audit: Security log of user sessions (IP, Device, Location).
	•	Key Functionality:
	•	Add/Edit Member: User provisioning.
	•	Permission Visualization: Read-only view of the permissions matrix.
4.9. Reports & Analytics
	•	Route: /dashboard/reports
	•	Purpose: High-level business intelligence.
	•	Sub-Modules / Tabs:
	•	Sales Reports: Revenue trends, top projects, top agents.
	•	Payment Reports: Collection rates, overdue aging.
	•	Customer Satisfaction: NPS and feedback analysis.
	•	Project Performance: Inventory turnover rates.
	•	Late Tasks: Operational bottlenecks.
	•	Key Functionality:
	•	Visual Charts: (Mock components currently) showcasing trends.
	•	Export: PDF/Excel download triggers.
4.10. Notifications
	•	Route: /dashboard/notifications
	•	Purpose: Communication center for internal and external alerts.
	•	Sub-Modules / Tabs:
	•	Communication Log: Record of all calls, meetings, and messages with clients.
	•	Task Reminders: Personal to-do list for the logged-in user.
	•	Internal Messages: Direct messaging between staff.
	•	Notification Center: System alerts (Bookings, Payments).
5. Data Models (Inferred from Mock Data)
The following entities act as the core data backbone of the application:
	•	Customer: { id, name, nationalId, phone, status, linkedUnits[] }
	•	Project: { id, name, location, type, totalUnits, status, manager }
	•	Unit: { id, projectId, unitNumber, type, area, price, status (First, Resale) }
	•	Booking: { id, customerId, unitId, date, status, paymentPlan }
	•	Payment: { id, invoiceNumber, amount, date, status (Paid, Pending), type }
	•	Ticket (Maintenance/Support): { id, unitId, issueType, priority, status, assignedTo }
	•	User (Staff): { id, name, role, department, status }
6. Functional Relationships
	1	Project <-> Unit: One-to-Many. Projects contain Units.
	2	Customer <-> Unit: Many-to-Many (via Bookings/Contracts). A customer can own multiple units; a unit belongs to one customer (once sold).
	3	Booking -> Payment: One-to-Many. A booking generates multiple payment installments (Invoices).
	4	Unit -> Maintenance: One-to-Many. Issues are logged against specific Units.
	5	User -> All: Users are assigned to specific records (e.g., "Assigned Sales Rep" on Customer, "Technician" on Ticket).
7. Current Limitations & Missing Features
	•	No Backend: The application is purely a frontend shell. No API calls are made. All data resets on refresh.
	•	Currency Inconsistency: Some dashboards show ₹ (Rupee) or generic symbols instead of SAR.
	•	Empty "Linked Units": The Customer Detail view has tabs for linked units that are currently empty placeholders.
	•	Hardcoded Logic: Permission checks (if role === 'admin') are mostly visual and not enforced by a secure backend middleware.
	•	Image Placeholders: User avatars use external placeholder URLs (pexels.com).
