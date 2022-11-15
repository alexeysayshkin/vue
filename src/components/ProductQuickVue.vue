<template>

    <div v-if="productLoading">
        <LoadingPreloader />
    </div>
    <div v-else-if="!productData">
        <div class="error">
            <h1 class="error__header">Произошла ошибка при загрузке товара</h1>
            <button class="error__btn" @click.prevent="loadProducts">Попробуйте еще раз</button>
        </div>
    </div>
    <div v-else>

        <section class="item">
            <div class="item__pics pics">
                <div class="pics__wrapper">
                    <img class="pics__img" width="570" height="570" :src="product.preview.file.url"
                        :alt="product.title">
                </div>

            </div>

            <div class="item__info">
                <span class="item__code">Артикул: {{ product.id }}</span>
                <h2 class="item__title" v-if="memoryCapacity != null">
                    <label for="sizes-item">{{ filter.title }} </label>
                </h2>
                <h2 class="item__title" v-else>
                    {{ product.title }}
                </h2>
                <div class="item__form">
                    <form class="form" action="#" method="POST" @submit.prevent="addToCatr">
                        <b class="item__price" v-if="memoryCapacity != null">
                            {{ filterPretty }} P
                        </b>
                        <b class="item__price" v-else>
                            {{ pricePretty }} P
                        </b>

                        <fieldset class="form__block">
                            <legend class="form__legend">Цвет:</legend>
                            <ul class="colors">
                                <li class="colors__item" v-for="color in product.colors" :key="color.id">
                                    <label class="colors__label">
                                        <input class="colors__radio sr-only" type="radio" name="color"
                                            :value="color.color.id" v-model="itemColorId">
                                        <span class="colors__value" :style="{ backgroundColor: color.color.code }">
                                        </span>
                                    </label>
                                </li>
                            </ul>
                            <div class="error-params" v-if="itemColorError">Выберите цвет</div>
                        </fieldset>

                          <fieldset class="form__block">
                            <legend class="form__legend">{{ product.mainProp.title }}</legend>

                            <ul class="sizes sizes--primery">
                                <li class="sizes__item" v-for="volume in product.offers" :key="volume.id">
                                    <label class="sizes__label" :value="volume.title">
                                        <input class="sizes__radio sr-only" v-model="memoryCapacity" type="radio"
                                            name="sizes-item" :value="volume.id" :data-value="volume.title">
                                        <span class="sizes__value" v-for="volumes in volume.propValues"
                                            :key="volumes.id">
                                            {{ volumes.value }}
                                        </span>
                                    </label>
                                </li>

                            </ul>
                            <div class="error-params" v-if="productIdEroor">Выберите параметр</div>
                        </fieldset>

                        <div class="item__row">

                            <ProductCounter  v-model="productAmount" />
                            <button class="button button--primery" type="submit" :disabled="productAddSend">
                                В корзину
                            </button>
                            <BaseModel v-model:open="isShowAddedMessage">Товар добавлен в корзину</BaseModel>
                        </div>
                        <div v-if=" productAdded">Товар добавлен в корзину</div>
                        <div v-if=" productAddSend">Идет отправка товара</div>
                    </form>
                </div>
            </div>

        </section>
    </div>

</template>

<script>
import BaseModel from '@/components/BaseModel.vue';
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import ProductCounter from '@/components/ProductCounter.vue';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import LoadingPreloader from '@/components/LoadingPreloader.vue';
import { mapActions } from 'vuex';






export default {
    props: {
        productId: { type: [Number, String], required: true }
    },
    components: { ProductCounter, LoadingPreloader, BaseModel },
    data() {
        return {
            productAmount: 1,
            productData: null,
            productLoading: false,
            productLoadingFalled: false,
            productAdded: false,
            productAddSend: false,
            isShowAddedMessage: false,
            memoryCapacity: null,
            itemColorId: null,
            productIdEroor: false,
            itemColorError: false,
            memory: []
        };
    },

    computed: {
        pricePretty() {
            return numberFormat(this.product.price)

        },

        filterPretty() {
            return numberFormat(this.filter.price)

        },
        filter() {


            if (this.memoryCapacity === null) return this.product.offers

            const user = this.product.offers.find(item => item.id == this.memoryCapacity)
            return user

        },

        productAmounts: {
            get() {
                return this.item.amount;
            },
            set(value) {
                this.$store.commit('updateCartProductAmount', { productId: this.item.productId, amount: value });
            }
        },
        product() {
            return this.productData;


        },
        category() {
            return this.productData.category;

        },
        isInFirstPage() {
            return this.productAmount === 1;
        },


    },

    watch: {
        memoryId(value) {
            this.memoryCapacity = value;
        },
        idColorId(value) {
            this.itemColorId = value;
        },


    },

    methods: {
        ...mapActions(['addProductToCart']),
        gotoPage,
        addToCat() {
            this.productAdded = false;
            this.productAddSend = true;
            this.addProductToCart({ productId: this.memoryCapacity, amount: this.productAmount, itemColor: this.itemColorId })
                .then(() => {
                    this.isShowAddedMessage = true;
                    this.productAdded = true;
                    this.productAddSend = false;
                    this.productLoadingFalled = false;
                })
                .catch(() => {
                    this.productLoadingFalled = true;
                    this.productAddSend = false
                })



        },


        addToCatr() {

            if (this.itemColorId === null) {
                this.itemColorError = true
            } else if (this.memoryCapacity === null) {
                    this.productIdEroor = true
                    this.itemColorError = false
                } else {
                    this.itemColorError = false
                    this.productIdEroor = false
                    this.productAdded = false;
                    this.productAddSend = true;
                    this.addProductToCart({ productId: this.memoryCapacity, amount: this.productAmount, itemColor: this.itemColorId })
                        .then(() => {
                            this.isShowAddedMessage = true;
                            this.productAdded = true;
                            this.productAddSend = false;
                            this.productLoadingFalled = false;

                        })
                        .catch(() => {
                            this.productLoadingFalled = true;
                            this.productAddSend = false
                        })
                }
        },
        increment() {
            this.productAmount = this.productAmount - 1;

        },
        increments() {
            this.productAmount = this.productAmount + 1;

        },
        goToCat() {
            this.$router.push({ name: 'category', params: { id: this.category.id, category: this.category.title } })
        },


        loadProduct() {
            this.productLoading = true;
            this.productLoadingFalled = false;
            clearTimeout(this.loadProductsTimer);
            this.loadProductsTimer = setTimeout(() => {
                axios.get(API_BASE_URL + '/api/products/' + this.productId)
                    .then(response => this.productData = response.data)
                    .then(() => this.memory.push(
                        this.productData.offers
                    ))
                    .catch(() => this.productLoadingFalled = true)
                    .then(() => this.productLoading = false)

            }, 500)


        },
    },
    created() {
        this.loadProduct();
    },
    beforeRouteUpdate() {
        this.loadProduct();
    }


}
</script>

<style scoped>
.pics__img {
    object-fit: contain;
    height: 570px;
}

.item {
    grid-template-columns: 1fr;
}
</style>