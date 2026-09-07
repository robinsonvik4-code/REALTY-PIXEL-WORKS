from pathlib import Path
import re

root = Path('dist')

# Keep the current Virtual Staging image order exactly as-is:
# furnished/staged image on LEFT, empty room on RIGHT.
pairs = [
    ('vs-living-before-1.jpg', 'vs-living-after-1.jpg'),
    ('vs-bedroom-before.jpg', 'vs-bedroom-after.jpg'),
    ('vs-living-before-2.jpg', 'vs-living-after-2.jpg'),
]

for name in ('services.html', 'portfolio.html'):
    path = root / name
    text = path.read_text(encoding='utf-8')

    # Preserve the previously requested image direction.
    for before, after in pairs:
        token = f'__TMP_{before}__'
        text = text.replace(before, token)
        text = text.replace(after, before)
        text = text.replace(token, after)

    # TEXT ONLY: left badge must say BEFORE, right badge must say AFTER.
    text = text.replace('<span>AFTER</span><span>BEFORE</span>', '<span>BEFORE</span><span>AFTER</span>')
    text = text.replace('<span>STAGED</span><span>EMPTY</span>', '<span>BEFORE</span><span>AFTER</span>')
    text = text.replace('<span>EMPTY</span><span>STAGED</span>', '<span>BEFORE</span><span>AFTER</span>')
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

# Reinforce slider direction visually without changing the requested image order.
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

# Force browsers to pick up this deployment instead of an older cached build.
sw_path = root / 'sw.js'
if sw_path.exists():
    sw = sw_path.read_text(encoding='utf-8')
    sw = re.sub(r'const CACHE\s*=\s*["\'][^"\']+["\'];', 'const CACHE = "realtypixelworks-vs-text-v15";', sw)
    sw_path.write_text(sw, encoding='utf-8')

print('Applied text-only Virtual Staging labels: BEFORE left, AFTER right.')
