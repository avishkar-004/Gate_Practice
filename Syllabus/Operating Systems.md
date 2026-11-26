# Operating Systems — GATE CSE

## Official GATE 2027 syllabus

The official GATE CS syllabus lists these Operating Systems topics:

- System calls
- Processes and threads
- Inter-process communication
- Concurrency and synchronization
- Deadlock
- CPU and I/O scheduling
- Memory management and virtual memory
- File systems

## Topics to study

The following outline expands those headings into concepts and problem-solving skills to practice.

### 1. System calls and operating-system structure

- User mode and kernel mode
- System-call interface and the transition between user and kernel mode
- System calls versus library or API calls
- Process-control, file, device, information and communication system calls
- Interrupts, exceptions and traps at an introductory level

### 2. Processes

- Process concept, address space and process states
- Process Control Block (PCB) and context switching
- Process creation and termination
- Parent and child processes
- Process state-transition diagrams
- Orphan and zombie processes
- Program versus process

### 3. Threads

- Thread concept and thread state
- User-level and kernel-level threads
- Multithreading models
- Process-level versus thread-level context switching
- Benefits and costs of multithreading
- Shared process resources and per-thread state

### 4. Inter-process communication

- Shared memory and message passing
- Direct and indirect communication
- Blocking and non-blocking communication
- Pipes, message queues and sockets
- Race conditions in shared-memory communication
- Choosing an IPC mechanism for a scenario

### 5. Concurrency and synchronization

- Critical sections and race conditions
- Mutual exclusion, progress and bounded waiting
- Atomic hardware instructions and spinlocks
- Mutex locks, semaphores and monitors
- Binary and counting semaphores
- Classical problems: producer-consumer, readers-writers and dining philosophers
- Deadlock and starvation caused by synchronization choices
- Interleaving traces and semaphore-value calculations

### 6. Deadlock

- Deadlock characterization and the four necessary conditions
- Resource-allocation graphs
- Deadlock prevention and avoidance
- Safe states and safe sequences
- Banker's algorithm and resource-request checks
- Deadlock detection and recovery
- Distinguishing deadlock, starvation and livelock

### 7. CPU scheduling

- Scheduling criteria: CPU utilization, throughput, turnaround, waiting and response time
- Preemptive and non-preemptive scheduling
- FCFS, SJF, SRTF, priority and Round Robin scheduling
- Multilevel queue and multilevel feedback queue concepts
- Gantt charts and calculations for waiting and turnaround times
- Effect of time quantum and context-switch overhead
- Starvation and aging

### 8. I/O scheduling

- Disk access time: seek time, rotational latency and transfer time
- FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK disk scheduling
- Head-movement calculations from request queues
- Trade-offs in fairness, throughput and response time
- Basic buffering, caching and spooling concepts

### 9. Memory management

- Logical and physical addresses
- Address binding and relocation
- Contiguous allocation and fragmentation
- Paging and page-table address translation
- Multilevel and inverted page-table concepts
- Segmentation and segmentation with paging
- Translation Lookaside Buffer (TLB) and effective access-time calculations
- Protection and sharing at an introductory level

### 10. Virtual memory

- Demand paging and page faults
- Page replacement: FIFO, LRU and Optimal
- Stack algorithms and Belady's anomaly
- Working set and thrashing
- Frame allocation and local versus global replacement
- Effective access time with page-fault probability
- Page-fault and replacement traces

### 11. File systems

- Files, directories and file attributes
- File access methods and directory structures
- File allocation: contiguous, linked and indexed
- Free-space management
- Inodes and file-system metadata
- Disk-block and index calculations
- File protection and access-control basics
- File-system consistency and recovery concepts

## Recommended study order

1. Processes, threads and context switching
2. CPU scheduling and performance calculations
3. Concurrency, synchronization and IPC
4. Deadlocks and Banker's algorithm
5. Memory management and address translation
6. Virtual memory and page-replacement problems
7. File systems and disk scheduling
8. System calls and operating-system structure

## Official reference

[GATE 2027 CS syllabus PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf)
