import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PaginationShopHoa from "../../components/PaginationShopHoa";
import styles from "./OccasionDetailPage.module.css";
import BookItem from "../../components/FlowerItem";
import { useParams } from "react-router-dom";
import flowerApi from "../../api/flowerApi";
import occasionApi from "../../api/occasionApi";

export default function OccasionDetailPage() {
  const params = useParams();
  const { occasion } = params;

  const [flowerData, setFlowerData] = useState({});
  const [occasionData, setOccasionData] = useState({});
  const [orderByPrice, setOrderByPrice] = useState("");
  const [orderByDate, setOrderByDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await flowerApi.getAll({
          occasion: occasionData._id,
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

    if (occasionData._id) {
      fetchData();
    }
  }, [occasionData, orderByPrice, orderByDate, page]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await occasionApi.getBySlug(occasion);
        setOccasionData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (occasion) {
      fetchData();
    }
  }, [occasion]);

  const handleChangeOrderByPrice = (e) => {
    setOrderByPrice(e.target.value);
  };

  const handleChangeOrderByDate = (e) => {
    setOrderByDate(e.target.value);
  };

  const handleChangePage = useCallback((page) => {
    setPage(page);
  }, []);

  return (
    <div className="main">
      <Container>
        <div className={styles.genre_header}>
          <ul>
            <li>Trang chủ</li>
            <li>Sản Phẩm</li>
            <li>{occasionData && occasionData.name}</li>
          </ul>
          <h1>{occasionData && occasionData.name}</h1>
        </div>
        <div className={styles.genre_body}>
          <div className={styles.genreOrder}>
            <Row>
              <Col xl={3}>
                <div className={styles.orderItem}>
                  <label htmlFor="price-order">Giá:</label>
                  <select
                    className="form-select"
                    name="price-order"
                    value={orderByPrice}
                    onChange={handleChangeOrderByPrice}
                  >
                    <option value="">Sắp xếp theo giá</option>
                    <option value="desc">Cao đến thấp</option>
                    <option value="asc">Thấp đến cao</option>
                  </select>
                </div>
              </Col>

              <Col xl={3}>
                <div className={styles.orderItem}>
                  <label htmlFor="date-order">Sắp xếp:</label>
                  <select
                    className="form-select"
                    name="date-order"
                    value={orderByDate}
                    onChange={handleChangeOrderByDate}
                  >
                    <option value="">Sắp xếp theo ngày</option>
                    <option value="desc">Mới nhất</option>
                    {/* <option value="asc">Bán chạy nhất</option> */}
                    <option value="asc">Cũ nhất</option>
                  </select>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.products}>
            <Row>
              {flowerData.flowers && flowerData.flowers.length > 0
                ? flowerData.flowers.map((book) => (
                    <Col xl={3} key={book._id}>
                      <BookItem data={book} />
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
        </div>
      </Container>
    </div>
  );
}
