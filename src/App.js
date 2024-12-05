import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Signin from './components/Signin';
import Main from './components/Main';
import NewsDetails from './components/NewsDetails';
import { Auth0ProviderWithNavigate } from './auth/auth0-provider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <HashRouter>
      <Auth0ProviderWithNavigate>
        <Routes>
          <Route path='/signin' element={<Signin />} />
          <Route path='/' element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }/>
          <Route path='/details' element={
            <ProtectedRoute>
              <NewsDetails />
            </ProtectedRoute>
          }/>
        </Routes>
      </Auth0ProviderWithNavigate>
    </HashRouter>
  );
}

export default App;