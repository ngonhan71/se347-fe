import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import PaginationShopHoa from "../PaginationShopHoa";

import { Row, Col, Card, Table, Spinner, Modal, Button } from "react-bootstrap";
import occasionApi from "../../api/occasionApi";
import styles from "./OccasionList.module.css";

function OccasionList() {
  const [occasionData, setOccasionData] = useState({});
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [occasionDelete, setOccasionDelete] = useState({})

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await occasionApi.getAll({ page: page, limit: 10, sortByDate: "desc" });
        setLoading(false);
        setOccasionData({ occasions: res.data, totalPage: res.pagination.totalPage });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [page]);

  const handleClickDeleteOccasion = (e) => {
    setOccasionDelete({
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
      await occasionApi.deleteOccasion(occasionDelete._id);
      setShowModal(false)
      alert("Xóa thành công!")
      setOccasionData((preState) => {
        const newArray = [...preState.occasions];
        return {
          ...preState,
          occasions: newArray.filter((item) => item._id !== occasionDelete._id)
        }
      });
    } catch (error) {
      alert("Xóa thất bại!")
      setShowModal(false)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa chủ đề</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc xóa chủ đề <b>{occasionDelete && occasionDelete.name}</b> này không?</Modal.Body>
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
          <Card.Header className={styles.title}>Danh sách chủ đề</Card.Header>
          <Card.Body className={styles.occasionList}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th className={styles.name}>Tác giả</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3}>
                      <Spinner
                        animation="border"
                        variant="success"
                      />
                    </td>
                  </tr>
                ) : occasionData.occasions && occasionData.occasions.length > 0 ? (
                  occasionData.occasions.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <td>{(1 && page - 1) * 10 + (index + 1)}</td>
                        <td>
                          {item.name} {item.year && "-"} {item?.year}
                        </td>
                        
                        <td>
                          <Link
                            to={`/admin/occasion/update/${item._id}`}
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
                            onClick={handleClickDeleteOccasion}
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
                {occasionData.totalPage > 1 ? (
                  <PaginationShopHoa
                    totalPage={occasionData.totalPage}
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

export default OccasionList;
