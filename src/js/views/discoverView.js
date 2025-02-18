// import formatPrice from '../utils/formatPrice';
import View from "./view";

class discoverView extends View {
  isLoading = false;

  catalogEl = null;
  

  constructor() {
    this.catalogEl = document.querySelector('.moviesHeader');
  }

}





export default discoverView