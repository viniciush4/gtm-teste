/**
 * Exemplos de uso do serviço GTM Events
 * Cenários comuns de venda de ingressos
 */

import {
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  setUserInfo,
  clearEcommerce
} from '@/services/gtmEvents'

// ============================================================================
// EXEMPLO 1: Fluxo Completo de Compra
// ============================================================================

export const exampleFullPurchaseFlow = () => {
  // 1. Definir informações do usuário
  setUserInfo({
    user_id: 'usr_12345',
    email: 'customer@example.com',
    user_type: 'new',
    country: 'BR'
  })

  // 2. Usuário visualiza um ingresso
  trackViewItem({
    item_id: 'evt_coldplay_rio_2026',
    item_name: 'Show Coldplay - Rio de Janeiro',
    item_category: 'event_ticket',
    item_variant: 'inteira',
    price: 450.00,
    currency: 'BRL',
    event_date: '2026-09-20',
    venue: 'Estádio do Maracanã',
    artist: 'Coldplay'
  })

  // 3. Usuário adiciona 2 ingressos ao carrinho
  const cartItems = [
    {
      item_id: 'evt_coldplay_rio_2026',
      item_name: 'Show Coldplay - Rio de Janeiro',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 450.00,
      quantity: 2,
      currency: 'BRL',
      event_date: '2026-09-20',
      venue: 'Estádio do Maracanã',
      artist: 'Coldplay'
    }
  ]
  trackAddToCart(cartItems, 900.00)

  // 4. Usuário inicia checkout
  trackBeginCheckout(cartItems, 900.00, {
    user_id: 'usr_12345',
    email: 'customer@example.com'
  })

  // 5. Usuário seleciona método de pagamento
  trackAddPaymentInfo(cartItems, 900.00, {
    coupon: 'PRIMEIRACOMPRA',
    payment_method: 'credit_card',
    payment_type: 'online',
    installments: 3
  })

  // 6. Compra finalizada
  trackPurchase({
    transaction_id: `txn_${Date.now()}`,
    affiliation: 'Ticket Marketplace Brasil',
    items: cartItems,
    value: 900.00,
    tax: 135.00,
    shipping: 0,
    currency: 'BRL',
    coupon: 'PRIMEIRACOMPRA',
    user_id: 'usr_12345',
    email: 'customer@example.com',
    customer_lifetime_value: 900.00,
    payment_method: 'credit_card'
  })

  // 7. Limpar para próxima sessão
  clearEcommerce()
}

// ============================================================================
// EXEMPLO 2: Vários Eventos no Mesmo Carrinho
// ============================================================================

export const exampleMultipleEventsPurchase = () => {
  setUserInfo({
    user_id: 'usr_67890',
    email: 'music_fan@example.com',
    user_type: 'returning',
    country: 'BR'
  })

  // Usuário adiciona ingressos para dois eventos diferentes
  const cartItems = [
    {
      item_id: 'evt_pink_floyd_sp_2026',
      item_name: 'Pink Floyd Tribute - São Paulo',
      item_category: 'event_ticket',
      item_variant: 'vip',
      price: 600.00,
      quantity: 1,
      currency: 'BRL',
      event_date: '2026-07-10',
      venue: 'Allianz Parque',
      artist: 'Pink Floyd Tribute Band'
    },
    {
      item_id: 'evt_timbalada_salvador_2026',
      item_name: 'Timbalada - Salvador',
      item_category: 'event_ticket',
      item_variant: 'pista',
      price: 120.00,
      quantity: 2,
      currency: 'BRL',
      event_date: '2026-08-15',
      venue: 'Arena Fonte Nova',
      artist: 'Timbalada'
    }
  ]

  trackAddToCart(cartItems, 840.00)
  trackBeginCheckout(cartItems, 840.00, { user_id: 'usr_67890', email: 'music_fan@example.com' })
  trackAddPaymentInfo(cartItems, 840.00, { payment_method: 'pix', installments: 1 })
  trackPurchase({
    transaction_id: `txn_multi_${Date.now()}`,
    affiliation: 'Ticket Marketplace Brasil',
    items: cartItems,
    value: 840.00,
    tax: 126.00,
    shipping: 0,
    currency: 'BRL',
    user_id: 'usr_67890',
    email: 'music_fan@example.com',
    customer_lifetime_value: 840.00,
    payment_method: 'pix'
  })

  clearEcommerce()
}

// ============================================================================
// EXEMPLO 3: Compra com Desconto de Cupom
// ============================================================================

