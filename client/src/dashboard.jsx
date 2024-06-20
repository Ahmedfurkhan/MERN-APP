function Dashboard() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="/home">Home</a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/employee">Create List</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/employeelist">Employee List</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">User</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h1>Welcome to admin Panel</h1>
            </div>
        </div>        
    )
}
export default Dashboard;
