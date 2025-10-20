# ⚠️ WORKFLOW IMPORTANTE - LEER SIEMPRE AL INICIO

## 🔴 REGLA DE BRANCHES - MUY IMPORTANTE

**NUNCA commitear directamente en `main` a menos que el usuario lo pida explícitamente.**

### Workflow correcto:

1. **Identificar el juego/feature** que estamos modificando
2. **Crear/cambiar a branch** con el nombre del juego o feature
3. **Hacer todos los commits en esa branch**
4. **Solo ir a main cuando el usuario lo pida**

### Ejemplos:

```bash
# Trabajando en Memory Matrix
git checkout -b memory-matrix-development
# ... hacer cambios ...
git add .
git commit -m "..."

# Trabajando en Master Sequence
git checkout -b master-sequence-development
# ... hacer cambios ...
git add .
git commit -m "..."

# Trabajando en Knight Quest
git checkout -b knight-quest-development
# ... hacer cambios ...
git add .
git commit -m "..."
```

### ❌ NO HACER:
```bash
# Estar en main y hacer commits directos
git checkout main
git add .
git commit -m "..."  # ❌ MAL!
```

### ✅ HACER:
```bash
# Crear/ir a branch específico
git checkout -b master-sequence-development
git add .
git commit -m "..."  # ✅ BIEN!

# Cuando usuario pida merge a main:
git checkout main
git merge master-sequence-development
git push origin main
```

## 📍 Ubicación de juegos

- Memory Matrix: `games/memory-matrix-v2/`
- Master Sequence: `games/master-sequence/`
- Knight Quest: `games/knight-quest/`
- Square Rush: `games/square-rush/`

## 🎯 Al inicio de cada sesión

1. Preguntar: "¿En qué juego/feature vamos a trabajar?"
2. Verificar branch actual: `git branch`
3. Si estoy en main, cambiar a branch del juego
4. Proceder con el trabajo

---

**Este documento existe para recordar trabajar en branches y no en main directamente.**
