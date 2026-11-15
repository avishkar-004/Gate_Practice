# GATE CSE Syllabus (GATE 2027)

The GATE paper is officially titled **Computer Science and Information Technology (CS)**.

- **Total:** 100 marks
- **General Aptitude:** 15 marks
- **CS syllabus:** 85 marks

## 1. Engineering Mathematics

- **Discrete Mathematics:** Propositional and first-order logic; sets, relations, functions, partial orders and lattices; monoids and groups; graph connectivity, matching and colouring; counting, recurrence relations and generating functions.
- **Linear Algebra:** Matrices, determinants, systems of linear equations, eigenvalues and eigenvectors, LU decomposition.
- **Calculus:** Limits, continuity and differentiability, maxima and minima, mean value theorem, integration.
- **Probability and Statistics:** Random variables; uniform, normal, exponential, Poisson and binomial distributions; mean, median, mode and standard deviation; conditional probability and Bayes' theorem.

## 2. Digital Logic

Boolean algebra and minimization (algebraic technique, Karnaugh map, tabular method); design of combinational and sequential circuits; number representation and arithmetic (fixed and floating point).

## 3. Computer Organization and Architecture

Instruction set and addressing modes; design of arithmetic and logic unit (ALU); hardwired and microprogrammed control units; memory interfacing and hierarchy, performance and cache memory mapping; I/O interface (interrupt and DMA); instruction pipelining and pipeline hazards.

## 4. Programming and Data Structures

Programming in C; recursion; arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps and graphs.

## 5. Algorithms

Searching, sorting and hashing; asymptotic worst-case time and space complexity; greedy, dynamic programming and divide-and-conquer techniques; graph traversals, minimum spanning trees and shortest paths.

## 6. Theory of Computation

Regular expressions and finite automata; context-free grammars and push-down automata; regular and context-free languages; pumping lemma; Turing machines and undecidability.

## 7. Compiler Design

Lexical analysis, parsing and syntax-directed translation; runtime environments; intermediate code generation; local optimization; data-flow analyses including constant propagation, liveness analysis and common subexpression elimination.

## 8. Operating Systems

System calls, processes, threads, inter-process communication, concurrency and synchronization; deadlock; CPU and I/O scheduling; memory management and virtual memory; file systems.

## 9. Databases

ER model; relational model, relational algebra, tuple calculus and SQL; integrity constraints and normal forms; file organization and indexing (e.g., B and B+ trees); transactions and concurrency control.

## 10. Computer Networks

Principles of layering; basics of switching (circuit, packet and virtual circuit) and performance metrics; data link layer (error detection, Medium Access Control, Ethernet); distance-vector and link-state routing; IPv4 (fragmentation, CIDR notation, Network Address Translation); TCP (flow control and congestion control), socket API; DNS and HTTP.

## General Aptitude

General Aptitude is a common 15-mark component of the GATE paper. Refer to the official syllabus for its detailed topics.

## Official reference

- [GATE 2027 CS syllabus PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf)
- [GATE 2027 test papers and syllabus page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus)

## GATE CS Practice Lab

Open `index.html` in a browser to use the static practice app. It works without a server and saves checked answers in the browser's local storage. Choose a subject, then a topic, to start practicing.

The app contains two subjects: **Programming and Data Structures** and **Algorithms**. Each has eight topics with 100 original GATE-style practice questions per topic (1,600 total). The bank includes single-answer MCQs, multiple-select questions, numerical answer questions, and worked explanations. These are practice problems written for this app, not reproduced official GATE questions.

Frontend files:

- `index.html` — topic home and practice views
- `styles.css` — responsive layout and styling
- `app.js` — navigation, answer checking and local progress
- `questions.js` — Programming and Data Structures question bank
- `algorithm-questions.js` — Algorithms question bank
