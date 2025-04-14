import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

const AdminDashboard = () => {
    
    return (
      <div className="max-w-full mx-auto">
        <Navbar />
  
        <div className="flex justify-center p-6">
            <h1 className="text-gray-500">Home Screen</h1>
        </div>
  
        <Footer />
      </div>
    );
};

export default AdminDashboard;