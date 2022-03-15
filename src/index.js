import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Parameters from './pages/Parameters/Parameters';
import ParametrosProvider from './context/ParametrosProvider';
import Tree from './pages/Tree/Tree';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Tree></Tree>
    }

    return this.props.children; 
  }
}


ReactDOM.render(
  <BrowserRouter>
      <ParametrosProvider>
      <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parametros/" element={<Parameters />} />
            <Route path="/arbol/" element={<Tree />} />
          </Routes>
        </ErrorBoundary>
      </ParametrosProvider>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
