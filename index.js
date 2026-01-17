export const pubKeyCredParams = [
	{alg: -8, type: 'public-key'}, // EdDSA
	{alg: -7, type: 'public-key'}, // ES256
	{alg: -257, type: 'public-key'}, // RS256
]

export function creationOptionsToJSON(options) {
	// Partner function of PublicKeyCredential.parseCreationOptionsFromJSON(json)
	return {
		authenticatorSelection: {
			residentKey: options.authenticatorSelection?.residentKey,
		},
		challenge:
			options.challenge === undefined
				? undefined
				: encodeBase64Url(options.challenge),
		pubKeyCredParams: options.pubKeyCredParams,
		rp: options.rp,
		user: {
			name: options.user?.name,
			displayName: options.user?.displayName,
			id:
				options.user?.id === undefined
					? undefined
					: encodeBase64Url(options.user.id),
		},
	}
}

export function parseCreationOptionsFromJSON(json) {
	// Ponyfill of PublicKeyCredential.parseCreationOptionsFromJSON(json)
	return {
		authenticatorSelection: {
			residentKey: json.authenticatorSelection?.residentKey,
		},
		challenge:
			json.challenge === undefined
				? undefined
				: decodeBase64Url(json.challenge),
		pubKeyCredParams: json.pubKeyCredParams,
		rp: json.rp,
		user: {
			name: json.user?.name,
			displayName: json.user?.displayName,
			id:
				json.user?.id === undefined
					? undefined
					: decodeBase64Url(json.user.id),
		},
	}
}

export function requestOptionsToJSON(options) {
	// Partner function of PublicKeyCredential.parseRequestOptionsFromJSON(json)
	return {
		allowCredentials: options.allowCredentials?.map((c) => ({
			id: encodeBase64Url(c.id),
			transports: c.transports,
			type: c.type,
		})),
		challenge:
			options.challenge === undefined
				? undefined
				: encodeBase64Url(options.challenge),
		extensions: options.extensions,
		hints: options.hints,
		rpId: options.rpId,
		timeout: options.timeout,
		userVerification: options.userVerification,
	}
}

export function parseRequestOptionsFromJSON(json) {
	// Ponyfill of PublicKeyCredential.parseRequestOptionsFromJSON(json)
	return {
		allowCredentials: json.allowCredentials?.map((c) => ({
			id: decodeBase64Url(c.id),
			transports: c.transports,
			type: c.type,
		})),
		challenge:
			json.challenge === undefined
				? undefined
				: decodeBase64Url(json.challenge),
		extensions: json.extensions,
		hints: json.hints,
		rpId: json.rpId,
		timeout: json.timeout,
		userVerification: json.userVerification,
	}
}

export function assertionToJSON(credential) {
	const r = credential.response
	return {
		id: credential.id,
		rawId: encodeBase64Url(credential.rawId),
		response: {
			authenticatorData: encodeBase64Url(r.authenticatorData),
			clientDataJSON: encodeBase64Url(r.clientDataJSON),
			signature: encodeBase64Url(r.signature),
			userHandle: encodeBase64Url(r.userHandle),
		},
		authenticatorAttachment: credential.authenticatorAttachment,
		clientExtensionResults: {},
		type: credential.type,
	}
}

export function assertionFromJSON(json) {
	const r = json.response
	return {
		id: json.id,
		rawId: decodeBase64Url(json.rawId),
		response: {
			authenticatorData: decodeBase64Url(r.authenticatorData),
			clientDataJSON: decodeBase64Url(r.clientDataJSON),
			signature: decodeBase64Url(r.signature),
			userHandle: decodeBase64Url(r.userHandle),
		},
		authenticatorAttachment: json.authenticatorAttachment,
		clientExtensionResults: json.clientExtensionResults,
		type: json.type,
	}
}

export function attestationToJSON(credential) {
	const r = credential.response
	return {
		id: credential.id,
		rawId: encodeBase64Url(credential.rawId),
		response: {
			attestationObject: encodeBase64Url(r.attestationObject),
			clientDataJSON: encodeBase64Url(r.clientDataJSON),
			authenticatorData: encodeBase64Url(
				r.getAuthenticatorData?.() ?? r.authenticatorData,
			),
			publicKey: encodeBase64Url(r.getPublicKey?.() ?? r.publicKey),
			publicKeyAlgorithm:
				r.getPublicKeyAlgorithm?.() ?? r.publicKeyAlgorithm,
			transports: r.getTransports?.() ?? r.transports,
		},
		authenticatorAttachment: credential.authenticatorAttachment,
		clientExtensionResults: {},
		type: credential.type,
	}
}

export function attestationFromJSON(json) {
	const r = json.response
	return {
		id: json.id,
		rawId: decodeBase64Url(json.rawId),
		response: {
			attestationObject: decodeBase64Url(r.attestationObject),
			clientDataJSON: decodeBase64Url(r.clientDataJSON),
			authenticatorData: decodeBase64Url(r.authenticatorData),
			publicKey: decodeBase64Url(r.publicKey),
			publicKeyAlgorithm: r.publicKeyAlgorithm,
			transports: r.transports,
		},
		authenticatorAttachment: json.authenticatorAttachment,
		clientExtensionResults: json.clientExtensionResults,
		type: json.type,
	}
}

function encodeBase64Url(data) {
	const typed = data instanceof ArrayBuffer ? new Uint8Array(data) : data
	return typed.toBase64({alphabet: 'base64url', omitPadding: true})
}

function decodeBase64Url(encoded) {
	return Uint8Array.fromBase64(encoded, {
		alphabet: 'base64url',
	})
}
