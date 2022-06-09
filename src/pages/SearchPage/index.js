import { Container, Row, Col } from "react-bootstrap";
import FlowerItem from "../../components/FlowerItem";
import flowerApi from "../../api/flowerApi";
import { useEffect, useState } from "react";
import styles from './SearchPage.module.css'
import { useSearchParams } from "react-router-dom";

function SearchPage() {

  const [searchParams] = useSearchParams()

  const key = searchParams.get('key')

  const [flowers, setFlowers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await flowerApi.search(key)
        console.log(res.data)
        setFlowers(res.data)
        
      } catch (error) {
        console.log(error)
      }
    }
    if (key) {
      fetchData()
    }
  }, [key])
  
  return (
    <div className={styles.main}>
      <Container>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Kết quả</h2>
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

export default SearchPage;
