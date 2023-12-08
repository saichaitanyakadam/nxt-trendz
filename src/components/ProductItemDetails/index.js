import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class ProductItemDetails extends Component {
  state = {
    count: 1,
    productDetails: {},
    similarProduct: [],
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onDecrement = () => {
    this.setState(prevState => ({
      count: prevState.count === 1 ? prevState.count : prevState.count - 1,
    }))
  }

  onIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  formatedData = data => ({
    imageUrl: data.image_url,
    brand: data.brand,
    description: data.description,
    availability: data.availability,
    id: data.id,
    rating: data.rating,
    price: data.price,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = this.formatedData(data)
      const similarProduct = data.similar_products.map(item =>
        this.formatedData(item),
      )

      this.setState({
        productDetails: updatedData,
        similarProduct: [...similarProduct],
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderLoaderView = () => (
    <div className="products-loader-container" data-testId="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onContinueShoppingClick = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onContinueShoppingClick}>
        Continue Shopping
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {productDetails, count, similarProduct} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails
    return (
      <div className="product-details-main-container">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-detail-image" />
          <div className="product-details-text-container">
            <h1>{title}</h1>
            <p>RS {price}/- </p>
            <div className="reviews-container">
              <div className="rating-container-product-details">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />
            <div className="btn-container">
              <button
                className="add-btn"
                type="button"
                onClick={this.onDecrement}
                data-testId="minus"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                type="button"
                className="add-btn"
                onClick={this.onIncrement}
                data-testId="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1>Similar Products</h1>
          <ul className="each-product-container">
            {similarProduct.map(item => (
              <SimilarProductItem key={item.id} product={item} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  getAllApiConditions = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.in_progress:
        return this.renderLoaderView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.getAllApiConditions()}
      </>
    )
  }
}

export default ProductItemDetails
