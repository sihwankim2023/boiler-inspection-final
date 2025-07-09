import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InspectionPage from './pages/InspectionPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inspection" element={<InspectionPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App