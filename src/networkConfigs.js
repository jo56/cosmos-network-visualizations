/**
 * Unique Visual Configurations for Each Network Type
 * Each network has distinct colors, styles, and behaviors
 * Using bold, high-contrast designs for maximum visual impact
 */

export const networkConfigs = [
  // 0: Scale-Free Network - Electric purple/cyan with bright hubs
  {
    name: 'Scale-Free Network',
    description: 'Barabási–Albert model with preferential attachment. Features power-law degree distribution with highly connected hubs.',
    icon: '',
    backgroundColor: '#0a0a1a',
    pointDefaultColor: '#00ffff',
    nodeSize: 4,
    linkWidth: 0.6, // Thinner links for better performance
    spaceSize: 3072,
    simulationFriction: 0.25, // Increased for faster settling
    simulationGravity: 0.1, // Minimum to prevent drift
    simulationRepulsion: 0.6,
    simulationLinkSpring: 0.5,
    curvedLinks: true,
    scalePointsOnZoom: true,
    getNodeColor: (node, index, total, nodeDegrees) => {
      // Bright cyan for hubs, purple for others
      const degree = nodeDegrees[index] || 1;
      const maxDegree = Math.max(...nodeDegrees);
      const intensity = degree / maxDegree;
      if (intensity > 0.3) {
        // Hub - bright cyan
        return [0, 255, 255, 255]; // Cyan
      } else {
        // Regular node - purple gradient
        const hue = 270 + (index % 30);
        return hslToRgb(hue / 360, 0.9, 0.5 + intensity * 0.3);
      }
    },
    getLinkColor: () => [100, 200, 255, 80], // Light blue links
  },

  // 1: Small World Network - Deep ocean blue with clustering
  {
    name: 'Small World Network',
    description: 'Watts–Strogatz model with high clustering and short path lengths. Dense local connections with occasional long-range links.',
    icon: '',
    backgroundColor: '#001122',
    pointDefaultColor: '#00aaff',
    nodeSize: 3.5,
    linkWidth: 0.7,
    spaceSize: 3072,
    simulationFriction: 0.28,
    simulationGravity: 0.3, // Increased to keep centered
    simulationRepulsion: 0.6,
    simulationLinkSpring: 0.6,
    curvedLinks: true,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      // Blue gradient by cluster
      const hue = 200 + (node.group * 20) % 40;
      return hslToRgb(hue / 360, 0.95, 0.55);
    },
    getLinkColor: (link) => {
      // Bright blue links
      return [0, 170, 255, 120];
    },
  },

  // 2: Random Network - Neon green chaos
  {
    name: 'Random Network',
    description: 'Erdős–Rényi model with random connections. Poisson degree distribution with uniform connectivity.',
    icon: '',
    backgroundColor: '#000000',
    pointDefaultColor: '#00ff00',
    nodeSize: 3,
    linkWidth: 0.6,
    spaceSize: 3584,
    simulationFriction: 0.25,
    simulationGravity: 0.1, // Minimum to prevent drift
    simulationRepulsion: 0.7,
    simulationLinkSpring: 0.45,
    curvedLinks: false,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      // Random neon colors
      const hue = (index * 137.508) % 360;
      return hslToRgb(hue / 360, 1.0, 0.5);
    },
    getLinkColor: () => [0, 255, 100, 60], // Neon green
  },

  // 3: Hierarchical Network - Tree structure with warm colors
  {
    name: 'Hierarchical Network',
    description: 'Tree-like structure with multiple levels. Parent-child relationships with some cross-level connections.',
    icon: '',
    backgroundColor: '#1a0f0a',
    pointDefaultColor: '#ff6b35',
    nodeSize: 4.5,
    linkWidth: 1.0,
    spaceSize: 3072,
    simulationFriction: 0.3,
    simulationGravity: 0.4,
    simulationRepulsion: 0.5,
    simulationLinkSpring: 0.8,
    curvedLinks: true,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      // Warm colors by hierarchy level
      const level = node.group || 0;
      const hue = 15 - (level * 8); // Orange to red gradient
      const lightness = 0.4 + (level * 0.1);
      return hslToRgb(hue / 360, 0.9, lightness);
    },
    getLinkColor: (link) => {
      return [255, 107, 53, 150]; // Orange links
    },
  },

  // 4: Modular Network - Vibrant community colors
  {
    name: 'Modular Network',
    description: 'Community-based structure with dense clusters. Strong intra-community and weak inter-community connections.',
    icon: '',
    backgroundColor: '#1a0a1a',
    pointDefaultColor: '#ff00ff',
    nodeSize: 3.8,
    linkWidth: 0.8,
    spaceSize: 3072,
    simulationFriction: 0.26,
    simulationGravity: 0.25, // Increased to keep centered
    simulationRepulsion: 0.65,
    simulationLinkSpring: 0.65,
    curvedLinks: true,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      // Distinct vibrant colors per community
      const colors = [
        [255, 0, 100, 255],    // Hot pink
        [0, 255, 200, 255],    // Cyan
        [255, 150, 0, 255],    // Orange
        [150, 0, 255, 255],    // Purple
        [0, 255, 100, 255],    // Green
        [255, 255, 0, 255],    // Yellow
        [0, 150, 255, 255],    // Blue
        [255, 0, 200, 255],    // Magenta
        [100, 255, 0, 255],    // Lime
        [255, 100, 150, 255],  // Pink
        [0, 255, 255, 255],    // Aqua
        [255, 200, 0, 255],    // Gold
        [200, 0, 255, 255],    // Violet
        [0, 200, 255, 255],    // Sky blue
        [255, 0, 255, 255],    // Fuchsia
        [100, 0, 255, 255],    // Indigo
        [255, 255, 100, 255],  // Light yellow
        [0, 100, 255, 255],    // Royal blue
        [255, 50, 100, 255],   // Rose
        [100, 255, 200, 255],  // Turquoise
      ];
      return colors[node.group % colors.length];
    },
    getLinkColor: (link) => {
      // Bright links, stronger for intra-community
      const alpha = link.value > 1 ? 180 : 80;
      return [255, 100, 255, alpha];
    },
  },

  // 5: Ring Network - Circular rainbow
  {
    name: 'Ring Network',
    description: 'Circular topology with nearest-neighbor connections. Additional skip connections create shortcuts.',
    icon: '',
    backgroundColor: '#0a0a0a',
    pointDefaultColor: '#ff0080',
    nodeSize: 3.2,
    linkWidth: 0.7,
    spaceSize: 2560,
    simulationFriction: 0.28,
    simulationGravity: 0.35, // Increased to keep centered
    simulationRepulsion: 0.6,
    simulationLinkSpring: 0.75,
    curvedLinks: false,
    scalePointsOnZoom: true,
    getNodeColor: (node, index, total) => {
      // Rainbow gradient around the ring
      const hue = (index / total) * 360;
      return hslToRgb(hue / 360, 1.0, 0.5);
    },
    getLinkColor: (link) => {
      return [255, 0, 128, 100]; // Pink links
    },
  },

  // 6: Grid Network - Neon grid pattern
  {
    name: 'Grid Network',
    description: '2D grid structure with regular connectivity. Diagonal connections add complexity to the lattice.',
    icon: '',
    backgroundColor: '#000814',
    pointDefaultColor: '#00f5ff',
    nodeSize: 3.5,
    linkWidth: 0.7,
    spaceSize: 3072,
    simulationFriction: 0.3,
    simulationGravity: 0.55, // Increased to keep centered
    simulationRepulsion: 0.4,
    simulationLinkSpring: 0.9,
    curvedLinks: false,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      // Checkerboard pattern with neon colors
      const x = index % 30;
      const y = Math.floor(index / 30);
      const pattern = (x + y) % 2;
      if (pattern === 0) {
        return [0, 245, 255, 255]; // Cyan
      } else {
        return [255, 0, 150, 255]; // Pink
      }
    },
    getLinkColor: () => [0, 200, 255, 90], // Cyan links
  },

  // 7: Bipartite Network - High contrast split
  {
    name: 'Bipartite Network',
    description: 'Two distinct node groups with cross-connections. Minimal connections within groups.',
    icon: '',
    backgroundColor: '#1a0a2a',
    pointDefaultColor: '#ff00ff',
    nodeSize: 4.0,
    linkWidth: 0.6, // Thinner links for better performance
    spaceSize: 3072,
    simulationFriction: 0.26,
    simulationGravity: 0.1, // Minimum to prevent drift
    simulationRepulsion: 0.7,
    simulationLinkSpring: 0.6,
    curvedLinks: true,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      // High contrast: bright pink vs bright cyan
      if (node.group === 0) {
        return [255, 0, 200, 255]; // Hot pink
      } else {
        return [0, 255, 255, 255]; // Cyan
      }
    },
    getLinkColor: () => [255, 100, 255, 120], // Magenta links
  },

  // 8: Star Network - Golden hub with colorful spokes
  {
    name: 'Star Network',
    description: 'Central hub with many peripheral nodes. Hub-and-spoke topology with high centralization.',
    icon: '',
    backgroundColor: '#1a0a0a',
    pointDefaultColor: '#ffd700',
    nodeSize: (node) => node.group === 0 ? 8 : 3,
    linkWidth: 1.0,
    spaceSize: 3072,
    simulationFriction: 0.28,
    simulationGravity: 0.45, // Increased to keep centered
    simulationRepulsion: 0.6,
    simulationLinkSpring: 0.75,
    curvedLinks: true,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      if (node.group === 0) {
        return [255, 215, 0, 255]; // Gold for hubs
      }
      // Colorful spokes
      const hue = (node.group * 30) % 360;
      return hslToRgb(hue / 360, 1.0, 0.6);
    },
    getLinkColor: () => [255, 200, 0, 140], // Gold links
  },

  // 9: Hybrid Network - Multi-colored fusion
  {
    name: 'Hybrid Network',
    description: 'Combination of multiple network types. Scale-free core with modular communities and random connections.',
    icon: '',
    backgroundColor: '#0a0a1a',
    pointDefaultColor: '#ff00ff',
    nodeSize: 3.6,
    linkWidth: 0.7,
    spaceSize: 3584,
    simulationFriction: 0.25,
    simulationGravity: 0.25, // Increased to keep centered
    simulationRepulsion: 0.65,
    simulationLinkSpring: 0.6,
    curvedLinks: true,
    scalePointsOnZoom: true,
    getNodeColor: (node, index) => {
      // Mixed vibrant colors
      if (node.group === 0) {
        // Core - bright white/cyan
        return [200, 255, 255, 255];
      } else {
        // Communities - varied bright colors
        const hue = (node.group * 45 + index * 5) % 360;
        return hslToRgb(hue / 360, 1.0, 0.55);
      }
    },
    getLinkColor: (link) => {
      // Vary by link strength
      const alpha = link.value > 1 ? 150 : (link.value > 0.5 ? 100 : 60);
      return [255, 100, 255, alpha];
    },
  },
];

/**
 * Convert HSL to RGB (returns array [r, g, b, a])
 */
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
    255
  ];
}
