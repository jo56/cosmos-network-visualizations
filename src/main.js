/**
 * Main Application
 * Handles cosmos.gl integration and network switching with unique visualizations
 * Using proper cosmos.gl API with pointColors and linkColors as Float32Arrays
 */

import { Graph } from '@cosmos.gl/graph';
import { getAllNetworks } from './networks.js';
import { networkConfigs } from './networkConfigs.js';

// Get DOM elements
const graphContainer = document.getElementById('graph-container');
const loadingElement = document.getElementById('loading');
const infoPanel = document.getElementById('info-panel');
const networkNameElement = document.getElementById('network-name');
const networkDescriptionElement = document.getElementById('network-description');
const nodeCountElement = document.getElementById('node-count');
const linkCountElement = document.getElementById('link-count');
const networkDensityElement = document.getElementById('network-density');
const navContainer = document.getElementById('nav-container');

// Application state
let graphInstance = null;
let currentNetworkIndex = 0;
let networkData = [];
let isLoading = false;

/**
 * Calculate network density
 */
function calculateDensity(nodes, links) {
  const n = nodes.length;
  const maxLinks = (n * (n - 1)) / 2;
  const density = (links.length / maxLinks) * 100;
  return density.toFixed(2);
}

/**
 * Calculate node degrees for color mapping
 */
function calculateNodeDegrees(nodes, links) {
  const degrees = new Array(nodes.length).fill(0);
  links.forEach(link => {
    const source = typeof link.source === 'number' ? link.source : link.source.id;
    const target = typeof link.target === 'number' ? link.target : link.target.id;
    degrees[source]++;
    degrees[target]++;
  });
  return degrees;
}

/**
 * Initialize navigation with icons and better styling
 */
function initializeNavigation() {
  networkConfigs.forEach((config, index) => {
    const navItem = document.createElement('div');
    navItem.className = 'nav-item';
    
    const button = document.createElement('button');
    button.className = 'nav-button';
    if (index === 0) {
      button.classList.add('active');
    }
    
    button.innerHTML = `
      <span class="nav-icon">${config.icon}</span>
      <span class="nav-label">${config.name}</span>
      <span class="nav-number">${index + 1}</span>
    `;
    
    button.addEventListener('click', () => switchNetwork(index));
    navItem.appendChild(button);
    navContainer.appendChild(navItem);
  });
}

/**
 * Update info panel with current network stats
 */
function updateInfoPanel(data, config) {
  networkNameElement.textContent = config.name;
  networkDescriptionElement.textContent = config.description;
  nodeCountElement.textContent = data.nodes.length.toLocaleString();
  linkCountElement.textContent = data.links.length.toLocaleString();
  networkDensityElement.textContent = `${calculateDensity(data.nodes, data.links)}%`;
  infoPanel.style.display = 'block';
}

/**
 * Switch to a different network visualization
 */