export const examplePurchaseWithCoupon = () => {
  const basePrice = 250.00
  const discountPercent = 20 // COUPON20 = 20% desconto
  const discountAmount = basePrice * (discountPercent / 100)
  const finalPrice = basePrice - discountAmount

  setUserInfo({
    user_id: 'usr_member_001',
    email: 'member@example.com',
    user_type: 'premium',
    country: 'BR'
  })

  const cartItems = [
    {
      item_id: 'evt_anitta_brasilia_2026',
      item_name: 'Anitta - Brasília',
      item_category: 'event_ticket',
      item_variant: 'camarote',
      price: basePrice,
      quantity: 1,
      currency: 'BRL',
      event_date: '2026-10-05',
      venue: 'Estádio Mané Garrincha',
      artist: 'Anitta'
    }
  ]

  trackAddToCart(cartItems, basePrice)
  trackAddPaymentInfo(cartItems, finalPrice, {
    coupon: 'COUPON20',
    payment_method: 'credit_card',
    installments: 1
  })
  trackPurchase({
    transaction_id: `txn_coupon_${Date.now()}`,
    affiliation: 'Ticket Marketplace Brasil',
    items: cartItems,
    value: finalPrice,
    tax: finalPrice * 0.15,
    shipping: 0,
    currency: 'BRL',
    coupon: 'COUPON20',
    user_id: 'usr_member_001',
    email: 'member@example.com',
    customer_lifetime_value: finalPrice,
    payment_method: 'credit_card'
  })

  clearEcommerce()
}

// ============================================================================
// EXEMPLO 4: Compra com Parcelamento
// ============================================================================

export const examplePurchaseWithInstallments = () => {
  const totalValue = 1500.00
  const installments = 6

  setUserInfo({
    user_id: 'usr_family_group',
    email: 'family@example.com',
    country: 'BR'
  })

  const cartItems = [
    {
      item_id: 'evt_festival_lolla_2026',
      item_name: 'Lollapalooza Brasil 2026',
      item_category: 'event_ticket',
      item_variant: 'pista',
      price: 750.00,
      quantity: 2,
      currency: 'BRL',
      event_date: '2026-03-29',
      venue: 'Autódromo José Carlos Pace',
      artist: 'Lollapalooza (Various Artists)'
    }
  ]

  trackAddToCart(cartItems, totalValue)
  trackBeginCheckout(cartItems, totalValue, { user_id: 'usr_family_group', email: 'family@example.com' })
  trackAddPaymentInfo(cartItems, totalValue, {
    payment_method: 'credit_card',
    payment_type: 'online',
    installments: installments
  })
  trackPurchase({
    transaction_id: `txn_install_${Date.now()}`,
    affiliation: 'Ticket Marketplace Brasil',
    items: cartItems,
    value: totalValue,
    tax: totalValue * 0.15,
    shipping: 0,
    currency: 'BRL',
    user_id: 'usr_family_group',
    email: 'family@example.com',
    customer_lifetime_value: totalValue,
    payment_method: 'credit_card'
  })

  clearEcommerce()
}

// ============================================================================
// EXEMPLO 5: Apenas View Item (Sem Compra)
// ============================================================================

export const exampleJustViewItem = () => {
  // Usuário apenas explora ingressos, sem fazer compra
  const events = [
    {
      item_id: 'evt_racionais_sp_2026',
      item_name: 'Racionais MC\'s - São Paulo',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 380.00,
      currency: 'BRL',
      event_date: '2026-05-15',
      venue: 'Espaço das Américas',
      artist: 'Racionais MC\'s'
    },
    {
      item_id: 'evt_bbb_sp_2026',
      item_name: 'Banda Bis - São Paulo',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 150.00,
      currency: 'BRL',
      event_date: '2026-06-10',
      venue: 'Sesc Pompeia',
      artist: 'Banda Bis'
    }
  ]

  // Rastrear visualização de cada evento
  events.forEach(event => {
    trackViewItem(event)
    clearEcommerce() // Limpar entre eventos
  })
}

// ============================================================================
// EXEMPLO 6: Compra com Meia Entrada
// ============================================================================

