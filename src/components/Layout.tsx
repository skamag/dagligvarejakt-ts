import { Link, Outlet } from "react-router-dom"
// import logoImg from '../images/bananaTransparent.png'
import logoImg from "../images/bananaCoin.webp"

export default function Layout() {
  return (
    <div className="appContainer">
      <div className="headerContainer">
        <Link to="/" className="link">
          {/* <h1 className="header">Matvarepriser</h1> */}
          <div className="logo">
            <img className="logo-img" src={logoImg} alt="logoImg"></img>
            <h2 className="logo-text main-logo-text">Dagligvarejakt</h2>
            <h2 className="logo-text alternate-logo-text">Matinnhold</h2>
          </div>
        </Link>
        <div className="loginContainer">Logg inn</div>
        {/* <p>Finn dagligvarer og sammenlign priser fra ulike dagligvarekjeder.</p> */}
      </div>
      <Outlet />
    </div>
  )
}
