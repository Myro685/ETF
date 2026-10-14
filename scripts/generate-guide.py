"""Build the downloadable guide from the same fund data as the React page.

Requires reportlab; use --font-dir for a directory with arial.ttf/arialbd.ttf.
The PDF is versioned so an existing email keeps referring to the same edition.
"""
import argparse
import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--font-dir', type=Path, default=Path('C:/Windows/Fonts'))
args = parser.parse_args()
pdfmetrics.registerFont(TTFont('Guide', str(args.font_dir / 'arial.ttf')))
pdfmetrics.registerFont(TTFont('GuideBold', str(args.font_dir / 'arialbd.ttf')))
pdfmetrics.registerFontFamily('Guide', normal='Guide', bold='GuideBold')
data = json.loads((ROOT / 'src/data/etfs.json').read_text(encoding='utf-8-sig'))
funds = data['funds']
INK = colors.HexColor('#202e27')
GREEN = colors.HexColor('#285a43')
PALE = colors.HexColor('#eef3ee')
MUTED = colors.HexColor('#52635a')
LINE = colors.HexColor('#d2ddd4')
styles = {
    'title': ParagraphStyle('title', fontName='GuideBold', fontSize=28, leading=33, textColor=INK, spaceAfter=17),
    'heading': ParagraphStyle('heading', fontName='GuideBold', fontSize=16, leading=21, textColor=GREEN, spaceBefore=17, spaceAfter=9),
    'body': ParagraphStyle('body', fontName='Guide', fontSize=10.5, leading=16, textColor=INK, spaceAfter=9),
    'small': ParagraphStyle('small', fontName='Guide', fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=7),
    'cell': ParagraphStyle('cell', fontName='Guide', fontSize=10, leading=14, textColor=INK),
}
story = []
def p(text, style='body'):
    return Paragraph(text.replace('S&P', 'S&amp;P').replace('[2, 3]', '[2,&nbsp;3]'), styles[style])
def add(text, style='body'):
    story.append(p(text, style))
def heading(text):
    add(text, 'heading')
def table(rows, widths):
    t = Table([[p(str(cell), 'cell') for cell in row] for row in rows], colWidths=widths, hAlign=TA_LEFT)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PALE), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 12), ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 12), ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LINEBELOW', (0, 0), (-1, -1), .5, LINE),
    ]))
    story.extend([t, Spacer(1, 12)])
def section(number, title):
    if story:
        story.append(PageBreak())
    add(f'PRŮVODCE / {number:02d}', 'small')
    add(title, 'title')

section(1, 'Než koupíte ETF,<br/>poznejte rozdíly.')
add('Průvodce porovnáním ETF před prvním nákupem. Tři přístupy k americkým akciím, příklad nákladů a checklist pro rozhovor s brokerem.')
table([['<b>Fond</b>', '<b>Co porovnáváme</b>', '<b>Náklad za rok</b>']] + [
    [f'<b>{f["ticker"]}</b>', escape(f['focusCs']), f'{f["expenseRatioPercent"]:.2f} %'.replace('.', ',')]
    for f in funds
], [65, 320, 110])
for ticker, title, text in [
    ('VOO', 'Velké společnosti', 'Sleduje S&P 500. Při porovnání s VTI se ptejte hlavně na šíři pokrytí, ne jen na stejný poplatek. [1]'),
    ('VTI', 'Širší americký trh', 'Zahrnuje také menší společnosti. Od 29. 7. 2026 nese název Vanguard Morningstar Total Stock Market ETF a sleduje Morningstar US Total Market Index. Starší dokumenty mohou používat původní názvy. [2, 3]'),
    ('SCHD', 'Dividendový výběr', 'Sleduje Dow Jones U.S. Dividend 100 Index a výběr zohledňuje fundamentální ukazatele. Dividendový příjem sám o sobě nezaručuje vyšší celkový výnos ani menší riziko. [4]'),
]:
    story.append(KeepTogether([p(f'{ticker} / {title}', 'heading'), p(text)]))
add('Všechny tři fondy mají listing na NYSE Arca. Jde o jinou burzu než NYSE main market. Toto porovnání vysvětluje strategie; neurčuje nejlepší fond pro vaši situaci.', 'small')
add('Vydání 14. 10. 2026. Základní údaje fondů znovu zkontrolované 14. 10. 2026; dostupnost podle rešerše z 9. 10. 2026. Zdroje a jejich data najdete na straně 4.', 'small')

section(2, 'Malé procento.<br/>Konkrétní částka.')
add('Procento převedete na orientační náklad takto: <b>hodnota investice × roční nákladovost / 100</b>. Například 100 000 Kč × 0,03 / 100 = 30 Kč za rok.')
rows = [['<b>Hodnota investice</b>'] + [f'<b>{f["ticker"]}</b>' for f in funds]]
for amount in (10000, 100000, 1000000):
    money = lambda n: f'{n:,.0f}'.replace(',', ' ') + ' Kč'
    rows.append([money(amount)] + [money(amount * f['expenseRatioPercent'] / 100) for f in funds])
table(rows, [180, 105, 105, 105])
add('Model předpokládá neměnnou hodnotu investice po celý rok. Jde o vysvětlení nákladovosti, nikoliv simulaci investování nebo předpověď výnosu. Náklad fondu je promítnutý do jeho hodnoty; nejde o samostatnou fakturu.')
heading('Co ještě patří do porovnání')
for title, text in [
    ('Poplatek brokera', 'Zjistěte cenu nákupu i prodeje, případné minimum a poplatek za vedení účtu.'),
    ('Spread', 'Rozdíl mezi nákupní a prodejní cenou je další náklad. Není součástí uvedené roční nákladovosti fondu.'),
    ('Směna měny', 'Ověřte kurz a poplatky za převod korun do obchodní měny i zpět. Kurz také ovlivní korunovou hodnotu investice.'),
    ('Daně', 'Daňové dopady závisejí na konkrétní situaci. Zjistěte, jaké podklady broker poskytuje; tento průvodce neurčuje vaše daňové povinnosti.'),
]:
    add(f'<b>{title}.</b> {text}')
