# Getting Started with News Portal

## Installation

### Backend Setup
```bash
cd newsportal-backend
npm install
```

### Frontend Setup
```bash
cd newsportal-frontend
npm install
```

## Running the Application

### Option 1: Manual Start (Recommended)

**Terminal 1 - Backend:**
```bash
cd newsportal-backend
npm start
```
Backend runs on: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd newsportal-frontend
npm run dev
```
Frontend runs on: http://localhost:3001

### Option 2: Using Start Script (Linux/Mac)
```bash
./start.sh
```

## First Time Usage

1. Open http://localhost:3001 in your browser
2. You'll see the login page
3. Select a user from the dropdown:
   - Alice Rahman
   - Karim Hossain
   - Nusrat Jahan
4. Click "Login"
5. You're now on the news list page!

## Features to Try

### 1. View News
- Browse all news articles on the main page
- See author names and comment counts

### 2. Search News
- Use the search bar at the top to filter news by title
- Search is case-insensitive

### 3. Create News
- Click "Create News" button
- Fill in title (required)
- Fill in body (minimum 20 characters)
- Click "Create"

### 4. View News Details
- Click "View Details" on any news article
- See full content and all comments
- View who commented and when

### 5. Add Comments
- On the detail page, scroll to "Add Comment"
- Write your comment
- Click "Submit Comment"

### 6. Edit Your News
- Only visible on news you created
- Click "Edit" on your news
- Modify title or body
- Click "Update"

### 7. Delete Your News
- Only visible on news you created
- Click "Delete" on your news
- Confirm deletion

## Validation Rules

- ❌ News title cannot be empty
- ❌ News body must be at least 20 characters
- ❌ Comment text cannot be empty
- ❌ You cannot edit/delete other users' news

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Make sure you ran `npm install` in newsportal-backend

### Frontend won't start
- Check if port 3001 is already in use
- Make sure you ran `npm install` in newsportal-frontend

### Can't login
- Make sure backend is running on port 3000
- Check browser console for errors

### Changes not saving
- Verify backend server is running
- Check that db.json file exists in newsportal-backend/data/

## Project Structure

```
newsportal web app/
├── newsportal-backend/          # Express.js API
│   ├── server.js                # Main server
│   ├── data/db.json             # Database
│   └── package.json
├── newsportal-frontend/         # Next.js app
│   ├── app/                     # Pages
│   │   ├── page.tsx             # Login
│   │   └── news/                # News pages
│   ├── lib/                     # Utilities
│   │   ├── api.ts               # API calls
│   │   └── auth.ts              # Auth logic
│   └── package.json
└── README.md
```

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Database**: JSON file (db.json)
- **Auth**: Simulated (localStorage)

## Need Help?

Check the following files:
- `README.md` - Project overview
- `project.md` - Assignment requirements
- `newsportal-backend/README.md` - Backend documentation
- `newsportal-frontend/README.md` - Frontend documentation
