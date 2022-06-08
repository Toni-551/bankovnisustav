import { Link, Outlet } from "react-router-dom";


function Administracija(){
    return(
        <>
        <nav className='navbar navbar-expand-lg bg-primary '>
            <Link className='btn text-white' to="klijenti">Klijenti</Link>
            <Link className='btn text-white' to="transakcije">transakcije</Link>
            <Link className='btn text-white' to="zaposlenici">zaposlenici</Link>
        </nav>
        <Outlet />
        </>
    );
}

export default Administracija;