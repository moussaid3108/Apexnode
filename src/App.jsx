import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ApexNodeLink from './components/ApexNodeLink'
import ApexNodeHub from './components/ApexNodeHub'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApexNodeLink />} />
        <Route path="/dashboard" element={<ApexNodeHub />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
