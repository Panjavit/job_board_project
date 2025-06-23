import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen w-full font-noto-sans">
            <Navbar />
            {children}
            <Footer/>
        </div>
    );
};

export default MainLayout;
