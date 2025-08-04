import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutPlanner from './pages/WorkoutPlanner';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import AssignmentList from './pages/AssignmentList';
import AssignmentCreate from './pages/AssignmentCreate';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exercises" element={<ExerciseLibrary />} />
              <Route path="/assignments" element={<AssignmentList />} />
              <Route path="/assignments/create" element={<AssignmentCreate />} />
              <Route path="/workouts" element={<WorkoutPlanner />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
