import { Link } from "react-router-dom";
import styles from "./AdminSideBar.module.css";

function AdminSideBar() {
  return (
    <div className={styles.adminSideBar}>
      <div className={styles.logo}>
        <Link to="/">
          <img
            src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png"
            alt=""
          />
          <span>SHOPHOA</span>
        </Link>
      </div>
      <div className={styles.sidebarContainer}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/admin">
              <span>Tổng quan</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/admin/flower">
              <span>Quản lý hoa</span>
            </Link>
            <div className={styles.subnav}>
              <div className={styles.navItem}>
                <Link className={styles.navLink} to="/admin/flower/add">
                  Thêm hoa mới
                </Link>
              </div>
            </div>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/admin/occasion">
              <span>Quản lý chủ đề</span>
            </Link>
            <div className={styles.subnav}>
              <div className={styles.navItem}>
                <Link className={styles.navLink} to="/admin/occasion/add">
                  Thêm chủ đề
                </Link>
              </div>
            </div>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/admin/order">
              <span>Quản lý đơn hàng</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSideBar;
