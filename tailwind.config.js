module.exports = {
  purge: [],
  theme: {
    screens: {
     'Desktop': {'max': '1279px'},
     // => @media (max-width: 1279px) { ... }

     'Laptop': {'max': '1023px'},
     // => @media (max-width: 1023px) { ... }

     'Tablet': {'max': '930px'},
     // => @media (max-width: 767px) { ... }

     'Mobile': {'max': '500px'},
     // => @media (max-width: 639px) { ... }
   },
    extend: {},
  },
  variants: {},
  plugins: [],
}
