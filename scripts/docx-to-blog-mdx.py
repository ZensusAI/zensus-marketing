#!/usr/bin/env python3
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

DOCX = Path(r"C:\Users\ashwi\Downloads\What Is Cash Flow Forecasting.docx")
OUT = Path(__file__).resolve().parent.parent / "src/content/blog/what-is-cash-flow-forecasting.mdx"

META = {
    "title": (
        "What Is Cash Flow Forecasting? A Practical Guide for Founders and Finance Teams"
    ),
    "description": (
        "Learn what cash flow forecasting is, why it matters for founders and finance "
        "teams, and how businesses improve liquidity visibility, forecast accuracy, "
        "and financial planning."
    ),
    "date": "2026-05-19",
    "dateModified": "2026-05-19",
    "category": "Guide",
    "readTime": "12 min read",
    "slug": "what-is-cash-flow-forecasting",
    "ogImage": "https://zensus.app/og/blog/what-is-cash-flow-forecasting.png",
}

SECTION_HEADINGS = {
    "What Is Cash Flow Forecasting?",
    "Why Cash Flow Forecasting Matters",
    "Better Financial Visibility",
    "Improved Liquidity Management",
    "Smarter Business Planning",
    "Reduced Financial Risk",
    "How Cash Flow Forecasting Works",
    "Common Forecasting Time Horizons",
    "Short Term Forecasting",
    "Medium Term Forecasting",
    "Long Term Forecasting",
    "Types of Cash Flow Forecasting",
    "Direct Cash Flow Forecasting",
    "Indirect Cash Flow Forecasting",
    "What Is a Rolling Cash Flow Forecast?",
    "Common Challenges in Cash Flow Forecasting",
    "Spreadsheet Dependency",
    "Fragmented Financial Data",
    "Poor Forecast Accuracy",
    "Limited Real Time Visibility",
    "How Technology Is Changing Cash Forecasting",
    "Best Practices for Better Cash Flow Forecasting",
    "Use Rolling Forecasts",
    "Update Forecasts Frequently",
    "Centralize Financial Data",
    "Measure Forecast Accuracy",
    "Reduce Manual Processes",
    "The Future of Cash Flow Forecasting",
    "Final Thoughts",
}

LIST_INTRO_MARKERS = (
    "In this guide, we'll cover:",
    "In this guide, we\u2019ll cover:",
)


def extract_paragraphs(docx_path: Path) -> list[str]:
    with zipfile.ZipFile(docx_path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    lines: list[str] = []
    for p in root.iter(W + "p"):
        texts = [t.text for t in p.iter(W + "t") if t.text]
        if texts:
            line = "".join(texts).replace("\u2019", "'").replace("\u2014", "—").strip()
            if line:
                lines.append(line)
    return lines


def escape_mdx(text: str) -> str:
    return text.replace("{", "\\{")


def emit_paragraph(out: list[str], text: str, *, lead: bool = False, intro: bool = False) -> None:
    if lead:
        out.append(
            f'\n<p id="blog-article-lead" className="text-lg leading-relaxed text-muted-foreground">\n'
            f"  {escape_mdx(text)}\n"
            f"</p>\n"
        )
        return
    if intro:
        out.append(
            f'\n<p className="mb-2 font-medium text-foreground">{escape_mdx(text)}</p>\n'
        )
        return
    out.append(f"\n<p>{escape_mdx(text)}</p>\n")


def flush_bullets(out: list[str], bullets: list[str]) -> None:
    if not bullets:
        return
    out.append("\n<ul>\n")
    for b in bullets:
        out.append(f"  <li>{escape_mdx(b)}</li>")
    out.append("\n</ul>\n")
    bullets.clear()


def to_mdx(lines: list[str]) -> str:
    out: list[str] = []
    out.append("export const meta = {")
    for key, val in META.items():
        out.append(f"  {key}: {repr(val)},")
    out.append("};")
    out.append("")
    out.append("import { BlogCallout } from '@/components/blog/BlogCallout';")
    out.append("")

    i = 0
    first_para = True
    bullets: list[str] = []
    skip_title = lines[0] if lines else ""

    while i < len(lines):
        line = lines[i]

        if line == skip_title:
            i += 1
            continue

        if any(line.startswith(m.replace("\u2019", "'")) for m in LIST_INTRO_MARKERS):
            flush_bullets(out, bullets)
            emit_paragraph(out, line, intro=True)
            i += 1
            while i < len(lines) and lines[i][0].islower():
                bullets.append(lines[i])
                i += 1
            flush_bullets(out, bullets)
            continue

        if line in SECTION_HEADINGS:
            flush_bullets(out, bullets)
            out.append(f"\n## {escape_mdx(line)}\n")
            i += 1
            continue

        if line.endswith(":") and i + 1 < len(lines) and lines[i + 1][0].islower():
            flush_bullets(out, bullets)
            emit_paragraph(out, line, intro=True)
            i += 1
            while i < len(lines) and lines[i][0].islower() and len(lines[i]) < 120:
                if lines[i] in SECTION_HEADINGS:
                    break
                bullets.append(lines[i])
                i += 1
            flush_bullets(out, bullets)
            continue

        if line[0].islower() and len(line) < 120:
            bullets.append(line)
            i += 1
            continue

        flush_bullets(out, bullets)

        if first_para:
            emit_paragraph(out, line, lead=True)
            first_para = False
        else:
            emit_paragraph(out, line)
        i += 1

    flush_bullets(out, bullets)

    out.append(
        '\n<BlogCallout title="Improve Financial Visibility with Zensus">\n'
        "Zensus helps founders and finance teams improve cash visibility, streamline "
        "forecasting workflows, and reduce manual financial reporting through "
        "centralized real time insights. "
        '[Talk to us](https://calendly.com/hello-zensus/introcall) or explore '
        '[pricing](/pricing).\n'
        "</BlogCallout>\n"
    )
    return "\n".join(out)


def main() -> None:
    docx = Path(sys.argv[1]) if len(sys.argv) > 1 else DOCX
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else OUT
    lines = extract_paragraphs(docx)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(to_mdx(lines), encoding="utf-8")
    print(f"Wrote {out} ({len(lines)} paragraphs)")


if __name__ == "__main__":
    main()
