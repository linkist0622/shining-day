"""Subset a locally supplied Noto Sans JP TTF for current website text."""
import argparse
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser()
parser.add_argument("source_ttf", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
files = list((root / "dist").rglob("*.html")) + [root / "dist/app.js"]
text = "".join(path.read_text(encoding="utf-8") for path in files)
text += "".join(chr(code) for code in range(32, 127))
font = TTFont(args.source_ttf)
options = subset.Options()
options.layout_features = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
font.flavor = "woff"
font.save(root / "dist/assets/shining-sans-v2.woff")
print("Updated local Japanese font subset.")
