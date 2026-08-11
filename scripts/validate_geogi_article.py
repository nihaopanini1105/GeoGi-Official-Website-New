#!/usr/bin/env python3
import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.scripts = []
        self._in_script = False
        self._script_type = ""
        self._script = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "script":
            self._in_script = True
            self._script_type = attrs.get("type", "")
            self._script = []

    def handle_data(self, data):
        if self._in_script:
            self._script.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._in_script:
            if self._script_type == "application/ld+json":
                self.scripts.append("".join(self._script).strip())
            self._in_script = False


def styles(html):
    return re.findall(r"<style[^>]*>.*?</style>", html, flags=re.S)


def visible_faq(html):
    block = re.search(r'<h2 id="faq">.*?(?=<h2 id="references">)', html, flags=re.S)
    if not block:
        return []
    return re.findall(r"<h3>(.*?)</h3><p>(.*?)</p>", block.group(0), flags=re.S)


def resolve_internal(path, href):
    if href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")) or href.startswith("#"):
        return None
    href = href.split("#", 1)[0]
    if not href:
        return None
    target = (path.parent / href).resolve()
    if target.is_dir():
        target = target / "index.html"
    return target


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--master", required=True)
    parser.add_argument("--article", required=True)
    parser.add_argument("--json", required=True)
    args = parser.parse_args()

    master_path = Path(args.master).resolve()
    article_path = Path(args.article).resolve()
    data = json.loads(Path(args.json).read_text())
    master = master_path.read_text()
    article = article_path.read_text()
    errors = []

    if styles(master) != styles(article):
        errors.append("CSS style blocks differ from the master article.")

    for required in [data["title"], data["description"], data["canonical_url"]]:
        if required not in article:
            errors.append(f"Missing required metadata/content: {required}")

    forbidden = [
        "GEO 会取代 SEO 吗？",
        "GEO 是否等于增加 AI 引用次数？",
        "企业应先优化内容还是先检测？",
        "GeoGi 自有概念是不是行业公认标准？",
        "llms.txt 是进入 Google AI 搜索的必要条件吗？",
    ]
    for text in forbidden:
        if text in article:
            errors.append(f"Old FAQ/content remains: {text}")

    parsed = LinkParser()
    parsed.feed(article)
    schemas = [json.loads(s) for s in parsed.scripts if s]
    article_schema = next((s for s in schemas if s.get("@type") == "Article"), None)
    faq_schema = next((s for s in schemas if s.get("@type") == "FAQPage"), None)
    if not article_schema:
        errors.append("Missing Article schema.")
    elif article_schema.get("headline") != data["title"]:
        errors.append("Article schema headline does not match article.json title.")
    if not faq_schema:
        errors.append("Missing FAQPage schema.")
    else:
        schema_faq = [(item["name"], item["acceptedAnswer"]["text"]) for item in faq_schema.get("mainEntity", [])]
        expected_faq = [(item["question"], item["answer"]) for item in data["faq"]]
        visible = [(re.sub("<.*?>", "", q), re.sub("<.*?>", "", a)) for q, a in visible_faq(article)]
        if schema_faq != expected_faq:
            errors.append("FAQ schema does not match article.json.")
        if visible != expected_faq:
            errors.append("Visible FAQ does not match FAQ schema/article.json.")

    for href in parsed.links:
        target = resolve_internal(article_path, href)
        if target and not target.exists():
            errors.append(f"Broken internal link: {href}")

    if errors:
        print("VALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print("VALIDATION PASSED")
    print(f"Master: {master_path}")
    print(f"Article: {article_path}")
    print(f"FAQ items: {len(data['faq'])}")
    print(f"Internal links checked: {len([x for x in parsed.links if resolve_internal(article_path, x)])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
