import { apiRoot } from './apiClient';
import CardView from '../components/main/main-product/card/card-view';
import NotFoundView from '../components/main/main-not-found/not-found-view';
import { clickPage, handlerButtonNotFound } from './router';
import getSlider from './slider';

const getProduct = (keyCard: string) => {
    apiRoot
        .products()
        .withKey({ key: keyCard })
        .get()
        .execute()
        .then((result) => {
            if (result.body.masterData.staged.masterVariant.prices) {
                const resImages = [];
                const arrayImages = result.body.masterData.staged.masterVariant.images;
                for (let i = 0; !arrayImages || i < arrayImages.length; i += 1) {
                    if (arrayImages && !arrayImages[i].url.includes('small')) {
                        resImages.push(arrayImages[i].url);
                    }
                }
                const title = result.body.masterData.current.name['en-US'];
                const price = `$${result.body.masterData.staged.masterVariant.prices[0].value.centAmount / 100}`;
                const priceOld = '';
                let description = '';
                if (result.body.masterData.staged.description) {
                    description = result.body.masterData.staged.description['en-US'];
                }
                clickPage(new CardView(resImages, title, price, priceOld, description));
                getSlider();
            }
        })
        .catch((error: string) => {
            console.error(error);
            clickPage(new NotFoundView());
            handlerButtonNotFound();
        });
};
export default getProduct;
