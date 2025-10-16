import React from 'react'
import Header from '../../components/Header/Header'
import Products from '../../components/Products/Products'
import Steps from '../../components/Steps/Steps'
import Services from '../../components/Services/Services'
import Seller from '../../components/Seller/Seller'
import Store from '../../components/Store/Store'
import Testimonial from '../../components/Testimonial/Testimonial'
import About from '../../components/About/About'
import Footer from '../../components/Footer/Footer'
import Delivery from '../../components/Delivery/Delivery'

function Home() {
  return (
    <div>
      <Header/>
      <Products/>
      <Steps/>
      <Services/>
      <Seller/>
      <Store/>
      <Delivery/>
      <About/>
      {/* <Testimonial/> */}
      <Footer/>
    </div>
  )
}

export default Home
