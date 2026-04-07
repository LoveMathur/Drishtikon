# 🧠 Project: Drishtikon — News Consensus Analyzer

## 📌 Overview

Drishtikon is an AI-powered platform that analyzes news from multiple sources and extracts **factual consensus and narrative differences**.

Instead of showing users more news, it helps them understand:
- What is commonly agreed upon (truth signals)
- Where narratives differ (bias / interpretation)

*NOTE: It is a hackathon project and not a production project. make it such that it works as prototype.*

---

## ❗ Problem Statement

Modern news consumption suffers from:
- Bias across sources
- Narrative framing differences
- Information overload
- Lack of comparison tools

Users cannot easily distinguish:
- Facts vs opinions
- Consensus vs disagreement

---

## 💡 Solution

An AI pipeline that:
1. Aggregates news articles
2. Extracts factual claims using LLMs
3. Groups similar claims using embeddings
4. Identifies consensus and disagreements
5. Presents structured insights

---

## 🚀 Core Features

- Multi-source news aggregation
- Bias classification (Left / Center / Right)
- Claim-level extraction (LLM-based)
- Semantic clustering of claims
- Consensus scoring engine
- Explainable structured output

---

## 🧠 System Architecture

User Input → Topic  
↓  
Fetch News Articles  
↓  
Bias Classification  
↓  
Claim Extraction (LLM)  
↓  
Embedding Generation  
↓  
Store in Vector DB (Pinecone)  
↓  
Similarity Retrieval  
↓  
Clustering Logic  
↓  
Consensus Analysis  
↓  
Final Structured Output  

---

## 🧱 Tech Stack

### Backend
- FastAPI (Python)

### LLM
- OpenAI API

### Vector Database
- Pinecone

### Embeddings
- all-minilm-l6-v2

### Frontend
- React + Tailwind CSS

### News Sources
- NewsAPI / GNews

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 🎯 Hackathon Strategy

Focus on:
- Clean pipeline
- Accurate claim extraction
- Strong clustering logic
- Clear UI output

Avoid:
- Over-engineering
- Complex ML training

---