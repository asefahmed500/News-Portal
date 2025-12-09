#!/bin/bash

echo "Starting News Portal Application..."
echo ""

# Start backend
echo "Starting backend server on port 3000..."
cd "newsportal-backend"
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on port 3001..."
cd "../newsportal-frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting!"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
