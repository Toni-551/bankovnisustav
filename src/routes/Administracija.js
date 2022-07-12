import { Link, Outlet, Navigate } from "react-router-dom";


function Administracija(){
    const handleClick=(event)=>{
        localStorage.removeItem('Sifra');
    }
    if(localStorage.getItem('Sifra')){
        return(
            <>
            <nav className='navbar navbar-expand-md justify-content-between bg-primary'>
                <div className='container'>
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
                        <Link className='btn text-white' to="/Login" onClick={handleClick}  >Odjava</Link>       
                    </div>    
                </div>
            </nav>
            <Outlet />
            </>
        );
    }else{
        return(
            <Navigate to="/login" />
        );
    }
}


export default Administracija;