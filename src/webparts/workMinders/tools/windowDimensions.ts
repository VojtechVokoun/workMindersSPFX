/**
 * Object for storing the current viewport dimensions.
 */
export type TViewportDimensions = {
  viewportWidth: number;
  viewportHeight: number;
};

/**
 * Returns the current viewport dimensions.
 */
export function getViewportDimensions(): TViewportDimensions {
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
  return {
    viewportWidth,
    viewportHeight,
  };
}
