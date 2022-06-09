import { Row, Col, Card, Form, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import styles from "./FormUpdateOccasion.module.css";
import { useEffect, useState } from "react";
import occasionApi from "../../api/occasionApi";

function FormUpdateOccasion() {
  const params = useParams()
  const { id } = params

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [occasionData, setOccasionData] = useState({})


  useEffect(() => {
    const fetchOccasion = async () => {
      try {
        const res = await occasionApi.getById(id);
         setOccasionData(res.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchOccasion();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: occasionData.name ? occasionData.name : "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Không được bỏ trống trường này!"),
    }),
    onSubmit: async () => {
      console.log("kiem tra", formik.values);
      const { name } = formik.values;
      try {
        setLoading(true)
        await occasionApi.updateOccasion(id, { name })
        setLoading(false)
        alert("Cập nhật thành công!")
        navigate({ pathname: "/admin/occasion" });
      } catch (error) {
        setLoading(false)
        alert("That bai! ", error)
        console.log(error);
      }
    },
  });

  return (
    <Row className={styles.addWrapper}>
      <Col xl={12}>
        <Card>
          <Card.Header className={styles.header}>Cập nhật thông tin</Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit}>
              <Row>
                <Col xl={4}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Tên chủ đề</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${
                        formik.errors.name
                          ? "is-invalid"
                          : formik.values.name && "is-valid"
                      }`}
                      placeholder="Tên chủ đề"
                      value={formik.values.name}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.name && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="d-flex-center">
                <button type="submit" className={`shophoa-btn ${styles.submitBtn}`}>
                  Lưu
                </button>
                {loading && <Spinner style={{ marginLeft: "20px" }} animation="border" variant="success" />}
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default FormUpdateOccasion;
