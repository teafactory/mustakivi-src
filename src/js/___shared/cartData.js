import Axios from "axios"

export const store = {

  state: {
    cartData: []
  },

  getCart(){
    Axios.get('/cart.js')
    .then(response => {
      this.state.cartData.push(response.data)
    })
    .catch(error => {
      
    })

  }

}