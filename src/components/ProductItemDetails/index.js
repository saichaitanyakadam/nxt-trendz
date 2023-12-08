import React, {useState, useEffect, useContext} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'
import {AppContext} from '../../context/Appcontext'

const apiStatusConstant = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

const ProductItemDetails = ({match, history}) => {
  const [count, setCount] = useState(1)
  const [productDetails, setProductDetails] = useState({})
  const [similarProduct, setSimilarProduct] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstant.initial)
  const {setCartItems, cartItems} = useContext(AppContext)

  const onDecrement = () => {
    setCount(prevCount => (prevCount === 1 ? prevCount : prevCount - 1))
  }

  const onIncrement = () => {
    setCount(prevCount => prevCount + 1)
  }

  const formatedData = data => ({
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

  const getProductDetails = async () => {
    setApiStatus(apiStatusConstant.in_progress)
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(
        `https://apis.ccbp.in/products/${id}`,
        options,
      )

      if (response.ok) {
        const data = await response.json()
        const updatedData = formatedData(data)
        const formattedSimilarProduct = data.similar_products.map(item =>
          formatedData(item),
        )

        setProductDetails(updatedData)
        setSimilarProduct([...formattedSimilarProduct])
        setApiStatus(apiStatusConstant.success)
      } else {
        setApiStatus(apiStatusConstant.failure)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      setApiStatus(apiStatusConstant.failure)
    }
  }

  useEffect(() => {
    getProductDetails()
  }, [])

  const renderLoaderView = () => (
    <div className="products-loader-container" data-testId="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const onContinueShoppingClick = () => {
    history.replace('/products')
  }

  const handleCartItems = product => {
    const isItemPresent = cartItems.find(item => item?.id === product.id)
    if (!isItemPresent) setCartItems(prev => [...prev, {...product, count}])
    else {
      setCartItems(
        cartItems.map(item => {
          if (product.id === isItemPresent.id) {
            return {...product, count: isItemPresent.count + count}
          }
          return item
        }),
      )
    }
  }

  const renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={onContinueShoppingClick}>
        Continue Shopping
      </button>
    </div>
  )

  const renderSuccessView = () => {
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
      id,
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
                onClick={onDecrement}
                data-testId="minus"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                type="button"
                className="add-btn"
                onClick={onIncrement}
                data-testId="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={() => {
                handleCartItems(productDetails)
              }}
            >
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

  const getAllApiConditions = () => {
    switch (apiStatus) {
      case apiStatusConstant.success:
        return renderSuccessView()
      case apiStatusConstant.failure:
        return renderFailureView()
      case apiStatusConstant.in_progress:
        return renderLoaderView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      {getAllApiConditions()}
    </>
  )
}

export default ProductItemDetails
