import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Row, Col, Card, Form, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import PreviewImage from "../PreviewImage";
import * as Yup from "yup";
import styles from "./FormAddFlower.module.css";
import { useEffect, useState } from "react";
import occasionApi from "../../api/occasionApi";
import objectApi from "../../api/objectApi";
import flowertypeApi from "../../api/flowertypeApi";
import flowerApi from "../../api/flowerApi";
import axios from "axios";

function FormAddFlower() {
  const navigate = useNavigate();

  const [occasionList, setOccasionList] = useState([]);
  const [objectList, setObjectList] = useState([]);
  const [flowertypeList, setFlowertypeList] = useState([]);

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await occasionApi.getAll({ limit: 20 });
        setOccasionList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOccasions();
  }, []);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const res = await objectApi.getAll({});
        setObjectList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchObjects();
  }, []);

  useEffect(() => {
    const fetchFlowerTypes = async () => {
      try {
        const res = await flowertypeApi.getAll({});
        setFlowertypeList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFlowerTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      discount: "",
      image: "",
      description: "",
      display: "Bó hoa tươi",
      occasion: occasionList[0]
        ? { _id: occasionList[0]._id, name: occasionList[0].name }
        : {},
      object: objectList[0]
        ? { _id: objectList[0]._id, name: objectList[0].name }
        : {},
      flowertype: flowertypeList[0]
      ? { _id: flowertypeList[0]._id, name: flowertypeList[0].name }
      : {},
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Không được bỏ trống trường này!"),
      price: Yup.number()
        .typeError("Vui lòng nhập giá hợp lệ!")
        .required("Không được bỏ trống trường này!"),
      image: Yup.mixed().required("Không được bỏ trống trường này!")
      .test("FILE_SIZE", "Kích thước file quá lớn!", (value) => !value || (value && value.size < 1024 * 1024))
      .test("FILE_FORMAT", "File không đúng định dạng!", (value) => 
        !value || (value && ['image/png', 'image/gif', 'image/jpeg'].includes(value?.type) )
        )
    }),
    onSubmit: async () => {
      console.log("kiem tra", formik.values);
      const { name, occasion, object, flowertype, description, 
              display, price, discount, image } = formik.values;
      try {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "u4vztwpq");
        setLoading(true)
        const resCloudinary = await axios.post("https://api.cloudinary.com/v1_1/dbynglvwk/image/upload", formData)
        const { secure_url, public_id } = resCloudinary.data
        if (secure_url && public_id) {
          await flowerApi.createFlower({ 
            name, display, price, discount, description,
            occasion: occasion._id,
            object: object._id,
            flowertype: flowertype._id,
            imageUrl: secure_url,
            publicId: public_id
          })
          setLoading(false)
          alert("Thêm hoa thành công!")
          navigate({ pathname: "/admin/flower" });
        }
        
      } catch (error) {
        setLoading(false)
        alert("That bai! ", error)
        console.log(error);
      }
    },
  });

  const handleChangeOccasion = (e) => {
    const index = e.target.selectedIndex;
    formik.setFieldValue("occasion", {
      _id: e.target.value,
      name: e.target[index].text,
    });
  };

  const handleChangeObject = (e) => {
    const index = e.target.selectedIndex;
    formik.setFieldValue("object", {
      _id: e.target.value,
      name: e.target[index].text,
    });
  };

  const handleChangeFlowertype = (e) => {
    const index = e.target.selectedIndex;
    formik.setFieldValue("flowertype", {
      _id: e.target.value,
      name: e.target[index].text,
    });
  }

  return (
    <Row className={styles.addWrapper}>
      <Col xl={12}>
        <Card>
          <Card.Header className={styles.header}>Thêm hoa mới</Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit}>
              <Row>
                <Col xl={9}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Tên hoa</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${
                        formik.errors.name
                          ? "is-invalid"
                          : formik.values.name && "is-valid"
                      }`}
                      placeholder="Tên hoa"
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

              <Row>
                <Col xl={4}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Chủ đề</label>
                    <select
                      className="form-select"
                      name="occasion"
                      value={formik.values.occasion._id}
                      onBlur={formik.handleBlur}
                      onChange={handleChangeOccasion}
                    >
                      {occasionList.length > 0 &&
                        occasionList.map((occasion) => (
                          <option key={occasion._id} value={occasion._id}>
                            {occasion.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Đối tượng</label>
                    <select
                      className="form-select"
                      name="object"
                      value={formik.values.object._id}
                      onBlur={formik.handleBlur}
                      onChange={handleChangeObject}
                    >
                      {objectList.length > 0 &&
                        objectList.map((object) => (
                          <option key={object._id} value={object._id}>
                            {object.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Loại hoa</label>
                    <select
                      className="form-select"
                      name="flowertype"
                      value={formik.values.flowertype._id}
                      onBlur={formik.handleBlur}
                      onChange={handleChangeFlowertype}
                    >
                      {flowertypeList.length > 0 &&
                        flowertypeList.map((flowertype) => (
                          <option key={flowertype._id} value={flowertype._id}>
                            {flowertype.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Cách trình bày</label>
                    <select
                      className="form-select"
                      name="display"
                      value={formik.values.display}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    >
                      <option key="Bó hoa tươi" value="Bó hoa tươi">
                        Bó hoa tươi
                      </option>
                      <option key="Lẵng hoa chúc mừng" value="Lẵng hoa chúc mừng">
                        Lẵng hoa chúc mừng
                      </option>
                      <option key="Lẵng hoa chia buồn" value="Lẵng hoa chia buồn">
                        Lẵng hoa chia buồn
                      </option>
                      <option key="Giỏ hoa" value="Giỏ hoa">
                        Giỏ hoa
                      </option>
                    </select>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl={3}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Giá bán</label>
                    <input
                      type="number"
                      min="0"
                      name="price"
                      className={`form-control ${
                        formik.errors.price
                          ? "is-invalid"
                          : formik.values.price && "is-valid"
                      }`}
                      placeholder="Giá bán"
                      value={formik.values.price}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.price && (
                      <Form.Control.Feedback
                        type="invalid"
                        className={styles.feedback}
                      >
                        {formik.errors.price}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </Col>
                <Col xl={3}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Giảm giá</label>
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      className={`form-control ${
                        formik.errors.discount
                          ? "is-invalid"
                          : formik.values.discount && "is-valid"
                      }`}
                      placeholder="Giảm giá"
                      value={formik.values.discount}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.discount && (
                      <Form.Control.Feedback
                        type="invalid"
                        className={styles.feedback}
                      >
                        {formik.errors.discount}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
              <Col xl={12}>
                  <label className={styles.formLabel}>Mô tả</label>
                  <CKEditor
                      editor={ ClassicEditor }
                      data={formik.values.description}
                      onReady={ editor => {
                          // You can store the "editor" and use when it is needed.
                          console.log( 'Editor is ready to use!', editor );
                      } }
                      onChange={ ( event, editor ) => {
                          const data = editor.getData();
                          formik.setFieldValue("description", data);
                      } }
                      onBlur={ ( event, editor ) => {
                          console.log( 'Blur.', editor );
                      } }
                      onFocus={ ( event, editor ) => {
                          console.log( 'Focus.', editor );
                      } }
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={3}>
                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Hình ảnh</label>
                    <input
                      type="file"
                      name="image"
                      className={`form-control ${
                        formik.errors.image
                          ? "is-invalid"
                          : formik.values.image && "is-valid"
                      }`}
                      placeholder="Hình ảnh"
                      accept="image/png, image/gif, image/jpeg"
                      onBlur={(e) => formik.setFieldValue('image', e.target.files[0])}
                      onChange={(e) => formik.setFieldValue('image', e.target.files[0])}
                    />
                    {formik.errors.image && (
                      <Form.Control.Feedback
                        type="invalid"
                        className={styles.feedback}
                      >
                        {formik.errors.image}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </Col>
                <Col xl={3}>
                  {formik.values.image && <PreviewImage file={formik.values.image} />}
                </Col>
              </Row>

              <div className="d-flex-center">
                <button type="submit" className={`shophoa-btn ${styles.submitBtn}`}>
                  Thêm hoa
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

export default FormAddFlower;
