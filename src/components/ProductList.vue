<template>
  <ul class="catalog__list">
    <ProductItemsVue class="catalog__item" :products="products"  ></ProductItemsVue>

  </ul>
</template>
 <script>
 import ProductItemsVue from './ProductItems.vue'
 
 
 export default {
   components: { ProductItemsVue },
   props: ['products']
 
 }
 
 </script>