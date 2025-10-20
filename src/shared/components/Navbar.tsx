import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import SearchModal from "./SearchModal";
import { useStoreInfo } from "../../context/StoreInfoContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const storeInfo = useStoreInfo();
  const cartCount = useSelector(
    (state: RootState) =>
      state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="container-fluid fixed-top">
        {/* --- Topbar --- */}
        <div className="container topbar bg-primary d-none d-lg-block">
          <div className="d-flex justify-content-between">
            <div className="top-info ps-2">
              <small className="me-3">
                <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                <a href="#" className="text-white">
                  {storeInfo.find((item) => item.code === "ADDRESS")?.name}
                </a>
              </small>
              <small className="me-3">
                <i className="fas fa-envelope me-2 text-secondary"></i>
                <a href="#" className="text-white">
                  {storeInfo.find((item) => item.code === "EMAIL")?.name}
                </a>
              </small>
            </div>
            <div className="top-link pe-2">
              <a href="#" className="text-white">
                <small className="text-white mx-2">Privacy Policy</small>/
              </a>
              <a href="#" className="text-white">
                <small className="text-white mx-2">Terms of Use</small>/
              </a>
              <a href="#" className="text-white">
                <small className="text-white ms-2">Sales and Refunds</small>
              </a>
            </div>
          </div>
        </div>

        {/* --- Navbar --- */}
        <div className="container px-0">
          <nav className="navbar navbar-light bg-white navbar-expand-xl">
            <Link to="/" className="navbar-brand">
              <h1 className="text-primary display-6">
                {storeInfo.find((item) => item.code === "LOGO")?.name}
              </h1>
            </Link>

            <button
              className="navbar-toggler py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars text-primary"></span>
            </button>

            <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
              <div className="navbar-nav mx-auto">
                {storeInfo
                  .filter((item) => item.parentCode === "MENU")
                  .sort((a, b) => a.sort - b.sort)
                  .map((menu) => (
                    <Link
                      key={menu.id}
                      to={menu.link || "#"}
                      className="nav-item nav-link"
                    >
                      {menu.name}
                    </Link>
                  ))}
                <Link to="/contact" className="nav-item nav-link">
                  Contact
                </Link>
              </div>

              {/* --- User / Cart / Search --- */}
              <div className="d-flex m-3 me-0 align-items-center">
                <button
                  className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                  data-bs-toggle="modal"
                  data-bs-target="#searchModal"
                >
                  <i className="fas fa-search text-primary"></i>
                </button>

                <Link to="/cart" className="position-relative me-4 my-auto">
                  <i className="fa fa-shopping-bag fa-2x"></i>
                  {cartCount > 0 && (
                    <span
                      className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                      style={{
                        top: "-5px",
                        left: "15px",
                        height: "20px",
                        minWidth: "20px",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="d-flex align-items-center">
                    <span className="me-3 fw-bold text-primary">
                      {user.fullName || user.userName || user.email}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="my-auto">
                    <i className="fas fa-user fa-2x"></i>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <SearchModal />
    </>
  );
}
