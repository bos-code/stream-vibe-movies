import Controller from './controller/controller';
import model from '../js/model/model'
import view from '../js/views/view'
import 'core-js/stable';
// const app = new discoverController()
// app.init()

const apiKey = '465c8a03a49665a1678b47c4e4a653af';
const modelel = new model(apiKey);
const viewel = new view('.moviesHeader');
const controllerel = new Controller(modelel, viewel);

// Fetch trending movies
controllerel.loadContent('/3/discover/movie', { language: 'en-US' });

// Fetch discovered movies (Uncomment to test)
// controller.loadContent('/discover/movie', { language: 'en-US', sort_by: 'popularity.desc' });
