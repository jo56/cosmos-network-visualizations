/**
 * Network Data Generators
 * Creates 10 different complex network topologies
 * Optimized for performance with reduced node counts
 */

// Helper function to generate random integer
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * 1. Scale-Free Network (Barabási–Albert model)
 * Features: Preferential attachment, power-law degree distribution
 */
export function generateScaleFreeNetwork() {
  const nodes = [];
  const links = [];
  const nodeCount = 1200; // Reduced from 5000
  const initialNodes = 5;
  const linksPerNewNode = 3;

  // Initialize initial nodes
  for (let i = 0; i < initialNodes; i++) {
    nodes.push({
      id: i,
      label: `Node ${i}`,
      group: Math.floor(i / 2)
    });
  }

  // Create initial complete graph
  for (let i = 0; i < initialNodes; i++) {
    for (let j = i + 1; j < initialNodes; j++) {
      links.push({ source: i, target: j, value: 1 });
    }
  }

  // Preferential attachment - optimized
  const degrees = new Array(nodeCount).fill(0);
  links.forEach(link => {
    degrees[link.source]++;
    degrees[link.target]++;
  });

  for (let i = initialNodes; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: `Node ${i}`,
      group: Math.floor(i / 50)
    });

    const totalDegree = degrees.reduce((a, b) => a + b, 0);
    const targets = new Set();

    while (targets.size < Math.min(linksPerNewNode, i)) {
      let r = Math.random() * totalDegree;
      for (let j = 0; j < i; j++) {
        r -= degrees[j];
        if (r <= 0 && !targets.has(j)) {
          targets.add(j);
          links.push({ source: i, target: j, value: 1 });
          degrees[i]++;
          degrees[j]++;
          break;
        }
      }
    }
  }

  return { nodes, links, name: 'Scale-Free Network', description: 'Barabási–Albert model with preferential attachment' };
}

/**
 * 2. Small World Network (Watts–Strogatz model)
 * Features: High clustering, short path lengths
 */
export function generateSmallWorldNetwork() {
  const nodes = [];
  const links = [];
  const nodeCount = 1000; // Reduced from 4000
  const k = 6; // Each node connected to k nearest neighbors
  const p = 0.1; // Rewiring probability

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: `Node ${i}`,
      group: Math.floor(i / 100)
    });
  }

  // Create ring lattice
  for (let i = 0; i < nodeCount; i++) {
    for (let j = 1; j <= k / 2; j++) {
      const target = (i + j) % nodeCount;
      links.push({ source: i, target: target, value: 1 });
    }
  }

  // Rewire edges with probability p - optimized
  const linkSet = new Set();
  links.forEach(link => {
    linkSet.add(`${link.source},${link.target}`);
  });

  links.forEach(link => {
    if (Math.random() < p) {
      const newTarget = Math.floor(Math.random() * nodeCount);
      const key = `${link.source},${newTarget}`;
      if (newTarget !== link.source && !linkSet.has(key)) {
        linkSet.delete(`${link.source},${link.target}`);
        link.target = newTarget;
        linkSet.add(key);
      }
    }
  });

  return { nodes, links, name: 'Small World Network', description: 'Watts–Strogatz model with high clustering' };
}

/**
 * 3. Random Network (Erdős–Rényi model)
 * Features: Random connections, Poisson degree distribution
 */
export function generateRandomNetwork() {
  const nodes = [];
  const links = [];
  const nodeCount = 1500; // Reduced from 6000
  const p = 0.002; // Probability of edge between any two nodes

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: `Node ${i}`,
      group: Math.floor(i / 150)
    });
  }

  // Create random edges - optimized to avoid O(n²) check
  const linkSet = new Set();
  const expectedLinks = Math.floor((nodeCount * (nodeCount - 1) / 2) * p);
  let linkCount = 0;
  
  while (linkCount < expectedLinks * 1.1) { // Generate slightly more to account for randomness
    const i = Math.floor(Math.random() * nodeCount);
    const j = Math.floor(Math.random() * nodeCount);
    if (i !== j) {
      const key1 = `${i},${j}`;
      const key2 = `${j},${i}`;
      if (!linkSet.has(key1) && !linkSet.has(key2)) {
        links.push({ source: i, target: j, value: 1 });
        linkSet.add(key1);
        linkCount++;
      }
    }
  }

  return { nodes, links, name: 'Random Network', description: 'Erdős–Rényi model with random connections' };
}

/**
 * 4. Hierarchical Network
 * Features: Tree-like structure with multiple levels
 */
