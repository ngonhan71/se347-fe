import { Container, Row, Col, Carousel } from "react-bootstrap";
import FlowerItem from "../../components/FlowerItem";
import flowerApi from "../../api/flowerApi";
import { useEffect, useState } from "react";
import styles from './HomePage.module.css'

function HomePage() {
  const [flowers, setFlowers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await flowerApi.getAll({page: 1, limit: 8, sortByDate: "desc"})
        setFlowers(res.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  

  return (
    <div className={styles.main}>
      <Container>
        <div className={styles.carousels}>
          <Carousel variant="dark">
              <Carousel.Item interval={2000}>
                  <img
                  className={`d-block w-100 ${styles.img}`}
                  src="https://hoayeuthuong.com/cms-images/banner/434445_only-rose.jpg"
                  alt="First slide"
                  />
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                  <img
                  className={`d-block w-100 ${styles.img}`}
                  src="https://hoayeuthuong.com/cms-images/banner/434433_63-tinh-thanh.jpg"
                  alt="Second slide"
                  />
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                  <img
                  className={`d-block w-100 ${styles.img}`}
                  src="https://hoayeuthuong.com/cms-images/banner/434408_giao-hang-nhanh-60p.jpg"
                  alt="Third slide"
                  />
              </Carousel.Item>
          </Carousel>
        </div>
        <div className={styles.flowersList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Sản phẩm nổi bật</h2>
          </div>
          <Row>
            {flowers && flowers.length > 0 ? (
               flowers.map(flower => 
                <Col xl={3} key={flower._id}>
                  <FlowerItem data={flower} />
                </Col>)
            ) : null}
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default HomePage;
