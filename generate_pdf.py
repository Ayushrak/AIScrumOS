"""
AI ScrumOS — Professional Hackathon Screening Assignment PDF Generator
Generates a polished, multi-page PDF submission document using ReportLab.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, ListFlowable, ListItem, Image
)
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

# ─── Color Palette ───
DARK_BG = HexColor("#0f172a")
ACCENT_CYAN = HexColor("#06b6d4")
ACCENT_VIOLET = HexColor("#8b5cf6")
ACCENT_EMERALD = HexColor("#10b981")
TEXT_PRIMARY = HexColor("#1e293b")
TEXT_SECONDARY = HexColor("#475569")
TEXT_MUTED = HexColor("#94a3b8")
SECTION_BG = HexColor("#f1f5f9")
BORDER_COLOR = HexColor("#e2e8f0")
LINK_COLOR = HexColor("#2563eb")

# ─── Output path ───
OUTPUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "AIScrumOS_Hackathon_Submission.pdf")

# ─── Custom page background & footer ───
def add_page_decorations(canvas_obj, doc):
    canvas_obj.saveState()
    # Top accent bar
    canvas_obj.setFillColor(ACCENT_CYAN)
    canvas_obj.rect(0, A4[1] - 4 * mm, A4[0], 4 * mm, fill=1, stroke=0)
    # Footer
    canvas_obj.setFillColor(TEXT_MUTED)
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.drawCentredString(A4[0] / 2, 12 * mm, f"AI ScrumOS — Hack-AI-thon Screening Submission  |  Ayush Sharma  |  Page {doc.page}")
    canvas_obj.restoreState()


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        topMargin=20 * mm,
        bottomMargin=22 * mm,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    # ─── Custom Styles ───
    title_style = ParagraphStyle(
        "DocTitle", parent=styles["Title"],
        fontSize=22, leading=28, textColor=TEXT_PRIMARY,
        spaceAfter=4, fontName="Helvetica-Bold",
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle", parent=styles["Normal"],
        fontSize=11, leading=15, textColor=TEXT_SECONDARY,
        spaceAfter=16, fontName="Helvetica",
    )
    section_style = ParagraphStyle(
        "SectionHead", parent=styles["Heading2"],
        fontSize=14, leading=18, textColor=ACCENT_CYAN,
        spaceBefore=18, spaceAfter=8, fontName="Helvetica-Bold",
        borderPadding=(0, 0, 2, 0),
    )
    subsection_style = ParagraphStyle(
        "SubSection", parent=styles["Heading3"],
        fontSize=11, leading=15, textColor=ACCENT_VIOLET,
        spaceBefore=10, spaceAfter=4, fontName="Helvetica-Bold",
    )
    body_style = ParagraphStyle(
        "BodyText2", parent=styles["Normal"],
        fontSize=10, leading=14.5, textColor=TEXT_PRIMARY,
        alignment=TA_JUSTIFY, spaceAfter=6, fontName="Helvetica",
    )
    bold_body = ParagraphStyle(
        "BoldBody", parent=body_style,
        fontName="Helvetica-Bold",
    )
    bullet_style = ParagraphStyle(
        "BulletItem", parent=body_style,
        leftIndent=18, bulletIndent=6, spaceAfter=3,
    )
    code_style = ParagraphStyle(
        "CodeBlock", parent=styles["Code"],
        fontSize=8.5, leading=12, textColor=HexColor("#334155"),
        backColor=HexColor("#f8fafc"), borderColor=BORDER_COLOR,
        borderWidth=0.5, borderPadding=8, spaceAfter=8,
        fontName="Courier",
    )
    link_style = ParagraphStyle(
        "LinkText", parent=body_style,
        textColor=LINK_COLOR, fontName="Helvetica-Bold",
    )
    meta_style = ParagraphStyle(
        "MetaInfo", parent=styles["Normal"],
        fontSize=9, leading=13, textColor=TEXT_SECONDARY,
        fontName="Helvetica",
    )

    # ─── Helper functions ───
    def heading(text):
        return Paragraph(text, section_style)

    def subheading(text):
        return Paragraph(text, subsection_style)

    def body(text):
        return Paragraph(text, body_style)

    def bold(text):
        return Paragraph(text, bold_body)

    def bullet(text):
        return Paragraph(f"• {text}", bullet_style)

    def code(text):
        return Paragraph(text.replace("\n", "<br/>"), code_style)

    def link(text, url):
        return Paragraph(f'<a href="{url}" color="#2563eb">{text}</a>', link_style)

    def hr():
        return HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceAfter=10, spaceBefore=6)

    def spacer(h=6):
        return Spacer(1, h)

    # ═══════════════════════════════════════════════════════════════
    # BUILD DOCUMENT CONTENT
    # ═══════════════════════════════════════════════════════════════
    story = []

    # ─── COVER / HEADER ───
    story.append(Paragraph("Hack-AI-thon Screening Assignment", title_style))
    story.append(Paragraph(
        "AI ScrumOS — An AI-native Engineering Operating System that Autonomously Manages Software Delivery Workflows",
        subtitle_style
    ))
    story.append(hr())

    # Candidate info table
    meta_data = [
        ["Candidate:", "Ayush Sharma"],
        ["GitHub:", "github.com/Ayushrak/AIScrumOS"],
        ["Repository:", "https://github.com/Ayushrak/AIScrumOS"],
        ["Tech Stack:", "React + Vite (Frontend)  |  Python FastAPI (Backend)  |  WebSockets"],
        ["Date:", "24th May 2026"],
    ]
    meta_table = Table(meta_data, colWidths=[80, 400])
    meta_table.setStyle(TableStyle([
        ("FONT", (0, 0), (0, -1), "Helvetica-Bold", 9),
        ("FONT", (1, 0), (1, -1), "Helvetica", 9),
        ("TEXTCOLOR", (0, 0), (0, -1), TEXT_SECONDARY),
        ("TEXTCOLOR", (1, 0), (1, -1), TEXT_PRIMARY),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(meta_table)
    story.append(spacer(14))
    story.append(hr())

    # ═══════════════════════════════════════════════════════════════
    # SECTION 1: LLM PROJECT
    # ═══════════════════════════════════════════════════════════════
    story.append(heading("1. LLM Project — AI ScrumOS"))

    story.append(subheading("1.1 What Problem the System Solves"))
    story.append(body(
        "Traditional project management tools (Jira, Linear, Asana) are <b>reactive</b> — they require manual ticket "
        "updates, manual follow-ups, and developer overhead. In modern engineering teams, <b>70% of developer blockers "
        "are never explicitly raised</b>. Developers silently struggle with environment crashes, configuration loops, "
        "and dependency failures without logging a blocker, causing sprint delays that are only discovered at the end."
    ))
    story.append(body(
        "<b>AI ScrumOS</b> solves this by acting as an <b>autonomous AI Engineering Manager</b> that continuously "
        "ingests real-time telemetry — Git commit patterns, CI/CD pipeline statuses, Slack channel activity, meeting "
        "transcriptions, and developer work-hour distributions — to:"
    ))
    story.append(bullet("<b>Detect silent blockers</b> using behavioral signal analysis (repeated build failures, config file edits, no git pushes)."))
    story.append(bullet("<b>Predict sprint delivery risks</b> by computing cascading delay probabilities across microservice dependency graphs."))
    story.append(bullet("<b>Auto-coordinate resolutions</b> by creating Jira tickets, sending Slack notifications, and assigning domain experts."))
    story.append(bullet("<b>Preserve engineering memory</b> via a RAG-powered temporal search system that indexes historical Slack chats, Jira tickets, GitHub PRs, and retrospective action items."))
    story.append(bullet("<b>Monitor team wellness ethically</b> by tracking context-switching indexes, late-night commit patterns, and workload ratios."))
    story.append(spacer(4))

    story.append(subheading("1.2 High-Level Architecture & Key Components"))
    story.append(body(
        "AI ScrumOS is built on a <b>decoupled client-server architecture</b> with two independent services communicating "
        "via REST APIs and WebSocket event streams:"
    ))
    story.append(spacer(4))

    # Architecture table
    arch_data = [
        [Paragraph("<b>Layer</b>", bold_body), Paragraph("<b>Technology</b>", bold_body), Paragraph("<b>Responsibility</b>", bold_body)],
        [Paragraph("Frontend", body_style), Paragraph("React 19 + Vite 8 + Vanilla CSS", body_style),
         Paragraph("Glassmorphic cyberpunk dashboard with interactive SVG dependency graphs, real-time WebSocket event listeners, and a 6-step simulator control panel.", body_style)],
        [Paragraph("Backend", body_style), Paragraph("Python FastAPI + Uvicorn + Pydantic Settings", body_style),
         Paragraph("REST API gateway, WebSocket connection manager for broadcasting live events, state machine agent pipelines (Sprint Agent, Risk Agent, Memory Agent), and environment-based configuration loading.", body_style)],
        [Paragraph("Intelligence", body_style), Paragraph("Mock Agent State Machine + RAG Emulation", body_style),
         Paragraph("Simulates AI agent coordination loops. Computes cumulative sprint state transitions, burnout risk matrices, and keyword-matching temporal search over indexed engineering decisions.", body_style)],
    ]
    arch_table = Table(arch_data, colWidths=[65, 130, 275])
    arch_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT_CYAN),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 9),
        ("FONT", (0, 1), (-1, -1), "Helvetica", 8.5),
        ("GRID", (0, 0), (-1, -1), 0.4, BORDER_COLOR),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, SECTION_BG]),
    ]))
    story.append(arch_table)
    story.append(spacer(6))

    story.append(body(
        "<b>Key Data Flow</b>: The React client connects to the FastAPI WebSocket endpoint (<font name='Courier' size='9'>/ws/events</font>) on mount. "
        "When a judge clicks 'Advance Step' on the simulator, the frontend sends a POST request to "
        "<font name='Courier' size='9'>/api/simulator/step</font>. The backend processes the state transition through "
        "the agent pipeline, updates the in-memory database, and <b>broadcasts</b> the new state to all connected "
        "WebSocket clients simultaneously — enabling real-time, multi-client dashboard updates."
    ))
    story.append(spacer(4))

    story.append(subheading("1.3 Engineering Challenge — Real-Time Fallback Architecture"))
    story.append(body(
        "The most significant engineering challenge was designing a <b>zero-downtime fallback system</b> for live "
        "hackathon presentations. During a stage demo, the Python backend server might crash, lose connection, or "
        "fail to start. If the React dashboard simply displayed an error screen, the entire presentation would be ruined."
    ))
    story.append(body(
        "<b>Solution</b>: I implemented a <b>dual-mode state architecture</b> in the React client. On mount, the app "
        "attempts to connect to the FastAPI server via a health-check fetch to <font name='Courier' size='9'>/api/sprint-data</font>. "
        "If the backend responds, the app enters <b>Backend Mode</b> — all state is fetched from REST APIs, and the "
        "WebSocket channel streams live event logs. If the backend is unreachable, the app transparently falls back to "
        "<b>Local Simulation Mode</b> — computing identical state transitions using a pure JavaScript state machine "
        "bundled in <font name='Courier' size='9'>mockData.js</font>. The UI displays a subtle status indicator showing "
        "which mode is active, but the interactive experience remains identical. This means <b>the demo never breaks</b>, "
        "regardless of server availability."
    ))
    story.append(spacer(4))

    story.append(subheading("1.4 Repository & Demo"))
    story.append(body(
        '<b>GitHub Repository</b>: <a href="https://github.com/Ayushrak/AIScrumOS" color="#2563eb">https://github.com/Ayushrak/AIScrumOS</a>'
    ))
    story.append(body(
        "The repository includes a comprehensive README.md with setup instructions, architecture diagrams (Mermaid), "
        "full directory structure documentation, and a generated cyberpunk UI preview image."
    ))
    story.append(spacer(6))
    story.append(hr())

    # ═══════════════════════════════════════════════════════════════
    # SECTION 2: ARCHITECTURE DESIGN
    # ═══════════════════════════════════════════════════════════════
    story.append(heading("2. Architecture Design — Document Q&A System"))
    story.append(body(
        "Below is my proposed pipeline for a production-grade Document Q&A system over 10,000 internal documents "
        "(PDFs, Word files, and Confluence pages) with semantic retrieval and cited answers."
    ))
    story.append(spacer(4))

    story.append(subheading("2.1 Chunking Strategy"))
    story.append(body(
        "I would use <b>Recursive Character Text Splitting</b> (LangChain's <font name='Courier' size='9'>RecursiveCharacterTextSplitter</font>) "
        "with a chunk size of <b>800–1200 tokens</b> and an overlap of <b>150–200 tokens</b>. This splitter respects "
        "natural document boundaries (paragraphs → sentences → words) rather than splitting mid-sentence, which preserves "
        "semantic coherence. For structured documents (Confluence pages with headers), I would additionally use "
        "<b>Markdown/HTML header-based splitting</b> to create chunks aligned to document sections, attaching section "
        "titles as metadata for improved retrieval context."
    ))
    story.append(spacer(2))

    story.append(subheading("2.2 Embedding Model Choice"))
    story.append(body(
        "<b>OpenAI text-embedding-3-small</b> (1536 dimensions) for the best cost-performance ratio at scale, or "
        "<b>text-embedding-3-large</b> (3072 dimensions) if accuracy is paramount. For an on-premise or open-source "
        "alternative, <b>BGE-large-en-v1.5</b> or <b>E5-large-v2</b> from HuggingFace offer competitive MTEB benchmark "
        "scores without vendor lock-in. The embedding model must be consistent between ingestion and query time."
    ))
    story.append(spacer(2))

    story.append(subheading("2.3 Vector Store Choice"))
    story.append(body(
        "<b>Pinecone</b> for managed cloud deployment (serverless scaling, metadata filtering, and hybrid search support), or "
        "<b>Qdrant</b> for self-hosted requirements (rich filtering, payload indexing, and excellent Rust-based performance). "
        "For prototyping, <b>ChromaDB</b> works well locally. At 10,000 documents with ~100K chunks, any modern vector "
        "database handles the scale comfortably."
    ))
    story.append(spacer(2))

    story.append(subheading("2.4 Retrieval Strategy"))
    story.append(body(
        "I would implement a <b>hybrid retrieval pipeline</b> combining multiple strategies:"
    ))
    story.append(bullet("<b>Semantic Search</b>: Dense vector similarity (cosine) over the embedded chunks — handles paraphrased and conceptual queries."))
    story.append(bullet("<b>BM25 Keyword Search</b>: Sparse retrieval for exact term matching — handles acronyms, product codes, and proper nouns that embeddings may miss."))
    story.append(bullet("<b>Reciprocal Rank Fusion (RRF)</b>: Merges ranked results from both retrievers into a single ordered list, combining the strengths of semantic and lexical search."))
    story.append(bullet("<b>Metadata Filtering</b>: Pre-filter by document type, department, or date range to narrow the search scope before vector similarity."))
    story.append(bullet("<b>Re-ranking</b>: Apply a cross-encoder re-ranker (e.g., Cohere Rerank or a ColBERT model) on the top-20 retrieved chunks to produce a final top-5 with higher precision."))
    story.append(spacer(2))

    story.append(subheading("2.5 Handling Partial Answers"))
    story.append(body(
        "When no single document fully answers a question, I would implement <b>multi-document synthesis</b>: retrieve "
        "the top-K chunks (K=5–8), pass all of them to the LLM with a prompt that instructs it to synthesize a "
        "comprehensive answer by combining information across sources. Each claim in the response must cite its source "
        "chunk using bracketed references (e.g., [Doc A, Section 3]). The prompt explicitly instructs the model to say "
        "'Based on available documents, this is only a partial answer' when coverage is incomplete, rather than hallucinating."
    ))
    story.append(spacer(2))

    story.append(subheading("2.6 Biggest Failure Mode & Mitigation"))
    story.append(body(
        "<b>Biggest Failure Mode</b>: <b>Retrieval misses</b> — the correct document chunks are not retrieved because "
        "the user's query is semantically distant from the document's language (vocabulary mismatch), or the answer spans "
        "multiple chunks that individually score low in isolation."
    ))
    story.append(body(
        "<b>Mitigation</b>: (1) <b>Query expansion</b> — use an LLM to rewrite the user's question into 3–4 alternative "
        "phrasings before retrieval, then union the results. (2) <b>Hypothetical Document Embedding (HyDE)</b> — generate "
        "a hypothetical answer first, embed it, and use that embedding for retrieval (often more effective than embedding "
        "the question directly). (3) <b>Parent-child chunking</b> — store small chunks for precise retrieval but return "
        "the larger parent chunk for context, ensuring the LLM sees enough surrounding information. (4) Implement "
        "<b>user feedback loops</b> — log queries with low confidence scores for human review and continuous improvement."
    ))

    story.append(spacer(6))
    story.append(hr())

    # ═══════════════════════════════════════════════════════════════
    # SECTION 3: DEBUG CHALLENGE
    # ═══════════════════════════════════════════════════════════════
    story.append(heading("3. Debug Challenge — Find and Fix the Bugs"))

    story.append(body(
        "Below is my analysis of every bug in the submitted RAG pipeline code, explaining what each issue actually "
        "causes in production, followed by the corrected version."
    ))
    story.append(spacer(4))

    # Bug 1
    story.append(subheading("Bug 1: chunk_overlap > chunk_size (Runtime Crash)"))
    story.append(body(
        "<font name='Courier' size='9'>chunk_size=100, chunk_overlap=500</font> — The overlap (500) exceeds the chunk "
        "size (100). This raises a <b>ValueError</b> at runtime because it is logically impossible for the overlap "
        "region to be larger than the chunk itself. The splitter cannot create valid windows."
    ))
    story.append(body("<b>Fix</b>: Set <font name='Courier' size='9'>chunk_size=1000, chunk_overlap=200</font>. A chunk size of 1000 characters with "
        "200 overlap ensures sufficient semantic context per chunk while maintaining continuity between adjacent chunks."))
    story.append(spacer(4))

    # Bug 2
    story.append(subheading("Bug 2: Wrong Embedding Model (Silent Wrong Answers)"))
    story.append(body(
        "<font name='Courier' size='9'>OpenAIEmbeddings(model=\"gpt-4\")</font> — GPT-4 is a <b>chat completion model</b>, "
        "not an embedding model. This will either throw an API error or silently return garbage vectors. Embeddings "
        "require a dedicated embedding model."
    ))
    story.append(body("<b>Fix</b>: Use <font name='Courier' size='9'>OpenAIEmbeddings(model=\"text-embedding-3-small\")</font> or "
        "<font name='Courier' size='9'>text-embedding-ada-002</font>."))
    story.append(spacer(4))

    # Bug 3
    story.append(subheading("Bug 3: temperature=1.0 (Non-Deterministic, Hallucination-Prone)"))
    story.append(body(
        "<font name='Courier' size='9'>temperature=1.0</font> — Maximum randomness for a factual Q&A system. This causes "
        "the LLM to generate creative, varied responses instead of grounded, deterministic answers. In a RAG pipeline "
        "this dramatically increases <b>hallucination risk</b> — the model may invent facts not present in the retrieved documents."
    ))
    story.append(body("<b>Fix</b>: Set <font name='Courier' size='9'>temperature=0.0</font> (or at most 0.1) for factual retrieval tasks."))
    story.append(spacer(4))

    # Bug 4
    story.append(subheading("Bug 4: k=50 Retrieved Documents (Context Overflow)"))
    story.append(body(
        "<font name='Courier' size='9'>search_kwargs={\"k\": 50}</font> — Retrieving 50 chunks will likely <b>exceed the "
        "LLM's context window</b>, causing a token limit error. Even if it fits, the LLM's attention degrades with "
        "excessive context (the 'lost in the middle' problem), producing worse answers. It also increases API cost "
        "and latency dramatically."
    ))
    story.append(body("<b>Fix</b>: Set <font name='Courier' size='9'>k=3</font> to <font name='Courier' size='9'>k=5</font>. Use a re-ranker if precision matters."))
    story.append(spacer(4))

    # Bug 5
    story.append(subheading("Bug 5: return_source_documents=False (No Citations)"))
    story.append(body(
        "Setting <font name='Courier' size='9'>return_source_documents=False</font> discards the source chunks used to "
        "generate the answer. This means <b>users cannot verify the answer's accuracy</b>, there is no traceability, "
        "and the system cannot display citations — a fundamental requirement for any enterprise Q&A system."
    ))
    story.append(body("<b>Fix</b>: Set <font name='Courier' size='9'>return_source_documents=True</font> and display source metadata alongside answers."))
    story.append(spacer(4))

    # Bug 6
    story.append(subheading("Bug 6: No Error Handling (Production Crash)"))
    story.append(body(
        "<font name='Courier' size='9'>qa_chain.run(...)</font> has <b>zero error handling</b>. In production, API rate "
        "limits, network timeouts, malformed documents, and OpenAI outages will crash the entire application. The "
        "<font name='Courier' size='9'>.run()</font> method is also deprecated in favor of <font name='Courier' size='9'>.invoke()</font>."
    ))
    story.append(body("<b>Fix</b>: Wrap in try/except, implement retries with exponential backoff, use <font name='Courier' size='9'>.invoke()</font>, and log errors."))
    story.append(spacer(4))

    # Bug 7
    story.append(subheading("Bug 7: Single File Loader (Architectural Limitation)"))
    story.append(body(
        "<font name='Courier' size='9'>TextLoader(\"company_docs.txt\")</font> loads a single plaintext file. A production "
        "system with multiple document types (PDFs, Word, Confluence) needs <b>DirectoryLoader</b> with appropriate "
        "per-format parsers (PyPDFLoader, Docx2txtLoader, ConfluenceLoader). This is an architectural gap that will "
        "surface immediately when the system is deployed against real document corpora."
    ))
    story.append(body("<b>Fix</b>: Use <font name='Courier' size='9'>DirectoryLoader</font> with glob patterns and format-specific loader mappings."))
    story.append(spacer(4))

    # Bug 8
    story.append(subheading("Bug 8: CharacterTextSplitter (Poor Semantic Chunking)"))
    story.append(body(
        "<font name='Courier' size='9'>CharacterTextSplitter</font> splits on a single character (default: '\\n\\n'). "
        "This often produces chunks that break mid-sentence or mid-paragraph, destroying semantic coherence. "
        "Under load with diverse document formats, this leads to <b>degraded retrieval quality</b> because chunks "
        "contain fragmented, incomplete thoughts."
    ))
    story.append(body("<b>Fix</b>: Use <font name='Courier' size='9'>RecursiveCharacterTextSplitter</font> which tries multiple separators "
        "(paragraphs → sentences → words) to find the most natural split points."))

    story.append(spacer(8))
    story.append(hr())

    # Corrected code
    story.append(subheading("Corrected Production Code"))
    corrected_code = (
        "from langchain_community.document_loaders import DirectoryLoader, TextLoader<br/>"
        "from langchain.text_splitter import RecursiveCharacterTextSplitter<br/>"
        "from langchain_openai import OpenAIEmbeddings, ChatOpenAI<br/>"
        "from langchain_community.vectorstores import Chroma<br/>"
        "from langchain.chains import RetrievalQA<br/>"
        "import logging<br/><br/>"
        "logging.basicConfig(level=logging.INFO)<br/>"
        "logger = logging.getLogger(__name__)<br/><br/>"
        "# Load documents from directory<br/>"
        "loader = DirectoryLoader('company_docs/', glob='**/*.txt', loader_cls=TextLoader)<br/>"
        "docs = loader.load()<br/><br/>"
        "# Recursive splitting with proper sizes<br/>"
        "splitter = RecursiveCharacterTextSplitter(<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;chunk_size=1000,<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;chunk_overlap=200,<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;separators=['\\n\\n', '\\n', '. ', ' ', '']<br/>"
        ")<br/>"
        "chunks = splitter.split_documents(docs)<br/><br/>"
        "# Correct embedding model<br/>"
        "embeddings = OpenAIEmbeddings(model='text-embedding-3-small')<br/>"
        "vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory='./chroma_db')<br/><br/>"
        "# Deterministic LLM for factual Q&amp;A<br/>"
        "llm = ChatOpenAI(model='gpt-4', temperature=0.0)<br/>"
        "qa_chain = RetrievalQA.from_chain_type(<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;llm=llm,<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;retriever=vectorstore.as_retriever(search_kwargs={'k': 4}),<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;return_source_documents=True,<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;chain_type='stuff'<br/>"
        ")<br/><br/>"
        "# Query with error handling<br/>"
        "try:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;result = qa_chain.invoke({'query': 'What is our refund policy?'})<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;print(result['result'])<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;for doc in result['source_documents']:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(f'Source: {doc.metadata}')<br/>"
        "except Exception as e:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;logger.error(f'RAG pipeline error: {e}')<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;print('Unable to process query. Please try again.')"
    )
    story.append(code(corrected_code))

    # ─── Build the PDF ───
    doc.build(story, onFirstPage=add_page_decorations, onLaterPages=add_page_decorations)
    print(f"\n[OK] PDF generated successfully: {OUTPUT_PATH}")
    print(f"     File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")


if __name__ == "__main__":
    build_pdf()
