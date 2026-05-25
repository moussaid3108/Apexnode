import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ApexNodeLink from './components/ApexNodeLink'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApexNodeLink />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
