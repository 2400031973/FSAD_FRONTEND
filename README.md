# Online Assignment Submission and Grading System

A professional React-based web application for managing assignment submissions and grading with role-based access for students and teachers.

## Features

### Student Features
- View all assignments with status badges (Pending, Submitted, Graded)
- Submit assignments with file upload
- View grades and feedback from teachers
- Dashboard with assignment cards

### Teacher Features
- Create new assignments
- View all submissions
- Grade student submissions
- Provide feedback
- Dashboard with summary statistics

## Tech Stack

- React 18 (Functional Components)
- React Router DOM v6
- Pure CSS (No frameworks)
- Component-based architecture
- Local state management with useState

## Project Structure

```
src/
├── components/
│   ├── Sidebar.js       # Reusable sidebar navigation
│   ├── Header.js        # Page header component
│   └── Card.js          # Reusable card component
├── pages/
│   ├── Login.js         # Login page with role selection
│   ├── Register.js      # Registration page
│   ├── StudentDashboard.js
│   ├── TeacherDashboard.js
│   ├── CreateAssignment.js
│   ├── SubmitAssignment.js
│   ├── GradeAssignment.js
│   └── ViewGrades.js
├── App.js               # Main app with routing
├── index.js             # Entry point
└── style.css            # Global styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Login
- Email: any valid email
- Password: any password
- Role: Select Student or Teacher

### Student Role
- Navigate to Dashboard to view assignments
- Click "Submit" on pending assignments
- View grades in the "View Grades" section

### Teacher Role
- Create new assignments
- View and grade student submissions
- Provide feedback

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Status Badge Colors

- **Pending**: Orange (#f39c12)
- **Submitted**: Blue (#3182ce)
- **Graded**: Green (#38a169)

## Design Features

- Fixed sidebar navigation
- Card-based UI design
- Responsive layout (tablet-friendly)
- Smooth hover effects
- Professional color scheme
- Clean spacing and typography
- Soft shadows and rounded corners

## Notes

- This is a front-end only application (no backend)
- Uses localStorage for basic authentication simulation
- Dummy data is used for assignments and submissions
- Production-ready code structure
- Clean and maintainable codebase

## License

MIT
