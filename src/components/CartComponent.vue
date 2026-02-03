<template>
  <q-card class="cart-container" v-if="items.length > 0">
    <q-card-section>
      <div class="text-h6">Carrinho de Compras</div>
      <div class="text-subtitle2">{{ items.length }} ingresso(s)</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="cart-items">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="cart-item"
      >
        <div class="item-info">
          <div class="item-name">{{ item.item_name }}</div>
          <div class="item-details">
            <span class="badge">{{ formatVariant(item.item_variant) }}</span>
            <span class="date">{{ formatDate(item.event_date) }}</span>
          </div>
        </div>
        <div class="item-price">
          <div class="qty">
            <q-btn
              flat
              round
              dense
              icon="remove"
              size="sm"
              @click="decreaseQuantity(index)"
            />
            <span class="qty-value">{{ item.quantity }}</span>
            <q-btn
              flat
              round
              dense
              icon="add"
              size="sm"
              @click="increaseQuantity(index)"
            />
          </div>
          <div class="total">R$ {{ (item.price * item.quantity).toFixed(2) }}</div>
          <q-btn
            flat
            round
            dense
            icon="close"
            size="sm"
            @click="removeItem(index)"
          />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="cart-summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>R$ {{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="summary-row" v-if="tax > 0">
        <span>Impostos:</span>
        <span>R$ {{ tax.toFixed(2) }}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>R$ {{ (subtotal + tax).toFixed(2) }}</span>
      </div>
      <div v-if="coupon" class="summary-row discount">
        <span>Cupom: {{ coupon }}</span>
        <span>-R$ {{ discountAmount.toFixed(2) }}</span>
      </div>
    </q-card-section>

    <q-card-actions>
      <q-input
        v-model="couponInput"
        label="Cupom de desconto"
        dense
        class="coupon-input"
      />
      <q-btn
        flat
        color="primary"
        label="Aplicar"
        @click="applyCoupon"
      />
    </q-card-actions>

    <q-card-actions align="right">
      <q-btn
        flat
        color="negative"
        label="Limpar Carrinho"
        @click="clearCart"
      />
      <q-btn
        color="positive"
        label="Checkout"
        @click="handleCheckout"
        icon="payment"
      />
    </q-card-actions>
  </q-card>

  <div v-else class="empty-cart">
    <q-icon name="shopping_cart" size="lg" color="grey-7" />
    <p>Seu carrinho está vazio</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import {
  trackAddToCart,
  trackBeginCheckout,
  clearEcommerce
} from '@/services/gtmEvents'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  tax: {
    type: Number,
    default: 0
  },
  userInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update-cart', 'checkout', 'apply-coupon', 'clear-cart'])

const couponInput = ref('')
const coupon = ref(null)
const discountAmount = ref(0)

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const formatVariant = (variant) => {
  const variantMap = {
    inteira: 'Inteira',
    meia: 'Meia Entrada',
    cortesia: 'Cortesia',
    vip: 'VIP',
    camarote: 'Camarote',
    pista: 'Pista',
    arquibancada: 'Arquibancada'
  }
  return variantMap[variant] || variant
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const increaseQuantity = (index) => {
  const newItems = [...props.items]
  newItems[index].quantity++
  // Disparar evento GTM
  trackAddToCart(newItems, subtotal.value)
  emit('update-cart', newItems)
}

const decreaseQuantity = (index) => {
  const newItems = [...props.items]
  if (newItems[index].quantity > 1) {
    newItems[index].quantity--
  } else {
    newItems.splice(index, 1)
  }
  emit('update-cart', newItems)
}

const removeItem = (index) => {
  const newItems = props.items.filter((_, i) => i !== index)
  emit('update-cart', newItems)
}

const clearCart = () => {
  clearEcommerce()
  couponInput.value = ''
  coupon.value = null
  discountAmount.value = 0
  emit('clear-cart')
}

const applyCoupon = () => {
  // Validar cupom (exemplo simplificado)
  if (couponInput.value.length > 0) {
    const discountPercent = getCouponDiscount(couponInput.value)
    if (discountPercent > 0) {
      coupon.value = couponInput.value
      discountAmount.value = subtotal.value * (discountPercent / 100)
      emit('apply-coupon', {
        code: couponInput.value,
        discount: discountPercent,
        amount: discountAmount.value
      })
      // Mostrar feedback
      console.log(`✅ Cupom "${couponInput.value}" aplicado! Desconto: ${discountPercent}%`)
    } else {
      console.warn(`❌ Cupom "${couponInput.value}" inválido`)
    }
  }
}

const getCouponDiscount = (code) => {
  // Mapa de cupons válidos (exemplo)
  const coupons = {
    'SAVE10': 10,
    'SAVE15': 15,
    'SAVE20': 20,
    'PRIMEIRACOMPRA': 20,
    'FRIEND': 5,
    'VIP': 25
  }
  return coupons[code.toUpperCase()] || 0
}

const handleCheckout = () => {
  if (props.items.length > 0) {
    // Disparar evento de checkout
    trackBeginCheckout(
      props.items,
      subtotal.value,
      props.userInfo
    )
    
    emit('checkout', {
      items: props.items,
      subtotal: subtotal.value,
      tax: props.tax,
      total: subtotal.value + props.tax,
      coupon: coupon.value,
      discountAmount: discountAmount.value
    })
  }
}
</script>

<style scoped>
.cart-container {
  margin-top: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.cart-items {
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  gap: 1rem;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-details {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.date {
  color: #999;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
}

.qty {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px;
}

.qty-value {
  padding: 0 8px;
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.total {
  font-weight: bold;
  color: #1976d2;
  min-width: 100px;
  text-align: right;
}

.cart-summary {
  padding: 12px 16px;
  background-color: #f9f9f9;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-row.total {
  font-weight: bold;
  font-size: 16px;
  color: #1976d2;
  padding-top: 8px;
  border-top: 2px solid #ddd;
  margin-bottom: 0;
}

.summary-row.discount {
  color: #2e7d32;
}

.coupon-input {
  flex: 1;
  max-width: 200px;
}

q-card-actions {
  padding: 12px 16px;
}
</style>
