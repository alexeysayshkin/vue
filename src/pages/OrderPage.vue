<template>
    <main class="content container">
        <div class="content__top">
            <ul class="breadcrumbs">
                <li class="breadcrumbs__item">
                    <a class="breadcrumbs__link" href="index.html">
                        Каталог
                    </a>
                </li>
                <li class="breadcrumbs__item">
                    <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
                        Корзина
                    </router-link>
                </li>

                <li class="breadcrumbs__item">
                    <a class="breadcrumbs__link">
                        Оформление заказа
                    </a>
                </li>
            </ul>

            <h1 class="content__title">
                Корзина
            </h1>
            <span class="content__info">
                {{ $store.state.cartProducts.length }} товара
            </span>
        </div>

        <section class="cart">
            <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
                <div class="cart__field">
                    <div class="cart__data">

                        <BaseFormText v-model="formData.name" :error="formError.name" title="ФИО"
                            placeholder="Введите ваше полное имя" />

                        <BaseFormText v-model="formData.address" :error="formError.address" title="Адрес доставки"
                            placeholder="Введите ваш адрес" />

                        <BaseFormText v-model="formData.phone" :error="formError.phone" type="tel" title="Телефон"
                            placeholder="Введите ваш телефон" />


                        <BaseFormText v-model="formData.email" :error="formError.email" type="email" title="Email"
                            placeholder="Введи ваш Email" />

                        <BaseFormTextarea title="Комментарий к заказу" v-model="formData.comment"
                            :error="formError.comment" placeholder="Ваши пожелания" />

                    </div>

                    <div class="cart__options">
                        <h3 class="cart__title"  >Доставка  </h3>
                        
                        <ul class="cart__options options cart__options-one"  >
                            <ErroComp :error="formError.deliveryTypeId" />
                            <li class="options__item" >
                                <label class="options__label"  >
                                    <input class="options__radio sr-only"   v-model.number="formData.deliveryTypeId"
                                        type="radio" name="delivery" value="1" >
                                   
                                    <span class="options__value">
                                        Самовывоз <b>бесплатно</b>
                                    </span>
                                 
                                </label>
                            </li>
                            <li class="options__item">
                                <label class="options__label">
                                    <input class="options__radio sr-only" type="radio"  name="delivery" value="2"
                                        v-model.number="formData.deliveryTypeId">
                                       
                                    <span class="options__value">
                                        Курьером <b>1200 ₽</b>
                                    </span>
                                    
                                </label>
                            </li>
                        </ul>

                        <h3 class="cart__title">Оплата</h3>
                        
                        <ul class="cart__options options cart__options-two" >
                            <ErroComp :error="formError.paymentTypeId" />
                            <li class="options__item" >
                                <label class="options__label">
                                    <input class="options__radio sr-only"  type="radio" name="pay"
                                        v-model.number="formData.paymentTypeId" value="1">
                                       
                                    <span class="options__value">
                                        Картой при получении
                                    </span>
                                    
                                </label>
                            </li>
                            <li class="options__item">
                                <label class="options__label">
                                    <input class="options__radio sr-only"  type="radio" name="pay"
                                        v-model.number="formData.paymentTypeId" value="2">
            
                                    <span class="options__value">
                                        Наличными при получении
                                    </span>
                                  
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="cart__block">
                    <ul class="cart__orders">
                        <li class="cart__order" v-for="item in products" :key="item.productId" :item="item">
                            <h3> {{ item.product.title }}</h3>
                            <b>{{ (item.amount * item.product.price) }} ₽</b>
                            <span>Артикул: {{ item.product.id }}</span>
                        </li>

                    </ul>

                    <div class="cart__total">
                        <div v-if="this.formData.deliveryTypeId == 2">
                            <p>Доставка: <b>500 ₽</b></p>
                            <p>Итого: <b> {{ $store.state.cartProducts.length }}</b> товара на сумму <b>{{ deliveryPretty
                            
                            }} ₽</b></p>
                        </div>
                        <div v-else>
                            <p>Самовывоз: <b> 0 ₽</b></p>
                            <p>Итого: <b> {{ $store.state.cartProducts.length }}</b> товара на сумму <b>{{ pickupPretty
                            }} ₽</b></p>
                        </div>


                    </div>

                    <button class="cart__button button button--primery" type="submit">
                        Оформить заказ
                    </button>
                </div>
                <div class="cart__error form__error-block" v-if="formErrorMessage">
                    <h4>Заявка не отправлена!</h4>
                    <p>
                        {{ formErrorMessage }}
                    </p>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import { API_BASE_URL } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { mapGetters } from 'vuex';
import ErroComp from '@/components/ErroComp.vue'

export default {
    components: { BaseFormText, BaseFormTextarea,ErroComp },
    data() {
        return {
            formData: {},
            formError: {},
            formErrorMessage: '',
            deliveryTypeId: null
        }
    },


    watch: {
        deliveryTypeId(value) {
            this.formData.deliveryTypeId = value;
        }
    },


    methods: {
        order() {
            this.formError = {};
            this.formErrorMessage = {};
            axios
                .post(API_BASE_URL + '/api/orders', {
                    ...this.formData
                }, {
                    params: {
                        userAccessKey: this.$store.state.userAccessKey
                    }
                })
                .then(response => {
                    this.$store.commit('resetCart');
                    this.$store.commit('updateOrderInfo', response.data);
                    this.$router.push({ name: 'orderInfo', params: { id: response.data.id } })

                })
                .catch(error => {
                    this.formError = error.response.data.error.request || {};
                    this.formErrorMessage = error.response.data.error.message;
                })

        }
    },
    filters: { numberFormat },
    computed: {
        ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice' }),



        pickupPretty() {
            return numberFormat(this.totalPrice)

        },
        deliveryPretty() {
            return numberFormat(this.totalPrice + 500)

        },

    },



}
</script>

<style>
.cart__options-one{
    position: relative;
}
.cart__options-two{
    position: relative;
}
.options__label{
    position: relative;
}</style>