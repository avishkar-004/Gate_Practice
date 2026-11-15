# Computer Networks — GATE CSE

## Official GATE 2027 syllabus

The official GATE CS syllabus lists these Computer Networks topics:

- Principles of layering
- Basics of switching: circuit, packet and virtual circuit switching; performance metrics
- Data link layer: error detection, Medium Access Control (MAC), Ethernet
- Distance-vector and link-state routing
- IPv4: fragmentation, CIDR notation and Network Address Translation (NAT)
- TCP: flow control and congestion control; socket API
- DNS and HTTP

## Topics to study

### 1. Network layering

- Why networks use layers and what each layer provides
- Protocols, services and interfaces
- Encapsulation and decapsulation
- Protocol data units and headers
- Mapping common network functions to layers

### 2. Switching and performance metrics

- Circuit switching
- Packet switching: datagram and virtual-circuit approaches
- Store-and-forward transmission
- Transmission, propagation, processing and queuing delay
- Throughput, bandwidth, latency and packet loss
- Delay and throughput calculations for a path of links

### 3. Data link layer

#### Error detection

- Parity checks
- Checksums
- Cyclic redundancy check (CRC)
- Detectable error patterns and basic CRC calculations

#### Medium Access Control

- Purpose of MAC protocols and sharing a broadcast channel
- Contention-based and controlled access concepts
- Collision behavior and efficiency calculations for basic protocols

#### Ethernet

- Ethernet framing and MAC addresses
- Ethernet switching and forwarding-table behavior
- Learning and flooding in an Ethernet switch
- Collision domains and broadcast domains

### 4. Routing

- Routing tables and next-hop forwarding
- Distance-vector routing and iterative route updates
- Link-state routing and shortest-path computation
- Convergence and routing loops
- Count-to-infinity problem and split horizon
- Comparing distance-vector and link-state approaches

### 5. IPv4

- IPv4 datagram fields relevant to fragmentation
- Fragmentation using MTU, fragment offsets and the More Fragments flag
- Reassembling fragments at the destination
- CIDR prefixes, address blocks and subnet ranges
- Network and broadcast addresses
- Longest-prefix matching
- NAT address and port translation

### 6. TCP

#### Flow control

- Receiver-advertised window
- Sender and receiver windows
- Sliding-window behavior
- Window-based throughput calculations

#### Congestion control

- Congestion window and slow start
- Congestion avoidance
- Response to loss and timeout
- Effective sending window as limited by receiver and congestion windows
- Throughput and round-trip-time calculations

#### Socket API

- Client and server socket roles
- Bind, listen, accept, connect, send/receive and close operations
- TCP connection setup and byte-stream behavior

### 7. DNS

- Name hierarchy and domain-name resolution
- Recursive and iterative queries
- DNS caching and time to live
- Common DNS record types and their purpose
- Resolution-time calculations involving query paths and caching

### 8. HTTP

- Request and response structure
- Methods, status codes and headers
- Persistent and non-persistent connections
- Web-object transfer and response-time calculations
- HTTP interaction with DNS and TCP

## Recommended study order

1. Layering and switching
2. Delay, throughput and other performance calculations
3. Data link layer, MAC and Ethernet
4. IPv4 addressing, fragmentation and NAT
5. Routing algorithms
6. TCP flow and congestion control
7. Socket API, DNS and HTTP

## Official reference

[GATE 2027 CS syllabus PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf)
