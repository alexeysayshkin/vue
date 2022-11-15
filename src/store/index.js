import { createStore } from "vuex"
import axios from 'axios';
import { API_BASE_URL } from "@/config";


export default createStore({
    data() {
        return {
            productLoading: false,
            orderInfoLoaading: false,

        };
    },

    state: {
        cartProducts: [],
        userAccessKey: null,

        cartProductsData: [],

        orderInfo: null
    },
    mutations: {
        updateOrderInfo(state, orderInfo) {
            state.orderInfo = orderInfo;
        },
        resetCart(state) {
            state.cartProducts = [];
            state.cartProductsData = [];
        },

        updateCartProductAmount(state, { basketItemId, amount }) {
            const item = state.cartProducts.find(item => item.basketItemId === basketItemId);
            if (item) {
                item.amount = amount;
            }

        },
        deleteCartProduct(state, { basketItemId }) {
            state.cartProducts = state.cartProducts.filter(item => item.basketItemId != basketItemId)

        },
        updateUserAccessKey(state, accessKey) {
            state.userAccessKey = accessKey;
        },
        updateCartProductsData(state, items) {
            state.cartProductsData = items;
        },
        syncCartproducts(state) {
            state.cartProducts = state.cartProductsData.map(item => {
                return {
                    basketItemId: item.id,
                    productId: item.productOffer.id,
                    amount: item.quantity,
                }
            });
        }

    },
    getters: {
        cartDetailProducts(state) {
            return state.cartProducts.map(item => {
                const product = state.cartProductsData.find(p => p.productOffer.id === item.productId).productOffer;
                return {
                    ...item,
                    product: {
                        ...product

                    }
                }
            });
        },
        cartTotalPrice(state, getters) {
            return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
        }
    },
    actions: {
        loadOrderInfo(context, orderId) {
            return axios
                .get(API_BASE_URL + '/api/orders/' + orderId, {
                    params: {
                        userAccessKey: context.state.userAccessKey
                    }
                })
                .then(response => {
                    context.commit('updateOrderInfo', response.data)
                }).then(() => this.productLoading = false);

        },
        loadCart(context) {

            return (new Promise(resolve => setTimeout(resolve, 2000)))
                .then(() => {
                    return axios
                        .get(API_BASE_URL + '/api/baskets', {
                            params: {
                                userAccessKey: context.state.userAccessKey
                            }
                        })
                        .then(response => {
                            if (!context.state.userAccessKey) {
                                localStorage.setItem('userAccessKey', response.data.user.accessKey);
                                context.commit('updateUserAccessKey', response.data.user.accessKey);
                            }
                            context.commit('updateCartProductsData', response.data.items);
                            context.commit('syncCartproducts');
                        })
                })




        },
        addProductToCart(context, { productId, amount, itemColor }) {
            return (new Promise(resolve => setTimeout(resolve, 2000)))
                .then(() => {
                    return axios.post(API_BASE_URL + '/api/baskets/products', {
                            productOfferId: productId,
                            colorId: itemColor,
                            quantity: amount
                        }, {
                            params: {
                                userAccessKey: context.state.userAccessKey
                            }
                        })
                        .then(response => {
                            context.commit('updateCartProductsData', response.data.items);
                            context.commit('syncCartproducts');
                        })
                })
        },
        updateCartProductAmount(context, { basketItemId, amount }) {
            context.commit('updateCartProductAmount', { basketItemId, amount });
            if (amount < 1) {
                return;
            }
            return axios.put(API_BASE_URL + '/api/baskets/products', {
                    basketItemId: basketItemId,
                    quantity: amount
                }, {
                    params: {
                        userAccessKey: context.state.userAccessKey
                    }
                })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items);
                })
                .catch(() => {
                    context.commit('syncCartproducts');
                })
        },

        deleteCartProduct(context, { basketItemId }) {

            context.commit('deleteCartProduct', { basketItemId });
            return axios.delete(API_BASE_URL + '/api/baskets/products', {
                    data: {
                        basketItemId: basketItemId,
                    },
                    params: {
                        userAccessKey: context.state.userAccessKey,
                    },
                })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items);
                })
                .catch(() => {
                    context.commit('syncCartproducts');
                })

        }

    }
});