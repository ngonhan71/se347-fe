import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import PaginationShopHoa from "../PaginationShopHoa";

import { Row, Col, Card, Table, Spinner, Modal, Button } from "react-bootstrap";
import flowerApi from "../../api/flowerApi";
import format from "../../helper/format";
import styles from "./FlowerList.module.css";

function FlowerList() {
  const [flowerData, setFlowerData] = useState({});
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [flowerDelete, setFlowerDelete] = useState({})

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await flowerApi.getAll({ page: page, limit: 10, sortByDate: "desc" });
        setLoading(false);
        setFlowerData({ flowers: res.data, totalPage: res.pagination.totalPage });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [page]);

  const handleClickDeleteFlower = (e) => {
    setFlowerDelete({
      _id: e.target.getAttribute("data-id"),
      name: e.target.getAttribute("data-name")
    })
    setShowModal(true)
  }

  const handleChangePage = useCallback((page) => {
    setPage(page);
  }, []);

  const handleCallApiDelete = async (e) => {
    try {
      await flowerApi.deleteFlower(flowerDelete._id);
      setShowModal(false)
      alert("Xóa thành công!")
      setFlowerData((preState) => {
        const newArray = [...preState.flowers];
        return {
          ...preState,
          flowers: newArray.filter((item) => item._id !== flowerDelete._id)
        }
      });
    } catch (error) {
      alert("Xóa thất bại!")
      setShowModal(false)
    }
  }

  return (
    <Row className={styles.row}>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc xóa sách <b>{flowerDelete && flowerDelete.name}</b> này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleCallApiDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className={styles.title}>Danh sách sản phẩm</Card.Header>
          <Card.Body className={styles.flowerList}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th className={styles.name}>Tên hoa</th>
                  <th>Chủ đề</th>
                  <th>Đối tượng</th>
                  <th>Giá</th>
                  <th>Khuyến mãi (%)</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <Spinner
                        animation="border"
                        variant="success"
                      />
                    </td>
                  </tr>
                ) : flowerData.flowers && flowerData.flowers.length > 0 ? (
                  flowerData.flowers.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <td>{(1 && page - 1) * 10 + (index + 1)}</td>
                        <td>
                          {item.name} - {item?.display}
                        </td>
                        <td>
                          {item.occasion?.name}
                        </td>
                        <td>
                          {item.object?.name}
                        </td>
                        <td>{format.formatPrice(item.price)}</td>
                        <td>{item.discount}</td>
                        <td>
                          <Link
                            to={`/admin/flower/update/${item._id}`}
                            className="btn btn-warning"
                            data-id={item._id}
                          >
                            Sửa
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            data-id={item._id}
                            data-name={item.name}
                            onClick={handleClickDeleteFlower}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>Không có sản phẩm nào!</td>
                  </tr>
                )}
              </tbody>
            </Table>
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default FlowerList;
