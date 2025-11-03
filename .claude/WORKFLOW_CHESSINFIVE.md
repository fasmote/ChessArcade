# ChessInFive Workflow - Reglas Importantes

## 🚫 REGLA CRÍTICA: NO MERGE SIN AUTORIZACIÓN

**IMPORTANTE:** NUNCA hacer merge con la rama principal sin que el usuario lo pida explícitamente.

### Reglas de Branching

1. **Siempre trabajar en la rama del juego actual**
   - ChessInFive: `feature/chessinfive-implementation`
   - Otros juegos: `feature/[nombre-juego]`

2. **NO merge automático**
   - Solo hacer merge cuando el usuario diga explícitamente: "haz merge", "mergea", "merge to master", etc.
   - Si hay dudas, PREGUNTAR antes de mergear

3. **Commits frecuentes**
   - Hacer commits y push regularmente
   - Mantener la rama actualizada en GitHub
   - Documentar todos los cambios en BUGFIXES.md

### Flujo de Trabajo ChessInFive

```
feature/chessinfive-implementation
  ↓ (trabajo continuo)
  ↓ commits frecuentes
  ↓ push a GitHub
  ↓
  ↓ (SOLO cuando usuario lo pida explícitamente)
  ↓
master (merge)
```

### Comandos Git

```bash
# Trabajo normal (siempre):
git add games/chessinfive/
git commit -m "..."
git push origin feature/chessinfive-implementation

# Merge (SOLO cuando usuario lo pida):
git checkout master
git merge feature/chessinfive-implementation
git push origin master
```

### Checklist Pre-Merge (cuando usuario lo pida)

- [ ] Todos los bugs documentados en BUGFIXES.md
- [ ] Testing completo (desktop y mobile)
- [ ] Usuario confirmó que todo funciona
- [ ] Usuario dijo explícitamente "haz merge" o similar

---

**Última actualización:** 30 de Octubre 2025
**Autor:** Claude Code
