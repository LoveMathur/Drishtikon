# 🌐 Step 2: News Aggregation

## 🎯 Goal

Fetch news articles related to a given topic.

---

## 🧠 Approach

Use NewsAPI or GNews API to fetch articles.

---

## 📌 Function

get_news_articles(topic: str) -> List[Article]

---

## 📦 Article Structure

```json
{
  "title": "",
  "content": "",
  "source": "",
  "url": ""
}

---

## ⚙️ Requirements
Fetch 5–15 articles
Handle missing content
Remove duplicates
Ensure text is usable for LLM
⚠️ Edge Cases
Empty content
API failure
Duplicate articles