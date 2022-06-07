import { Link, Outlet } from "react-router-dom";


function Administracija(){
    return(
        <>
        <nav className='navbar navbar-expand-lg'>
            <Link className='btn' to="klijenti">Klijenti</Link>
            <Link className='btn' to="transakcije">transakcije</Link>
            <Link className='btn' to="Zaposlenici">zaposlenici</Link>
        </nav>
        <Outlet />
        </>
    );
}

export default Administracija;