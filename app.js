//const { response } = require('express');
const inicioDbeug = require('debug')('app:inicio');
const express = require('express');
const config = require('config');
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


console.log('Aplicacion: ' + config.get('nombre'));
console.log('BDD Server: ' + config.get('configDB.host'));

app.use(morgan('tiny'));

const usuarios = [
    { id: 1, nombre: 'PIRI' },
    { id: 2, nombre: 'USER2' },
    { id: 3, nombre: 'USER3' },
    { id: 4, nombre: 'USER4' }
];

app.get('/', (req, res) => {
    console.log('Paso por aqui');
    res.send('Hola Mundo desde Express');
    console.log('Paso por aqui2');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({

        nombre: Joi.string().min(3).max(30).required()
    });

    const { error, value } = schema.validate({ nombre: req.body.nombre });

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };

        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }


});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) {
        res.status(404).send('El usuario no se encuentra');
    } else {
        res.send(usuario);
    }

});

app.put('/api/usuarios/:id', (req, res) => {

    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) {
        res.status(404).send('No se encontro usuario');
    }

    const schema = Joi.object({

        nombre: Joi.string().min(3).max(30).required()
    });

    const { error, value } = schema.validate({ nombre: req.body.nombre });

    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;

    res.send(usuario);

});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Estan utilizando el puerto: ${port}`);
})