// Ready-made "general" lead templates for prospects whose store we do not have.
// Each entry freezes a real scraped catalog (main product + upsell others +
// subscription) so the admin can one-click generate a personalized page without
// scraping. The frozen product is stored on the lead exactly like a live scrape,
// so the 3 demo emails render identically. Re-freeze by re-running scrapeStore.
//
// gymshark: scrapeStore("https://www.gymshark.com/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-yellow-aw26", 6)

export const GENERAL_TEMPLATES = [
  {
    id: "gymshark",
    label: "GymShark",
    product: {
          "storeName": "Gymshark",
          "main": {
                "title": "Everyday Seamless Shelf Tank",
                "price": "30",
                "currency": "USD",
                "description": "SOFT, SECOND-SKIN GYM SETSThe soft, ultra-lightweight, second-skin sets you’ll want to wear for gym, life and all the moments in between.\nThe comfiest affordable gym staple\nSoft, ultra-lightweight seamless fabric that feels like a second skin\n\nSuper stretchy so you can move freely\nDouble-lined cups for a little bit of extra support &amp; coverage\nFlattering low scoop necklineSIZE &amp; FIT\nBody fit\nMidi length\nModel is 5'10\" and wears size S\nMATERIALS &amp; CARE91% Nylon, 9% ElastaneSKU: B6C4K-Y",
                "images": [
                      "http://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1599.jpg",
                      "https://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1605.jpg",
                      "https://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1608.jpg",
                      "https://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1609.jpg",
                      "https://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1612.jpg",
                      "https://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1643.jpg"
                ],
                "sizes": [
                      "xxs",
                      "xs",
                      "s",
                      "m",
                      "l",
                      "xl",
                      "xxl"
                ],
                "image": "http://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1599.jpg",
                "url": "https://www.gymshark.com/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-yellow-aw26"
          },
          "others": [
                {
                      "title": "Everyday Seamless Shelf Tank",
                      "price": "30",
                      "currency": "USD",
                      "description": "PRENDAS DE GIMNASIO SUAVES QUE SE SIENTEN COMO UNA SEGUNDA PIELLos conjuntos suaves, ultraligeros y que se sienten como una segunda piel que querrás usar para el gimnasio, la vida y cualquier otro momento.El complemento básico más cómodo y accesible para el gimnasioTejido suave, ultraligero y sin costuras que se siente como una segunda pielSúper elástico para que puedas moverte librementeCon copas de doble línea para obtener un poco más de soporte y coberturaEscote redondo pronunciado que favore",
                      "image": "http://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSButterYellowB6C4K_YBZ5_1599.jpg",
                      "url": "https://www.gymshark.com/es-US/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-yellow-aw26"
                },
                {
                      "title": "Everyday Seamless Shelf Tank",
                      "price": "30",
                      "currency": "USD",
                      "description": "SOFT, SECOND-SKIN GYM SETSThe soft, ultra-lightweight, second-skin sets you’ll want to wear for gym, life and all the moments in between.\nThe comfiest affordable gym staple\nSoft, ultra-lightweight seamless fabric that feels like a second skin\n\nSuper stretchy so you can move freely\nDouble-lined cups for a little bit of extra support &amp; coverage\nFlattering low scoop necklineSIZE &amp; FIT\nBody fit\nMidi length\nModel is 5'10\" and wears size S\nMATERIALS &amp; CARE91% Nylon, 9% ElastaneSKU: B6C4K-K",
                      "image": "https://cdn.shopify.com/s/files/1/0156/6146/files/1EverydaySeamlessTrendTankTopGSPoisePinkB6C4K_KDM9_0569_a1ec5322-5119-4381-b342-08f85f676090.jpg?v=1784723882",
                      "url": "https://www.gymshark.com/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-pink-aw26"
                },
                {
                      "title": "Everyday Seamless Shelf Tank",
                      "price": "30",
                      "currency": "USD",
                      "description": "SOFT, SECOND-SKIN GYM SETSThe soft, ultra-lightweight, second-skin sets you’ll want to wear for gym, life and all the moments in between.\nThe comfiest affordable gym staple\nSoft, ultra-lightweight seamless fabric that feels like a second skin\n\nSuper stretchy so you can move freely\nDouble-lined cups for a little bit of extra support &amp; coverage\nFlattering low scoop necklineSIZE &amp; FIT\nBody fit\nMidi length\nModel is 5'9\" and wears size XS\nMATERIALS &amp; CARE91% Nylon, 9% ElastaneSKU: B6C4K-W",
                      "image": "https://cdn.shopify.com/s/files/1/0156/6146/files/1EverydaySeamlessTrendTankTopGSSoftWhiteB6C4K_WCMY_0778_V2_fa491933-b5d5-4f99-ae47-d468fe3d3052.jpg?v=1784724428",
                      "url": "https://www.gymshark.com/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-white-aw26"
                },
                {
                      "title": "Everyday Seamless Shelf Tank",
                      "price": "30",
                      "currency": "USD",
                      "description": "SOFT, SECOND-SKIN GYM SETSThe soft, ultra-lightweight, second-skin sets you’ll want to wear for gym, life and all the moments in between.\nThe comfiest affordable gym staple\nSoft, ultra-lightweight seamless fabric that feels like a second skin\n\nSuper stretchy so you can move freely\nDouble-lined cups for a little bit of extra support &amp; coverage\nFlattering low scoop necklineSIZE &amp; FIT\nBody fit\nMidi length\nModel is 5'9\" and wears size XS\nMATERIALS &amp; CARE91% Nylon, 9% ElastaneSKU: B6C4K-K",
                      "image": "https://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSStrengthPinkB6C4K_KDM6_0052_V2.jpg?v=1784724506",
                      "url": "https://www.gymshark.com/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-pink-aw26-b6c4k-kdm6"
                },
                {
                      "title": "Everyday Seamless Shelf Tank",
                      "price": "30",
                      "currency": "USD",
                      "description": "SOFT, SECOND-SKIN GYM SETSThe soft, ultra-lightweight, second-skin sets you’ll want to wear for gym, life and all the moments in between.\nThe comfiest affordable gym staple\nSoft, ultra-lightweight seamless fabric that feels like a second skin\n\nSuper stretchy so you can move freely\nDouble-lined cups for a little bit of extra support &amp; coverage\nFlattering low scoop necklineSIZE &amp; FIT\nBody fit\nMidi length\nModel is 5'9\" and wears size XS\nMATERIALS &amp; CARE91% Nylon, 9% ElastaneSKU: B6C4K-N",
                      "image": "https://cdn.shopify.com/s/files/1/0156/6146/files/1EverydaySeamlessTrendTankTopGSEspressoBrownB6C4K_NDJ1_1015_v2.jpg?v=1784712578",
                      "url": "https://www.gymshark.com/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-brown-aw26"
                },
                {
                      "title": "Everyday Seamless Shelf Tank",
                      "price": "30",
                      "currency": "USD",
                      "description": "SOFT, SECOND-SKIN GYM SETSThe soft, ultra-lightweight, second-skin sets you’ll want to wear for gym, life and all the moments in between.\nThe comfiest affordable gym staple\nSoft, ultra-lightweight seamless fabric that feels like a second skin\n\nSuper stretchy so you can move freely\nDouble-lined cups for a little bit of extra support &amp; coverage\nFlattering low scoop necklineSIZE &amp; FIT\nBody fit\nMidi length\nModel is 5'10\" and wears size S\nMATERIALS &amp; CARE91% Nylon, 9% ElastaneSKU: B6C4K-G",
                      "image": "https://cdn.shopify.com/s/files/1/0156/6146/files/EverydaySeamlessTrendTankTopGSOnyxGreyB6C4K_GB7N_1853_07df07fb-5fa1-433c-b33f-93deb4cd154c.jpg?v=1784723688",
                      "url": "https://www.gymshark.com/products/gymshark-everyday-seamless-shelf-tank-sleeveless-tops-grey-aw26"
                }
          ],
          "subscription": null
    },
  },
];
