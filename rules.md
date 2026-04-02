Full-Stack Booking System Test
1. Tech Stack Requirements
●
●
●
●
●
Frontend: Next.js (App Router), TypeScript, TailwindCSS
Backend: NestJS (Node.js framework), TypeScript
Validation: Zod (shared schemas for frontend/backend)
Database: PostgreSQL via Drizzle ORM
Design: Figma Design image 
/Users/beyzaaslan/Desktop/booking-task/image.png
2. Project Structure
The project should be organized into a decoupled architecture:
●
●
apps/web (Next.js): Components, Pages (App Router), and API fetching logic.
apps/api (NestJS): Modules, Controllers, Services, and DB configuration.
3. Features to Implement
Frontend Components (Next.js)
●
Booking Widget with Profile Page
○
Calendar view showing available days and time slots
○
Time slot selection functionality
○
Booking session button
○
Confirmation modal
Backend API (NestJS)
A. Get Available Sessions
●
●
●
Endpoint: GET /bookings/available?date=
...
Logic: Filter out sessions that are already booked in the database.
Requirements:
○
Filter out already booked sessions
○
Return available time slots for a specific date
○
Include session duration
○
Handle timezone conversions
None
// Function to get available sessions and filter out booked ones
async function getAvailableSessions(date: Date) {
// Should return available time slots excluding booked ones
// Return type: Array of available time slots
}
Note: The function structure does not necessarily need to be exactly like the code snippet
above. You may make necessary changes to make it work for NestJS such as adding
decorators.
B. Book Session
●
●
●
Endpoint: POST /bookings
Logic: Validate session availability before creating a record to prevent double bookings.
Requirements:
○
Validate session availability before booking
○
Create booking record in the database
○
Send confirmation email (optional)
○
Handle concurrent booking attempts
None
// Function to book a new session
async function bookSession(sessionData: {
userId: string;
date: Date;
timeSlot: string;
}) {
// Create new booking in database
// Return booking confirmation
}
Note: The function structure does not necessarily need to be exactly like the code snippet
above. You may make necessary changes to make it work for NestJS such as adding
decorators.
4. Additional Requirements
1. Error Handling:
○ Handle double bookings
○ Validate session availability
○ Proper error messages for users
2. Authentication:
○ Implement user authentication
○ Protect booking routes
○ Handle user sessions
3. UI/UX:
○ Responsive design
○ Loading states
○ Error states
○ Success confirmations
4. Testing:
○ Unit tests for API functions
○ Integration tests for booking flow
○ E2E tests for critical paths
5. Evaluation Criteria
1. Code Quality:
a. Clean, maintainable code.
b. Proper TypeScript usage.
c. Proper NestJS project structure.
d. Following best coding practices.
2. Functionality:
a. Working booking system
b. Proper error handling
c. Real-time updates
3. Performance:
a. Optimized database queries
b. Frontend optimization
c. Loading states
4. UI/UX:
a. Responsive design
b. Intuitive user interface
c. Smooth user experience
6. Submission Requirements:
● GitHub repository with clear documentation
● Setup instructions
● API Documentation
● Environment variables example
● Database setup guide
This test will evaluate the candidate's ability to:
● Work with modern full-stack technologies
● Implement complex business logic
● Handle real-time data updates
● Create clean and maintainable code
● Design and implement database schemas
● Create intuitive user interfaces
