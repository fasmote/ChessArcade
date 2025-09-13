# 🤝 Guía de Contribución - ChessArcade

¡Gracias por tu interés en contribuir a ChessArcade! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Características](#sugerir-características)

## 📜 Código de Conducta

Este proyecto adhiere al [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Al participar, te comprometes a mantener un ambiente acogedor y respetuoso.

## 🎯 ¿Cómo puedo contribuir?

### 🐛 Reportar Bugs
- Usa la [plantilla de bug report](.github/ISSUE_TEMPLATE/bug_report.md)
- Incluye pasos para reproducir el error
- Proporciona screenshots si es posible
- Especifica tu navegador y dispositivo

### ✨ Sugerir Características
- Usa la [plantilla de feature request](.github/ISSUE_TEMPLATE/feature_request.md)
- Explica el problema que resuelve tu sugerencia
- Describe la solución propuesta en detalle
- Considera implementaciones alternativas

### 🔧 Mejorar Código
- Corregir bugs reportados
- Implementar características aprobadas
- Mejorar documentación
- Optimizar performance
- Agregar tests

### 📚 Mejorar Documentación
- Corregir typos y errores gramaticales
- Clarificar instrucciones confusas
- Agregar ejemplos de uso
- Traducir contenido a otros idiomas

## 🛠️ Configuración del Entorno

### Prerrequisitos
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- Editor de código (recomendado: VS Code)
- Git instalado
- Node.js 16+ (opcional, para herramientas de desarrollo)

### Setup Local
```bash
# 1. Fork el repositorio en GitHub
# 2. Clona tu fork
git clone https://github.com/TU_USERNAME/chessarcade.git
cd chessarcade

# 3. Configura upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/chessarcade.git

# 4. Instala herramientas de desarrollo (opcional)
npm install -g live-server prettier eslint

# 5. Ejecuta servidor local
live-server --port=3000
```

### Estructura del Proyecto
```
chessarcade/
├── index.html              # Aplicación principal
├── assets/
│   ├── icons/              # Iconos y favicon
│   ├── sounds/             # Efectos de sonido
│   └── images/             # Imágenes del juego
├── docs/                   # Documentación
├── tests/                  # Tests (futuro)
└── .github/                # Templates y workflows
```

## 🔄 Proceso de Desarrollo

### 1. Crear una Rama
```bash
# Asegúrate de estar en main y actualizado
git checkout main
git pull upstream main

# Crea una nueva rama
git checkout -b feature/nombre-caracteristica
# o
git checkout -b fix/descripcion-bug
```

### 2. Hacer Cambios
- Sigue las [convenciones de código](#estándares-de-código)
- Haz commits frecuentes con mensajes descriptivos
- Ejecuta tests locales antes de subir

### 3. Commit Guidelines
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato: tipo(scope): descripción

# Ejemplos:
git commit -m "feat(knight-quest): add 10x10 super board size"
git commit -m "fix(ui): resolve mobile logo overflow issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(buttons): improve hover effects"
git commit -m "refactor(game-state): simplify move validation logic"
```

**Tipos permitidos:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Solo documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactoring (ni bug ni feature)
- `test`: Agregar o corregir tests
- `chore`: Tareas de mantenimiento

## 📏 Estándares de Código

### JavaScript
```javascript
// ✅ Bueno
function calculatePossibleMoves(position) {
    const moves = [];
    // Clear, descriptive variable names
    knightMoves.forEach(([deltaRow, deltaCol]) => {
        const newPosition = position + deltaRow * boardSize + deltaCol;
        if (isValidPosition(newPosition)) {
            moves.push(newPosition);
        }
    });
    return moves;
}

// ❌ Malo
function calc(p) {
    let m = [];
    for (let i = 0; i < km.length; i++) {
        let np = p + km[i][0] * bs + km[i][1];
        if (valid(np)) m.push(np);
    }
    return m;
}
```

### CSS
```css
/* ✅ Bueno - Mobile First */
.btn {
    /* Base styles for mobile */
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    border-radius: 20px;
    transition: all 0.3s ease;
}

@media (min-width: 768px) {
    .btn {
        /* Desktop enhancements */
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
    }
}

/* ❌ Malo - Desktop First */
.btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
}

@media (max-width: 767px) {
    .btn {
        padding: 0.7rem 1rem;
        font-size: 0.9rem;
    }
}
```

### HTML
```html
<!-- ✅ Bueno - Semántico y accesible -->
<button 
    class="btn btn-primary" 
    onclick="makeMove(index)"
    aria-label="Move knight to position ${index}"
    role="button"
    tabindex="0">
    NUEVO JUEGO
</button>

<!-- ❌ Malo -->
<div onclick="makeMove(index)" class="btn">
    NUEVO JUEGO
</div>
```

### Principios Generales
- **Mobile First**: Diseñar para móvil primero
- **Accesibilidad**: ARIA labels, keyboard navigation
- **Performance**: Lazy loading, optimización de imágenes
- **SEO**: Meta tags semánticos
- **Vanilla JS**: Sin dependencias externas innecesarias

## 🔍 Proceso de Pull Request

### Antes de Crear el PR
```bash
# 1. Actualiza tu rama con main
git checkout main
git pull upstream main
git checkout feature/tu-rama
git rebase main

# 2. Verifica que todo funciona
# - Abre index.html en navegador
# - Prueba funcionalidad en móvil y desktop
# - Verifica que no hay errores en console

# 3. Push a tu fork
git push origin feature/tu-rama
```

### Crear el Pull Request
1. Ve a GitHub y crea el PR desde tu rama
2. Usa la [plantilla de PR](.github/pull_request_template.md)
3. Llena todos los campos requeridos
4. Asigna reviewers si conoces a alguien específico
5. Añade labels apropiados

### Checklist de PR
- [ ] **Código tested**: Funciona en Chrome, Firefox, Safari
- [ ] **Mobile responsive**: Probado en dispositivos móviles
- [ ] **No console errors**: Sin errores en DevTools
- [ ] **Commits clean**: Mensajes descriptivos y convencionales
- [ ] **Documentación actualizada**: README, CHANGELOG si aplica
- [ ] **Screenshots incluidos**: Para cambios visuales
- [ ] **Performance**: No degradación notable
- [ ] **Accesibilidad**: Keyboard navigation funciona

## 🐛 Reportar Bugs

### Información Requerida
- **Descripción clara** del problema
- **Pasos para reproducir** el error
- **Comportamiento esperado** vs actual
- **Screenshots/videos** si es visual
- **Información del entorno**:
  - Navegador y versión
  - Dispositivo y OS
  - Tamaño de pantalla
  - URL específica

### Template de Bug Report
```markdown
**Describe el bug**
Una descripción clara y concisa del bug.

**Para Reproducir**
1. Ve a '...'
2. Haz click en '....'
3. Desplázate hacia '....'
4. Ve el error

**Comportamiento Esperado**
Descripción clara de lo que esperabas que pasara.

**Screenshots**
Si aplica, agrega screenshots para ayudar a explicar el problema.

**Información del Entorno:**
- Navegador: [ej. Chrome 96, Safari 15]
- Dispositivo: [ej. iPhone 12, Samsung Galaxy S21, Desktop]
- OS: [ej. iOS 15, Android 11, Windows 10]
- Tamaño de pantalla: [ej. 375x667, 1920x1080]

**Contexto Adicional**
Agrega cualquier otro contexto sobre el problema aquí.
```

## 💡 Sugerir Características

### Antes de Sugerir
1. **Busca issues existentes** - Tu idea podría ya estar propuesta
2. **Consulta el [ROADMAP](ROADMAP.md)** - Podría estar ya planificada
3. **Considera el scope** - ¿Encaja con la visión del proyecto?

### Template de Feature Request
```markdown
**¿Tu feature request está relacionado a un problema?**
Una descripción clara y concisa del problema. Ej. Me molesta cuando [...]

**Describe la solución que te gustaría**
Una descripción clara y concisa de lo que quieres que pase.

**Describe alternativas que has considerado**
Una descripción clara y concisa de soluciones alternativas o características que has considerado.

**Contexto adicional**
Agrega cualquier otro contexto o screenshots sobre el feature request aquí.

**Impacto estimado**
- ¿Cuántos usuarios se beneficiarían?
- ¿Qué tan frecuentemente se usaría?
- ¿Es crítico para algún workflow específico?
```

## 🏷️ Labels y Categorización

### Priority Labels
- `priority/critical` - Bugs que rompen funcionalidad principal
- `priority/high` - Características importantes o bugs significativos
- `priority/medium` - Mejoras útiles
- `priority/low` - Nice-to-have

### Type Labels
- `type/bug` - Algo no funciona
- `type/feature` - Nueva funcionalidad
- `type/enhancement` - Mejora a funcionalidad existente
- `type/documentation` - Mejoras a documentación
- `type/refactor` - Mejoras de código sin cambio funcional

### Area Labels
- `area/ui` - Interface de usuario
- `area/game-logic` - Lógica de juegos
- `area/performance` - Optimizaciones
- `area/mobile` - Específico de dispositivos móviles
- `area/accessibility` - Mejoras de accesibilidad

### Status Labels
- `status/needs-review` - Listo para review
- `status/in-progress` - En desarrollo activo
- `status/blocked` - Bloqueado por dependencias
- `status/help-wanted` - Busca contribuidores

## 🎉 Reconocimiento

### Contributors Wall
Todos los contribuidores son reconocidos en nuestro [Contributors Wall](CONTRIBUTORS.md).

### Tipos de Contribución
Reconocemos todas las formas de contribución:
- 💻 Código
- 🐛 Bug reports
- 💡 Ideas y sugerencias
- 📖 Documentación
- 🎨 Diseño
- 🌍 Traducción
- 📢 Promoción
- 🤔 Feedback de usuario

## 📞 Obtener Ayuda

### Canales de Comunicación
- **GitHub Issues**: Para bugs y feature requests
- **GitHub Discussions**: Para preguntas generales
- **Email**: contacto@chessarcade.com.ar para temas sensibles

### FAQ para Contribuidores

**P: ¿Puedo trabajar en cualquier issue abierto?**
R: ¡Sí! Pero comenta primero en el issue para evitar trabajo duplicado.

**P: ¿Cuánto tiempo toma el review de un PR?**
R: Generalmente 2-5 días hábiles. PRs grandes pueden tomar más tiempo.

**P: ¿Puedo proponer cambios grandes a la arquitectura?**
R: ¡Por supuesto! Pero abre un issue primero para discutir el approach.

**P: ¿Necesito conocimiento de ajedrez para contribuir?**
R: No es necesario para la mayoría de contribuciones. El código es auto-explicativo.

---

## 🙏 Gracias

Cada contribución, sin importar su tamaño, hace que ChessArcade sea mejor. ¡Gracias por ser parte de nuestra comunidad!

---

*Esta guía está inspirada en las mejores prácticas de proyectos open source exitosos y se actualiza regularmente basada en feedback de la comunidad.*

**Última actualización**: Septiembre 11, 2025