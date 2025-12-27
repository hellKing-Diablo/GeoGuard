import "./Footer.css";

const Footer = (): JSX.Element => {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} GearGuard</span>
      <span>Made with Love by Us.</span>
    </footer>
  );
};

export default Footer;