export function generateHierarchicalNetwork() {
  const nodes = [];
  const links = [];
  const levels = 4; // Reduced from 5
  const branchingFactor = 4;
  let nodeId = 0;

  function createLevel(parentId, level, maxLevel) {
    if (level >= maxLevel) return;

    for (let i = 0; i < branchingFactor; i++) {
      const id = nodeId++;
      nodes.push({
        id: id,
        label: `L${level}-${i}`,
        group: level
      });

      if (parentId !== null) {
        links.push({ source: parentId, target: id, value: 1 });
      }

      // Add some cross-connections within same level
      if (level > 0 && Math.random() < 0.15) {
        const siblings = nodes.filter(n => n.group === level && n.id !== id);
        if (siblings.length > 0) {
          const sibling = siblings[Math.floor(Math.random() * siblings.length)];
          if (!links.some(l => 
            (l.source === id && l.target === sibling.id) ||
            (l.source === sibling.id && l.target === id)
          )) {
            links.push({ source: id, target: sibling.id, value: 0.5 });
          }
        }
      }

      createLevel(id, level + 1, maxLevel);
    }
  }

  createLevel(null, 0, levels);

  // Add more nodes to reach target size
  const targetSize = 800;
  const additionalNodes = Math.max(0, targetSize - nodeId);
  for (let i = nodeId; i < nodeId + additionalNodes; i++) {
    const parent = nodes[Math.floor(Math.random() * nodes.length)];
    nodes.push({
      id: i,
      label: `Node ${i}`,
      group: (parent.group + 1) % (levels + 1)
    });
    links.push({ source: parent.id, target: i, value: 1 });
  }

  return { nodes, links, name: 'Hierarchical Network', description: 'Tree-like structure with multiple levels' };
}

/**
 * 5. Modular Network
 * Features: Community-based structure with dense clusters
 */
export function generateModularNetwork() {
  const nodes = [];
  const links = [];
  const communities = 12; // Reduced from 20
  const nodesPerCommunity = 100; // Reduced from 300
  const intraCommunityDensity = 0.2; // Increased for visibility
  const interCommunityDensity = 0.002;

  let nodeId = 0;

  // Create communities
  for (let c = 0; c < communities; c++) {
    const communityNodes = [];
    
    // Create nodes in community
    for (let i = 0; i < nodesPerCommunity; i++) {
      nodes.push({
        id: nodeId,
        label: `C${c}-${i}`,
        group: c
      });
      communityNodes.push(nodeId);
      nodeId++;
    }

    // Intra-community links (dense) - optimized
    for (let i = 0; i < communityNodes.length; i++) {
      for (let j = i + 1; j < communityNodes.length; j++) {
        if (Math.random() < intraCommunityDensity) {
          links.push({ 
            source: communityNodes[i], 
            target: communityNodes[j], 
            value: 2 
          });
        }
      }
    }
  }

  // Inter-community links (sparse) - optimized
  const interLinkCount = Math.floor(nodes.length * nodes.length * interCommunityDensity);
  const linkSet = new Set();
  let interLinks = 0;
  
  while (interLinks < interLinkCount) {
    const i = Math.floor(Math.random() * nodes.length);
    const j = Math.floor(Math.random() * nodes.length);
    if (nodes[i].group !== nodes[j].group) {
      const key1 = `${i},${j}`;
      const key2 = `${j},${i}`;
      if (!linkSet.has(key1) && !linkSet.has(key2)) {
        links.push({ source: i, target: j, value: 0.5 });
        linkSet.add(key1);
        interLinks++;
      }
    }
  }

  return { nodes, links, name: 'Modular Network', description: 'Community-based structure with dense clusters' };
}

/**
 * 6. Ring Network
 * Features: Circular topology with additional connections
 */
export function generateRingNetwork() {
  const nodes = [];
  const links = [];
  const nodeCount = 1200; // Reduced from 5000
  const skipConnections = 3; // Connect to nodes skipConnections away
  const randomConnections = 0.03; // Reduced probability

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: `Node ${i}`,
      group: Math.floor(i / 200)
    });
  }

  // Create ring
  for (let i = 0; i < nodeCount; i++) {
    links.push({ 
      source: i, 
      target: (i + 1) % nodeCount, 
      value: 1 
    });
  }

  // Add skip connections - optimized
  const linkSet = new Set();
  links.forEach(link => {
    linkSet.add(`${link.source},${link.target}`);
  });

  for (let i = 0; i < nodeCount; i++) {
    for (let skip = 2; skip <= skipConnections; skip++) {
      if (Math.random() < 0.3) {
        const target = (i + skip) % nodeCount;
        const key = `${i},${target}`;
        if (!linkSet.has(key)) {
          links.push({ source: i, target: target, value: 0.8 });
          linkSet.add(key);
        }
      }
    }
  }

  // Add random connections - optimized
  const randomLinkCount = Math.floor(nodeCount * nodeCount * randomConnections);
  let randomLinks = 0;
  while (randomLinks < randomLinkCount) {
    const i = Math.floor(Math.random() * nodeCount);
    const j = Math.floor(Math.random() * nodeCount);
    if (i !== j) {
      const key1 = `${i},${j}`;
      const key2 = `${j},${i}`;
      if (!linkSet.has(key1) && !linkSet.has(key2)) {
        links.push({ source: i, target: j, value: 0.5 });
        linkSet.add(key1);
        randomLinks++;
      }
    }
  }

  return { nodes, links, name: 'Ring Network', description: 'Circular topology with additional connections' };
}

