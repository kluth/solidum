import type { ComponentNode, PerformanceEntry } from './types';

/**
 * Component tree visualizer and analyzer
 */
export class ComponentTree {
  private root: ComponentNode | null = null;
  private nodeMap: Map<string, ComponentNode> = new Map();

  /**
   * Register a component in the tree
   */
  registerComponent(
    id: string,
    name: string,
    type: string,
    parentId?: string,
    props?: Record<string, unknown>
  ): void {
    const node: ComponentNode = {
      id,
      name,
      type,
      props,
      children: [],
    };

    this.nodeMap.set(id, node);

    if (parentId) {
      const parent = this.nodeMap.get(parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      this.root = node;
    }
  }

  /**
   * Unregister a component from the tree
   */
  unregisterComponent(id: string): void {
    const node = this.nodeMap.get(id);
    if (!node) return;

    // Remove from parent's children
    this.nodeMap.forEach(parent => {
      parent.children = parent.children.filter(child => child.id !== id);
    });

    // Remove node and all children
    this.removeNodeAndChildren(node);
  }

  /**
   * Update component props
   */
  updateProps(id: string, props: Record<string, unknown>): void {
    const node = this.nodeMap.get(id);
    if (node) {
      node.props = props;
    }
  }

  /**
   * Update component state
   */
  updateState(id: string, state: Record<string, unknown>): void {
    const node = this.nodeMap.get(id);
    if (node) {
      node.state = state;
    }
  }

  /**
   * Add performance data to component
   */
  addPerformance(id: string, performance: PerformanceEntry): void {
    const node = this.nodeMap.get(id);
    if (node) {
      node.performance = performance;
    }
  }

  /**
   * Get the component tree
   */
  getTree(): ComponentNode | null {
    return this.root;
  }

  /**
   * Get a specific node
   */
  getNode(id: string): ComponentNode | undefined {
    return this.nodeMap.get(id);
  }

  /**
   * Get tree as JSON
   */
  toJSON(): string {
    return JSON.stringify(this.root, null, 2);
  }

  /**
   * Export tree as ASCII art
   */
  toASCII(): string {
    if (!this.root) return 'Empty tree';
    return this.nodeToASCII(this.root, '', true);
  }

  /**
   * Export tree as Mermaid diagram
   */
  toMermaid(): string {
    if (!this.root) return 'graph TD\n  empty[Empty Tree]';

    let mermaid = 'graph TD\n';
    const traverse = (node: ComponentNode, parentId?: string) => {
      const nodeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
      const label = `${node.name}[${node.type}]`;

      mermaid += `  ${nodeId}["${label}"]\n`;

      if (parentId) {
        mermaid += `  ${parentId} --> ${nodeId}\n`;
      }

      node.children.forEach(child => traverse(child, nodeId));
    };

    traverse(this.root);
    return mermaid;
  }

  /**
   * Get tree statistics
   */
  getStatistics(): {
    totalNodes: number;
    depth: number;
    byType: Record<string, number>;
    averageChildren: number;
  } {
    const byType: Record<string, number> = {};
    let totalChildren = 0;

    const traverse = (node: ComponentNode, depth: number): number => {
      byType[node.type] = (byType[node.type] ?? 0) + 1;
      totalChildren += node.children.length;

      let maxDepth = depth;
      node.children.forEach(child => {
        maxDepth = Math.max(maxDepth, traverse(child, depth + 1));
      });

      return maxDepth;
    };

    const depth = this.root ? traverse(this.root, 0) : 0;
    const totalNodes = this.nodeMap.size;

    return {
      totalNodes,
      depth,
      byType,
      averageChildren: totalNodes > 0 ? totalChildren / totalNodes : 0,
    };
  }

  /**
   * Find components by type
   */
  findByType(type: string): ComponentNode[] {
    const results: ComponentNode[] = [];
    this.nodeMap.forEach(node => {
      if (node.type === type) {
        results.push(node);
      }
    });
    return results;
  }

  /**
   * Find components by name
   */
  findByName(name: string): ComponentNode[] {
    const results: ComponentNode[] = [];
    this.nodeMap.forEach(node => {
      if (node.name.includes(name)) {
        results.push(node);
      }
    });
    return results;
  }

  /**
   * Get path to component
   */
  getPath(id: string): string[] {
    const path: string[] = [];
    const node = this.nodeMap.get(id);
    if (!node) return path;

    const findPath = (current: ComponentNode, target: ComponentNode): boolean => {
      path.push(current.name);

      if (current.id === target.id) {
        return true;
      }

      for (const child of current.children) {
        if (findPath(child, target)) {
          return true;
        }
      }

      path.pop();
      return false;
    };

    if (this.root) {
      findPath(this.root, node);
    }

    return path;
  }

  /**
   * Clear the tree
   */
  clear(): void {
    this.root = null;
    this.nodeMap.clear();
  }

  /**
   * Remove node and all its children
   */
  private removeNodeAndChildren(node: ComponentNode): void {
    node.children.forEach(child => this.removeNodeAndChildren(child));
    this.nodeMap.delete(node.id);
  }

  /**
   * Convert node to ASCII art
   */
  private nodeToASCII(node: ComponentNode, prefix: string, isLast: boolean): string {
    const connector = isLast ? '└─ ' : '├─ ';
    const childPrefix = isLast ? '   ' : '│  ';

    let result = prefix + connector + node.name;

    if (node.performance) {
      result += ` (${node.performance.duration.toFixed(2)}ms)`;
    }

    result += '\n';

    node.children.forEach((child, index) => {
      const isLastChild = index === node.children.length - 1;
      result += this.nodeToASCII(child, prefix + childPrefix, isLastChild);
    });

    return result;
  }
}
