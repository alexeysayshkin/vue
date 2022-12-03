<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit.prevent="submit()">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" placeholder="0" v-model.number="currentPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" placeholder="0" v-model.number="currentPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" name="category" v-model.number="currentCatedoryId" @change="loadCategorisSlag()">
            <option value="0">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.title }}</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend" v-for="slugg in slugs" :key="slugg.id">{{ slugg.title }}</legend>
        <ul class="check-list" v-for="slugg in slugs" :key="slugg.id">
          <li class="check-list__item" v-for="slu in slugg.availableValues" :key="slu">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" v-model="currentColor"
                :value="slu.value">
              <span class="check-list__desc">
                {{ slu.value }}
                <span>
                  ({{ slu.productsCount }})
                </span>
              </span>
            </label>
          </li>

        </ul>
      </fieldset>
      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button class="filter__reset button button--second" type="button" @click.prevent="reset">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../config'


export default {
  data() {
    return {
      currentPriceFrom: null,
      currentPriceTo: null,
      currentCatedoryId: 0,
      currentColor: [],
      categoriesData: null,
      categorieSlagsData: null,


    }
  },

  props: ['priceFrom', 'priceTo', 'catedoryId', 'colorFilter',],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    slugs() {
      return this.categorieSlagsData ? this.categorieSlagsData.productProps : [];
    },

  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    catedoryId(value) {
      this.currentCatedoryId = value;
    },
    colorFilter(value) {
      this.currentColor = value;
    },


  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:colorFilter', this.currentColor);
      this.$emit('update:catedoryId', this.currentCatedoryId);


    },
    reset() {
      this.$emit('update:priceFrom', null);
      this.$emit('update:priceTo', null);
      this.$emit('update:colorFilter', null);
      this.$emit('update:catedoryId', 0);

    },
    loadCategoris() {
      axios.get(API_BASE_URL + "/api/productCategories")
        .then(response => this.categoriesData = response.data)
    },
    async loadCategorisSlag() {
      await axios.get(API_BASE_URL + "/api/productCategories/" + this.currentCatedoryId)
        .then(response => this.categorieSlagsData = response.data);
      this.$emit('category', this.categorieSlagsData.productProps[0]);
    },
 
  },

  created() {
    this.loadCategoris();
    
  }
}
</script>