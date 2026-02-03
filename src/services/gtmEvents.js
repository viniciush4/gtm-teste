/**
 * Serviço para gerenciar eventos do GTM
 * Segue a estrutura recomendada do Google para e-commerce
 */

/**
 * Inicializa o dataLayer do GTM se não existir
 */
const initDataLayer = () => {
  if (!window.dataLayer) {
    window.dataLayer = []
  }
}

/**
 * Envia um evento para o GTM
 * @param {string} eventName - Nome do evento
 * @param {object} eventData - Dados do evento
 */
const pushEvent = (eventName, eventData) => {
  initDataLayer()
  const event = {
    event: eventName,
    ...eventData
  }
  window.dataLayer.push(event)
  console.log(`[GTM] Evento "${eventName}" enviado:`, event)
}

/**
 * Evento: View Item
 * Disparado quando um ingresso é visualizado
 * @param {object} item - Dados do ingresso
 */
export const trackViewItem = (item) => {
  const {
    item_id = '',
    item_name = '',
    item_category = 'event_ticket',
    item_variant = '',
    price = 0,
    currency = 'BRL',
    event_date = '',
    venue = '',
    artist = ''
  } = item

  const eventData = {
    ecommerce: {
      items: [
        {
          item_id,
          item_name,
          item_category,
          item_variant,
          price,
          currency,
          event_date,
          venue,
          artist
        }
      ]
    },
    value: price,
    currency
  }

  pushEvent('view_item', eventData)
}

/**
 * Evento: Add to Cart
 * Disparado quando um ou mais ingressos são adicionados ao carrinho
 * @param {array} items - Array de ingressos adicionados
 * @param {number} cartValue - Valor total do carrinho
 */
export const trackAddToCart = (items = [], cartValue = 0) => {
  const formattedItems = items.map(item => ({
    item_id: item.item_id || `evt_${generateId()}`,
    item_name: item.item_name || '',
    item_category: item.item_category || 'event_ticket',
    item_variant: item.item_variant || '',
    price: item.price || 0,
    quantity: item.quantity || 1,
    currency: item.currency || 'BRL',
    event_date: item.event_date || '',
    venue: item.venue || '',
    artist: item.artist || ''
  }))

  const totalValue = cartValue || formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const eventData = {
    ecommerce: {
      items: formattedItems,
      value: totalValue,
      currency: 'BRL'
    },
    value: totalValue,
    currency: 'BRL'
  }

  pushEvent('add_to_cart', eventData)
}

/**
 * Evento: Begin Checkout
 * Disparado quando o usuário inicia o processo de checkout
 * @param {array} items - Itens no carrinho
 * @param {number} value - Valor total
 * @param {object} userInfo - Informações do usuário
 */
export const trackBeginCheckout = (items = [], value = 0, userInfo = {}) => {
  const formattedItems = items.map(item => ({
    item_id: item.item_id || `evt_${generateId()}`,
    item_name: item.item_name || '',
    item_category: item.item_category || 'event_ticket',
    item_variant: item.item_variant || '',
    price: item.price || 0,
    quantity: item.quantity || 1,
    currency: item.currency || 'BRL',
    event_date: item.event_date || '',
    venue: item.venue || '',
    artist: item.artist || ''
  }))

  const totalValue = value || formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const eventData = {
    ecommerce: {
      items: formattedItems,
      value: totalValue,
      currency: 'BRL'
    },
    value: totalValue,
    currency: 'BRL',
    user_id: userInfo.user_id || null,
    email: userInfo.email || null
  }

  pushEvent('begin_checkout', eventData)
}

/**
 * Evento: Add Payment Info
 * Disparado quando o usuário seleciona/confirma informações de pagamento
 * @param {array} items - Itens no carrinho
 * @param {number} value - Valor total
 * @param {object} paymentInfo - Informações de pagamento
 */
export const trackAddPaymentInfo = (items = [], value = 0, paymentInfo = {}) => {
  const formattedItems = items.map(item => ({
    item_id: item.item_id || `evt_${generateId()}`,
    item_name: item.item_name || '',
    item_category: item.item_category || 'event_ticket',
    item_variant: item.item_variant || '',
    price: item.price || 0,
    quantity: item.quantity || 1,
    currency: item.currency || 'BRL',
    event_date: item.event_date || '',
    venue: item.venue || '',
    artist: item.artist || ''
  }))

  const totalValue = value || formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const eventData = {
    ecommerce: {
      items: formattedItems,
      value: totalValue,
      currency: 'BRL'
    },
    value: totalValue,
    currency: 'BRL',
    coupon: paymentInfo.coupon || null,
    payment_method: paymentInfo.payment_method || null,
    payment_type: paymentInfo.payment_type || null,
    installments: paymentInfo.installments || 1
  }

  pushEvent('add_payment_info', eventData)
}

/**
 * Evento: Purchase (Compra realizada)
 * Disparado quando a compra é finalizada com sucesso
 * @param {object} purchase - Dados da compra
 */
export const trackPurchase = (purchase = {}) => {
  const {
    transaction_id = `txn_${generateId()}`,
    affiliation = 'Ticket Marketplace',
    items = [],
    value = 0,
    tax = 0,
    shipping = 0,
    currency = 'BRL',
    coupon = null,
    user_id = null,
    email = null,
    customer_lifetime_value = 0,
    payment_method = null
  } = purchase

  const formattedItems = items.map(item => ({
    item_id: item.item_id || `evt_${generateId()}`,
    item_name: item.item_name || '',
    item_category: item.item_category || 'event_ticket',
    item_variant: item.item_variant || '',
    price: item.price || 0,
    quantity: item.quantity || 1,
    currency: item.currency || 'BRL',
    event_date: item.event_date || '',
    venue: item.venue || '',
    artist: item.artist || ''
  }))

  const totalValue = value || formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const eventData = {
    transaction_id,
    affiliation,
    value: totalValue,
    tax,
    shipping,
    currency,
    coupon,
    user_id,
    email,
    customer_lifetime_value,
    payment_method,
    ecommerce: {
      transaction_id,
      affiliation,
      value: totalValue,
      tax,
      shipping,
      currency,
      coupon,
      items: formattedItems
    }
  }

  pushEvent('purchase', eventData)
}

/**
 * Utilitário: Gera um ID aleatório
 */
const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Limpa o ecommerce do dataLayer para evitar conflitos entre eventos
 */
export const clearEcommerce = () => {
  initDataLayer()
  window.dataLayer.push({
    ecommerce: null
  })
}

/**
 * Define informações do usuário no dataLayer
 * @param {object} userInfo - Informações do usuário
 */
export const setUserInfo = (userInfo = {}) => {
  initDataLayer()
  window.dataLayer.push({
    user_id: userInfo.user_id || null,
    email: userInfo.email || null,
    user_type: userInfo.user_type || null,
    country: userInfo.country || 'BR'
  })
}
