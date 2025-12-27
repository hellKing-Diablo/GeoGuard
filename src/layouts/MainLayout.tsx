import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
