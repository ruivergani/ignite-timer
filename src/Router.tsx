import {Routes, Route } from 'react-router-dom'; // lib to create routes
import { Home } from './pages/Home';
import { History } from './pages/History';
import { DefaultLayout } from './layouts/DefaultLayout';

export function Router(){
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout/>}> {/* O LayoutDefault engloba todas as rotas */}
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route> 
    </Routes>
  )
}
