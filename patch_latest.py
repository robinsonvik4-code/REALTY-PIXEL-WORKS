from pathlib import Path
import re

root = Path('dist')

# Virtual Staging: furnished/staged image on LEFT, empty room on RIGHT.
pairs = [
    ('vs-living-before-1.jpg', 'vs-living-after-1.jpg'),
    ('vs-bedroom-before.jpg', 'vs-bedroom-after.jpg'),
    ('vs-living-before-2.jpg', 'vs-living-after-2.jpg'),
]

for name in ('services.html', 'portfolio.html'):
    path = root / name
    text = path.read_text(encoding='utf-8')

    for before, after in pairs:
        token = f'__TMP_{before}__'
        text = text.replace(before, token)
        text = text.replace(after, before)
        text = text.replace(token, after)

    # Explicit labels avoid Before/After confusion when staged is intentionally on the left.
    text = text.replace('<span>BEFORE</span><span>AFTER</span>', '<span>STAGED</span><span>EMPTY</span>')
    path.write_text(text, encoding='utf-8')

# Make every regular image inside <main> openable. Slider images still use their full-screen button.
js_path = root / 'assets/js/script.js'
js = js_path.read_text(encoding='utf-8')
js = re.sub(
    r'const selector = \[.*?\]\.join\(","\);',
    'const selector = "main img";',
    js,
    count=1,
    flags=re.S,
)
js_path.write_text(js, encoding='utf-8')

# Reinforce slider direction visually.
css_path = root / 'assets/css/style.css'
css = css_path.read_text(encoding='utf-8')
css += r'''\n/* Latest Virtual Staging direction */
#virtual-staging .ba > img:first-of-type,
.staging-ba-item .ba > img:first-of-type{position:relative;z-index:1}
#virtual-staging .ba > img.after,
.staging-ba-item .ba > img.after{position:absolute;inset:0;z-index:2;clip-path:inset(0 0 0 50%)}
#virtual-staging .labels span:first-child,
.staging-ba-item .labels span:first-child{margin-right:auto}
#virtual-staging .labels span:last-child,
.staging-ba-item .labels span:last-child{margin-left:auto}
main img.zoomable-img{cursor:zoom-in}
'''
css_path.write_text(css, encoding='utf-8')

# Force browsers to pick up this deployment instead of an older cached JS/CSS build.
sw_path = root / 'sw.js'
if sw_path.exists():
    sw = sw_path.read_text(encoding='utf-8')
    sw = re.sub(r'const CACHE\s*=\s*["\'][^"\']+["\'];', 'const CACHE = "realtypixelworks-staged-left-v13";', sw)
    sw_path.write_text(sw, encoding='utf-8')

print('Applied latest RealtyPixelWorks Virtual Staging + image viewer fixes.')
