# 🔧 Guia de Integração - Como Usar o GTM Events em Seu Projeto

## 📖 Índice

1. [Setup Inicial](#setup-inicial)
2. [Integração em Componentes](#integração-em-componentes)
3. [Cenários Comuns](#cenários-comuns)
4. [Troubleshooting](#troubleshooting)

---

## Setup Inicial

### 1. Verificar Instalação

```bash
# Verificar se GTM está carregado
# O arquivo index.html já possui GTM configurado
cat index.html | grep "GTM-"
```

### 2. Importar o Serviço

Em qualquer componente Vue:

```javascript
import { trackViewItem, trackAddToCart, trackPurchase } from '@/services/gtmEvents'
```

---

## Integração em Componentes

### Exemplo 1: Página de Detalhes do Evento

**EventDetailPage.vue**

```vue
<template>
  <div>
    <h1>{{ event.item_name }}</h1>
    <p>{{ event.artist }}</p>
    <p>R$ {{ event.price }}</p>
    <q-btn @click="handleViewDetails" label="Ver Detalhes" />
    <q-btn @click="handleAddToCart" label="Adicionar ao Carrinho" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { trackViewItem, trackAddToCart } from '@/services/gtmEvents'

const event = ref({
  item_id: 'evt_001',
  item_name: 'Show Metallica',
  item_category: 'event_ticket',
  item_variant: 'inteira',
  price: 350.00,
  currency: 'BRL',
  event_date: '2026-06-15',
  venue: 'Morumbi Stadium',
  artist: 'Metallica'
})

// Rastrear visualização quando componente carrega
onMounted(() => {
  trackViewItem(event.value)
})

const handleViewDetails = () => {
  trackViewItem(event.value)
}

const handleAddToCart = () => {
  trackAddToCart(
    [{ ...event.value, quantity: 1 }],
    event.value.price
  )
  // Mostrar confirmação
  console.log('✅ Ingresso adicionado ao carrinho')
}
</script>
```

---

### Exemplo 2: Página de Checkout

**CheckoutPage.vue**

```vue
<template>
  <div>
    <h2>Checkout</h2>
    
    <!-- Resumo do Carrinho -->
    <div class="cart-summary">
      <div v-for="item in cartItems" :key="item.item_id">
        {{ item.item_name }} - {{ item.quantity }}x
      </div>
      <strong>Total: R$ {{ total }}</strong>
    </div>

    <!-- Formulário de Usuário -->
    <q-form @submit="handleBeginCheckout">
      <q-input v-model="userEmail" label="Email" type="email" />
      <q-btn type="submit" label="Continuar para Pagamento" />
    </q-form>

    <!-- Seleção de Pagamento -->
    <q-form @submit="handlePayment">
      <q-select
        v-model="paymentMethod"
        :options="['credit_card', 'debit_card', 'pix', 'boleto']"
        label="Método de Pagamento"
      />
      <q-input v-model="coupon" label="Cupom (opcional)" />
      <q-btn type="submit" label="Confirmar Pagamento" />
    </q-form>

    <!-- Finalizar Compra -->
    <q-btn
      color="positive"
      label="Finalizar Compra"
      @click="handlePurchase"
      size="lg"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  setUserInfo
} from '@/services/gtmEvents'

const cartItems = ref([
  {
    item_id: 'evt_001',
    item_name: 'Show Metallica',
    item_category: 'event_ticket',
    item_variant: 'inteira',
    price: 350.00,
    quantity: 2,
    currency: 'BRL',
    event_date: '2026-06-15',
    venue: 'Morumbi Stadium',
    artist: 'Metallica'
  }
])

const userEmail = ref('')
const paymentMethod = ref('credit_card')
const coupon = ref('')

const total = cartItems.value.reduce(
  (sum, item) => sum + (item.price * item.quantity),
  0
)

const handleBeginCheckout = () => {
  // Definir informações do usuário
  setUserInfo({
    email: userEmail.value,
    user_type: 'new'
  })

  // Rastrear início de checkout
  trackBeginCheckout(cartItems.value, total, {
    email: userEmail.value
  })

  console.log('✅ Checkout iniciado')
}

const handlePayment = () => {
  // Rastrear adição de informações de pagamento
  trackAddPaymentInfo(cartItems.value, total, {
    coupon: coupon.value || null,
    payment_method: paymentMethod.value,
    payment_type: 'online',
    installments: 1
  })

  console.log('✅ Pagamento confirmado')
}

const handlePurchase = () => {
  // Rastrear compra finalizada
  trackPurchase({
    transaction_id: `txn_${Date.now()}`,
    affiliation: 'Ticket Marketplace',
    items: cartItems.value,
    value: total,
    tax: total * 0.15,
    shipping: 0,
    currency: 'BRL',
    coupon: coupon.value || null,
    payment_method: paymentMethod.value
  })

  console.log('✅ Compra finalizada com sucesso')
  // Redirecionar para página de confirmação
}
</script>
```

---

### Exemplo 3: Lista de Eventos

**EventListPage.vue**

```vue
<template>
  <q-page>
    <div class="events-grid">
      <TicketCard
        v-for="event in events"
        :key="event.item_id"
        :ticket="event"
        @view-item="handleViewItem"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import TicketCard from '@/components/TicketCard.vue'
import { trackAddToCart } from '@/services/gtmEvents'

const events = ref([
  {
    item_id: 'evt_001',
    item_name: 'Show Metallica - São Paulo',
    item_category: 'event_ticket',
    item_variant: 'inteira',
    price: 350.00,
    currency: 'BRL',
    event_date: '2026-06-15',
    venue: 'Morumbi Stadium',
    artist: 'Metallica'
  },
  {
    item_id: 'evt_002',
    item_name: 'Show Coldplay - Rio',
    item_category: 'event_ticket',
    item_variant: 'inteira',
    price: 450.00,
    currency: 'BRL',
    event_date: '2026-09-20',
    venue: 'Estádio Maracanã',
    artist: 'Coldplay'
  }
])

const handleViewItem = (event) => {
  console.log('👁️ Visualizando:', event.item_name)
}

const handleAddToCart = (items) => {
  console.log('🛒 Adicionado ao carrinho:', items)
  // Atualizar seu estado local de carrinho
}
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
</style>
```

---

## Cenários Comuns

### Cenário 1: Rastrear View Page + Adicionar Carrinho

```javascript
import { trackViewItem, trackAddToCart } from '@/services/gtmEvents'

// Quando página carrega
onMounted(() => {
  trackViewItem(ticketData)
})

// Quando clica no botão adicionar
const onAddClick = () => {
  trackAddToCart([{ ...ticketData, quantity: 1 }], ticketData.price)
}
```

### Cenário 2: Carrinho com Múltiplos Itens

```javascript
const addToCart = (item) => {
  cart.value.push(item)
  
  // Rastrear com todos os itens atuais
  const total = cart.value.reduce(
    (sum, i) => sum + (i.price * i.quantity),
    0
  )
  
  trackAddToCart(cart.value, total)
}
```

### Cenário 3: Aplicar Cupom

```javascript
const applyCoupon = (code) => {
  const discount = getDiscount(code)
  
  // Recalcular total com desconto
  const newTotal = subtotal - discount
  
  // Rastrear adição de pagamento com cupom
  trackAddPaymentInfo(cartItems, newTotal, {
    coupon: code,
    payment_method: 'credit_card'
  })
}
```

### Cenário 4: Rastreamento de Erro

```javascript
const processPurchase = async () => {
  try {
    const result = await submitPayment()
    
    // Rastrear apenas se sucesso
    trackPurchase({
      transaction_id: result.id,
      items: cartItems,
      value: total
    })
  } catch (error) {
    console.error('Erro na compra:', error)
    // Não rastrear purchase se houve erro
  }
}
```

---

### Cenário 5: Rastreamento em Store (Pinia/Vuex)

**stores/cart.js** (Pinia)

```javascript
import { defineStore } from 'pinia'
import { trackAddToCart } from '@/services/gtmEvents'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),

  actions: {
    addItem(item) {
      this.items.push(item)
      this.calculateTotal()
      
      // Rastrear adição ao carrinho
      trackAddToCart(this.items, this.total)
    },

    removeItem(itemId) {
      this.items = this.items.filter(i => i.item_id !== itemId)
      this.calculateTotal()
    },

    calculateTotal() {
      this.total = this.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      )
    }
  }
})
```

---

## Troubleshooting

### Problema: Evento não aparece no dataLayer

**Solução:**
```javascript
// Verificar se serviço foi importado corretamente
import { trackViewItem } from '@/services/gtmEvents'

// Verificar se função foi chamada
console.log('Chamando trackViewItem...')
trackViewItem(item)

// Verificar dataLayer
console.log('dataLayer:', window.dataLayer)
```

### Problema: IDs gerados são iguais

**Solução:**
Usar timestamp + random para ID único:
```javascript
const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
```

### Problema: Cupom não aparece

**Solução:**
```javascript
// Verificar se cupom foi passado
trackAddPaymentInfo(items, value, {
  coupon: 'VALID_CODE' // Certifique-se que não é null/undefined
})
```

### Problema: Total incorreto

**Solução:**
```javascript
// Recalcular sempre que quantidade muda
const total = items.reduce(
  (sum, item) => sum + (item.price * item.quantity),
  0
)

trackAddToCart(items, total)
```

### Problema: Evento duplicado

**Solução:**
```javascript
// Limpar entre eventos diferentes
import { clearEcommerce } from '@/services/gtmEvents'

trackViewItem(item1)
clearEcommerce()
trackViewItem(item2) // Agora são eventos separados
```

---

## Checklist de Implementação

- [ ] Importar serviço em componentes
- [ ] Rastrear view_item ao carregar página de detalhe
- [ ] Rastrear add_to_cart ao clicar botão
- [ ] Rastrear begin_checkout ao iniciar
- [ ] Rastrear add_payment_info ao confirmar pagamento
- [ ] Rastrear purchase ao finalizar
- [ ] Validar no console (F12)
- [ ] Testar no GTM Preview Mode
- [ ] Verificar dados no Google Analytics

---

## Recursos Úteis

```javascript
// Ver todos os eventos
window.dataLayer.forEach(e => {
  if (e.event) console.log(e.event, e)
})

// Contar por tipo
window.dataLayer
  .filter(e => e.event)
  .reduce((acc, e) => {
    acc[e.event] = (acc[e.event] || 0) + 1
    return acc
  }, {})

// Último evento
window.dataLayer[window.dataLayer.length - 1]

// Eventos de compra
window.dataLayer.filter(e => e.event === 'purchase')
```

---

## Próximos Passos

1. Integrar em seus componentes
2. Testar no console
3. Configurar tags no GTM
4. Validar em GTM Preview
5. Publicar no Google Analytics 4

---

**Precisa de ajuda?**
- Verifique GTM_IMPLEMENTATION_GUIDE.md
- Veja exemplos em gtmEvents.examples.js
- Execute testes em /event-tracking
