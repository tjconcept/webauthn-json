# JSON helpers for WebAuthn

A set of functions for converting to and from JSON compatible structures, useful
for passing these values between clients and servers as JSON strings.

## Example

```js
import {
  parseCreationOptionsFromJSON,
  attestationToJSON,
} from 'https://esm.sh/gh/tjconcept/webauthn-json@1.1.0'

function signUp() {
  const credential = navigator.credentials.create({
    publicKey: parseCreationOptionsFromJSON(JSON.parse(serverWebauthnCreate())),
  })
  join(credential, (credential) =>
    serverWebauthnStore(JSON.stringify(attestationToJSON(credential))),
  )
}
```

## Exports

```
creationOptionsToJSON(options) → json
parseCreationOptionsFromJSON(json) → options
requestOptionsToJSON(options) → json
parseRequestOptionsFromJSON(json) → options
assertionToJSON(credential) → json
assertionFromJSON(json) → credential
attestationToJSON(credential) → json
attestationFromJSON(json) → credential
pubKeyCredParams = [
  {alg: -8, type: 'public-key'},   // EdDSA
  {alg: -7, type: 'public-key'},   // ES256
  {alg: -257, type: 'public-key'}, // RS256
]
```

## `pubKeyCredParams`

A convenient list of common algorithms that can be filtered or sorted to
specific needs.

### Example

```js
const supported = [-8, -257]
navigator.credentials.create({
  publicKey: {
    authenticatorSelection: {residentKey: true},
    challenge: Uint8Array.from([1, 2, 3, 4]),
    pubKeyCredParams: pubKeyCredParams.filter((p) => supported.includes(p.alg)),
    rp: 'example.com',
    user: {
      name: 'Foo',
      displayName: 'Bar',
      id: Uint8Array.from([5, 6, 7, 8]),
    },
  },
})
```

## `parseCreationOptionsFromJSON(json)`

Ponyfill of
[`PublicKeyCredential.parseCreationOptionsFromJSON()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/parseCreationOptionsFromJSON_static).

Decode Base64-URL strings in `challenge` and `user.id` to `Uint8Array` values.

### Example

```js
navigator.credentials.create({
  publicKey: parseCreationOptionsFromJSON(JSON.parse(serverResponse)),
})
```

## `creationOptionsToJSON(options)`

Partner (reverse) of
[`PublicKeyCredential.parseCreationOptionsFromJSON()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/parseCreationOptionsFromJSON_static).

Encode `ArrayBuffer` or `Uint8Array` values in `challenge` and `user.id` as
Base64-URL strings.

### Example

```js
const serverResponse = creationOptionsToJSON({
  authenticatorSelection: {residentKey: true},
  challenge: Uint8Array.from([1, 2, 3, 4]),
  pubKeyCredParams: [{alg: -8, type: 'public-key'}],
  rp: 'example.com',
  user: {
    name: 'Foo',
    displayName: 'Bar',
    id: Uint8Array.from([5, 6, 7, 8]),
  },
})
sendToClient(JSON.stringify(serverResponse))
```

## `parseRequestOptionsFromJSON(json)`

Ponyfill of
[`PublicKeyCredential.parseRequestOptionsFromJSON()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/parseRequestOptionsFromJSON_static).

Decode Base64-URL strings in `challenge` and `allowCredentials[].id` to
`Uint8Array` values.

### Example

```js
navigator.credentials.get({
  publicKey: parseRequestOptionsFromJSON(JSON.parse(serverResponse)),
})
```

## `requestOptionsToJSON(options)`

Partner (reverse) of
[`PublicKeyCredential.parseRequestOptionsFromJSON()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/parseRequestOptionsFromJSON_static).

Encode `ArrayBuffer` or `Uint8Array` values in `challenge` and
`allowCredentials[].id` as Base64-URL strings.

### Example

```js
const serverResponse = creationOptionsToJSON({
  allowCredentials: [
    {
      id: Uint8Array.from([5, 6, 7, 8]),
      transports: ['ble', 'nfc'],
      type: 'public-key',
    },
  ],
  challenge: Uint8Array.from([1, 2, 3, 4]),
  extensions: {
    foo: 'bar',
  },
  hints: ['hybrid'],
  rpId: 'example.com',
  timeout: 12000,
  userVerification: 'preferred',
})
sendToClient(JSON.stringify(serverResponse))
```

## `assertionToJSON(credential)`

Encode `ArrayBuffer` or `Uint8Array` values in the following paths as Base64-URL
strings:

- `rawId`
- `response.authenticatorData`
- `response.clientDataJSON`
- `response.signature`
- `response.userHandle`

### Example

```js
navigator.credentials
  .get({
    publicKey: parseRequestOptionsFromJSON(JSON.parse(serverResponse)),
  })
  .then((credential) =>
    sendToServer(JSON.stringify(assertionToJSON(credential))),
  )
```

## `assertionFromJSON(json)`

Decode Base64-URL strings in the following paths to `Uint8Array` values:

- `rawId`
- `response.authenticatorData`
- `response.clientDataJSON`
- `response.signature`
- `response.userHandle`

### Example

```js
const assertion = assertionFromJSON(JSON.parse(clientResponse))
// assertion.response.signature
```

## `attestationToJSON(credential)`

Encode `ArrayBuffer` or `Uint8Array` values as Base64-URL strings and replace
"getter" functions with their result:

- `rawId` is Base64-URL encoded
- `response.attestationObject` is Base64-URL encoded
- `response.clientDataJSON` is Base64-URL encoded
- `response.authenticatorData` is the Base64-URL encoded result from
  `response.getAuthenticatorData()`
- `response.publicKey` is the Base64-URL encoded result from
  `response.getPublicKey()`
- `response.publicKeyAlgorithm` is the result from
  `response.getPublicKeyAlgorithm()`
- `response.transports` is the result from `response.getTransports()`

### Example

```js
navigator.credentials
  .create({
    publicKey: parseCreationOptionsFromJSON(JSON.parse(serverResponse)),
  })
  .then((credential) => sendToServer(attestationToJSON(credential)))
```

## `attestationFromJSON(json)`

Decode Base64-URL strings in the following paths to `Uint8Array` values:

- `rawId`
- `response.attestationObject`
- `response.clientDataJSON`
- `response.authenticatorData`
- `response.publicKey`

Note that this function is not an exact mirroring of
`attestationToJSON(PublicKeyCredential)` as it will not reproduce the "getter"
functions but replace them with a corresponding key-value pair, e.g.
`getAuthenticatorData: () → String` is replaced by `authenticatorData: String`.
However, it _is_ a mirroring of `attestationToJSON(json)`, such that
`attestationToJSON(attestationFromJSON(json))` _will work_. This simply means it
works as expected and can be used on both ends to transfer or store attestations
(e.g. using `JSON.stringify/parse`).

### Example

```js
const attestation = attestationFromJSON(JSON.parse(clientResponse))
if (attestation.response.publicKeyAlgorithm !== -8) {
  throw new Error('Algorithm not supported')
}

const key = crypto.subtle.importKey(
  'spki',
  attestation.response.publicKey,
  {name: 'Ed25519'},
  extractable,
  usages,
)
```

## Testing

```sh
deno --allow-env --allow-read test.js
```