export const examplePurchaseWithStudentDiscount = () => {
  const fullPrice = 280.00
  const halfPrice = fullPrice / 2

  setUserInfo({
    user_id: 'usr_student_123',
    email: 'student@example.com',
    user_type: 'student',
    country: 'BR'
  })

  const cartItems = [
    {
      item_id: 'evt_show_rock_curitiba_2026',
      item_name: 'Rock Fest Curitiba 2026',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: fullPrice,
      quantity: 1,
      currency: 'BRL',
      event_date: '2026-04-20',
      venue: 'Pedreira Paulo Leminski',
      artist: 'Rock Fest (Various Artists)'
    },
    {
      item_id: 'evt_show_rock_curitiba_2026_meia',
      item_name: 'Rock Fest Curitiba 2026 (Meia Entrada)',
      item_category: 'event_ticket',
      item_variant: 'meia',
      price: halfPrice,
      quantity: 1,
      currency: 'BRL',
      event_date: '2026-04-20',
      venue: 'Pedreira Paulo Leminski',
      artist: 'Rock Fest (Various Artists)'
    }
  ]

  const totalValue = fullPrice + halfPrice

  trackAddToCart(cartItems, totalValue)
  trackBeginCheckout(cartItems, totalValue, { user_id: 'usr_student_123', email: 'student@example.com' })
  trackAddPaymentInfo(cartItems, totalValue, {
    payment_method: 'debit_card',
    installments: 1
  })
  trackPurchase({
    transaction_id: `txn_student_${Date.now()}`,
    affiliation: 'Ticket Marketplace Brasil',
    items: cartItems,
    value: totalValue,
    tax: totalValue * 0.15,
    shipping: 0,
    currency: 'BRL',
    user_id: 'usr_student_123',
    email: 'student@example.com',
    customer_lifetime_value: totalValue,
    payment_method: 'debit_card'
  })

  clearEcommerce()
}

// ============================================================================
// EXEMPLO 7: Rastreamento apenas na página de ingressos (sem checkout)
// ============================================================================

export const exampleViewMultipleTickets = () => {
  setUserInfo({
    user_id: 'usr_browser_123',
    email: 'browser@example.com',
    country: 'BR'
  })

  // Simular usuário navegando e vendo vários ingressos na página
  const ticketsList = [
    {
      item_id: 'evt_foo_fighters_2026',
      item_name: 'Foo Fighters - São Paulo',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 550.00,
      currency: 'BRL',
      event_date: '2026-11-15',
      venue: 'Estádio do Morumbi',
      artist: 'Foo Fighters'
    },
    {
      item_id: 'evt_imagine_dragons_2026',
      item_name: 'Imagine Dragons - Rio de Janeiro',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 480.00,
      currency: 'BRL',
      event_date: '2026-12-05',
      venue: 'Jeunesse Arena',
      artist: 'Imagine Dragons'
    },
    {
      item_id: 'evt_mariah_carey_2026',
      item_name: 'Mariah Carey - Brasília',
      item_category: 'event_ticket',
      item_variant: 'vip',
      price: 890.00,
      currency: 'BRL',
      event_date: '2026-10-25',
      venue: 'Arena BRB Mané Garrincha',
      artist: 'Mariah Carey'
    }
  ]

  // Rastrear visualização de cada ingresso
  ticketsList.forEach((ticket, index) => {
    // Simular delay entre visualizações
    setTimeout(() => {
      trackViewItem(ticket)
      clearEcommerce()
    }, index * 500)
  })
}

// ============================================================================
// Função para executar exemplos no console
// ============================================================================

export const runExample = (exampleNumber) => {
  const examples = {
    1: exampleFullPurchaseFlow,
    2: exampleMultipleEventsPurchase,
    3: examplePurchaseWithCoupon,
    4: examplePurchaseWithInstallments,
    5: exampleJustViewItem,
    6: examplePurchaseWithStudentDiscount,
    7: exampleViewMultipleTickets
  }

  if (examples[exampleNumber]) {
    console.log(`🎫 Executando Exemplo ${exampleNumber}...`)
    examples[exampleNumber]()
    console.log(`✅ Exemplo ${exampleNumber} concluído. Verifique o dataLayer no console.`)
  } else {
    console.error(`❌ Exemplo ${exampleNumber} não encontrado. Exemplos disponíveis: 1-7`)
  }
}

// ============================================================================
// Instruções de uso
// ============================================================================

/*
Para usar os exemplos no console do browser:

1. Abra o Developer Tools (F12)
2. Na aba Console, importe e execute:

   // Executar exemplo completo de compra
   import { runExample } from '@/services/gtmEvents.examples'
   runExample(1)

   // Ou execute um exemplo específico
   import { exampleFullPurchaseFlow } from '@/services/gtmEvents.examples'
   exampleFullPurchaseFlow()

3. Verifique os eventos no dataLayer:
   console.log(window.dataLayer)

4. Abra o Google Tag Manager em preview mode para validar
*/
