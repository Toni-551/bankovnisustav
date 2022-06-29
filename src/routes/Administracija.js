import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";


function Administracija(){
    const username = localStorage.getItem('username');
    return(
        <>
        <nav className='navbar navbar-expand-md justify-content-between bg-primary'>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className='btn text-white' to="klijenti">Klijenti</Link>
                </li>
                <li className="nav-item">
                    <Link className='btn text-white' to="racuni">Racuni</Link>
                </li>
                <li className="nav-item">
                    <Link className='btn text-white' to="zaposlenici">Zaposlenici</Link>
                </li>
            </ul>
            <div className="navbar-nav ml-auto">
                <Link className='btn text-white' to="/Login">Odjava</Link>       
            </div>    
        </nav>
        <Outlet />
        </>
    );
}

export default Administracija;