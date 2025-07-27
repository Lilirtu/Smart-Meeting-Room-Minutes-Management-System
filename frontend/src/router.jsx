import {Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginForm from './Components/LogInForm/LogInForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import MeetingRoomBooking from './Components/RoomBookingForm/MeetingRoomBooking';
import MinutesForm from './Components/MinutesForm/MinutesForm';
//import ForgotPassword from './Components/ForgotPassword/ForgotPassword'; TO DOOOO

const RouterComponent = () =>{
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/booking" element={<MeetingRoomBooking/>} />
            <Route path="/minutes_of_meeting" element={<MinutesForm/>} />

        </Routes>
    );
};

export default RouterComponent;