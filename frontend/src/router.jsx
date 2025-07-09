import {Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginForm from './Components/LogInForm/LogInForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';

const RouterComponent = () =>{
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/forgot" element={<ForgotPassword/>} />


        </Routes>
    );
};

export default RouterComponent;