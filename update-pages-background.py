#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para agregar fondo reticulado y efectos de piezas flotantes
a las páginas de contacto, acerca de, política de privacidad y artículos
"""

import re
import sys

# Configure UTF-8 encoding for Windows
if sys.version_info >= (3, 7):
    sys.stdout.reconfigure(encoding='utf-8')

def add_grid_background_and_effects(filepath):
    """Agrega grid background y efectos de piezas flotantes a una página"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has neonchess-effects.js
    if 'neonchess-effects.js' in content:
        print(f"✓ {filepath} ya tiene neonchess-effects.js")
    else:
        # Add neonchess-effects.js before </body>
        content = content.replace(
            '</body>',
            '''
    <!-- NeonChess Interactive Effects -->
    <script src="assets/js/neonchess-effects.js"></script>
</body>'''
        )
        print(f"✓ Agregado neonchess-effects.js a {filepath}")

    # Check if body has position: relative
    if '<body>' in content and 'neon-grid-bg' not in content:
        # Wrap body content with neon-container neon-grid-bg
        # Find <body> tag
        body_match = re.search(r'<body[^>]*>', content)
        if body_match:
            body_tag = body_match.group(0)
            # Find </body> closing tag
            body_close = content.rfind('</body>')

            if body_close > 0:
                # Get content between <body> and </body>
                start = body_match.end()
                body_content = content[start:body_close]

                # Replace body content with wrapped version
                new_body_content = f'''
    <div class="neon-container neon-grid-bg" style="min-height: 100vh;">
{body_content}
    </div>
'''
                content = content[:start] + new_body_content + content[body_close:]
                print(f"✓ Agregado neon-grid-bg wrapper a {filepath}")

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Actualizado: {filepath}\n")

# Files to update
files = [
    'C:\\Users\\clau\\Documents\\Multiajedrez 2025\\contact.html',
    'C:\\Users\\clau\\Documents\\Multiajedrez 2025\\about.html',
    'C:\\Users\\clau\\Documents\\Multiajedrez 2025\\privacy-policy.html',
    'C:\\Users\\clau\\Documents\\Multiajedrez 2025\\articles.html'
]

print("Agregando grid background y efectos a páginas...\n")

for filepath in files:
    try:
        add_grid_background_and_effects(filepath)
    except Exception as e:
        print(f"✗ Error en {filepath}: {e}\n")

print("\n✓ Proceso completado!")
