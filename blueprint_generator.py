import xml.etree.ElementTree as ET
import os

# Set working directory to script location
os.chdir(os.path.dirname(os.path.abspath(__file__)))

ET.register_namespace('', 'http://www.w3.org/2000/svg')
tree = ET.parse('assets/world.svg')
root = tree.getroot()

# Crop to the actual world bounds (exclude Antarctica for a sleeker look)
# Highcharts world map bounds are roughly 0-710 width, 0-450 height (no Antarctica)
root.set('viewBox', '0 30 710 380') 
root.set('width', '100%')
root.set('height', '100%')
root.set('preserveAspectRatio', 'xMidYMid meet')

# Clean out ALL highcharts specific data and stray elements
tags_to_remove = ['desc', 'title', 'circle', 'text', 'style', 'defs', 'metadata']

for parent in root.iter():
    to_remove = []
    for child in parent:
        # Check if the tag name contains any of our unwanted tags
        if any(tag in child.tag for tag in tags_to_remove):
            to_remove.append(child)
    for child in to_remove:
        parent.remove(child)

# Reset global styles for admin0 group if it exists
bg_group = None
for child in root:
    if child.tag.endswith('g') and child.get('id') == 'admin0':
        bg_group = child
        break

if bg_group is not None:
    bg_group.set('fill', 'none')
    bg_group.set('stroke', 'none')

# Make every country a sleek, continuous blueprint line
for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
    path.set('fill', '#ffffff')
    path.set('fill-opacity', '0.03')
    path.set('stroke', '#ffffff')
    path.set('stroke-opacity', '0.15')
    path.set('stroke-width', '0.4')
    
# Grid mesh
grid_g = ET.Element('g')
grid_g.set('stroke', '#ffffff')
grid_g.set('stroke-opacity', '0.05')
grid_g.set('stroke-width', '0.2')
for x in range(0, 720, 40): # Larger grid
    line = ET.SubElement(grid_g, 'line')
    line.set('x1', str(x))
    line.set('y1', '0')
    line.set('x2', str(x))
    line.set('y2', '500')
for y in range(0, 500, 40):
    line = ET.SubElement(grid_g, 'line')
    line.set('x1', '0')
    line.set('y1', str(y))
    line.set('x2', '720')
    line.set('y2', str(y))
root.insert(0, grid_g)

# Highlighting visited countries (these IDs exist in flighty-map-custom)
visited = ['np', 'in', 'sg', 'ph']
for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
    path_id = path.get('id')
    if path_id in visited:
        path.set('fill', '#cd4c1b') # Accent orange
        path.set('fill-opacity', '0.7')
        path.set('stroke', '#ff7b4d')
        path.set('stroke-opacity', '1')
        path.set('stroke-width', '0.8')

tree.write('assets/blueprint-map.svg')
print('Blueprint SVG Generated with clean source.')


