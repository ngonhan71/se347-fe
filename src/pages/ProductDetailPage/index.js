import React, {useEffect, useState} from 'react'
import { Container } from 'react-bootstrap'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useParams } from 'react-router-dom';
import flowerApi from "../../api/flowerApi";
import { addToCart } from "../../redux/actions/cart"
import { useDispatch } from "react-redux"
import format from "../../helper/format";
import styles from './ProductDetailPage.module.css'

export default function DetailProduct() {

  const dispatch = useDispatch()
  const params = useParams()
  const { slug } = params
  const [flowerData, setFlowerData] = useState({})

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await flowerApi.getBySlug(slug);
        console.log(res.data)
        setFlowerData(res.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchBook();
  }, [slug]);

  const [quantity, setQuantity] = useState(1);
  const [fav, setFav]= useState(false);

  const decQuantity = () => {
    if(quantity > 0) {
      setQuantity(quantity - 1)
    }
  }

  const incQuantity = () => {
    setQuantity(parseInt(quantity + 1))
  }

  const handleChange = (e) => {
    console.log(e.target.value);
    // /^[0-9]+$/.test(newQuantity)
    //sai khi them chu
    const newQuantity = parseInt(e.target.value)
    if(newQuantity){
      setQuantity(newQuantity)
      console.log('ok')
    }
    else {
      setQuantity('')
      e.target.value = null;
    }
  }

  const handleFav = () => {
    setFav(!fav)
  }

  const handleAddToCart = () => {
    const { _id, name, imageUrl, slug, price, discount } = flowerData
    let newPrice = price
    if (discount > 0) {
      newPrice = price - price * discount / 100
    }
    const action = addToCart({quantity, _id, name, imageUrl, slug, 
      price: newPrice, 
      totalPriceItem: newPrice * quantity})
    dispatch(action)
    alert("Thêm sản phẩm vào giỏ hàng thành công!")
  }

  return (
    <div className={styles.main}>
      <Container>
        <div className={styles.productBriefing}>
            <div className={styles.imgBriefing}>
              <img src={flowerData && flowerData.imageUrl} alt="" />
            </div>

            <div className={styles.infoBriefing}>
              <div>
                <h2>{flowerData && flowerData.name}</h2>
                <div className={styles.price}>
                  {flowerData && flowerData.discount > 0 ? 
                  (<p>
                    <span>{format.formatPrice(flowerData.price - flowerData.price * flowerData.discount / 100)}</span>
                    <span className={styles.oldPrice}>{format.formatPrice(flowerData.price)}</span>
                  </p>)
                  : format.formatPrice(flowerData.price)}
                </div>

                <div className={`d-flex ${styles.itemBriefing}`}>
                  <div>Dịp: &nbsp;</div>
                  <div className={styles.occasion}>{flowerData && flowerData.occasion?.name}</div>
                </div>

                <div className={`d-flex ${styles.itemBriefing}`}>
                  <div>Cách trình bày: &nbsp;</div>
                  <div className={styles.occasion}>{flowerData && flowerData.display}</div>
                </div>

                <div className={`d-flex ${styles.itemBriefing} ${styles.description}`}>
                  <div dangerouslySetInnerHTML={{__html:flowerData?.description}} />
                </div>

                <div className={`d-flex ${styles.itemBriefing}`}>
                  <div className={styles.textBold}>Số lượng: </div>
                  <div className='d-flex'>
                    <button className={styles.descreaseBtn} onClick={decQuantity}>
                      <AiOutlineMinus />
                    </button>
                    <input type="text" className={styles.quantityInput} value={quantity} onChange={handleChange} />
                    <button className={styles.increaseBtn} onClick={incQuantity}>
                      <AiOutlinePlus />
                    </button>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button className={styles.fav_btn} onClick={handleFav}>
                    {fav ? <AiFillHeart className={styles.fav_icon} /> : <AiOutlineHeart className={styles.fav_icon}/> }
                    Yêu thích
                  </button>

                  <div className={styles.actions_bottom}>
                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                      <AiOutlineShoppingCart className={styles.addToCartIcon} />
                      Thêm vào giỏ hàng
                    </button>
                    <button className={styles.buyBtn}>Mua ngay</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </Container>
    </div>
  )
}
