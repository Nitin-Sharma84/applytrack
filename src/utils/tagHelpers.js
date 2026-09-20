/** @returns {string[]} every tag used by at least one application, sorted A to Z */
export function getAllTags(applications) {
  const tags = new Set()
  for (const application of applications) {
    for (const tag of application.tags) tags.add(tag)
  }
  return [...tags].sort()
}