/**
 * 7. Grid Network
 * Features: 2D grid structure with diagonal connections
 */
export function generateGridNetwork() {
  const nodes = [];
  const links = [];
  const width = 40; // Reduced from 80
  const height = 30; // Reduced from 60
  const includeDiagonals = true;

  // Create nodes in grid
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const id = y * width + x;
      nodes.push({
        id: id,
        label: `(${x},${y})`,
        group: Math.floor(y / 5)
      });
    }
  }

  // Create grid edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const id = y * width + x;

      // Right neighbor
      if (x < width - 1) {
        links.push({ source: id, target: id + 1, value: 1 });
      }

      // Bottom neighbor
      if (y < height - 1) {
        links.push({ source: id, target: id + width, value: 1 });
      }

      // Diagonal connections
      if (includeDiagonals) {
        if (x < width - 1 && y < height - 1 && Math.random() < 0.3) {
          links.push({ source: id, target: id + width + 1, value: 0.7 });
        }
        if (x > 0 && y < height - 1 && Math.random() < 0.3) {
          links.push({ source: id, target: id + width - 1, value: 0.7 });
        }
      }
    }
  }

  // Add some random long-range connections - optimized
  const longRangeCount = Math.floor(nodes.length * 0.01);
  const linkSet = new Set();
  links.forEach(link => {
    linkSet.add(`${link.source},${link.target}`);
  });

  let longRangeLinks = 0;
  while (longRangeLinks < longRangeCount) {
    const i = Math.floor(Math.random() * nodes.length);
    const j = Math.floor(Math.random() * nodes.length);
    if (i !== j) {
      const key1 = `${i},${j}`;
      const key2 = `${j},${i}`;
      if (!linkSet.has(key1) && !linkSet.has(key2)) {
        links.push({ source: i, target: j, value: 0.5 });
        linkSet.add(key1);
        longRangeLinks++;
      }
    }
  }

  return { nodes, links, name: 'Grid Network', description: '2D grid structure with diagonal connections' };
}

/**
 * 8. Bipartite Network
 * Features: Two distinct node groups with cross-connections
 */
export function generateBipartiteNetwork() {
  const nodes = [];
  const links = [];
  const groupASize = 600; // Reduced from 2500
  const groupBSize = 600; // Reduced from 2500
  const connectionProbability = 0.003; // Slightly increased for visibility

  // Create group A nodes
  for (let i = 0; i < groupASize; i++) {
    nodes.push({
      id: i,
      label: `A${i}`,
      group: 0
    });
  }

  // Create group B nodes
  for (let i = 0; i < groupBSize; i++) {
    nodes.push({
      id: groupASize + i,
      label: `B${i}`,
      group: 1
    });
  }

  // Create cross-connections - optimized
  const expectedLinks = Math.floor(groupASize * groupBSize * connectionProbability);
  const linkSet = new Set();
  let crossLinks = 0;
  
  while (crossLinks < expectedLinks) {
    const a = Math.floor(Math.random() * groupASize);
    const b = groupASize + Math.floor(Math.random() * groupBSize);
    const key = `${a},${b}`;
    if (!linkSet.has(key)) {
      links.push({ source: a, target: b, value: 1 });
      linkSet.add(key);
      crossLinks++;
    }
  }

  // Add some intra-group connections (making it near-bipartite) - minimal
  for (let i = 0; i < groupASize; i += 50) {
    for (let j = i + 1; j < Math.min(i + 5, groupASize); j++) {
      if (Math.random() < 0.1) {
        links.push({ source: i, target: j, value: 0.3 });
      }
    }
  }

  for (let i = 0; i < groupBSize; i += 50) {
    for (let j = i + 1; j < Math.min(i + 5, groupBSize); j++) {
      if (Math.random() < 0.1) {
        links.push({ 
          source: groupASize + i, 
          target: groupASize + j, 
          value: 0.3 
        });
      }
    }
  }

  return { nodes, links, name: 'Bipartite Network', description: 'Two distinct node groups with cross-connections' };
}

/**
 * 9. Star Network
 * Features: Central hub with many peripheral nodes
 */
