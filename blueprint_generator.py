import xml.etree.ElementTree as ET

ET.register_namespace('', 'http://www.w3.org/2000/svg')
tree = ET.parse('/Users/shishiracharya-fonenxt/.gemini/antigravity/scratch/portfolio/assets/world.svg')
root = tree.getroot()

# Blueprint aspect ratio - Wide landscape
# Original is roughly 0 to 710, 0 to 730
# The world is generally wider than it is tall in equirectangular. The Highcharts map is actually 710x730? No, highcharts viewBox is -5 -5 710 730, but the actual map contents are roughly 0 to 700 width, 0 to 450 height.
# Let's crop it tightly to the visual bounds of the world (removing Antarctica to make it sleeker).
root.set('viewBox', '0 20 700 360')
root.set('width', '100%')
root.set('height', '100%')

bg_group = None
for child in root:
    if child.tag.endswith('g') and child.get('id') == 'admin0':
        bg_group = child
        break

if bg_group is not None:
    # Completely remove thick strokes and solid fills
    bg_group.set('fill', 'none')
    bg_group.set('stroke', 'none')

# Clean out ALL descriptions and extra data for extreme minification
for path in root.findall('.//{http://www.w3.org/2000/svg}desc'):
    parent_map = {c: p for p in root.iter() for c in p}
    if path in parent_map:
        parent_map[path].remove(path)

# Make every country a sleek, continuous blueprint line
for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
    path.set('fill', '#ffffff')
    path.set('fill-opacity', '0.02') # Extremely subtle mesh fill
    path.set('stroke', '#ffffff')
    path.set('stroke-opacity', '0.15') # Sleek wireframe lines
    path.set('stroke-width', '0.4')
    # Remove any country-specific overrides
    if 'class' in path.attrib:
        del path.attrib['class']

# Optional: Add a subtle horizontal/vertical grid mesh natively in the SVG to make it 'Avionics/Radar' styled
grid_g = ET.Element('g')
grid_g.set('stroke', '#ffffff')
grid_g.set('stroke-opacity', '0.04') # Very faint
grid_g.set('stroke-width', '0.3')
for x in range(0, 710, 20):
    line = ET.SubElement(grid_g, 'line')
    line.set('x1', str(x))
    line.set('y1', '0')
    line.set('x2', str(x))
    line.set('y2', '500')
for y in range(0, 500, 20):
    line = ET.SubElement(grid_g, 'line')
    line.set('x1', '0')
    line.set('y1', str(y))
    line.set('x2', '710')
    line.set('y2', str(y))
root.insert(0, grid_g) # Insert grid behind the map

tree.write('/Users/shishiracharya-fonenxt/.gemini/antigravity/scratch/portfolio/assets/blueprint-map.svg')
print('Blueprint SVG Generated')
