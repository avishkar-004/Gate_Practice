/*
 * Original GATE-style practice items for the official Programming and Data
 * Structures syllabus. Items are authored for this practice app, not copied
 * from past papers. Parameterized variants keep calculations varied.
 */
(() => {
  const topics = [];
  const mcq = (prompt, correct, wrong, explanation, difficulty = 'MODERATE') => ({
    type: 'MCQ', difficulty, prompt,
    options: [...new Set([correct, ...wrong])].sort((a, b) => hash(a) - hash(b)),
    answer: [correct], explanation
  });
  const msq = (prompt, options, answer, explanation, difficulty = 'CHALLENGING') => ({type:'MSQ',difficulty,prompt,options,answer,explanation});
  const nat = (prompt, answer, explanation, difficulty = 'MODERATE') => ({type:'NAT',difficulty,prompt,answer:String(answer),explanation});
  function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h;}
  function add(title, subtitle, icon, questions){ topics.push({title,subtitle,icon,questions}); }

  // C programming — 13 items
  {
    const q=[];
    for(let i=0;i<4;i++){
      const n=3+i, k=2+i;
      q.push(mcq(`In a C implementation where int occupies 4 bytes, let int a[${n}][${k}]; What is the byte offset of a[${n-1}][${k-1}] from the start of a (0-based row-major layout)?`,String(4*(n*k-1)),[String(4*n*k),String(4*(n+k-2)),String(4*(n*k-n))],`In row-major order the element index is (${n-1})×${k}+(${k-1}) = ${n*k-1}. Multiplying by 4 bytes gives ${4*(n*k-1)} bytes.`));
    }
    for(let i=0;i<3;i++){
      const n=5+i;
      q.push(mcq(`Consider: int a[${n}]={0}; int *p=a; printf("%d", *(p+${i+2})); What is printed?`, '0',['1','The address of a[0]','Undefined behavior'],`All elements not explicitly initialized in this aggregate are initialized to zero. Pointer arithmetic p+${i+2} points to a[${i+2}], so the printed value is 0.`));
    }
    for(let i=0;i<3;i++){
      const a=2+i,b=5+i;
      q.push(mcq(`A function receives two int parameters by value. Its body executes x=${b}; y=${a}; The caller passed x=${a}, y=${b}. What are the caller's values after the function returns?`,`x=${a}, y=${b}`,[`x=${b}, y=${a}`,`x=${a}, y=${a}`,`x=${b}, y=${b}`],'C passes ordinary scalar arguments by value. Assignments to the local parameter copies do not change the caller variables.'));
    }
    for(let i=0;i<3;i++){
      const n=4+i;
      q.push(mcq(`Assume int is 4 bytes. In the scope containing int a[${n}];, what is sizeof(a) / sizeof(a[0])?`,String(n),['4',String(4*n),'Implementation-dependent'],`Here a is an array, so sizeof(a) is ${n}×4 bytes and sizeof(a[0]) is 4 bytes. Their ratio is ${n}.`));
    }
    q.push(msq('Which statements about C arrays and pointers are correct?',[
      'In most expressions, an array expression is converted to a pointer to its first element.',
      'The sizeof operator applied directly to an array gives the size of its pointer.',
      'Pointer arithmetic advances in units of the pointed-to type.',
      'Two pointers into the same array can be subtracted to obtain an element distance.'
    ],['In most expressions, an array expression is converted to a pointer to its first element.','Pointer arithmetic advances in units of the pointed-to type.','Two pointers into the same array can be subtracted to obtain an element distance.'],'Array-to-pointer conversion has exceptions such as sizeof. sizeof(array) measures the full array, while pointer arithmetic and subtraction are measured in elements.'));
    add('C Programming','Pointers, arrays, functions & code tracing','⌘',q);
  }
  // Recursion — 13 items
  {
    const q=[];
    for(let i=0;i<4;i++){
      const n=4+i;
      q.push(nat(`Let f(n) be defined by f(0)=0 and f(n)=n+f(n-1) for n>0. Find f(${n}).`,n*(n+1)/2,`Expanding gives 1+2+…+${n} = ${n}(${n}+1)/2 = ${n*(n+1)/2}.`));
    }
    for(let i=0;i<3;i++){
      const n=5+i;
      q.push(mcq(`A recursive procedure makes exactly one call on input n-1 until n=0. If the initial input is ${n}, how many total invocations occur, including the base-case invocation?`,String(n+1),[String(n),String(2*n),String(n-1)],`The invocation sequence is n,n−1,…,1,0, which contains ${n+1} calls.`));
    }
    for(let i=0;i<3;i++){
      const n=4+i;
      q.push(mcq(`A procedure is defined as T(n)=2T(n/2)+n for n>1, with T(1)=1 and n a power of 2. What is the asymptotic order of T(n)?`,'Θ(n log n)',['Θ(n)','Θ(n²)','Θ(log n)'],'At every level of the recursion tree, the total non-recursive work is n. There are log₂n levels, giving Θ(n log n).','CHALLENGING'));
    }
    for(let i=0;i<3;i++){
      const n=6+i;
      q.push(mcq(`A recursive function returns 1 for n≤1 and otherwise returns n×F(n−1). What does F(${n}) return?`,String(fact(n)),[String(fact(n-1)),String(n*n),String(fact(n)+1)],`The recurrence computes n!; therefore F(${n}) = ${n}! = ${fact(n)}.`));
    }
    q.push(msq('For the recursive definition T(n)=2T(n/2)+n, with T(1)=Θ(1) and n a power of 2, which statements are true?',[
      'The recursion tree has Θ(log n) levels.',
      'The total non-recursive work at each level is Θ(n).',
      'The total running time is Θ(n log n).',
      'The recursion uses Θ(n) stack depth.'
    ],['The recursion tree has Θ(log n) levels.','The total non-recursive work at each level is Θ(n).','The total running time is Θ(n log n).'],'Each split halves the problem, so there are Θ(log n) levels. The aggregate work per level is n, giving Θ(n log n); the recursion depth is logarithmic.'));
    add('Recursion','Call traces, recurrences & stack depth','↻',q);
  }
  function fact(n){let x=1;for(let j=2;j<=n;j++)x*=j;return x;}
  // Arrays — 13
  {
    const q=[];
    for(let i=0;i<4;i++){
      const r=3+i,c=4+i,j=1+i;
      q.push(nat(`An integer matrix A[${r}][${c}] is stored in row-major order. Integers occupy 4 bytes and A[0][0] is at address 1000. What is the address of A[${r-1}][${j}]?`,1000+4*((r-1)*c+j),`Row-major element offset = (${r-1})×${c}+${j} = ${(r-1)*c+j} elements. Address = 1000 + 4×${(r-1)*c+j} = ${1000+4*((r-1)*c+j)}.`));
    }
    for(let i=0;i<3;i++){
      const n=8+i*2, k=2+i;
      const upperCount=Math.floor((n-1)/2), upperWorst=Math.floor(Math.log2(upperCount))+1;
      q.push(mcq(`A sorted array has ${n} elements. Binary search uses mid=floor((low+high)/2) and checks the middle element first. If the key is larger than the middle and the search continues in the upper half, what is the maximum number of additional comparisons needed in the worst case?`,String(upperWorst),[String(upperWorst+1),String(n-1),String(Math.max(1,upperWorst-1))],`With mid=floor((low+high)/2), the upper half has ${upperCount} elements. Binary search on ${upperCount} elements needs at most floor(log₂ ${upperCount})+1 = ${upperWorst} comparisons.`));
    }
    for(let i=0;i<3;i++){
      const n=5+i, val=2+i;
      q.push(mcq(`The array [${Array.from({length:n},(_,z)=>z+1).join(', ')}] is left-rotated by ${val} positions. What is the first element of the result?`,String(val+1),[String(n),'1',String(Math.max(2,val))],`A left rotation by ${val} positions moves the element at index ${val} to the first position. The array is 1-based in value, so the first value is ${val+1}.`));
    }
    for(let i=0;i<3;i++){
      const n=6+i;
      q.push(nat(`A one-dimensional array has ${n} elements. Starting from index 0, how many array positions are visited by a loop for (i=0; i<${n}; i+=2)?`,Math.ceil(n/2),`The visited indices are 0,2,4,… below ${n}; the count is ⌈${n}/2⌉ = ${Math.ceil(n/2)}.`));
    }
    q.push(msq('For a two-dimensional array stored in row-major order, which statements are correct?',[
      'Elements in the same row occupy consecutive memory locations.',
      'For A[R][C], the element A[i][j] has linear element offset iC+j from A[0][0].',
      'The address difference between A[0][0] and A[1][0] is one element.',
      'The address difference between A[0][0] and A[0][1] is one element.'
    ],['Elements in the same row occupy consecutive memory locations.','For A[R][C], the element A[i][j] has linear element offset iC+j from A[0][0].','The address difference between A[0][0] and A[0][1] is one element.'],'Row-major storage lays out each row consecutively; moving to the next row skips C elements. Adjacent columns differ by one element.'));
    add('Arrays','Indexing, memory layout & operations','▤',q);
  }
  // Linked lists — 13
  {
    const q=[];
    for(let i=0;i<4;i++){
      const n=5+i;
      q.push(mcq(`A singly linked list contains ${n} nodes. Starting only with a pointer to the head, what is the worst-case number of next-pointer traversals needed to reach the last node?`,String(n-1),[String(n),String(Math.ceil(Math.log2(n))),String(1)],`The head is already at the first node. Reaching node ${n} requires following ${n-1} next links.`));
    }
    for(let i=0;i<3;i++){
      const n=4+i, target=n+3;
      q.push(mcq(`A singly linked list has a pointer to its head and contains ${target} nodes. A new node is inserted immediately after node ${n}. How many next-pointer fields are assigned in total, including the new node's field?`,'2',['1','3','0'],'The new node points to the former successor, and node n is redirected to the new node. Exactly two next fields are assigned.'));
    }
    for(let i=0;i<3;i++){
      const n=5+i;
      q.push(mcq(`A singly linked list has ${n} nodes. A standard iterative reversal uses three pointers (previous, current, next). How many next fields are reassigned during reversal?`,String(n),[String(n-1),String(2*n),String(1)],`Each of the ${n} nodes has its next pointer redirected once; the final node is also assigned null. Total: ${n}.`));
    }
    for(let i=0;i<3;i++){
      const n=6+i;
      q.push(mcq(`A circular singly linked list has ${n} nodes and only a tail pointer is maintained, with tail.next pointing to the head. What is the time complexity to insert a new node at the head?`,'Θ(1)',['Θ(log n)','Θ(n)','Θ(n log n)'],'The head is tail.next. Link the new node to the old head and update tail.next; no traversal is needed.'));
    }
    q.push(msq('A singly linked list is given only by a head pointer. Which operations can be performed in Θ(1) worst-case time?',[
      'Insert a new node at the head.',
      'Delete the head node.',
      'Find the node at position n/2.',
      'Append a node at the tail.'
    ],['Insert a new node at the head.','Delete the head node.'],'Head insertion and deletion require only changing the head link. Reaching a middle or tail position requires traversal without extra pointers.'));
    add('Linked Lists','Traversal, insertion, deletion & reversal','↗',q);
  }
  // Stacks and queues — 13
  {
    const q=[];
    const sequences=[['push 2, push 5, pop, push 7, pop, pop','5, 7, 2'],['push 4, push 1, pop, push 3, pop, pop','1, 3, 4'],['push 6, pop, push 2, push 9, pop, pop','6, 9, 2'],['push 8, push 3, pop, pop','3, 8']];
    for(const [seq,answer] of sequences) q.push(mcq(`A stack is initially empty. Operations are performed in order: ${seq}. What is the sequence of values returned by pop, in order?`,answer,[answer.split(', ').reverse().join(', '),answer.split(', ').sort().join(', '),'The sequence depends on implementation'],'A stack is LIFO. Simulating the operations yields the pop values shown, from the first pop to the last.'));
    for(let i=0;i<3;i++){
      const n=5+i;
      q.push(mcq(`A circular queue has an array of size ${n} and uses the one-empty-slot convention to distinguish full from empty. What is its maximum number of stored elements?`,String(n-1),[String(n),String(n-2),String(Math.floor(n/2))],`One array slot must remain unused, so capacity is ${n}−1 = ${n-1}.`));
    }
    for(let i=0;i<3;i++){
      const n=4+i;
      q.push(mcq(`An initially empty queue receives ${n} enqueue operations followed by ${n-1} dequeue operations. How many elements remain?`,'1',['0',String(n),String(n-1)],`Queue size changes by +${n} and then −${n-1}, leaving one element.`));
    }
    for(let i=0;i<3;i++){
      const n=3+i;
      q.push(mcq(`A stack is used to evaluate the postfix expression: ${n} ${n+1} + ${n+2} *. What value is produced?`,String((2*n+1)*(n+2)),[String(n+(n+1)*(n+2)),String(2*n+n+2),String((n+1)*(n+2))],`First compute ${n}+${n+1}=${2*n+1}; then multiply by ${n+2}, giving ${(2*n+1)*(n+2)}.`));
    }
    q.push(msq('Which statements about a queue implemented by a circular array using one unused slot are correct?',[
      'The queue is empty when front equals rear.',
      'The queue is full when (rear+1) mod capacity equals front.',
      'Its usable capacity is equal to the array length.',
      'Both enqueue and dequeue can be Θ(1).'
    ],['The queue is empty when front equals rear.','The queue is full when (rear+1) mod capacity equals front.','Both enqueue and dequeue can be Θ(1).'],'The one-unused-slot convention makes full and empty distinguishable, with usable capacity one less than the array length. Circular index updates make both operations constant time.'));
    add('Stacks & Queues','LIFO, FIFO, circular buffers & expressions','⇅',q);
  }
  // Trees and BST — 13
  {
    const q=[];
    for(let i=0;i<4;i++){
      const n=3+i;
      const vals=Array.from({length:n},(_,z)=>z+1);
      q.push(mcq(`Keys ${vals.join(', ')} are inserted in this order into an initially empty BST. What is the height measured in edges?`,String(n-1),[String(n),String(Math.floor(Math.log2(n))),String(1)],`The keys arrive in increasing order, so each becomes the right child of the previous key. The resulting chain has ${n} nodes and height ${n-1} edges.`));
    }
    const orders=[['4, 2, 6, 1, 3','1, 2, 3, 4, 6'],['5, 3, 7, 2, 4','2, 3, 4, 5, 7'],['8, 4, 10, 2, 6','2, 4, 6, 8, 10']];
    for(const [ins,out] of orders) q.push(mcq(`The keys ${ins} are inserted into an empty binary search tree. What is the inorder traversal?`,out,[ins.split(', ').reverse().join(', '),ins,'2, 4, 6, 8, 10'],'Inorder traversal of a BST visits keys in sorted increasing order.'));
    for(let i=0;i<3;i++){
      const n=4+i;
      q.push(mcq(`A perfect binary tree has ${n} levels, with the root at level 0. How many leaves does it have?`,String(2**(n-1)),[String(2**n-1),String(2**(n-1)-1),String(n*n)],`A perfect binary tree doubles the number of nodes at each level. The last level has 2^${n-1} = ${2**(n-1)} leaves.`));
    }
    for(let i=0;i<3;i++){
      const n=7+i;
      q.push(mcq(`A full binary tree has ${n} internal nodes. How many leaves does it have?`,String(n+1),[String(n),String(2*n),String(2*n+1)],`In a full binary tree, every internal node has exactly two children; the number of leaves is internal nodes + 1 = ${n+1}.`));
    }
    q.push(msq('A binary tree has 10 nodes. Which statements must be true?',[
      'It has exactly 9 edges.',
      'Its height is at least 3 edges.',
      'It has exactly 5 leaves.',
      'It can have height 9 edges.'
    ],['It has exactly 9 edges.','Its height is at least 3 edges.','It can have height 9 edges.'],'Any tree with 10 nodes has 9 edges. A binary tree of height at most 2 has at most 7 nodes, so height is at least 3; a skewed 10-node tree has height 9.'));
    add('Trees & BSTs','Traversals, properties & search trees','⌘',q);
  }
  // Binary heaps — 13
  {
    const q=[];
    const heaps=[[4,7,9,12,15],[3,6,8,11,14,17],[2,5,7,10,13,16,19],[1,4,6,9,12,15,18,21]];
    for(const a of heaps) q.push(mcq(`The array [${a.join(', ')}] represents a min-heap. What is the value at the root?`,String(a[0]),[String(a[1]),String(a[a.length-1]),String(Math.min(...a.slice(1)))],'In a min-heap, every parent is no greater than its children; the root is the minimum element.'));
    for(let i=0;i<3;i++){
      const n=8+i*2;
      q.push(mcq(`A binary heap stores ${n} elements in a zero-indexed array. What are the indices of the left and right children of the element at index 2?`,'5 and 6',['4 and 5','6 and 7','3 and 4'],'For a zero-indexed heap, children of index i are 2i+1 and 2i+2. For i=2 these are 5 and 6.'));
    }
    for(let i=0;i<3;i++){
      const n=7+i;
      q.push(mcq(`In a zero-indexed binary heap containing ${n} elements, what is the index of the last internal node?`,String(Math.floor(n/2)-1),[String(Math.floor(n/2)),String(n-1),String(Math.floor((n-1)/2)+1)],`Leaves start at index ⌊n/2⌋. Therefore the last internal node is at index ⌊n/2⌋−1 = ${Math.floor(n/2)-1}.`));
    }
    for(let i=0;i<3;i++){
      const n=5+i, parent=2+i;
      q.push(nat(`A max-heap is stored in a zero-indexed array. What is the parent index of the element at index ${n}?`,Math.floor((n-1)/2),`For a zero-indexed heap, parent(i)=⌊(i−1)/2⌋. Here that is ⌊(${n}−1)/2⌋ = ${Math.floor((n-1)/2)}.`));
    }
    q.push(msq('A max-heap is stored in a zero-indexed array. Which statements are correct?',[
      'The root contains a maximum key.',
      'The array representation is necessarily sorted.',
      'The parent of index i>0 is floor((i−1)/2).',
      'A heap with n elements has height Θ(log n).'
    ],['The root contains a maximum key.','The parent of index i>0 is floor((i−1)/2).','A heap with n elements has height Θ(log n).'],'The heap order puts a maximum at the root, but does not sort the entire array. A binary heap is complete, so its height is logarithmic.'));
    add('Binary Heaps','Heap order, array indices & operations','△',q);
  }
  // Graphs — 13
  {
    const q=[];
    for(let i=0;i<4;i++){
      const n=4+i;
      q.push(nat(`A simple undirected graph has ${n} vertices. What is the maximum possible number of edges?`,n*(n-1)/2,`At most one edge can connect each unordered vertex pair: C(${n},2) = ${n}×${n-1}/2 = ${n*(n-1)/2}.`));
    }
    for(let i=0;i<3;i++){
      const n=5+i;
      q.push(mcq(`A connected undirected graph has ${n} vertices and exactly ${n-1} edges. Which statement must hold?`,'The graph is a tree',['The graph contains a cycle','The graph is complete','The graph is disconnected'],'Every connected graph has a spanning tree with n−1 edges. Since the graph has exactly that many edges, it has no additional cycle edges and is itself a tree.','CHALLENGING'));
    }
    q.push(mcq(`An undirected graph has edges (A,B), (A,C), (B,D), (C,E). BFS starts at A and visits adjacent vertices in alphabetical order. What is the BFS order?`,'A, B, C, D, E',['A, C, E, B, D','A, B, D, C, E','A, B, C, E, D'],'BFS visits all distance-1 vertices before distance-2 vertices. Alphabetical neighbor order gives B,C first, then D,E.'));
    q.push(mcq(`An undirected graph has edges (A,B), (A,D), (B,C), (B,E), (D,E). BFS starts at A and visits adjacent vertices alphabetically. What is the BFS order?`,'A, B, D, C, E',['A, D, E, B, C','A, B, C, E, D','A, B, D, E, C'],'From A, enqueue B then D. Processing B discovers C then E; D has no new neighbor. Hence A,B,D,C,E.'));
    q.push(mcq(`An undirected graph has edges (P,Q), (P,R), (Q,S), (R,S), (S,T). BFS starts at P and visits adjacent vertices alphabetically. What is the BFS order?`,'P, Q, R, S, T',['P, R, S, Q, T','P, Q, S, R, T','P, Q, R, T, S'],'P discovers Q and R. Processing Q discovers S; R adds no new vertex; S then discovers T.'));
    for(let i=0;i<3;i++){
      const n=6+i;
      q.push(mcq(`An adjacency matrix for a simple undirected graph has ${n} vertices and no self-loops. How many entries are guaranteed to be zero on the diagonal?`,String(n),[String(n*n),String(n-1),String(0)],`A simple graph has no self-loops, so all ${n} diagonal entries are zero.`));
    }
    for(let i=0;i<3;i++){
      const n=4+i;
      q.push(mcq(`A connected graph is represented by adjacency lists. A complete traversal visits every vertex and examines each adjacency-list entry once. For an undirected graph with ${n} vertices and ${n+1} edges, how many adjacency-list entries are examined?`,String(2*(n+1)),[String(n+1),String(n*(n-1)),String(2*n)],`Every undirected edge appears in two adjacency lists, so the total entries are 2E = 2(${n+1}) = ${2*(n+1)}.`));
    }
    q.push(msq('For a simple undirected graph with n vertices and m edges, which statements are always true?',[
      'The sum of vertex degrees is 2m.',
      'An adjacency matrix is symmetric.',
      'An adjacency-list representation uses Θ(n+m) space.',
      'A connected graph must have at least n edges.'
    ],['The sum of vertex degrees is 2m.','An adjacency matrix is symmetric.','An adjacency-list representation uses Θ(n+m) space.'],'Each undirected edge contributes two to the degree sum. Undirected adjacency is symmetric; adjacency lists store vertices and edge incidences. A connected graph needs only n−1 edges.'));
    add('Graphs','Representations, traversal & graph properties','◎',q);
  }

  // Extend every syllabus topic to exactly 100 items. Each family below varies
  // its input data so the practice set contains distinct calculations/traces.
  function numericMCQ(prompt, answer, explanation, step=1){
    const a=Number(answer);
    return mcq(prompt,String(answer),[String(a+step),String(a-step),String(a+2*step)],explanation);
  }
  function supplement(topicIndex, i){
    const v=i+1, r=Math.floor(i/10), variant=i%10;
    switch(topicIndex){
      case 0: { // C
        const n=5+r, k=1+(r%4), base=1000+40*r;
        switch(variant){
          case 0:return nat(`Let int a[${n}] and int *p=&a[${r%3}]. What is the value of (p+${k})-p?`,k,`Pointer subtraction within the same array returns the number of elements between the pointers: ${k}.`);
          case 1:return numericMCQ(`Assume sizeof(int)=4. For int a[${n}];, evaluate sizeof(a)/sizeof(a[0]).`,n,`The array occupies ${n}×4 bytes and each element occupies 4 bytes, so the ratio is ${n}.`);
          case 2:{const idx=r%3, j=idx+k;return nat(`Assume int is 4 bytes and int a[${n}]. If &a[0] is byte address ${base}, what is the byte address of a[${j}]?`,base+4*j,`The element is ${j} positions from the start, so its address is ${base}+4×${j}=${base+4*j}.`);}
          case 3:{const x=2+r,y=5+r;return mcq(`For int a[]={${x},${y},${y+2}}; int *p=a; int z=*p++; what are (z, *p) after the statement?`,`(${x}, ${y})`,[`(${y}, ${x})`,`(${x}, ${y+2})`,`(${x+1}, ${y})`],'Postfix increment uses the old pointer to fetch a[0], then advances p to a[1].');}
          case 4:{const x=3+r,y=7+r;return mcq(`A C function receives int x and int y by value. The caller invokes f(${x},${y}); inside f, x=y; y=x+1;. What are the caller's values after return?`,`(${x}, ${y})`,[`(${y}, ${x+1})`,`(${y}, ${y+1})`,`(${x+1}, ${y+1})`],'The function modifies only its local parameter copies; the caller variables are unchanged.');}
          case 5:{const x=3+r,index=1+(r%3);return numericMCQ(`For int a[${index+2}]={${x}};, what is a[${index}]?`,0,'Only the first element is explicitly initialized; the remaining elements of this aggregate are zero-initialized.');}
          case 6:{const rows=3+r%3,cols=4+r%4,row=rows-1,col=r%cols,off=row*cols+col;return nat(`A[${rows}][${cols}] is row-major. How many elements after A[0][0] is A[${row}][${col}]?`,off,`The row-major offset is row×number-of-columns+column = ${row}×${cols}+${col}=${off}.`);}
          case 7:{const len=6+r,idx=1+r%3;return mcq(`Let int a[${len}]; int *p=&a[${idx}]; Which expression refers to a[${idx+1}]?`,'p + 1',['p + sizeof(int)','(char*)p + 1','p - 1'],'Adding 1 to an int pointer advances by one int element.');}
          case 8:{const x=4+r,y=9+r;return mcq(`A function receives integers ${x} and ${y} by value and swaps its local parameters using a temporary variable. What happens to the caller's arguments?`,'They remain unchanged',['They are swapped','Only the first is changed','The result is undefined'],'C passes these scalar arguments by value; swapping local copies does not affect caller variables.');}
          default:{const len=5+r;return numericMCQ(`Assume int a[${len}]. What is the value of sizeof(a) in bytes when sizeof(int)=4?`,4*len,`sizeof on the array itself is ${len}×4=${len*4} bytes.`);}
        }
      }
      case 1: { // Recursion
        const n=4+r;
        switch(variant){
          case 0:return nat(`A recursive function is defined by S(0)=0 and S(n)=n+S(n−1). Find S(${n}).`,n*(n+1)/2,`S(${n}) is the sum 1+…+${n}=${n*(n+1)/2}.`);
          case 1:return numericMCQ(`A function makes one recursive call on n−1 until the base case n=0. Starting at n=${n}, how many invocations occur, including the base case?`,n+1,`The inputs are ${n},${n-1},…,0, which gives ${n+1} invocations.`);
          case 2:{let a=0,b=1;for(let z=0;z<n;z++){const t=a+b;a=b;b=t;}return nat(`Define F(0)=0, F(1)=1 and F(n)=F(n−1)+F(n−2). Find F(${n}).`,a,`Applying the recurrence successively gives F(${n})=${a}.`);}
          case 3:return mcq(`For T(n)=T(n/2)+1, T(1)=1 and n a power of 2, what is the asymptotic order?`,'Θ(log n)',['Θ(n)','Θ(n log n)','Θ(1)'],'Each recursive call halves n, producing logarithmic depth and constant work per level.');
          case 4:return mcq(`For T(n)=2T(n/2)+1, T(1)=1 and n a power of 2, what is the asymptotic order?`,'Θ(n)',['Θ(log n)','Θ(n log n)','Θ(n²)'],'There are n leaves in the recursion tree and constant work per internal node, for total Θ(n).');
          case 5:return nat(`A recursive procedure executes exactly one call for each input n,n−1,…,1 and stops at 0. What is the maximum number of simultaneously active calls when started at ${n}?`,n+1,`The call chain includes n through 0, so there are ${n+1} active frames at maximum depth.`);
          case 6:return nat(`R(0)=0 and R(n)=R(n−1)+${n}. Find R(${n}).`,n*n,`The increment ${n} is added once for each of the ${n} recursive levels: ${n}×${n}=${n*n}.`);
          case 7:return numericMCQ(`A recursion tree has 2 children at every internal node and stops after ${n} levels of branching. How many leaves does it have?`,2**n,`Each level doubles the number of branches; after ${n} levels there are 2^${n}=${2**n} leaves.`);
          case 8:return mcq(`The recurrence T(n)=T(n−1)+n with T(0)=1 has what asymptotic order?`,'Θ(n²)',['Θ(n)','Θ(log n)','Θ(n log n)'],'Expanding gives a sum of the first n integers, which is Θ(n²).');
          default:return numericMCQ(`A recursive function computes n! with one recursive call on n−1 and base value 1 at n=1. What is its value at n=${n}?`,fact(n),`The recurrence multiplies n(n−1)…1, giving ${fact(n)}.`);
        }
      }
      case 2: { // Arrays
        const rows=3+r%4,cols=4+r%5,row=1+r%(rows-1),col=r%cols,n=7+r;
        switch(variant){
          case 0:{const off=row*cols+col;return nat(`A[${rows}][${cols}] is row-major, with 8-byte elements. Find the byte offset of A[${row}][${col}] from A[0][0].`,8*off,`Row-major element offset=${row}×${cols}+${col}=${off}; byte offset=${off}×8=${8*off}.`);}
          case 1:{const off=col*rows+row;return nat(`A[${rows}][${cols}] is column-major, with 4-byte elements. Find the byte offset of A[${row}][${col}] from A[0][0].`,4*off,`Column-major element offset=${col}×${rows}+${row}=${off}; byte offset=${off}×4=${4*off}.`);}
          case 2:return numericMCQ(`A loop executes for (i=0; i<${n}; i+=${1+r%3}). How many iterations occur?`,Math.ceil(n/(1+r%3)),`The loop visits multiples of ${1+r%3} below ${n}; the count is ceil(${n}/${1+r%3})=${Math.ceil(n/(1+r%3))}.`);
          case 3:return numericMCQ(`Inserting an element at index ${r%4} of a contiguous array containing ${n} elements requires how many existing elements to shift right?`,n-r%4,`All elements from the insertion index through the old last element shift: ${n}−${r%4}=${n-r%4}.`);
          case 4:{const rot=1+r%(n-1);return numericMCQ(`The array [${Array.from({length:n},(_,z)=>z+1).join(', ')}] is left-rotated by ${rot} positions. What is its first value?`,rot+1,`The value originally at index ${rot} (zero-based) moves to the first position; its value is ${rot+1}.`);}
          case 5:return numericMCQ(`A maximum is found by scanning an unsorted array of ${n} elements once, retaining the largest seen value. How many element-to-maximum comparisons are made?`,n-1,`The first element initializes the current maximum; each of the remaining ${n-1} elements is compared once.`);
          case 6:return numericMCQ(`A loop sums all entries of an n-element array using one addition per entry, starting from sum=0. For n=${n}, how many additions are performed?`,n,`One addition is executed for each of the ${n} elements.`);
          case 7:return numericMCQ(`Reversing an array of ${n} elements in place by swapping symmetric pairs requires how many swaps?`,Math.floor(n/2),`Each swap handles two elements, so the count is floor(${n}/2)=${Math.floor(n/2)}.`);
          case 8:return numericMCQ(`An array has ${n} elements. A left-to-right pass compares every adjacent pair exactly once. How many comparisons are made?`,n-1,`There are ${n}−1 adjacent pairs.`);
          default:{const off=row*cols+col;return nat(`A[${rows}][${cols}] has 4-byte elements in row-major order. If A[0][0] is at address 1200, find the address of A[${row}][${col}].`,1200+4*off,`Element offset=${row}×${cols}+${col}=${off}; address=1200+4×${off}=${1200+4*off}.`);}
        }
      }
      case 3: { // Linked lists
        const n=6+r, pos=1+r%(n-2);
        switch(variant){
          case 0:return numericMCQ(`A singly linked list contains ${n} nodes. Starting at the head, how many next links must be followed to reach the last node?`,n-1,`The last node is ${n-1} links beyond the head.`);
          case 1:return mcq(`A pointer to the head of a singly linked list is available. What is the worst-case time to access its ${pos}th node?`,'Θ(n)',['Θ(1)','Θ(log n)','Θ(n log n)'],'A singly linked list has no direct indexing; nodes must be followed from the head.');
          case 2:return numericMCQ(`A node is inserted after a known node in a singly linked list. How many next-pointer fields are assigned, counting the new node?`,2,'The new node points to the old successor and the predecessor points to the new node.');
          case 3:return numericMCQ(`An iterative reversal processes a singly linked list of ${n} nodes. How many node next fields are redirected?`,n,`Each node's next field is assigned once during the traversal.`);
          case 4:return numericMCQ(`A list has ${n} nodes. Starting slow and fast at the head, a loop advances slow once and fast twice while fast and fast.next are non-null. How many times does slow advance?`,Math.floor(n/2),`The loop condition permits floor(${n}/2)=${Math.floor(n/2)} iterations; each advances slow once.`);
          case 5:return mcq(`In a doubly linked list, inserting a node between two existing adjacent nodes generally requires how many link fields to be updated?`,'4',['2','3','6'],'Set the new node’s prev and next fields, plus the predecessor’s next and successor’s prev fields.');
          case 6:return mcq(`A circular singly linked list is maintained with a tail pointer and tail.next is the head. What is the time to insert a node at the head?`,'Θ(1)',['Θ(log n)','Θ(n)','Θ(n log n)'],'The head is available as tail.next; update two links without traversal.');
          case 7:return mcq(`A singly linked list has only a head pointer. What is the worst-case time to append a node at the end?`,'Θ(n)',['Θ(1)','Θ(log n)','Θ(n log n)'],'Without a tail pointer, the list must be traversed to find its last node.');
          case 8:return numericMCQ(`A doubly linked list contains ${n} nodes. Starting from the tail, how many prev links are followed to reach the head?`,n-1,`There is one prev link between each adjacent pair, giving ${n-1} links.`);
          default:return mcq(`A singly linked list has ${n} nodes and a pointer to its head. Deleting the head requires what asymptotic time?`,'Θ(1)',['Θ(log n)','Θ(n)','Θ(n log n)'],'Update the head pointer to head.next; no scan is required.');
        }
      }
      case 4: { // Stacks and queues
        const n=5+r,cap=6+r;
        switch(variant){
          case 0:{const pushes=[2+v,5+v,7+v];const popped=[pushes[1],pushes[2],pushes[0]];return mcq(`An empty stack performs push ${pushes[0]}, push ${pushes[1]}, pop, push ${pushes[2]}, pop, pop. What values are popped, in order?`,popped.join(', '),[popped.slice().reverse().join(', '),[pushes[0],pushes[1],pushes[2]].join(', '),'The stack underflows'],'The stack is LIFO: the second pushed item is popped first, then the new item, then the bottom item.');}
          case 1:return numericMCQ(`A circular queue of array capacity ${cap} uses one unused slot. What is its maximum number of stored elements?`,cap-1,`One slot distinguishes full from empty, so capacity is ${cap}−1=${cap-1}.`);
          case 2:return numericMCQ(`A queue receives ${n+2} enqueue operations followed by ${n} dequeue operations. How many elements remain?`,2,`Queue size changes by +${n+2}−${n}=2.`);
          case 3:{const a=2+r,b=4+r,c=6+r;return numericMCQ(`Evaluate the postfix expression ${a} ${b} + ${c} *.`,(a+b)*c,`The first operator gives ${a}+${b}=${a+b}; multiply by ${c} to obtain ${(a+b)*c}.`);}
          case 4:return numericMCQ(`A stack is initially empty. Push ${n} items and then pop ${Math.floor(n/2)} items. How many items remain?`,n-Math.floor(n/2),`${n}−${Math.floor(n/2)}=${n-Math.floor(n/2)} items remain.`);
          case 5:return mcq(`A deque supports insertion and deletion at both ends. Which structure is it?`,'A double-ended queue',['A priority queue','A stack only','A circular singly linked list'],'A deque (double-ended queue) permits operations at both front and rear.');
          case 6:return mcq(`A stack is used to test whether parentheses are balanced. Which input causes an attempted pop from an empty stack?`,'())(',['(())','()()','(()())'],'The third character is a closing parenthesis with no unmatched opening parenthesis available.');
          case 7:return numericMCQ(`A circular queue has capacity ${cap}, uses the one-empty-slot convention, and currently stores ${cap-2} elements. How many more elements can it accept before full?`,1,'Usable capacity is cap−1. Current size is cap−2, leaving exactly one free usable slot.');
          case 8:return mcq(`In an array-based stack with a top index, which condition represents an empty stack when top is initialized to −1?`,'top == −1',['top == 0','top == capacity','top == capacity−1'],'The convention initializes top to −1 and increments it on each push.');
          default:return numericMCQ(`An initially empty queue receives ${n} enqueues. Then ${Math.floor(n/2)} items are dequeued. How many elements remain?`,n-Math.floor(n/2),`The queue size is ${n}−${Math.floor(n/2)}=${n-Math.floor(n/2)}.`);
        }
      }
      case 5: { // Trees and BST
        const n=4+r;
        switch(variant){
          case 0:{const vals=Array.from({length:n},(_,z)=>z+1);return numericMCQ(`The keys ${vals.join(', ')} are inserted in order into an empty BST. What is its height in edges?`,n-1,`Increasing insertion order creates a right-skewed chain of ${n} nodes, whose height is ${n-1} edges.`);}
          case 1:return numericMCQ(`A perfect binary tree has ${n} levels, with root at level 0. How many leaves does it have?`,2**(n-1),`The last level contains 2^${n-1}=${2**(n-1)} nodes.`);
          case 2:return numericMCQ(`A full binary tree has ${n} internal nodes. How many leaves does it have?`,n+1,`For a full binary tree, leaves = internal nodes + 1 = ${n+1}.`);
          case 3:return numericMCQ(`A binary tree has ${n} nodes. How many edges does it have?`,n-1,`Every tree with n nodes has n−1 edges.`);
          case 4:return mcq(`In a BST, which traversal lists the keys in nondecreasing order?`,'Inorder',['Preorder','Postorder','Level order'],'Inorder visits left subtree, node, then right subtree; the BST ordering makes this sorted.');
          case 5:return numericMCQ(`A perfect binary tree has ${n} levels. How many total nodes does it contain?`,2**n-1,`The level sizes are 1+2+…+2^${n-1}=2^${n}−1=${2**n-1}.`);
          case 6:return mcq(`A binary tree has n nodes. Which is the maximum possible height measured in edges?`,'n−1',['floor(log₂ n)','n','2n−1'],'A skewed tree forms a chain with n−1 edges.' .replace('n−1',`${n}−1`));
          case 7:return numericMCQ(`A full binary tree has ${n} internal nodes. How many total nodes does it have?`,2*n+1,`A full binary tree has n internal nodes and n+1 leaves, totaling 2n+1=${2*n+1}.`);
          case 8:return mcq(`In a BST containing distinct keys, where is the minimum key located?`,'At the leftmost node',['At the root','At the rightmost node','At the deepest leaf'],'Repeatedly following left children reaches the smallest key.');
          default:return numericMCQ(`A binary tree has ${n} nodes and is a single chain. What is its height in edges?`,n-1,`A chain of ${n} nodes contains ${n-1} edges.`);
        }
      }
      case 6: { // Heaps
        const n=7+r;
        switch(variant){
          case 0:return numericMCQ(`In a zero-indexed heap, what is the left-child index of the node at index ${r+1}?`,2*(r+1)+1,`The left child index is 2i+1; for i=${r+1}, it is ${2*(r+1)+1}.`);
          case 1:return numericMCQ(`A zero-indexed heap contains ${n} elements. What is the parent index of the node at the last index, ${n-1}?`,Math.floor((n-2)/2),`parent(i)=floor((i−1)/2). For i=${n-1}, this is floor((${n-1}−1)/2)=${Math.floor((n-2)/2)}.`);
          case 2:return numericMCQ(`A zero-indexed binary heap contains ${n} elements. What is the index of its last internal node?`,Math.floor(n/2)-1,`Leaves begin at floor(n/2), so the last internal node is floor(${n}/2)−1=${Math.floor(n/2)-1}.`);
          case 3:return mcq(`Which operation on a binary heap has worst-case time Θ(log n)?`,'Insert a key',['Read the root','Check whether the heap is empty','Read the array length'],'Insertion may move the new item up a heap path of logarithmic height.');
          case 4:return mcq(`Which statement must hold for every min-heap?`,'Every parent key is no greater than its children',['The array is sorted increasingly','Every leaf has the same key','The root is the largest key'],'Heap order constrains each parent-child relation, not the full array order.');
          case 5:return mcq(`Building a binary heap from an arbitrary array using bottom-up heapify takes what asymptotic time?`,'Θ(n)',['Θ(n log n)','Θ(log n)','Θ(n²)'],'Most nodes are near the leaves and require little sift-down work; summing over levels gives Θ(n).');
          case 6:return mcq(`A binary heap contains ${n} elements. What is its asymptotic height?`,'Θ(log n)',['Θ(1)','Θ(n)','Θ(n log n)'],`A complete binary tree with ${n} nodes has logarithmic height.`);
          case 7:return mcq(`In a max-heap, after deleting the root, which operation restores heap order?`,'Move the last array element to the root and sift it down',['Move the first leaf to the root and sift it up','Sort the remaining array','Delete every node and rebuild by insertion'],'Replacing the root with the last item preserves completeness; sift-down restores the parent-child order.');
          case 8:return numericMCQ(`A min-heap contains distinct values [${n}, ${n+2}, ${n+4}, ${n+6}, ${n+8}]. What is the root value?`,n,`The root of a min-heap is the minimum value, ${n}.`);
          default:return mcq(`A binary heap is stored in a zero-indexed array. For a node at index i, what is the right-child index?`,'2i+2',['2i+1','floor((i−1)/2)','i+2'],'In a zero-indexed heap, left and right children are 2i+1 and 2i+2.');
        }
      }
      default: { // Graphs
        const n=5+r, m=3+r;
        switch(variant){
          case 0:return numericMCQ(`A simple undirected graph has ${n} vertices. What is the maximum possible number of edges?`,n*(n-1)/2,`At most one edge per unordered pair gives n(n−1)/2=${n*(n-1)/2}.`);
          case 1:return numericMCQ(`An undirected graph has ${m} edges. What is the sum of the degrees of all vertices?`,2*m,`By the handshaking lemma, the degree sum is 2E=2×${m}=${2*m}.`);
          case 2:return mcq(`For a simple undirected graph with ${n} vertices and ${m} edges, how many nonzero entries does its adjacency matrix have?`,String(2*m),[String(m),String(n*n),String(n)],`Every undirected edge contributes two symmetric off-diagonal entries, so there are 2E=${2*m}.`);
          case 3:return numericMCQ(`A connected undirected graph has ${n} vertices and exactly ${n-1} edges. How many cycles does it contain?`,0,'A connected graph with n−1 edges is a tree, and a tree is acyclic.');
          case 4:return mcq(`Which representation uses Θ(V+E) space for a sparse graph?`,'Adjacency lists',['Adjacency matrix','A V×V distance table','A complete edge matrix'],'Adjacency lists store one entry per vertex and per edge incidence.');
          case 5:return mcq(`In an undirected graph, what does BFS from a source compute for each reachable vertex?`,'The minimum number of edges in a path from the source',['A minimum-weight path for arbitrary edge weights','The number of all simple paths','A topological ordering'],'BFS explores vertices by increasing number of edges from the source, so it finds unweighted shortest-path distances.');
          case 6:return mcq(`A DFS started at one vertex visits all vertices of an undirected graph exactly when the graph is…`,'Connected',['Acyclic','Complete','Bipartite'],'DFS reaches exactly the connected component containing its start vertex.');
          case 7:return numericMCQ(`A directed graph has ${m} edges. What is the sum of all vertex indegrees?`,m,`Each directed edge contributes exactly one to the indegree of its destination; sum indegrees=E=${m}.`);
          case 8:return numericMCQ(`A directed graph has ${m} edges. What is the sum of all vertex outdegrees?`,m,`Each directed edge contributes exactly one to the outdegree of its source; sum outdegrees=E=${m}.`);
          default:return mcq(`A connected undirected graph with ${n} vertices contains a spanning tree. How many edges are in every spanning tree?`,String(n-1),[String(n),String(n*(n-1)/2),String(n-2)],`A spanning tree has all ${n} vertices and is a tree, so it has ${n}−1 edges.`);
        }
      }
    }
  }
  const extraCounts=[1,1,0,0,1,0,0,1];
  topics.forEach((topic, index) => {
    const target=100-topic.questions.length-extraCounts[index];
    for(let i=0;i<target;i++) topic.questions.push(supplement(index,i));
  });

  const all = topics.flatMap((topic, ti) => topic.questions.map((q, qi) => ({...q,id:`${ti+1}-${qi+1}`,topicIndex:ti})));
  // Four additional items strengthen pointer, recursion, queue, and graph reasoning.
  all.push(
    {...mcq('In C, if int a[6]; and int *p=a;, what is the value of (p+4)-p?','4',['16','4*sizeof(int)','The difference is undefined'],'Pointer subtraction between elements of the same array yields the number of elements between them, not the byte distance.'),id:'extra-1',topicIndex:0},
    {...mcq('For the recurrence T(n)=T(n−1)+1 with T(1)=1, what is T(n)?','Θ(n)',['Θ(log n)','Θ(n log n)','Θ(n²)'],'There are n−1 increments before the base case, so T(n)=n=Θ(n).'),id:'extra-2',topicIndex:1},
    {...mcq('A queue is implemented using a singly linked list with pointers to both head and tail. Which operation can be performed in Θ(1) time?','Both enqueue at tail and dequeue at head',['Enqueue only','Dequeue only','Neither operation'],'A tail pointer supports insertion at the end in constant time, and removing the head is also constant time.'),id:'extra-3',topicIndex:4},
    {...mcq('A DFS traversal of an undirected graph is started from one vertex. When does it visit all vertices?','Exactly when the graph is connected',['Exactly when the graph is acyclic','For every undirected graph','Exactly when every vertex has even degree'],'A traversal from one start vertex reaches precisely the vertices in that vertex’s connected component.'),id:'extra-4',topicIndex:7}
  );
  window.SUBJECT_QUESTION_BANK = {topics, questions: all};
})();
