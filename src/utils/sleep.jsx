/**
 * @returns {Promise<void>}
 */
export function fakeNetwork(ms = Math.random() * 500 + 50) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
