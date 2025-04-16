import "./App.css";
import CommunityPage from "./pages/CommunityPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUppage from "./pages/SignUppage.jsx";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/errorpage/PageNotFound";
import ProfilePage from "./pages/addProfile";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SignUppage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="*" element={<PageNotFound/>}/>
        <Route path="/addprofile" element={<ProfilePage/>}/>

      </Routes>
     
    </Router>
  );
}

export default App;
