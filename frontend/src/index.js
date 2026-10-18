import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TasksContextProvider } from './context/TasksContext'
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider> {/* Wrapowanie App w odpowiednie contexty, ktore sluza do przetrzymywania globalnie jakichs informacji */}
      <TasksContextProvider>
        <App />
      </TasksContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);