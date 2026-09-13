import foodBanhCuon from '../../../assets/food/food-banh-cuon.png'
import foodBanhMi from '../../../assets/food/food-banh-mi.png'
import foodBanhXeo from '../../../assets/food/food-banh-xeo.png'
import foodBunBoHue from '../../../assets/food/food-bun-bo-hue.png'
import foodBunCha from '../../../assets/food/food-bun-cha.png'
import foodBunRieu from '../../../assets/food/food-bun-rieu.png'
import foodBunThitNuong from '../../../assets/food/food-bun-thit-nuong.png'
import foodComGa from '../../../assets/food/food-com-ga.png'
import foodComTam from '../../../assets/food/food-com-tam.png'
import foodGoiCuon from '../../../assets/food/food-goi-cuon.png'
import foodHuTieu from '../../../assets/food/food-hu-tieu.png'
import foodLau from '../../../assets/food/food-lau.png'
import foodMiQuang from '../../../assets/food/food-mi-quang.png'
import foodPhoBo from '../../../assets/food/food-pho-bo.png'

const DEFAULT_PRESENTATION = { scale: 1, x: 0, y: 0 }

export const dishAssets = {
  'pho-bo': { image: foodPhoBo, presentation: { scale: 1.02, x: 0, y: 4 } },
  'bun-cha': { image: foodBunCha, presentation: { scale: 0.98, x: 0, y: 4 } },
  'com-tam': { image: foodComTam, presentation: { scale: 0.96, x: 0, y: 2 } },
  'banh-mi': { image: foodBanhMi, presentation: { scale: 0.84, x: 0, y: 8 } },
  'bun-bo-hue': { image: foodBunBoHue, presentation: { scale: 1.0, x: 0, y: 2 } },
  'banh-xeo': { image: foodBanhXeo, presentation: { scale: 0.88, x: 0, y: 6 } },
  'hu-tieu': { image: foodHuTieu, presentation: { scale: 1.0, x: 0, y: 2 } },
  'banh-cuon': { image: foodBanhCuon, presentation: { scale: 0.9, x: 0, y: 4 } },
  'goi-cuon': { image: foodGoiCuon, presentation: { scale: 5.4, x: 0, y: 18 } },
  'bun-thit-nuong': { image: foodBunThitNuong, presentation: { scale: 0.92, x: 0, y: 4 } },
  'mi-quang': { image: foodMiQuang, presentation: { scale: 1.02, x: 0, y: 3 } },
  'com-ga': { image: foodComGa, presentation: { scale: 0.96, x: 0, y: 2 } },
  lau: { image: foodLau, presentation: { scale: 0.86, x: 0, y: 2 } },
  'bun-rieu': { image: foodBunRieu, presentation: { scale: 1.0, x: 0, y: 2 } },
}

export function attachDishAssets(dishes) {
  return dishes.map((dish) => {
    const asset = dishAssets[dish.id]
    return {
      ...dish,
      image: asset?.image ?? dish.image,
      presentation: asset?.presentation ?? DEFAULT_PRESENTATION,
    }
  })
}
