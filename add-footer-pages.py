#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para agregar footer a las páginas que les falta
"""

import re
import sys

# Configure UTF-8 encoding for Windows
if sys.version_info >= (3, 7):
    sys.stdout.reconfigure(encoding='utf-8')

FOOTER_HTML = '''
    <footer style="background: rgba(26, 0, 51, 0.9); padding: 2rem 1rem; margin-top: 4rem; border-top: 2px solid var(--neon-cyan); text-align: center; position: relative; z-index: 10;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; margin-bottom: 1.5rem;">
                <a href="index.html" style="color: var(--neon-cyan); text-decoration: none; font-weight: bold; transition: all 0.3s ease;">Inicio</a>
                <a href="articles.html" style="color: var(--neon-cyan); text-decoration: none; font-weight: bold; transition: all 0.3s ease;">Artículos</a>
                <a href="about.html" style="color: var(--neon-cyan); text-decoration: none; font-weight: bold; transition: all 0.3s ease;">Acerca de</a>
                <a href="contact.html" style="color: var(--neon-cyan); text-decoration: none; font-weight: bold; transition: all 0.3s ease;">Contacto</a>
                <a href="privacy-policy.html" style="color: var(--neon-cyan); text-decoration: none; font-weight: bold; transition: all 0.3s ease;">Política de Privacidad</a>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
                © 2025 ChessArcade. Todos los derechos reservados.
            </p>
            <p style="color: var(--neon-magenta); font-size: 0.85rem; margin-top: 0.5rem;">
                Hecho con 💜 para la comunidad de ajedrez
            </p>
        </div>
    </footer>
'''

def add_footer_if_missing(filepath):
    """Agrega footer si no existe"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has footer
    if '<footer' in content:
        print(f"✓ {filepath} ya tiene footer")
        return

    # Find closing div of neon-container and </body>
    # Add footer before closing </div> of neon-container

    # Find the last </div> before </body>
    body_close = content.rfind('</body>')
    if body_close == -1:
        print(f"✗ No se encontró </body> en {filepath}")
        return

    # Find last </div> before </body>
    last_div = content.rfind('</div>', 0, body_close)
    if last_div == -1:
        print(f"✗ No se encontró </div> antes de </body> en {filepath}")
        return

    # Insert footer before the last </div>
    content = content[:last_div] + FOOTER_HTML + '\n' + content[last_div:]

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Footer agregado a {filepath}")

# Files to update
files = [
    'C:\\Users\\clau\\Documents\\Multiajedrez 2025\\contact.html',
    'C:\\Users\\clau\\Documents\\Multiajedrez 2025\\about.html',
    'C:\\Users\\clau\\Documents\\Multiajedrez 2025\\privacy-policy.html'
]

print("Agregando footer a páginas...\n")

for filepath in files:
    try:
        add_footer_if_missing(filepath)
    except Exception as e:
        print(f"✗ Error en {filepath}: {e}")

print("\n✓ Proceso completado!")
