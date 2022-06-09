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
                  src="https://img.freepik.com/foto-gratis/banner-horizontal-pila-libros-lado-derecho-proyectos-educativos_351987-173.jpg"
                  alt="First slide"
                  />
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                  <img
                  className={`d-block w-100 ${styles.img}`}
                  src="https://t3.ftcdn.net/jpg/04/27/15/08/360_F_427150821_oQOZiOLP6lnWQdUmUG0YgQiTUsjmaGwE.jpg"
                  alt="Second slide"
                  />
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                  <img
                  className={`d-block w-100 ${styles.img}`}
                  src="http://images6.fanpop.com/image/photos/40600000/Book-Banner-Header-booknerd-40619463-950-323.jpg"
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