heading('Jak výsledek číst')
add('Při 100 000 Kč je rozdíl mezi 0,03 % a 0,06 % v tomto modelu 30 Kč ročně. VOO a VTI mají stejnou nákladovost, ale jiný záběr. SCHD používá odlišný výběr společností. Samotná nejnižší částka proto nestačí k volbě fondu.')

section(3, 'Checklist<br/>před prvním nákupem.')
add('Použijte při ověřování u svého brokera. Pokud některou odpověď neznáte, nechte si ji nejdřív vysvětlit.')
checks = [
    ('Přesný instrument', 'Sedí ticker, úplný název, burza a identifikátor? Jde o podíl v ETF, nebo o CFD či jiný produkt?'),
    ('Oprávnění účtu', 'Mohu na svém konkrétním účtu skutečně zadat nákup? Samotné zobrazení fondu v katalogu to nepotvrzuje.'),
    ('Dokumentace', 'Je dostupný aktuální dokument KID, pokud je pro tento nákup vyžadován, a dokumentace emitenta?'),
    ('Zaměření a riziko', 'Rozumím tomu, které společnosti fond pokrývá? Počítám s poklesem ceny akcií a změnou kurzu měny?'),
    ('Celkové náklady', 'Znám nákladovost fondu, komise, spread, směnu měny a případné další poplatky?'),
    ('Dividendy a podklady', 'Vím, jak fond zachází s dividendami, a jak získám potřebné výpisy od brokera?'),
    ('Parametry pokynu', 'Rozumím rozdílu mezi tržním a limitním pokynem, jeho měně, množství a platnosti?'),
]
for title, text in checks:
    story.append(KeepTogether([p(f'□  <b>{title}</b>'), p(text, 'small'), Spacer(1, 7)]))
heading('Dostupnost si potvrďte individuálně')
add('IBKR uvádí omezení nákupů pro retailové klienty EHP bez KID; Fio uvádí možnost obchodovat americká ETF. To není potvrzení, že na vašem účtu lze koupit VOO, VTI nebo SCHD. Konkrétní pokyn na českém retailovém účtu nebyl ověřen. [5, 6]')
add('Moje poznámka / otázka pro brokera:', 'small')
story.append(Spacer(1, 24))
table([['']], [495])

section(4, 'Zdroje a hranice<br/>tohoto porovnání.')
add('Dokument slouží ke vzdělávání. Neposkytuje osobní investiční doporučení, neslibuje výnos a neposuzuje vhodnost konkrétního nákupu. Hodnota investice může klesnout.')
selected = ['voo-factsheet', 'vti-factsheet', 'vti-name-supplement', 'schd-profile', 'ibkr-priips', 'fio-etf', 'nyse-etp', 'cnb-priips']
notes = [
    'Fact sheet k 30. 6. 2026: zaměření, nákladovost 0,03 % a listing.',
    'Fact sheet k 30. 6. 2026: širší trh, nákladovost 0,03 % a listing. Původní název/index nahrazuje doplněk [3].',
    'Doplněk z 29. 7. 2026: nový název VTI a jeho indexu.',
    'Oficiální profil: strategie, index, nákladovost 0,06 % a listing. Samostatné datum účinnosti poplatku neuvedeno.',
    'Oficiální odpověď IBKR z 19. 11. 2025 k omezení PRIIPs/KID. Rešerše 9. 10. 2026.',
    'Obecné informace o přístupu k americkým ETF. Rešerše 9. 10. 2026; bez ověření konkrétního účtu.',
    'Rozlišení burz NYSE a NYSE Arca. Rešerše 9. 10. 2026.',
    'Regulatorní kontext PRIIPs. Nezaručuje dostupnost konkrétního instrumentu. Rešerše 9. 10. 2026.',
]
for i, (source_id, note) in enumerate(zip(selected, notes), 1):
    source = next(s for s in data['sources'] if s['id'] == source_id)
    story.append(KeepTogether([p(f'<b>[{i}] {escape(source["publisher"])}</b>', 'small'), p(note, 'small'),
        p(f'<link href="{escape(source["url"], {chr(34): "&quot;"})}" color="#285a43"><u>Otevřít: {escape(source["title"].replace("—", "-"))}</u></link>', 'small'), Spacer(1, 3)]))
add('Položky [1]-[4] znovu zkontrolované 14. 10. 2026. Ostatní vycházejí z uvedené projektové rešerše. Před nákupem ověřte aktuální údaje u emitenta a brokera. Odkazy v PDF jsou klikatelné.', 'small')

def page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN)
    canvas.setFont('GuideBold', 12)
    canvas.drawString(50, A4[1] - 34, 'clientelo.')
    canvas.setStrokeColor(LINE)
    canvas.line(50, 43, A4[0] - 50, 43)
    canvas.setFillColor(MUTED)
    canvas.setFont('Guide', 8)
    canvas.drawString(50, 29, 'Průvodce porovnáním ETF • Vydání 14. 10. 2026')
    canvas.drawRightString(A4[0] - 50, 29, str(doc.page))
    canvas.restoreState()

output = ROOT / 'public/guides/pruvodce-etf-2026-10-14.pdf'
output.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=50, rightMargin=50,
    topMargin=65, bottomMargin=60, title='Průvodce porovnáním ETF před prvním nákupem', author='Clientelo')
doc.build(story, onFirstPage=page, onLaterPages=page)
print(output)
