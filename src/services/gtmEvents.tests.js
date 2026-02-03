/**
 * Testes e Validação do Serviço GTM Events
 * 
 * Para executar os testes no console do browser:
 * import { runAllTests } from '@/services/gtmEvents.tests'
 * runAllTests()
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
// Validadores
// ============================================================================

const validators = {
  // Validar se um objeto tem todos os campos obrigatórios
  validateItem: (item) => {
    const required = ['item_id', 'item_name', 'price']
    const missing = required.filter(field => !item[field])
    return {
      valid: missing.length === 0,
      missing
    }
  },

  // Validar estrutura do dataLayer
  validateDataLayer: (expectedEvent) => {
    if (!window.dataLayer || window.dataLayer.length === 0) {
      return { valid: false, error: 'dataLayer vazio' }
    }
    const lastEvent = window.dataLayer[window.dataLayer.length - 1]
    return {
      valid: lastEvent.event === expectedEvent,
      event: lastEvent.event,
      expectedEvent
    }
  },

  // Validar estrutura de ecommerce
  validateEcommerce: () => {
    const lastEvent = window.dataLayer[window.dataLayer.length - 1]
    if (!lastEvent.ecommerce) {
      return { valid: false, error: 'ecommerce não encontrado' }
    }
    if (!lastEvent.ecommerce.items || lastEvent.ecommerce.items.length === 0) {
      return { valid: false, error: 'items array vazio' }
    }
    return { valid: true, itemsCount: lastEvent.ecommerce.items.length }
  },

  // Validar transação
  validateTransaction: () => {
    const lastEvent = window.dataLayer[window.dataLayer.length - 1]
    const required = ['transaction_id', 'affiliation', 'value']
    const missing = required.filter(field => !lastEvent[field])
    return {
      valid: missing.length === 0,
      missing,
      transactionId: lastEvent.transaction_id
    }
  }
}

// ============================================================================
// Testes Unitários
// ============================================================================

const tests = {
  testViewItem: () => {
    console.log('\n📋 Teste: View Item')
    const ticket = {
      item_id: 'evt_test_001',
      item_name: 'Test Event',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 100,
      currency: 'BRL',
      event_date: '2026-06-15',
      venue: 'Test Venue',
      artist: 'Test Artist'
    }

    // Validar item
    const itemValidation = validators.validateItem(ticket)
    if (!itemValidation.valid) {
      console.error('❌ Item inválido:', itemValidation.missing)
      return false
    }

    // Executar evento
    trackViewItem(ticket)

    // Validar resultado
    const eventValidation = validators.validateDataLayer('view_item')
    const ecommerceValidation = validators.validateEcommerce()

    console.log('✅ Item válido')
    console.log('✅ Evento disparado:', eventValidation.valid ? 'SIM' : 'NÃO')
    console.log('✅ Estrutura ecommerce:', ecommerceValidation.valid ? 'SIM' : 'NÃO')

    clearEcommerce()
    return eventValidation.valid && ecommerceValidation.valid
  },

  testAddToCart: () => {
    console.log('\n🛒 Teste: Add to Cart')
    const items = [{
      item_id: 'evt_test_002',
      item_name: 'Test Event 2',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 150,
      quantity: 2,
      currency: 'BRL',
      event_date: '2026-07-20',
      venue: 'Test Venue 2',
      artist: 'Test Artist 2'
    }]

    trackAddToCart(items, 300)

    const eventValidation = validators.validateDataLayer('add_to_cart')
    const ecommerceValidation = validators.validateEcommerce()

    console.log('✅ Evento disparado:', eventValidation.valid ? 'SIM' : 'NÃO')
    console.log('✅ Estrutura ecommerce:', ecommerceValidation.valid ? 'SIM' : 'NÃO')
    console.log('✅ Itens no dataLayer:', ecommerceValidation.itemsCount || 0)

    clearEcommerce()
    return eventValidation.valid && ecommerceValidation.valid
  },

  testBeginCheckout: () => {
    console.log('\n💳 Teste: Begin Checkout')
    const items = [{
      item_id: 'evt_test_003',
      item_name: 'Test Event 3',
      price: 200,
      quantity: 1,
      currency: 'BRL'
    }]

    trackBeginCheckout(items, 200, {
      user_id: 'test_user_123',
      email: 'test@example.com'
    })

    const eventValidation = validators.validateDataLayer('begin_checkout')
    const ecommerceValidation = validators.validateEcommerce()

    console.log('✅ Evento disparado:', eventValidation.valid ? 'SIM' : 'NÃO')
    console.log('✅ Estrutura ecommerce:', ecommerceValidation.valid ? 'SIM' : 'NÃO')

    clearEcommerce()
    return eventValidation.valid && ecommerceValidation.valid
  },

  testAddPaymentInfo: () => {
    console.log('\n💰 Teste: Add Payment Info')
    const items = [{
      item_id: 'evt_test_004',
      item_name: 'Test Event 4',
      price: 250,
      quantity: 1,
      currency: 'BRL'
    }]

    trackAddPaymentInfo(items, 250, {
      coupon: 'TEST10',
      payment_method: 'credit_card',
      payment_type: 'online',
      installments: 3
    })

    const eventValidation = validators.validateDataLayer('add_payment_info')
    const lastEvent = window.dataLayer[window.dataLayer.length - 1]

    console.log('✅ Evento disparado:', eventValidation.valid ? 'SIM' : 'NÃO')
    console.log('✅ Cupom registrado:', lastEvent.coupon || 'N/A')
    console.log('✅ Método de pagamento:', lastEvent.payment_method || 'N/A')
    console.log('✅ Parcelamento:', lastEvent.installments || 1)

    clearEcommerce()
    return eventValidation.valid
  },

  testPurchase: () => {
    console.log('\n✅ Teste: Purchase')
    const items = [{
      item_id: 'evt_test_005',
      item_name: 'Test Event 5',
      price: 300,
      quantity: 1,
      currency: 'BRL'
    }]

    trackPurchase({
      transaction_id: 'txn_test_001',
      affiliation: 'Test Marketplace',
      items: items,
      value: 300,
      tax: 45,
      shipping: 0,
      currency: 'BRL',
      user_id: 'test_user_123',
      email: 'test@example.com',
      payment_method: 'credit_card'
    })

    const eventValidation = validators.validateDataLayer('purchase')
    const transactionValidation = validators.validateTransaction()
    const ecommerceValidation = validators.validateEcommerce()

    console.log('✅ Evento disparado:', eventValidation.valid ? 'SIM' : 'NÃO')
    console.log('✅ Transação válida:', transactionValidation.valid ? 'SIM' : 'NÃO')
    console.log('✅ ID Transação:', transactionValidation.transactionId || 'N/A')
    console.log('✅ Estrutura ecommerce:', ecommerceValidation.valid ? 'SIM' : 'NÃO')

    clearEcommerce()
    return eventValidation.valid && transactionValidation.valid
  },

  testSetUserInfo: () => {
    console.log('\n👤 Teste: Set User Info')
    
    setUserInfo({
      user_id: 'user_test_123',
      email: 'user@test.com',
      user_type: 'premium',
      country: 'BR'
    })

    const lastEvent = window.dataLayer[window.dataLayer.length - 1]
    const hasUserInfo = lastEvent.user_id && lastEvent.email

    console.log('✅ Informações de usuário definidas:', hasUserInfo ? 'SIM' : 'NÃO')
    console.log('✅ User ID:', lastEvent.user_id || 'N/A')
    console.log('✅ Email:', lastEvent.email || 'N/A')
    console.log('✅ Tipo de usuário:', lastEvent.user_type || 'N/A')

    return hasUserInfo
  },

  testClearEcommerce: () => {
    console.log('\n🗑️ Teste: Clear Ecommerce')

    // Adicionar evento
    trackViewItem({ item_id: 'evt_001', item_name: 'Test', price: 100 })
    
    // Limpar
    clearEcommerce()

    const lastEvent = window.dataLayer[window.dataLayer.length - 1]
    const cleared = lastEvent.ecommerce === null

    console.log('✅ Ecommerce limpo:', cleared ? 'SIM' : 'NÃO')

    return cleared
  }
}

// ============================================================================
// Suite de Testes
// ============================================================================

export const runAllTests = () => {
  console.clear()
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🧪 SUITE DE TESTES - GTM Events Service')
  console.log('═══════════════════════════════════════════════════════════════')

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  }

  // Executar todos os testes
  const testList = [
    { name: 'View Item', fn: tests.testViewItem },
    { name: 'Add to Cart', fn: tests.testAddToCart },
    { name: 'Begin Checkout', fn: tests.testBeginCheckout },
    { name: 'Add Payment Info', fn: tests.testAddPaymentInfo },
    { name: 'Purchase', fn: tests.testPurchase },
    { name: 'Set User Info', fn: tests.testSetUserInfo },
    { name: 'Clear Ecommerce', fn: tests.testClearEcommerce }
  ]

  testList.forEach(test => {
    try {
      const passed = test.fn()
      results.tests.push({
        name: test.name,
        passed
      })
      if (passed) {
        results.passed++
      } else {
        results.failed++
      }
    } catch (error) {
      console.error(`❌ Erro no teste "${test.name}":`, error.message)
      results.tests.push({
        name: test.name,
        passed: false,
        error: error.message
      })
      results.failed++
    }
  })

  // Resumo
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('📊 RESULTADO DOS TESTES')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`✅ Aprovados: ${results.passed}`)
  console.log(`❌ Falhados: ${results.failed}`)
  console.log(`📈 Taxa de sucesso: ${((results.passed / testList.length) * 100).toFixed(2)}%`)

  console.log('\n📝 Detalhes:')
  results.tests.forEach(test => {
    const status = test.passed ? '✅' : '❌'
    console.log(`${status} ${test.name}`)
    if (test.error) {
      console.log(`   Erro: ${test.error}`)
    }
  })

  console.log('\n═══════════════════════════════════════════════════════════════\n')

  // Verificação do dataLayer
  console.log('🔍 Informações do DataLayer:')
  console.log(`Total de eventos: ${window.dataLayer?.length || 0}`)
  if (window.dataLayer && window.dataLayer.length > 0) {
    const events = window.dataLayer
      .filter(e => e.event)
      .map(e => e.event)
      .reduce((acc, event) => {
        acc[event] = (acc[event] || 0) + 1
        return acc
      }, {})
    console.log('Tipos de eventos:', events)
  }

  return results
}

// ============================================================================
// Testes de Performance
// ============================================================================

export const runPerformanceTests = () => {
  console.log('\n⚡ TESTES DE PERFORMANCE')
  console.log('═══════════════════════════════════════════════════════════════')

  const iterations = 100
  const item = {
    item_id: 'evt_perf_test',
    item_name: 'Performance Test Event',
    price: 100,
    currency: 'BRL'
  }

  // Teste 1: View Item
  console.time('View Item (100 iterações)')
  for (let i = 0; i < iterations; i++) {
    trackViewItem(item)
  }
  console.timeEnd('View Item (100 iterações)')

  // Teste 2: Add to Cart
  console.time('Add to Cart (100 iterações)')
  for (let i = 0; i < iterations; i++) {
    trackAddToCart([item], 100)
  }
  console.timeEnd('Add to Cart (100 iterações)')

  // Teste 3: Purchase
  console.time('Purchase (100 iterações)')
  for (let i = 0; i < iterations; i++) {
    trackPurchase({
      transaction_id: `txn_${i}`,
      items: [item],
      value: 100
    })
  }
  console.timeEnd('Purchase (100 iterações)')

  console.log('✅ Testes de performance concluídos')
  console.log(`Total de eventos no dataLayer: ${window.dataLayer.length}`)
}

// ============================================================================
// Instruções de Uso
// ============================================================================

export const showTestInstructions = () => {
  console.clear()
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🧪 TESTE DO SERVIÇO GTM EVENTS                              ║
╚═══════════════════════════════════════════════════════════════╝

Para executar os testes, abra o Console (F12) e execute:

1️⃣  Suite completa de testes:
    import { runAllTests } from '@/services/gtmEvents.tests'
    runAllTests()

2️⃣  Testes de performance:
    import { runPerformanceTests } from '@/services/gtmEvents.tests'
    runPerformanceTests()

3️⃣  Ver instruções:
    import { showTestInstructions } from '@/services/gtmEvents.tests'
    showTestInstructions()

4️⃣  Ver todos os eventos no dataLayer:
    console.log(window.dataLayer)

5️⃣  Ver últimos 5 eventos:
    console.log(window.dataLayer.slice(-5))

═══════════════════════════════════════════════════════════════
  `)
}
