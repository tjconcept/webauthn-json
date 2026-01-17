# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- Make tests run by pinning esm.sh version
- Remove an unused import

## 1.1.0 - 2024-10-22

### Added

- `attestationToJSON` supports the output of `attestationFromJSON`

## 1.0.0 - 2024-10-22

### Added

- `creationOptionsToJSON(options)`
- `parseCreationOptionsFromJSON(json)`
- `requestOptionsToJSON(options)`
- `parseRequestOptionsFromJSON(json)`
- `assertionToJSON(credential)`
- `assertionFromJSON(json)`
- `attestationToJSON(credential)`
- `attestationFromJSON(json)`
- `pubKeyCredParams`
