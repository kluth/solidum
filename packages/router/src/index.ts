/**
 * @solidum/router - Simple SPA Router for Solidum Applications
 * 
 * A lightweight, reactive router that integrates seamlessly with Solidum's
 * fine-grained reactivity system.
 */

import { atom } from '@solidum/core';

// Types
export interface RouteConfig {
  [path: string]: string;
}

export interface RouteChangeEvent {
  path: string;
  component: string;
}

export interface RouterOptions {
  routes: RouteConfig;
  initialPath?: string;
}

// Current route state
export const currentRoute = atom<string>('/');

// Route configuration
let routes: RouteConfig = {};

/**
 * Initialize the router with route configuration
 */
export function createRouter(options: RouterOptions): {
  navigate: (path: string) => void;
  getCurrentPage: () => string;
  getCurrentPath: () => string;
} {
  routes = options.routes;
  
  // Set initial route
  const initialPath = options.initialPath || window.location.pathname;
  if (routes[initialPath]) {
    currentRoute(initialPath);
  }

  // Handle browser navigation (back/forward buttons)
  window.addEventListener('popstate', (event) => {
    const path = event.state?.path || window.location.pathname;
    if (routes[path]) {
      currentRoute(path);
      
      // Trigger a page re-render
      window.dispatchEvent(new CustomEvent<RouteChangeEvent>('routechange', { 
        detail: { path, component: routes[path] } 
      }));
    }
  });

  return {
    navigate: (path: string) => navigate(path),
    getCurrentPage: () => getCurrentPage(),
    getCurrentPath: () => currentRoute()
  };
}

/**
 * Navigate to a new route
 */
export function navigate(path: string): void {
  if (routes[path]) {
    currentRoute(path);
    // Update browser history without page reload
    window.history.pushState({ path }, '', path);
    
    // Trigger a page re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent<RouteChangeEvent>('routechange', { 
      detail: { path, component: routes[path] } 
    }));
  }
}

/**
 * Get the current page component name
 */
export function getCurrentPage(): string {
  return routes[currentRoute()] || 'HomePage';
}

/**
 * Get the current route path
 */
export function getCurrentPath(): string {
  return currentRoute();
}

/**
 * Check if a route exists
 */
export function hasRoute(path: string): boolean {
  return path in routes;
}

/**
 * Get all available routes
 */
export function getRoutes(): RouteConfig {
  return { ...routes };
}