export function generateStarNetwork() {
  const nodes = [];
  const links = [];
  const hubCount = 5; // Reduced from 10
  const nodesPerHub = 200; // Reduced from 500
  const interHubConnections = 0.2; // Increased for visibility

  let nodeId = 0;

  // Create hubs
  const hubs = [];
  for (let h = 0; h < hubCount; h++) {
    nodes.push({
      id: nodeId,
      label: `Hub ${h}`,
      group: 0
    });
    hubs.push(nodeId);
    nodeId++;
  }

  // Connect hubs
  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      if (Math.random() < interHubConnections) {
        links.push({ source: hubs[i], target: hubs[j], value: 2 });
      }
    }
  }

  // Create peripheral nodes for each hub
  for (let h = 0; h < hubCount; h++) {
    for (let i = 0; i < nodesPerHub; i++) {
      nodes.push({
        id: nodeId,
        label: `P${h}-${i}`,
        group: h + 1
      });

      // Connect to hub
      links.push({ source: hubs[h], target: nodeId, value: 1 });

      // Some peripheral nodes connect to each other - reduced
      if (Math.random() < 0.01) {
        const otherPeripheral = nodeId - Math.floor(Math.random() * Math.min(i + 1, 20)) - 1;
        if (otherPeripheral > hubs[h] && nodes[otherPeripheral] && nodes[otherPeripheral].group === h + 1) {
          links.push({ source: nodeId, target: otherPeripheral, value: 0.5 });
        }
      }

      nodeId++;
    }
  }

  return { nodes, links, name: 'Star Network', description: 'Central hub with many peripheral nodes' };
}

/**
 * 10. Hybrid Network
 * Features: Combination of multiple network types
 */
export function generateHybridNetwork() {
  const nodes = [];
  const links = [];
  let nodeId = 0;

  // Create a scale-free core
  const coreSize = 400; // Reduced from 1000
  const coreNodes = [];
  for (let i = 0; i < coreSize; i++) {
    nodes.push({
      id: nodeId,
      label: `Core${i}`,
      group: 0
    });
    coreNodes.push(nodeId);
    nodeId++;
  }

  // Connect core nodes (scale-free like)
  for (let i = 1; i < coreSize; i++) {
    const target = Math.floor(Math.random() * i);
    links.push({ source: i, target: target, value: 1 });
    if (Math.random() < 0.3) {
      const target2 = Math.floor(Math.random() * i);
      if (target2 !== target) {
        links.push({ source: i, target: target2, value: 0.8 });
      }
    }
  }

  // Add modular communities
  const communities = 8; // Reduced from 15
  const nodesPerCommunity = 100; // Reduced from 300
  for (let c = 0; c < communities; c++) {
    const communityNodes = [];
    for (let i = 0; i < nodesPerCommunity; i++) {
      nodes.push({
        id: nodeId,
        label: `M${c}-${i}`,
        group: c + 1
      });
      communityNodes.push(nodeId);
      nodeId++;
    }

    // Dense intra-community connections - optimized
    for (let i = 0; i < communityNodes.length; i++) {
      for (let j = i + 1; j < communityNodes.length; j++) {
        if (Math.random() < 0.15) {
          links.push({ 
            source: communityNodes[i], 
            target: communityNodes[j], 
            value: 1.5 
          });
        }
      }
    }

    // Connect community to core
    const hubConnections = 3; // Reduced from 5
    for (let i = 0; i < hubConnections; i++) {
      const coreNode = coreNodes[Math.floor(Math.random() * coreNodes.length)];
      const communityNode = communityNodes[Math.floor(Math.random() * communityNodes.length)];
      links.push({ source: coreNode, target: communityNode, value: 1 });
    }
  }

  // Add some random long-range connections - optimized
  const randomLinkCount = Math.floor(nodes.length * 0.001);
  const linkSet = new Set();
  links.forEach(link => {
    linkSet.add(`${link.source},${link.target}`);
  });

  let randomLinks = 0;
  while (randomLinks < randomLinkCount) {
    const i = Math.floor(Math.random() * nodes.length);
    const j = Math.floor(Math.random() * nodes.length);
    if (i !== j) {
      const key1 = `${i},${j}`;
      const key2 = `${j},${i}`;
      if (!linkSet.has(key1) && !linkSet.has(key2)) {
        links.push({ source: i, target: j, value: 0.5 });
        linkSet.add(key1);
        randomLinks++;
      }
    }
  }

  return { nodes, links, name: 'Hybrid Network', description: 'Combination of multiple network types' };
}

/**
 * Get all network generators
 */
export function getAllNetworks() {
  return [
    generateScaleFreeNetwork,
    generateSmallWorldNetwork,
    generateRandomNetwork,
    generateHierarchicalNetwork,
    generateModularNetwork,
    generateRingNetwork,
    generateGridNetwork,
    generateBipartiteNetwork,
    generateStarNetwork,
    generateHybridNetwork
  ];
}
