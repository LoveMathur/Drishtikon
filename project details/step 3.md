# ⚖️ Step 3: Bias Classification

## 🎯 Goal

Label news sources based on political bias.

---

## 🧠 Approach

Use predefined mapping (simple and reliable).

---

## 📌 Example Mapping

```python
{
 "CNN": "Left",
 "Fox News": "Right",
 "Reuters": "Center"
}
📌 Function

classify_bias(source: str) -> str

⚙️ Rules
Return: Left / Center / Right
Unknown sources → "Unknown"