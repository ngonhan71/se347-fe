import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PaginationShopHoa from "../../components/PaginationShopHoa";
import FlowerItem from "../../components/FlowerItem";
import flowerApi from "../../api/flowerApi";
import occasionApi from "../../api/occasionApi";

import styles from "./ProductPage.module.css";

export default function ProductPage() {

  const [flowerData, setFlowerData] = useState({})
  const [occasionList, setOccasionList] = useState([])
  const [orderByPrice, setOrderByPrice] = useState("")
  const [orderByDate, setOrderByDate] = useState("")
  const [page, setPage] = useState(1);

  const [occasionsChecked, setOccasionsChecked] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await flowerApi.getAll({
          occasion: occasionsChecked,
          limit: 8,
          page: page,
          sortByPrice: orderByPrice,
          sortByDate: orderByDate,
        });
        setFlowerData({ flowers: res.data, totalPage: res.pagination.totalPage });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [orderByPrice, orderByDate, page, occasionsChecked]);

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await occasionApi.getAll({limit: 10});
        setOccasionList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOccasions();
  }, []);

  const handleChangeOrderByPrice = (e) => {
    setOrderByPrice(e.target.value);
  };

  const handleChangeOrderByDate = (e) => {
    setOrderByDate(e.target.value);
  };

  const handleChangePage = useCallback((page) => {
    setPage(page);
  }, []);

  const handleChangeOccasion = (e) => {
    const id = e.target.value
    setPage(1)
    setOccasionsChecked(pre => {
      if (pre.includes(id)) {
        return pre.filter(genre => genre !== id)
      } else {
        return [...pre, id]
      }
    })
  } 

  return (
    <div className="main">
      <Container>
        <div className={styles.genre_header}>
          <ul>
            <li>Trang ch???</li>
            <li>S???n Ph???m</li>
          </ul>
        </div>
        <div className={styles.genre_body}>
          <Row>
            <Col xl={3}>
              <div className={styles.filterGroup}>
                <p className={styles.filterGroupTitle}>Th??? lo???i</p>
                {occasionList &&
                  occasionList.length > 0 &&
                  occasionList.map((genre) => (
                    <div className={styles.filterGroupItem} key={genre._id}>
                      <label>
                        <input
                          type="checkbox"
                          className={styles.chk}
                          checked={occasionsChecked.includes(genre._id)}
                          value={genre._id}
                          onChange={handleChangeOccasion}
                        />
                        <span>{genre.name}</span>
                      </label>
                    </div>
                  ))}
              </div>
            </Col>
            <Col xl={9}>
              <div className={styles.genreOrder}>
                <Row>
                  <Col xl={4}>
                    <div className={styles.orderItem}>
                      <label htmlFor="price-order">Gi??:</label>
                      <select
                        className="form-select"
                        name="price-order"
                        value={orderByPrice}
                        onChange={handleChangeOrderByPrice}
                      >
                        <option value="">S???p x???p theo gi??</option>
                        <option value="desc">Cao ?????n th???p</option>
                        <option value="asc">Th???p ?????n cao</option>
                      </select>
                    </div>
                  </Col>

                  <Col xl={4}>
                    <div className={styles.orderItem}>
                      <label htmlFor="date-order">S???p x???p:</label>
                      <select
                        className="form-select"
                        name="date-order"
                        value={orderByDate}
                        onChange={handleChangeOrderByDate}
                      >
                        <option value="">S???p x???p theo ng??y</option>
                        <option value="desc">M???i nh???t</option>
                        {/* <option value="asc">B??n ch???y nh???t</option> */}
                        <option value="asc">C?? nh???t</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={styles.products}>
                <Row>
                  {flowerData.flowers && flowerData.flowers.length > 0
                    ? flowerData.flowers.map((flower) => (
                        <Col xl={3} key={flower._id}>
                          <FlowerItem data={flower} />
                        </Col>
                      ))
                    : null}
                </Row>
              </div>
              <div className={styles.pagination}>
                <Row>
                  <Col xl={12}>
                    {flowerData.totalPage > 1 ? (
                      <PaginationShopHoa
                        totalPage={flowerData.totalPage}
                        currentPage={page}
                        onChangePage={handleChangePage}
                      />
                    ) : null}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
