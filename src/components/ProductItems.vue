<template>
  <li v-bind="$attrs" v-for="product in productsNorvolized" :key="product.id">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id:product.id}}">
      <img class="catalog__img" :src="product.image" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#" @click.prevent="openQuickVue(product.id)">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.pricePretty }} ₽
    </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="products  in product.colors" :key="products.color.id">
        <label class="colors__label">
          <input class="colors__radio sr-only" type="radio" :value="products.color.title" v-model="color">
          <span class="colors__value" :style="{ backgroundColor: products.color.code}">
          </span>
        </label>
      </li>
    </ul>
  </li>
  <BaseModel v-model:open="isQuickVueOpen">
    <ProductQuickVue :product-id="currentProductId"></ProductQuickVue>
  </BaseModel>
</template>
<script>
import BaseModel from './BaseModel.vue';
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import { defineAsyncComponent, h } from 'vue';

export default {
  inheritAttrs: false,
  components: {
    BaseModel,
    ProductQuickVue: defineAsyncComponent({
      loader: () => import('@/components/ProductQuickVue.vue'),
      delay: 0,
      loadingComponent: () => h('button', 'uyfiyuuy')
    })
  },
  data() {
    return {
      color: "#73B6EA",
      currentProductId: null
    }
  },
  computed: {
    isQuickVueOpen: {
      get() {
        return this.currentProductId;
      },
      set(isOpen) {
        if (!isOpen) {
          this.currentProductId = null;
        }
      }
    },

    productsNorvolized() {
      return this.products.map((product) => {
        return {
          ...product,
          pricePretty: numberFormat(product.price)
        }
        
      })

    }
  },
  methods: {
    gotoPage,
    openQuickVue(productId) {
      this.currentProductId = productId;
    },

  },
  props: ['products'],

}

</script>