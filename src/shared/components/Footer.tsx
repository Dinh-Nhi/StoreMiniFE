import { Link } from "react-router-dom";
import { useStoreInfo } from "../../context/StoreInfoContext";

export default function Footer() {
  const storeInfo = useStoreInfo();

  return (
    <>
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div
            className="pb-4 mb-4"
            style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}
          >
            <div className="row g-4">
              <div className="col-lg-3">
                <Link to="/">
                  <h1 className="text-primary mb-0">
                    {storeInfo.find((item) => item.code === "LOGO")?.name}
                  </h1>
                </Link>
              </div>
              <div className="col-lg-6"></div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end pt-3">
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">
                  {storeInfo.find((item) => item.code === "MENU1")?.name}
                </h4>
                {storeInfo
                  .filter((item) => item.parentCode === "MENU1")
                  .sort((a, b) => a.sort - b.sort)
                  .map((menu) => (
                    <a
                      key={menu.id}
                      href={menu.link || "#"}
                      className="btn-link"
                    >
                      {menu.name}
                    </a>
                  ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">
                  {storeInfo.find((item) => item.code === "MENU2")?.name}
                </h4>
                {storeInfo
                  .filter((item) => item.parentCode === "MENU2")
                  .sort((a, b) => a.sort - b.sort)
                  .map((menu) => (
                    <a
                      key={menu.id}
                      href={menu.link || "#"}
                      className="btn-link"
                    >
                      {menu.name}
                    </a>
                  ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">
                  {storeInfo.find((item) => item.code === "MENU3")?.name}
                </h4>
                {storeInfo
                  .filter((item) => item.parentCode === "MENU3")
                  .sort((a, b) => a.sort - b.sort)
                  .map((menu) => (
                    <a
                      key={menu.id}
                      href={menu.link || "#"}
                      className="btn-link"
                    >
                      {menu.name}
                    </a>
                  ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">
                  {storeInfo.find((item) => item.code === "MENU4")?.name}
                </h4>
                {storeInfo
                  .filter((item) => item.parentCode === "MENU4")
                  .sort((a, b) => a.sort - b.sort)
                  .map((menu) => (
                    <a
                      key={menu.id}
                      href={menu.link || "#"}
                      className="btn-link"
                    >
                      {menu.name}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