async function switchNetwork(index) {
  if (isLoading || index === currentNetworkIndex) return;

  isLoading = true;
  currentNetworkIndex = index;
  
  // Update active button
  document.querySelectorAll('.nav-button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  // Get configuration for this network
  const config = networkConfigs[index];

  // Show loading
  loadingElement.style.display = 'flex';
  infoPanel.style.display = 'none';

  try {
    // Destroy existing graph instance
    if (graphInstance) {
      try {
        graphInstance.destroy();
      } catch (e) {
        console.warn('Error destroying previous graph:', e);
      }
      graphInstance = null;
    }

    // Generate or retrieve network data
    if (!networkData[index]) {
      loadingElement.querySelector('div:last-child').textContent = `Generating ${config.name}...`;
      const generator = getAllNetworks()[index];
      networkData[index] = generator();
    }

    const data = networkData[index];
    
    // Calculate node degrees for color mapping
    const nodeDegrees = calculateNodeDegrees(data.nodes, data.links);
    
    // Update info panel
    updateInfoPanel(data, config);

    // Small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));

    // Configure graph with network-specific settings
    const graphConfig = {
      spaceSize: config.spaceSize,
      backgroundColor: config.backgroundColor,
      pointDefaultColor: config.pointDefaultColor,
      simulationFriction: config.simulationFriction,
      simulationGravity: config.simulationGravity,
      simulationRepulsion: config.simulationRepulsion,
      simulationLinkSpring: config.simulationLinkSpring || 0.5,
      simulationRepulsionTheta: 0.5,
      curvedLinks: config.curvedLinks,
      scalePointsOnZoom: config.scalePointsOnZoom !== false,
      fitViewOnInit: true,
      fitViewDelay: 800,
      fitViewPadding: 0.15,
      rescalePositions: true,
      enableDrag: true,
      enableZoom: true,
      enablePan: true,
      pointSize: typeof config.nodeSize === 'function' ? 3 : config.nodeSize,
      linkWidth: config.linkWidth,
      onClick: (pointIndex) => {
        if (pointIndex !== null && data.nodes[pointIndex]) {
          console.log('Clicked node:', data.nodes[pointIndex]);
        }
      },
    };

    // Create new graph instance
    loadingElement.querySelector('div:last-child').textContent = 'Rendering visualization...';
    graphInstance = new Graph(graphContainer, graphConfig);

    // Convert nodes to point positions (Float32Array)
    const pointPositions = new Float32Array(data.nodes.length * 2);
    const pointSizes = new Float32Array(data.nodes.length);
    
    data.nodes.forEach((node, i) => {
      if (node.x !== undefined && node.y !== undefined) {
        pointPositions[i * 2] = node.x;
        pointPositions[i * 2 + 1] = node.y;
      } else {
        // Generate initial positions based on network type
        if (index === 5) { // Ring network - circular layout
          const angle = (i / data.nodes.length) * Math.PI * 2;
          const radius = config.spaceSize * 0.35;
          pointPositions[i * 2] = Math.cos(angle) * radius;
          pointPositions[i * 2 + 1] = Math.sin(angle) * radius;
        } else if (index === 6) { // Grid network - grid layout
          const gridWidth = 40; // Match the grid width from network generation
          const x = (i % gridWidth) - gridWidth / 2;
          const y = Math.floor(i / gridWidth) - gridWidth / 2;
          pointPositions[i * 2] = x * (config.spaceSize / gridWidth * 0.8);
          pointPositions[i * 2 + 1] = y * (config.spaceSize / gridWidth * 0.8);
        } else if (index === 8) { // Star network - radial layout
          if (node.group === 0) {
            // Hub at center
            pointPositions[i * 2] = 0;
            pointPositions[i * 2 + 1] = 0;
          } else {
            // Spokes in circle
            const angle = ((i - 1) / (data.nodes.length - 1)) * Math.PI * 2;
            const radius = config.spaceSize * 0.4;
            pointPositions[i * 2] = Math.cos(angle) * radius;
            pointPositions[i * 2 + 1] = Math.sin(angle) * radius;
          }
        } else {
          // Random initial positions
          pointPositions[i * 2] = (Math.random() - 0.5) * config.spaceSize;
          pointPositions[i * 2 + 1] = (Math.random() - 0.5) * config.spaceSize;
        }
      }
      
      // Set node size
      if (typeof config.nodeSize === 'function') {
        pointSizes[i] = config.nodeSize(node, i);
      } else {
        pointSizes[i] = config.nodeSize || 3;
      }
    });

    // Generate point colors (RGBA format: [r, g, b, a] per point = 4 values per point)
    const pointColors = new Float32Array(data.nodes.length * 4);
    data.nodes.forEach((node, i) => {
      const color = config.getNodeColor(node, i, data.nodes.length, nodeDegrees);
      pointColors[i * 4] = color[0] / 255;     // R
      pointColors[i * 4 + 1] = color[1] / 255; // G
      pointColors[i * 4 + 2] = color[2] / 255; // B
      pointColors[i * 4 + 3] = color[3] / 255; // A
    });

    // Convert links to link indices (Float32Array)
    const linkIndices = new Float32Array(data.links.length * 2);
    const linkColors = new Float32Array(data.links.length * 4); // RGBA per link
    
    data.links.forEach((link, i) => {
      const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
      const targetId = typeof link.target === 'number' ? link.target : link.target.id;
      linkIndices[i * 2] = sourceId;
      linkIndices[i * 2 + 1] = targetId;
      
      // Set link color
      const color = config.getLinkColor(link);
      linkColors[i * 4] = color[0] / 255;     // R
      linkColors[i * 4 + 1] = color[1] / 255; // G
      linkColors[i * 4 + 2] = color[2] / 255; // B
      linkColors[i * 4 + 3] = color[3] / 255; // A
    });

    // Set data
    graphInstance.setPointPositions(pointPositions);
    graphInstance.setLinks(linkIndices);
    
    // Set colors using the proper API
    if (graphInstance.setPointColors) {
      graphInstance.setPointColors(pointColors);
    }
    if (graphInstance.setLinkColors) {
      graphInstance.setLinkColors(linkColors);
    }
    if (graphInstance.setPointSizes && typeof config.nodeSize === 'function') {
      graphInstance.setPointSizes(pointSizes);
    }

    // Render
    graphInstance.render();

    // Hide loading after a short delay
    setTimeout(() => {
      loadingElement.style.display = 'none';
      isLoading = false;
    }, 500);

  } catch (error) {
    console.error('Error loading network:', error);
    loadingElement.querySelector('div:last-child').textContent = `Error: ${error.message}`;
    isLoading = false;
  }
}

/**
 * Handle window resize
 */
function handleResize() {
  if (graphInstance) {
    try {
      graphInstance.render();
    } catch (e) {
      console.warn('Error on resize:', e);
    }
  }
}

/**
 * Keyboard navigation
 */
function handleKeyPress(event) {
  // Number keys 1-0 to switch networks
  const key = event.key;
  if (key >= '1' && key <= '9') {
    const index = parseInt(key) - 1;
    if (index < networkConfigs.length) {
      switchNetwork(index);
    }
  } else if (key === '0') {
    switchNetwork(9); // 0 maps to network 10 (index 9)
  }
}

// Initialize application
function init() {
  initializeNavigation();
  
  // Load first network
  switchNetwork(0);

  // Add event listeners
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleKeyPress);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (graphInstance) {
      try {
        graphInstance.destroy();
      } catch (e) {
        console.warn('Error during cleanup:', e);
      }
    }
  });
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
