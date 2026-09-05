# Test DGT — permiso B

App web (PWA) para practicar el test teórico de conducir del permiso B.
Funciona sin conexión una vez cargada y se puede instalar en el móvil.

## Modos

- **Examen oficial** — 30 preguntas, máx. 3 fallos, 30 minutos.
- **Test rápido** — 10 / 20 / 30 / 50 preguntas.
- **Repaso equilibrado** — 2 preguntas de cada uno de los 17 temas.
- **Por temas** — practica una categoría concreta.
- **Repasar falladas** — las que has fallado antes.

La casilla *Reparto equilibrado por temas* hace que el examen oficial y el test
rápido repartan las preguntas entre todos los temas, en vez de sacarlas al azar
del banco (donde «Señales» y «Normas generales» suman el 36 %).

## Explicaciones con IA

Opcional. Al fallar una pregunta puedes pedir una explicación a Anthropic o a
OpenAI. La clave se guarda **solo en tu navegador** (localStorage) y nunca sale
de tu dispositivo salvo hacia el proveedor que elijas.

## Banco de preguntas

2.903 preguntas. Fuente: [anki-carnet-conducir](https://github.com/donmerendolo/anki-carnet-conducir)
y material de la DGT. Uso personal y no comercial. No es el banco oficial
completo de la DGT.

## Desarrollo

Es HTML/CSS/JS sin dependencias ni compilación. Para probar en local hace falta
un servidor (el service worker no funciona con `file://`):

```
python -m http.server 8000
```

Al cambiar `index.html`, subir `VERSION` en `sw.js` o el service worker seguirá
sirviendo la versión cacheada.
