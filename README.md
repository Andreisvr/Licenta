# Platformă pentru Gestionarea Temelor de Licență

codul sursa : https://github.com/Andreisvr/Licenta/tree/main/React

Această aplicație este formată din **3 componente** principale:

1. `frontend` – aplicația React (interfața)
2. `backend` – server Node.js care interacționează cu baza de date MySQL
3. `server_email` – server Node.js care trimite emailuri cu Nodemailer

---

## 📁 Structura proiectului

```
.
├── frontend/          # React (client)
├── backend/           # Node.js + MySQL (API)
└── server_email/      # Nodemailer (email sender)
```

---

## ✅ Cerințe preliminare

- Node.js și npm instalate: [https://nodejs.org/](https://nodejs.org/)
- MySQL sau XAMPP instalat (pentru baza de date locală)
- Cont Google pentru autentificare OAuth + parola de aplicație pentru email

---

## ⚙️ 1. Configurare `server_email`

### 📦 Instalare module:

```bash
cd server_email
npm install
```

### ⚙️ Variabile de mediu `.env`

Creează fișierul `.env` în directorul `server_email/` cu următorul conținut:

```
EMAIL_USER=adresa_ta@gmail.com
EMAIL_PASS=parola_aplicatiei_google
PORT=5002
```

> `EMAIL_PASS` se generează din Google Account > Security > App passwords

### ▶️ Rulare server email:

```console
npm start
```

---

## ⚙️ 2. Configurare `backend` (API)

### 📦 Instalare module:

```bash
cd backend
npm install
```

### ⚙️ Variabile de mediu `.env`

Creează fișierul `.env` în directorul `backend/` cu următorul conținut:

```env
PORT=8081
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_db_licenta
```

> Folosește `phpMyAdmin` din XAMPP pentru a crea baza de date `user_db_licenta`.

aici este linkul la fisierul cu toata structura bazei de date : 
https://github.com/Andreisvr/Licenta/blob/main/DB_Licenta.sql
### ▶️ Rulare backend:

```console
npm start
```

---

## ⚙️ 3. Configurare `frontend` (React)

### 📦 Instalare module:

```bash
cd frontend
npm install
```

### ⚙️ Variabile de mediu `.env`

Creează fișierul `.env` în directorul `frontend/`:

```env
REACT_APP_GOOGLE_CLIENT_ID=client_id_de_la_google.apps.googleusercontent.com
```

> Creează client ID din [Google Cloud Console](https://console.cloud.google.com/):  
> - Creează un proiect  
> - Configurează „OAuth consent screen”  
> - Creează OAuth Client ID pentru „Web”  
> - Adaugă `http://localhost:3000` la JavaScript Authorized Origins

### 🛠️ Legături către backend și server_email daca este necesar modificarea lor dar default sunt : 

În fișierele:
- `frontend/src/server_link.js`:
  ```js
  export const BACKEND_URL = 'http://localhost:8081';
  ```
- `frontend/src/email_link.js`:
  ```js
  export const SEND_URL = 'http://localhost:5002';
  ```

### ▶️ Rulare frontend:

```bash
npm start
```

---

## 🧪 Testare aplicație locală

1. Pornește serverul backend: `npm start`
2. Pornește serverul email: `npm start`
3. Pornește React: `npm start` în `frontend`

---

## 📦 Pachete esențiale utilizate

### 🔧 `server_email`

```js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
```

### 🔧 `backend`

```js
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
```

### 🎨 `frontend`

Folosește componente și iconuri din:
- `@mui/icons-material`
- `@mui/material`
- `@react-oauth/google`
- `jwt-decode`

---

