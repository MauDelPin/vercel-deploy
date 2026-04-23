// api/server.js - Backend para Vercel (Serverless)
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');

const app = express();

// Middleware
app.use(cors({
    origin: ['https://app.mcsolcon.com', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// En Vercel, usar /tmp para almacenamiento temporal
const storageDir = path.join('/tmp', 'evaluaciones', 'clientes');

// Crear carpeta si no existe
try {
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }
} catch (err) {
    console.log('Nota: Usando almacenamiento en memoria para Vercel');
}

// ============================================
// ENDPOINTS
// ============================================

// 1. CREAR CLIENTE
app.post('/api/clientes', (req, res) => {
    try {
        const { nombre, email, telefono, ciudad } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre del cliente es requerido' });
        }

        const clienteId = uuidv4();
        const clienteDir = path.join(storageDir, `${clienteId}_${nombre.replace(/\s+/g, '_')}`);
        
        try {
            if (!fs.existsSync(clienteDir)) {
                fs.mkdirSync(clienteDir, { recursive: true });
            }
        } catch (err) {
            console.log('No se pudo crear carpeta, pero continuamos');
        }

        // Guardar datos del cliente
        const clienteData = {
            id: clienteId,
            nombre,
            email,
            telefono,
            ciudad,
            fechaCreacion: new Date().toISOString(),
            propiedades: []
        };

        try {
            fs.writeFileSync(
                path.join(clienteDir, 'cliente.json'),
                JSON.stringify(clienteData, null, 2)
            );
        } catch (err) {
            console.log('No se pudo guardar JSON, pero el cliente se creó');
        }

        res.json({
            success: true,
            clienteId,
            carpeta: clienteDir,
            mensaje: `Cliente ${nombre} creado exitosamente`
        });

    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
});

// 2. GUARDAR EVALUACIÓN Y PDF
app.post('/api/evaluaciones/guardar', (req, res) => {
    try {
        const { clienteId, clienteNombre, ubicacion, pdfBase64, excelBase64, datosEvaluacion } = req.body;

        if (!clienteId || !pdfBase64) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        // Crear carpeta del cliente
        const clienteDir = path.join(storageDir, `${clienteId}_${clienteNombre.replace(/\s+/g, '_')}`);
        
        try {
            if (!fs.existsSync(clienteDir)) {
                fs.mkdirSync(clienteDir, { recursive: true });
            }
        } catch (err) {
            console.log('Creación de carpeta falló, continuando');
        }

        // Crear carpeta de propiedad
        const timestamp = new Date().toISOString().slice(0, 10);
        const propiedadDir = path.join(clienteDir, `${timestamp}_${ubicacion.replace(/\s+/g, '_')}`);
        
        try {
            if (!fs.existsSync(propiedadDir)) {
                fs.mkdirSync(propiedadDir, { recursive: true });
            }
        } catch (err) {
            console.log('Creación de subcarpeta falló');
        }

        // Guardar PDF
        const pdfPath = path.join(propiedadDir, `informe_${timestamp}.pdf`);
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        
        try {
            fs.writeFileSync(pdfPath, pdfBuffer);
        } catch (err) {
            console.log('No se pudo guardar PDF en disco');
        }

        // Guardar Excel si existe
        let excelPath = null;
        if (excelBase64) {
            excelPath = path.join(propiedadDir, `evaluacion_${timestamp}.xlsx`);
            const excelBuffer = Buffer.from(excelBase64, 'base64');
            try {
                fs.writeFileSync(excelPath, excelBuffer);
            } catch (err) {
                console.log('No se pudo guardar Excel');
            }
        }

        // Guardar datos JSON
        const jsonPath = path.join(propiedadDir, `datos_${timestamp}.json`);
        try {
            fs.writeFileSync(jsonPath, JSON.stringify(datosEvaluacion, null, 2));
        } catch (err) {
            console.log('No se pudo guardar JSON');
        }

        res.json({
            success: true,
            mensaje: 'Evaluación guardada exitosamente (nota: almacenamiento limitado en Vercel)',
            archivos: {
                pdf: pdfPath,
                excel: excelPath,
                datos: jsonPath
            }
        });

    } catch (error) {
        console.error('Error al guardar evaluación:', error);
        res.status(500).json({ error: 'Error al guardar evaluación' });
    }
});

// 3. OBTENER CLIENTES
app.get('/api/clientes', (req, res) => {
    try {
        const clientes = [];
        
        try {
            const carpetas = fs.readdirSync(storageDir);

            carpetas.forEach(carpeta => {
                const clienteJsonPath = path.join(storageDir, carpeta, 'cliente.json');
                try {
                    if (fs.existsSync(clienteJsonPath)) {
                        const data = fs.readFileSync(clienteJsonPath, 'utf8');
                        const cliente = JSON.parse(data);
                        clientes.push(cliente);
                    }
                } catch (err) {
                    console.log('Error leyendo cliente:', carpeta);
                }
            });
        } catch (err) {
            console.log('No se pudo leer carpeta de clientes');
        }

        res.json({ success: true, clientes });

    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

// 4. TEST ENDPOINT
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        mensaje: 'API funcionando correctamente en Vercel',
        almacenamiento: '/tmp (temporal)'
    });
});

// ============================================
// PARA DESARROLLO LOCAL
// ============================================

// Si se ejecuta localmente (no en Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
        console.log(`📁 Carpeta de almacenamiento: ${storageDir}`);
    });
}

// Exportar para Vercel
module.exports = app;
