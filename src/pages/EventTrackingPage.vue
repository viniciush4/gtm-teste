<template>
  <q-page class="flex flex-center column q-pa-lg">
    <div class="container">
      <h1 class="text-center q-mb-lg">Sistema de Vendas de Ingressos - Rastreamento GTM</h1>
      
      <!-- Seção de Eventos -->
      <div class="events-section q-mb-lg">
        <h2>Eventos de E-commerce de Ingressos</h2>
        
        <!-- View Item -->
        <q-expansion-item
          header-class="bg-blue-1 text-blue-10"
          icon="visibility"
          label="1. View Item - Visualizar Ingresso"
          class="q-mb-md"
        >
          <q-card>
            <q-card-section>
              <div class="row gap-md items-center">
                <q-input
                  v-model="selectedTicket.item_id"
                  label="ID do Ingresso"
                  class="col"
                />
                <q-input
                  v-model="selectedTicket.item_name"
                  label="Nome do Evento"
                  class="col"
                />
                <q-input
                  v-model.number="selectedTicket.price"
                  label="Preço"
                  type="number"
                  class="col-sm-2"
                />
                <q-btn
                  color="primary"
                  label="Rastrear Visualização"
                  @click="handleViewItem"
                  icon="visibility"
                />
              </div>
              <div class="row gap-md items-center q-mt-md">
                <q-input
                  v-model="selectedTicket.event_date"
                  label="Data do Evento"
                  type="date"
                  class="col"
                />
                <q-input
                  v-model="selectedTicket.venue"
                  label="Local do Evento"
                  class="col"
                />
                <q-input
                  v-model="selectedTicket.item_variant"
                  label="Tipo (inteira/meia)"
                  class="col-sm-2"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Add to Cart -->
        <q-expansion-item
          header-class="bg-green-1 text-green-10"
          icon="shopping_cart"
          label="2. Add to Cart - Adicionar ao Carrinho"
          class="q-mb-md"
        >
          <q-card>
            <q-card-section>
              <div class="row gap-md items-center">
                <q-input
                  v-model.number="cartItem.quantity"
                  label="Quantidade"
                  type="number"
                  min="1"
                  class="col-sm-2"
                />
                <q-btn
                  color="positive"
                  label="Adicionar ao Carrinho"
                  @click="handleAddToCart"
                  icon="shopping_cart"
                />
                <q-chip
                  removable
                  @remove="clearCart"
                  v-if="cart.length > 0"
                  color="amber"
                  text-color="dark"
                >
                  {{ cart.length }} item(ns) - R$ {{ cartTotal.toFixed(2) }}
                </q-chip>
              </div>
              <div v-if="cart.length > 0" class="q-mt-md">
                <h4>Itens no Carrinho:</h4>
                <q-list bordered separator>
                  <q-item
                    v-for="(item, index) in cart"
                    :key="index"
                  >
                    <q-item-section>
                      <q-item-label>{{ item.item_name }}</q-item-label>
                      <q-item-label caption>{{ item.quantity }}x R$ {{ item.price.toFixed(2) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        round
                        dense
                        icon="close"
                        size="sm"
                        @click="removeFromCart(index)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Begin Checkout -->
        <q-expansion-item
          header-class="bg-orange-1 text-orange-10"
          icon="payment"
          label="3. Begin Checkout - Iniciar Checkout"
          class="q-mb-md"
        >
          <q-card>
            <q-card-section>
              <div class="row gap-md items-center q-mb-md">
                <q-input
                  v-model="userInfo.user_id"
                  label="ID do Usuário"
                  class="col"
                />
                <q-input
                  v-model="userInfo.email"
                  label="Email"
                  type="email"
                  class="col"
                />
              </div>
              <q-btn
                color="orange"
                label="Iniciar Checkout"
                @click="handleBeginCheckout"
                icon="payment"
                :disable="cart.length === 0"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Add Payment Info -->
        <q-expansion-item
          header-class="bg-purple-1 text-purple-10"
          icon="credit_card"
          label="4. Add Payment Info - Informações de Pagamento"
          class="q-mb-md"
        >
          <q-card>
            <q-card-section>
              <div class="row gap-md items-center q-mb-md">
                <q-input
                  v-model="paymentInfo.coupon"
                  label="Cupom (opcional)"
                  class="col"
                />
                <q-select
                  v-model="paymentInfo.payment_method"
                  :options="paymentMethods"
                  label="Método de Pagamento"
                  class="col"
                />
              </div>
              <div class="row gap-md items-center q-mb-md">
                <q-select
                  v-model.number="paymentInfo.installments"
                  :options="[1, 2, 3, 6, 12]"
                  label="Parcelamento"
                  class="col-sm-2"
                />
              </div>
              <q-btn
                color="purple"
                label="Confirmar Pagamento"
                @click="handleAddPaymentInfo"
                icon="credit_card"
                :disable="cart.length === 0"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Purchase -->
        <q-expansion-item
          header-class="bg-red-1 text-red-10"
          icon="done_all"
          label="5. Purchase - Finalizar Compra"
          class="q-mb-md"
        >
          <q-card>
            <q-card-section>
              <div class="row gap-md items-center">
                <q-input
                  v-model.number="purchaseData.tax"
                  label="Impostos (R$)"
                  type="number"
                  class="col-sm-2"
                />
                <q-input
                  v-model.number="purchaseData.shipping"
                  label="Frete (R$)"
                  type="number"
                  class="col-sm-2"
                />
                <q-btn
                  color="negative"
                  label="Finalizar Compra"
                  @click="handlePurchase"
                  icon="done_all"
                  :disable="cart.length === 0"
                  size="lg"
                />
              </div>
              <div v-if="lastPurchaseId" class="q-mt-md">
                <q-banner class="bg-green-1 text-green-10">
                  <strong>Compra concluída!</strong> ID de Transação: {{ lastPurchaseId }}
                </q-banner>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>

      <!-- Console do GTM -->
      <div class="console-section">
        <h3>Console de Eventos GTM</h3>
        <q-card class="console">
          <q-card-section>
            <div class="console-output">
              <div
                v-for="(log, index) in consoleLogs"
                :key="index"
                class="console-line"
                :class="log.type"
              >
                <span class="timestamp">{{ log.timestamp }}</span>
                <span class="message">{{ log.message }}</span>
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn
              flat
              label="Limpar Console"
              @click="clearConsole"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  setUserInfo,
  clearEcommerce
} from '@/services/gtmEvents'

// Estado do componente
const selectedTicket = ref({
  item_id: 'evt_001',
  item_name: 'Show Metallica - São Paulo',
  item_category: 'event_ticket',
  item_variant: 'inteira',
  price: 350.00,
  currency: 'BRL',
  event_date: '2026-06-15',
  venue: 'Morumbi Stadium',
  artist: 'Metallica'
})

const cartItem = ref({
  quantity: 2
})

const cart = ref([])

const userInfo = ref({
  user_id: 123,
  email: 'customer@example.com'
})

const paymentInfo = ref({
  coupon: null,
  payment_method: 'credit_card',
  payment_type: 'online',
  installments: 1
})

const paymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto']

const purchaseData = ref({
  tax: 0,
  shipping: 0
})

const consoleLogs = ref([])
const lastPurchaseId = ref(null)

// Computed
const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

// Métodos
const addLog = (message, type = 'info') => {
  const now = new Date()
  const timestamp = now.toLocaleTimeString('pt-BR')
  consoleLogs.value.push({ message, type, timestamp })
  
  // Manter apenas os últimos 20 logs
  if (consoleLogs.value.length > 20) {
    consoleLogs.value.shift()
  }
}

const handleViewItem = () => {
  try {
    trackViewItem(selectedTicket.value)
    addLog(`[VIEW_ITEM] ${selectedTicket.value.item_name}`, 'success')
  } catch (error) {
    addLog(`Erro: ${error.message}`, 'error')
  }
}

const handleAddToCart = () => {
  try {
    if (cart.value.length === 0) {
      // Primeira vez adicionando
      cart.value.push({
        ...selectedTicket.value,
        quantity: cartItem.value.quantity
      })
    } else {
      // Verifica se o item já está no carrinho
      const existing = cart.value.find(item => item.item_id === selectedTicket.value.item_id)
      if (existing) {
        existing.quantity += cartItem.value.quantity
      } else {
        cart.value.push({
          ...selectedTicket.value,
          quantity: cartItem.value.quantity
        })
      }
    }
    
    trackAddToCart(cart.value, cartTotal.value)
    addLog(`[ADD_TO_CART] ${cartItem.value.quantity}x ${selectedTicket.value.item_name}`, 'success')
  } catch (error) {
    addLog(`Erro: ${error.message}`, 'error')
  }
}

const handleBeginCheckout = () => {
  try {
    if (cart.value.length === 0) {
      addLog('Carrinho vazio!', 'warning')
      return
    }
    trackBeginCheckout(cart.value, cartTotal.value, userInfo.value)
    setUserInfo(userInfo.value)
    addLog('[BEGIN_CHECKOUT] Processo iniciado', 'success')
  } catch (error) {
    addLog(`Erro: ${error.message}`, 'error')
  }
}

const handleAddPaymentInfo = () => {
  try {
    if (cart.value.length === 0) {
      addLog('Carrinho vazio!', 'warning')
      return
    }
    trackAddPaymentInfo(cart.value, cartTotal.value, paymentInfo.value)
    addLog(`[ADD_PAYMENT_INFO] ${paymentInfo.value.payment_method}`, 'success')
  } catch (error) {
    addLog(`Erro: ${error.message}`, 'error')
  }
}

const handlePurchase = () => {
  try {
    if (cart.value.length === 0) {
      addLog('Carrinho vazio!', 'warning')
      return
    }
    
    const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`
    lastPurchaseId.value = transactionId
    
    trackPurchase({
      transaction_id: transactionId,
      affiliation: 'Ticket Marketplace',
      items: cart.value,
      value: cartTotal.value,
      tax: purchaseData.value.tax,
      shipping: purchaseData.value.shipping,
      currency: 'BRL',
      coupon: paymentInfo.value.coupon,
      user_id: userInfo.value.user_id,
      email: userInfo.value.email,
      customer_lifetime_value: cartTotal.value + purchaseData.value.tax,
      payment_method: paymentInfo.value.payment_method
    })
    
    addLog(`[PURCHASE] Transação ${transactionId} concluída`, 'success')
    
    // Limpar carrinho após compra
    setTimeout(() => {
      clearEcommerce()
      cart.value = []
      addLog('Carrinho limpo para nova compra', 'info')
    }, 1000)
  } catch (error) {
    addLog(`Erro: ${error.message}`, 'error')
  }
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
  addLog('Item removido do carrinho', 'info')
}

const clearCart = () => {
  cart.value = []
  clearEcommerce()
  addLog('Carrinho limpo', 'info')
}

const clearConsole = () => {
  consoleLogs.value = []
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 100%;
}

.events-section {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
}

.events-section h2 {
  margin-top: 0;
  color: #333;
}

.gap-md {
  gap: 1rem;
}

.console-section {
  margin-top: 2rem;
}

.console {
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.console-output {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.console-line {
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  border-left: 3px solid #666;
  padding-left: 0.5rem;
}

.console-line.info {
  color: #d4d4d4;
  border-left-color: #007fd4;
}

.console-line.success {
  color: #6a9955;
  border-left-color: #6a9955;
}

.console-line.warning {
  color: #d7ba7d;
  border-left-color: #d7ba7d;
}

.console-line.error {
  color: #f48771;
  border-left-color: #f48771;
}

.timestamp {
  color: #858585;
  margin-right: 0.5rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

h3 {
  color: #333;
  margin-bottom: 1rem;
}
</style>
