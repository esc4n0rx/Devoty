#!/usr/bin/env node

const { createECDH } = require('crypto')

function toBase64Url(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function generateVapidKeys() {
  const ecdh = createECDH('prime256v1')
  ecdh.generateKeys()

  const publicKey = toBase64Url(ecdh.getPublicKey())
  const privateKey = toBase64Url(ecdh.getPrivateKey())

  return { publicKey, privateKey }
}

function main() {
  const { publicKey, privateKey } = generateVapidKeys()

  console.log('VAPID keys gerados com sucesso!')
  console.log('Adicione as chaves às variáveis de ambiente correspondentes:')
  console.log(`NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY=${publicKey}`)
  console.log(`WEB_PUSH_PRIVATE_KEY=${privateKey}`)
}

if (require.main === module) {
  try {
    main()
  } catch (error) {
    console.error('Não foi possível gerar as chaves VAPID:', error)
    process.exitCode = 1
  }
}
