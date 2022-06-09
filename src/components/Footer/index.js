import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { IoPaperPlane, IoLogoFacebook, IoLogoYoutube, IoLogoInstagram } from "react-icons/io5";

import styles from "./Footer.module.css";
function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          <Col xl={3}>
            <div className={styles.footerGroup}>
              <h1 className={`${styles.shophoaHighlight} me-5`}>Shop Hoa</h1>
              <p>Khu phố 6, phường Linh Trung, TP Thủ Đức, TP HCM</p>
              <p>shophoa@gmail.com</p>
            </div>
          </Col>
          <Col xl={6}>
            <div className={styles.footerGroup}>
                <Row>
                  <Col xl={4}>
                    <div className={styles.footerBoxLink}>
                        <p className={styles.title}>SẢN PHẨM</p>
                        <Link to="/san-pham/chu-de/hoa-sinh-nhat">Hoa sinh nhật</Link>
                        <Link to="/san-pham/chu-de/hoa-khai-truong">Hoa khai trương</Link>
                        <Link to="/san-pham/chu-de/hoa-chuc-mung-tot-nghiep">Hoa chúc mừng</Link>
                        <Link to="/san-pham/chu-de/hoa-chia-buon">Hoa chia buồn</Link>
                    </div>
                  </Col>
                  <Col xl={4}>
                    <div className={styles.footerBoxLink}>
                        <p className={styles.title}>DANH MỤC</p>
                        <Link to="/">Trang chủ</Link>
                        <Link to="/">Giới thiệu</Link>
                        <Link to="/lien-he">Liên hệ</Link>
                        <Link to="/">Danh mục sản phẩm</Link>
                    </div>
                  </Col>
                  <Col xl={4}>
                    <div className={styles.footerBoxLink}>
                        <p className={styles.title}>CHÍNH SÁCH</p>
                        <Link to="/">Chính sách đổi trả</Link>
                        <Link to="/">Chính sách vận chuyển</Link>
                    </div>
                  </Col>
                </Row>
            </div>
          </Col>
          <Col xl={3}>
            <div className={styles.footerGroup}>
              <p className={styles.title}>ĐĂNG KÝ</p>
              <p>Đăng ký để nhận được được thông tin mới nhất từ chúng tôi.</p>
              <div className={`form-group ${styles.formGroup}`}>
                <input type="text" className="form-control" placeholder="Email..." />
                <button className={`bookstore-btn ${styles.subscribeBtn}`}><IoPaperPlane /></button>
              </div>
              <div className={styles.boxSocial}>
                <button className={`bookstore-btn ${styles.bookstoreBtn}`}><IoLogoFacebook /></button>
                <button className={`bookstore-btn ${styles.bookstoreBtn}`}><IoLogoYoutube /></button>
                <button className={`bookstore-btn ${styles.bookstoreBtn}`}><IoLogoInstagram /></button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
