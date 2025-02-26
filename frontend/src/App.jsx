import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/admin/Dashboard';
import Authlayout from './layout/Authlayout';
import Login from './pages/auth/Login';
import Users from './pages/admin/User/User';
import EditUser from './pages/admin/User/EditUser';
import EditMember from './pages/admin/Member/EditMember';
import AddUser from './pages/admin/User/AddUser';
import Members from './pages/admin/Member/Member';
import UnitPS from './pages/admin/Unit/UnitPs';
import Meja from './pages/admin/Meja/Meja';
import Sewa from './pages/admin/Sewa/Sewa';
import Booking from './pages/admin/Booking/Booking';
import AddUnit from './pages/admin/Unit/AddUnit';
import AddMember from './pages/admin/Member/AddMember';
import AddMeja from './pages/admin/Meja/AddMeja';
import AddSewa from './pages/admin/Sewa/AddSewa';
import AddBooking from './pages/admin/Booking/AddBooking';
import EditUnit from './pages/admin/Unit/EditUnit';
import EditMeja from './pages/admin/Meja/EditMeja';
import LogMember from './pages/auth/LoginMember';
import EditSewa from './pages/admin/Sewa/EditSewa';
import EditBooking from './pages/admin/Booking/EditBooking';
import HomeMember from './pages/Home/Home';

function App() {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/" element={<Layout/>}>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path='user' element={<Users/>}/>
            <Route path="edituser/:id" element={<EditUser />} />
            <Route path='member' element = {<Members/>} />
            <Route path='addmember' element = {<AddMember/>} />
            <Route path='editmember/:idmember' element={<EditMember/>} />
            <Route path='adduser' element={<AddUser/>}/>
            <Route path='unit' element={<UnitPS/>} />
            <Route path='addunit' element={<AddUnit/>} />
            <Route path='editunit/:idunit' element={<EditUnit/>} />
            <Route path='meja' element={<Meja/>} />
            <Route path='addmeja' element={<AddMeja/>} />
            <Route path='editmeja/:idtempat' element={<EditMeja/>} />
            <Route path='sewa' element={<Sewa/>} />
            <Route path='addsewa' element={<AddSewa/>} />
            <Route path='editsewa/:idsewa' element={<EditSewa/>} />
            <Route path='booking' element = {<Booking/>}/>
            <Route path='addbooking' element = {<AddBooking/>}/>
            <Route path='editbooking/:idbooking' element = {<EditBooking/>}/>
          </Route>
          <Route path='/' element= {<Authlayout/>}>
            <Route path='/' element = {<Login/>}/>
            <Route path='/logmember' element = {<LogMember/>}/>
            <Route path='/home' element = {<HomeMember/>}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App