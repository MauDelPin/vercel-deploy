# 🚀 GUÍA DEPLOYMENT - VERCEL + HOSTINGER

## 📋 ESTRUCTURA DEL PROYECTO

```
real-estate-evaluador/
├── api/
│   └── server.js              # Backend Node.js (Vercel Serverless)
├── public/
│   └── index.html             # App frontend
├── vercel.json                # Configuración Vercel
├── package.json               # Dependencias
└── README.md
```

---

## ⚡ PASO 1: PREPARAR VERCEL

### 1.1 Crear cuenta en Vercel (GRATIS)

1. Ve a https://vercel.com
2. Regístrate con **GitHub, GitLab o correo**
3. Confirma tu email

### 1.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `real-estate-evaluador`
3. Descripción: `Sistema de evaluación de propiedades`
4. **Público** (para que Vercel lo detecte)
5. Crea el repositorio

### 1.3 Subir el código a GitHub

**Opción A: Desde Terminal (recomendado)**

```bash
# En tu carpeta del proyecto
git init
git add .
git commit -m "Inicial: Evaluador de propiedades"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/real-estate-evaluador.git
git push -u origin main
```

**Opción B: Subir archivos manualmente**

1. En GitHub, haz clic en "Upload files"
2. Sube: `api/`, `public/`, `vercel.json`, `package.json`
3. Commit changes

---

## ⚡ PASO 2: DESPLEGAR EN VERCEL

### 2.1 Conectar Vercel con GitHub

1. Ve a https://vercel.com/dashboard
2. Haz clic en **"Import Project"**
3. Selecciona **"Import Git Repository"**
4. Busca `real-estate-evaluador`
5. Haz clic en **"Import"**

### 2.2 Configurar Variables de Ambiente

En Vercel, ve a **Settings** → **Environment Variables**

Agrega:
```
API_URL = https://tu-proyecto.vercel.app
NODE_ENV = production
```

### 2.3 Deploy

Haz clic en **"Deploy"**

**Espera 2-3 minutos** y ¡listo! 🎉

Tu app estará en: `https://tu-proyecto.vercel.app`

---

## 🌐 PASO 3: CONECTAR CON TU DOMINIO (mcsolcon.com)

### Opción A: Subdominio app.mcsolcon.com (RECOMENDADO)

#### En Vercel:

1. Ve a tu proyecto → **Settings** → **Domains**
2. Agregar dominio: `app.mcsolcon.com`
3. Vercel te mostrará los **nameservers** o **CNAME**

#### En Hostinger:

1. Ve a **Dominios** → **mcsolcon.com** → **Gestionar DNS**
2. Agrega un registro **CNAME**:
   - **Nombre:** `app`
   - **Valor:** Lo que Vercel te indicó (ej: `cname.vercel-dns.com`)
3. Espera 5-10 minutos para que propague

**Resultado:** Tu app en `app.mcsolcon.com` 🎉

### Opción B: Subcarpeta mcsolcon.com/evaluador

1. Descarga la app desde Vercel
2. Sube a tu Hostinger en carpeta `/evaluador`
3. Acceso: `mcsolcon.com/evaluador`

---

## 🎯 PASO 4: USAR LA APP

### Acceder

**Si usaste subdominio:**
```
https://app.mcsolcon.com
```

**Si usaste subcarpeta:**
```
https://mcsolcon.com/evaluador
```

### Flujo de uso

1. **Abre la app**
2. **Completa datos** (cliente, ubicación, precio, etc.)
3. **Califica ambientes** (1-5 estrellas)
4. **Agrega nota global** con justificación
5. **Genera PDF** (descarga a tu PC)
6. **Genera Excel** (descarga a tu PC)
7. **Haz clic "Guardar en Servidor"** (opcional, se guarda en Vercel)

---

## 💾 ALMACENAMIENTO EN VERCEL

### ⚠️ IMPORTANTE

Vercel usa almacenamiento temporal (`/tmp`). Los archivos se pierden después de cada deployment o después de 15 minutos sin usar.

### Soluciones:

**Opción 1: Usar los PDFs/Excels descargados (RECOMENDADO)**
- ✅ Descargas los archivos a tu PC
- ✅ Los organizas en carpetas por cliente
- ✅ Control total
- ❌ Manual

**Opción 2: Agregar almacenamiento (Supabase o similar)**
- Gratis hasta 5GB
- Guarda archivos en la nube
- Más automático

**Opción 3: Base de datos (PostgreSQL)**
- Guarda metadatos en BD
- Los archivos se descargan

---

## 🔄 ACTUALIZAR LA APP

Después de cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel **redeploya automáticamente** ✨

---

## 🆘 TROUBLESHOOTING

### Error: "Module not found"
```bash
npm install
git add package-lock.json
git commit -m "Actualizar dependencias"
git push
```

### Error: CORS bloqueado
Verifica que en `api/server.js` está configurado:
```javascript
origin: ['https://app.mcsolcon.com', 'http://localhost:3000']
```

### La app no carga
- Abre **DevTools** (F12)
- Ve a **Console**
- Busca errores rojos
- Verifica que `API_URL` sea correcto

### Los archivos guardados desaparecen
Normal en Vercel. Descarga los PDFs/Excels a tu PC.

---

## 📊 FLUJO FINAL

```
Usuario abre app.mcsolcon.com
        ↓
Ingresa datos de propiedad
        ↓
Califica ambientes
        ↓
Genera PDF/Excel (descarga a PC)
        ↓
Haz clic "Guardar en Servidor"
        ↓
Se almacena en Vercel (temporal)
        ↓
Puedes descargar carpeta completa del cliente
```

---

## 📞 CONTACTO

- **Vercel:** https://vercel.com/docs
- **Hostinger:** https://support.hostinger.com
- **GitHub:** https://docs.github.com

---

**¡Tu app está lista en Vercel! 🚀**

Accede a: **https://app.mcsolcon.com**

(O reemplaza con tu subdominio/subcarpeta configurada)
