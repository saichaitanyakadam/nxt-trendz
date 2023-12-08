import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  const {imageUrl, title, brand, price, rating} = product
  return (
    <li className="product-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="product-image"
      />
      <h3>{title}</h3>
      <p>by {brand}</p>
      <div className="price-container">
        <p>Rs {price}/- </p>
        <div className="rating-container-product-details">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
