import test from 'https://esm.sh/tape@5.9.0'
import fixtures from './fixtures.js'
import {
	pubKeyCredParams,
	creationOptionsToJSON,
	requestOptionsToJSON,
	parseCreationOptionsFromJSON,
	parseRequestOptionsFromJSON,
	assertionToJSON,
	assertionFromJSON,
	attestationToJSON,
	attestationFromJSON,
} from './index.js'

test('`pubKeyCredParams`', (t) => {
	t.deepEqual(pubKeyCredParams, [
		{alg: -8, type: 'public-key'}, // EdDSA
		{alg: -7, type: 'public-key'}, // ES256
		{alg: -257, type: 'public-key'}, // RS256
	])
	t.end()
})

test('`creationOptionsToJSON`', (t) => {
	t.deepEqual(
		creationOptionsToJSON({}),
		{
			authenticatorSelection: {residentKey: undefined},
			challenge: undefined,
			pubKeyCredParams: undefined,
			rp: undefined,
			user: {name: undefined, displayName: undefined, id: undefined},
		},
		'with no values provided',
	)
	t.deepEqual(
		creationOptionsToJSON(fixtures.internal.creationOptions),
		fixtures.json.creationOptions,
		'with all values provided',
	)
	t.end()
})

test('`parseCreationOptionsFromJSON`', (t) => {
	t.deepEqual(
		parseCreationOptionsFromJSON({}),
		{
			authenticatorSelection: {residentKey: undefined},
			challenge: undefined,
			pubKeyCredParams: undefined,
			rp: undefined,
			user: {name: undefined, displayName: undefined, id: undefined},
		},
		'with no values provided',
	)
	t.deepEqual(
		parseCreationOptionsFromJSON(fixtures.json.creationOptions),
		fixtures.internal.creationOptions,
		'with all values provided',
	)
	t.end()
})

test('`requestOptionsToJSON`', (t) => {
	t.deepEqual(
		requestOptionsToJSON({}),
		{
			allowCredentials: undefined,
			challenge: undefined,
			extensions: undefined,
			hints: undefined,
			rpId: undefined,
			timeout: undefined,
			userVerification: undefined,
		},
		'with no values provided',
	)
	t.deepEqual(
		requestOptionsToJSON(fixtures.internal.requestOptions),
		fixtures.json.requestOptions,
		'with all values provided',
	)
	t.end()
})

test('`parseRequestOptionsFromJSON`', (t) => {
	t.deepEqual(
		parseRequestOptionsFromJSON({}),
		{
			allowCredentials: undefined,
			challenge: undefined,
			extensions: undefined,
			hints: undefined,
			rpId: undefined,
			timeout: undefined,
			userVerification: undefined,
		},
		'with no values provided',
	)
	t.deepEqual(
		parseRequestOptionsFromJSON(fixtures.json.requestOptions),
		fixtures.internal.requestOptions,
		'with all values provided',
	)
	t.end()
})

test('`assertionToJSON`', (t) => {
	t.deepEqual(
		assertionToJSON(fixtures.internal.assertion),
		fixtures.json.assertion,
	)
	t.end()
})

test('`assertionFromJSON`', (t) => {
	t.deepEqual(
		assertionFromJSON(fixtures.json.assertion),
		fixtures.internal.assertion,
	)
	t.end()
})

test('`attestationToJSON`', (t) => {
	t.deepEqual(
		attestationToJSON(fixtures.web.attestation),
		fixtures.json.attestation,
		'from a `PublicKeyCredential` (`navigator.credentials.create` return value)',
	)
	t.deepEqual(
		attestationToJSON(fixtures.internal.attestation),
		fixtures.json.attestation,
		'from a JSON representation (`attestationFromJSON` return value)',
	)
	t.end()
})

test('`attestationFromJSON`', (t) => {
	t.deepEqual(
		attestationFromJSON(fixtures.json.attestation),
		fixtures.internal.attestation,
	)
	t.end()
})
