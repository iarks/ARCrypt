# Cryptic

![License](https://img.shields.io/badge/license-MIT-blue)

## Overview
Cryptic is a blazor webassembly based client side text encryption application. All encryptions are done client side. No data is retained or sent to any server.

## Why was this created?
I created this application for personal use to encrypt my TOTP backup codes before storing them in my password manager.

#### Why not use something like Cryptomator or Veracrypt?
I wanted an online first application similar to [hat.sh](https://hat.sh), but for simple plaintext.

#### Why not use other online encryption tools?
Could not find anything free and reliable, which is also online first. The ones I did find, I was not conforable sharing my passwords and secrets.

## Dependencies
- [libsodiumjs](#): The application uses the libsodium library for encryption

## Algorithms Used
This project uses the following algorithms from the libsodium library:
- `xchacha20-poly1305` for encryption
- `Argon2id` for key generation
